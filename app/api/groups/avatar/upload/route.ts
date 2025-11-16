import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 });
    }

    // Validiere Dateityp (nur Bilder)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Nur Bilddateien (JPEG, PNG, WebP, GIF) sind erlaubt" },
        { status: 400 }
      );
    }

    // Validiere Dateigröße (max 5MB für Bilder)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Bild ist zu groß (max. 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFile(buffer, file.name, file.type, "avatars");

    return NextResponse.json({
      url: fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Fehler beim Hochladen des Avatars:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}

