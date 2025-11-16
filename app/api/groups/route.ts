import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  avatar: z.string().url().optional(),
});

// GET: Liste aller Gruppen
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isPublic = searchParams.get("isPublic");
    const search = searchParams.get("search");

    const where: any = {};

    if (isPublic === "true") {
      where.isPublic = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const groups = await prisma.group.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Fehler beim Abrufen der Gruppen:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST: Neue Gruppe erstellen
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = groupSchema.parse(body);

    // Erstelle Gruppe
    const group = await prisma.group.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
      },
    });

    // Füge Ersteller als Admin hinzu
    await prisma.groupMember.create({
      data: {
        userId: session.user.id,
        groupId: group.id,
        role: "ADMIN",
      },
    });

    const groupWithDetails = await prisma.group.findUnique({
      where: { id: group.id },
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

    return NextResponse.json(groupWithDetails, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Fehler beim Erstellen der Gruppe:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


