import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const email = "test@test.com";
    const password = "test";
    const name = "Test User";

    // Prüfe ob Benutzer bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("✅ Test-Benutzer existiert bereits:");
      console.log(`   Email: ${email}`);
      console.log(`   Passwort: ${password}`);
      console.log(`   Name: ${existingUser.name}`);
      return;
    }

    // Hash Passwort
    const hashedPassword = await bcrypt.hash(password, 10);

    // Erstelle Test-Benutzer
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "USER",
      },
    });

    console.log("✅ Test-Benutzer erfolgreich erstellt!");
    console.log("\n📋 Anmeldedaten:");
    console.log("   Email: test@test.com");
    console.log("   Passwort: test");
    console.log("   Name: Test User");
    console.log(`   ID: ${user.id}`);
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Test-Benutzers:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

