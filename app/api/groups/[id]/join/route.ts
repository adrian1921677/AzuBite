import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Gruppe beitreten
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });

    if (!group) {
      return NextResponse.json({ error: "Gruppe nicht gefunden" }, { status: 404 });
    }

    // Prüfe ob bereits Mitglied
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: params.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Bereits Mitglied" }, { status: 400 });
    }

    // Erstelle Mitgliedschaft
    const member = await prisma.groupMember.create({
      data: {
        userId: session.user.id,
        groupId: params.id,
        role: "MEMBER",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Beitreten zur Gruppe:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// DELETE: Gruppe verlassen
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { id: params.id },
    });

    if (!group) {
      return NextResponse.json({ error: "Gruppe nicht gefunden" }, { status: 404 });
    }

    // Besitzer kann Gruppe nicht verlassen (muss löschen)
    if (group.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "Besitzer kann Gruppe nicht verlassen" },
        { status: 400 }
      );
    }

    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: params.id,
        },
      },
    });

    return NextResponse.json({ message: "Gruppe verlassen" });
  } catch (error) {
    console.error("Fehler beim Verlassen der Gruppe:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


