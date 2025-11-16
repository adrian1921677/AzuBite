import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// GET: Einladungs-Link generieren oder abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Handle params as Promise (Next.js 15+) or object (Next.js 14)
    const resolvedParams = await Promise.resolve(params);
    const groupId = resolvedParams.id;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Gruppe nicht gefunden" }, { status: 404 });
    }

    // Nur Besitzer kann Einladungs-Link generieren
    if (group.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    // Generiere Token falls noch keiner existiert
    let inviteToken = group.inviteToken;
    if (!inviteToken) {
      inviteToken = randomBytes(32).toString("hex");
      await prisma.group.update({
        where: { id: groupId },
        data: { inviteToken },
      });
    }

    // Verwende die aktuelle Request-URL für bessere Kompatibilität
    const baseUrl = request.nextUrl.origin;
    const inviteUrl = `${baseUrl}/groups/invite/${inviteToken}`;

    return NextResponse.json({ inviteUrl, inviteToken });
  } catch (error) {
    console.error("Fehler beim Generieren des Einladungs-Links:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

// POST: Neuen Einladungs-Link generieren (Token zurücksetzen)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Handle params as Promise (Next.js 15+) or object (Next.js 14)
    const resolvedParams = await Promise.resolve(params);
    const groupId = resolvedParams.id;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Gruppe nicht gefunden" }, { status: 404 });
    }

    // Nur Besitzer kann Einladungs-Link generieren
    if (group.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 });
    }

    // Generiere neuen Token
    const inviteToken = randomBytes(32).toString("hex");
    await prisma.group.update({
      where: { id: groupId },
      data: { inviteToken },
    });

    // Verwende die aktuelle Request-URL für bessere Kompatibilität
    const baseUrl = request.nextUrl.origin;
    const inviteUrl = `${baseUrl}/groups/invite/${inviteToken}`;

    return NextResponse.json({ inviteUrl, inviteToken });
  } catch (error) {
    console.error("Fehler beim Generieren des Einladungs-Links:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

