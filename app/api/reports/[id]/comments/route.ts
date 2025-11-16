import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1, "Kommentar darf nicht leer sein"),
  parentId: z.string().optional(),
});

// GET: Kommentare eines Berichts abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        reportId: params.id,
        parentId: null, // Nur Top-Level Kommentare
      },
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Fehler beim Abrufen der Kommentare:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST: Neuen Kommentar erstellen
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Prüfe ob Bericht existiert und Zugriff besteht
    const report = await prisma.report.findUnique({
      where: { id: params.id },
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

    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        reportId: params.id,
        authorId: session.user.id,
        parentId: validatedData.parentId,
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

    // Erstelle Benachrichtigung für Bericht-Autor (wenn nicht selbst)
    if (report.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: report.authorId,
          type: "COMMENT",
          title: "Neuer Kommentar",
          message: `${session.user.name || "Ein Nutzer"} hat deinen Bericht "${report.title}" kommentiert`,
          link: `/reports/${params.id}`,
        },
      });
    }

    // Erstelle Benachrichtigung für Parent-Kommentar-Autor (wenn Antwort)
    if (validatedData.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validatedData.parentId },
      });

      if (parentComment && parentComment.authorId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.authorId,
            type: "COMMENT",
            title: "Antwort auf Kommentar",
            message: `${session.user.name || "Ein Nutzer"} hat auf deinen Kommentar geantwortet`,
            link: `/reports/${params.id}`,
          },
        });
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Fehler beim Erstellen des Kommentars:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


