import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: Einladung über Token akzeptieren
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const group = await prisma.group.findUnique({
      where: { inviteToken: params.token },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Ungültiger Einladungs-Link" },
        { status: 404 }
      );
    }

    // Prüfe ob bereits Mitglied
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: group.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Du bist bereits Mitglied dieser Gruppe", groupId: group.id },
        { status: 400 }
      );
    }

    // Erstelle Mitgliedschaft
    await prisma.groupMember.create({
      data: {
        userId: session.user.id,
        groupId: group.id,
        role: "MEMBER",
      },
    });

    // Erstelle Benachrichtigung für Gruppenbesitzer
    await prisma.notification.create({
      data: {
        userId: group.ownerId,
        type: "GROUP_JOIN",
        title: "Neues Mitglied",
        message: `${session.user.name || "Ein Nutzer"} ist deiner Gruppe "${group.name}" beigetreten.`,
        link: `/groups/${group.id}`,
      },
    });

    return NextResponse.json({
      message: "Erfolgreich beigetreten",
      groupId: group.id,
    });
  } catch (error) {
    console.error("Fehler beim Akzeptieren der Einladung:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// GET: Gruppen-Info über Token abrufen (für Vorschau)
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const group = await prisma.group.findUnique({
      where: { inviteToken: params.token },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
            reports: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Ungültiger Einladungs-Link" },
        { status: 404 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Fehler beim Abrufen der Gruppen-Info:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

