import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ratingSchema = z.object({
  value: z.number().int().min(1).max(5),
});

// GET: Bewertungen eines Berichts abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
      where: { reportId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Fehler beim Abrufen der Bewertungen:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST: Bewertung erstellen oder aktualisieren
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
    const validatedData = ratingSchema.parse(body);

    // Prüfe ob bereits bewertet
    const existingRating = await prisma.rating.findUnique({
      where: {
        reportId_userId: {
          reportId: params.id,
          userId: session.user.id,
        },
      },
    });

    let rating;
    if (existingRating) {
      // Aktualisiere bestehende Bewertung
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value: validatedData.value },
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
    } else {
      // Erstelle neue Bewertung
      rating = await prisma.rating.create({
        data: {
          reportId: params.id,
          userId: session.user.id,
          value: validatedData.value,
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
    }

    // Berechne Durchschnittsbewertung
    const allRatings = await prisma.rating.findMany({
      where: { reportId: params.id },
    });

    const averageRating =
      allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length;

    // Aktualisiere Bericht
    await prisma.report.update({
      where: { id: params.id },
      data: {
        averageRating,
        ratingCount: allRatings.length,
      },
    });

    // Erstelle Benachrichtigung für Bericht-Autor (wenn nicht selbst)
    if (report.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: report.authorId,
          type: "RATING",
          title: "Neue Bewertung",
          message: `${session.user.name || "Ein Nutzer"} hat deinen Bericht "${report.title}" mit ${validatedData.value} Sternen bewertet`,
          link: `/reports/${params.id}`,
        },
      });
    }

    return NextResponse.json(rating, { status: existingRating ? 200 : 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Fehler beim Erstellen der Bewertung:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// DELETE: Bewertung löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const rating = await prisma.rating.findUnique({
      where: {
        reportId_userId: {
          reportId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (!rating) {
      return NextResponse.json({ error: "Bewertung nicht gefunden" }, { status: 404 });
    }

    await prisma.rating.delete({
      where: { id: rating.id },
    });

    // Berechne neue Durchschnittsbewertung
    const allRatings = await prisma.rating.findMany({
      where: { reportId: params.id },
    });

    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length
        : 0;

    // Aktualisiere Bericht
    await prisma.report.update({
      where: { id: params.id },
      data: {
        averageRating,
        ratingCount: allRatings.length,
      },
    });

    return NextResponse.json({ message: "Bewertung gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen der Bewertung:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


