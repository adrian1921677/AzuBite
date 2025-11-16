import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const email = "test@test.com";
    const password = "test";
    const name = "test";

    // Prüfe ob Benutzer bereits existiert (nach Email oder Name)
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    const existingUserByName = await prisma.user.findFirst({
      where: { name },
    });

    if (existingUserByEmail || existingUserByName) {
      const user = existingUserByEmail || existingUserByName;
      console.log("✅ Test-Benutzer existiert bereits:");
      console.log(`   Email: ${user?.email}`);
      console.log(`   Passwort: ${password}`);
      console.log(`   Name: ${user?.name}`);
      console.log(`   ID: ${user?.id}`);
      
      // Aktualisiere Name falls nötig
      if (existingUserByEmail && existingUserByEmail.name !== name) {
        await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: { name },
        });
        console.log(`\n✅ Name wurde auf "${name}" aktualisiert.`);
      }
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
        emailVerified: new Date(),
        role: "USER",
      },
    });

    console.log("✅ Test-Benutzer erfolgreich erstellt!");
    console.log("\n📋 Anmeldedaten:");
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Passwort: ${password}`);
    console.log(`   ID: ${user.id}`);
    console.log("\n💡 Du kannst dich jetzt mit Name 'test' oder Email 'test@test.com' anmelden!");
  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Test-Benutzers:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

