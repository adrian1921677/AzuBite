import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reportSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number().positive(),
  fileType: z.enum(["PDF", "DOCX"]),
  visibility: z.enum(["PRIVATE", "GROUP", "PUBLIC"]),
  profession: z.string().optional(),
  trainingYear: z.number().int().min(1).max(3).optional(),
  tags: z.array(z.string()).default([]),
  groupId: z.string().optional(),
});

// GET: Liste aller Berichte (mit Filtern)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const visibility = searchParams.get("visibility");
    const profession = searchParams.get("profession");
    const trainingYear = searchParams.get("trainingYear");
    const tags = searchParams.get("tags")?.split(",");
    const groupId = searchParams.get("groupId");
    const authorId = searchParams.get("authorId");

    const where: any = {};

    // Sichtbarkeitsfilter
    if (visibility === "PUBLIC") {
      where.visibility = "PUBLIC";
    } else if (visibility === "GROUP") {
      where.OR = [
        { visibility: "GROUP", groupId: { not: null } },
        { visibility: "PUBLIC" },
      ];
    } else {
      // Standard: Nur öffentliche und eigene Berichte
      where.OR = [
        { visibility: "PUBLIC" },
        { authorId: session.user.id },
      ];
    }

    if (profession) {
      where.profession = profession;
    }

    if (trainingYear) {
      where.trainingYear = parseInt(trainingYear);
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    if (groupId) {
      where.groupId = groupId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Fehler beim Abrufen der Berichte:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST: Neuen Bericht erstellen
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = reportSchema.parse(body);

    // Prüfe Gruppenmitgliedschaft, falls Gruppe angegeben
    if (validatedData.groupId) {
      const groupMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: session.user.id,
            groupId: validatedData.groupId,
          },
        },
      });

      if (!groupMember) {
        return NextResponse.json(
          { error: "Du bist kein Mitglied dieser Gruppe" },
          { status: 403 }
        );
      }
    }

    const report = await prisma.report.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Fehler beim Erstellen des Berichts:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


