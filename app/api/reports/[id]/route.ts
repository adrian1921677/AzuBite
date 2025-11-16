import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateReportSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  visibility: z.enum(["PRIVATE", "GROUP", "PUBLIC"]).optional(),
  profession: z.string().optional(),
  trainingYear: z.number().int().min(1).max(3).optional(),
  tags: z.array(z.string()).optional(),
});

// GET: Einzelnen Bericht abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });
    }

    // Prüfe Zugriffsrechte
    if (report.visibility === "PRIVATE" && report.authorId !== session.user.id) {
      return NextResponse.json({ error: "Zugriff verweigert" }, { status: 403 });
    }

    if (report.visibility === "GROUP" && report.groupId) {
      const isMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: session.user.id,
            groupId: report.groupId,
          },
        },
      });

      if (!isMember && report.authorId !== session.user.id) {
        return NextResponse.json({ error: "Zugriff verweigert" }, { status: 403 });
      }
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Fehler beim Abrufen des Berichts:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// PUT: Bericht aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });
    }

    if (report.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateReportSchema.parse(body);

    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: validatedData,
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

    return NextResponse.json(updatedReport);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Fehler beim Aktualisieren des Berichts:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// DELETE: Bericht löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
    });

    if (!report) {
      return NextResponse.json({ error: "Bericht nicht gefunden" }, { status: 404 });
    }

    if (report.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    // Lösche Datei von S3/R2
    const { deleteFile, extractKeyFromUrl } = await import("@/lib/s3");
    try {
      const key = extractKeyFromUrl(report.fileUrl);
      await deleteFile(key);
    } catch (error) {
      console.error("Fehler beim Löschen der Datei:", error);
    }

    await prisma.report.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Bericht gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Berichts:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


