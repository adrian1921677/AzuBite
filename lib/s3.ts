import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Konfiguration für AWS S3 oder Cloudflare R2
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.R2_ENDPOINT, // Für Cloudflare R2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "";

export async function uploadFile(file: Buffer, fileName: string, contentType: string, folder: string = "reports"): Promise<string> {
  const key = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // URL zurückgeben (für Cloudflare R2 oder S3)
  if (process.env.R2_ENDPOINT) {
    return `${process.env.R2_ENDPOINT}/${key}`;
  }
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

// Extrahiere den Key aus einer URL
export function extractKeyFromUrl(url: string): string {
  if (url.includes("s3")) {
    const parts = url.split(".amazonaws.com/");
    return parts[1] || "";
  }
  if (url.includes("r2.cloudflarestorage.com")) {
    const parts = url.split(".com/");
    return parts[1] || "";
  }
  return url;
}


