import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFileUrl, extractKeyFromUrl } from "@/lib/s3";

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

    // Erhöhe Download-Zähler
    await prisma.report.update({
      where: { id: params.id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // Generiere Download-URL
    const key = extractKeyFromUrl(report.fileUrl);
    const downloadUrl = await getFileUrl(key, 3600); // 1 Stunde gültig

    return NextResponse.json({ downloadUrl, fileName: report.fileName });
  } catch (error) {
    console.error("Fehler beim Generieren der Download-URL:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}


