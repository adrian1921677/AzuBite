import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GroupDetail } from "@/components/groups/group-detail";

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const group = await prisma.group.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          members: true,
          reports: true,
        },
      },
    },
  });

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gruppe nicht gefunden</h1>
          <Link href="/groups">
            <Button>Zurück zu Gruppen</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prüfe Zugriff bei privaten Gruppen
  if (!group.isPublic) {
    const isMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId: session.user.id,
          groupId: params.id,
        },
      },
    });

    if (!isMember && group.ownerId !== session.user.id) {
      redirect("/groups");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="AzuBite Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/reports">
                <Button variant="ghost">Berichte</Button>
              </Link>
              <Link href="/groups">
                <Button variant="ghost">Gruppen</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GroupDetail groupId={params.id} userId={session.user.id} />
      </main>
    </div>
  );
}


