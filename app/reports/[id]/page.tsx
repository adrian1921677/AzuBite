import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ReportDetail } from "@/components/reports/report-detail";

export default async function ReportPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
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
    },
  });

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bericht nicht gefunden</h1>
          <Link href="/dashboard">
            <Button>Zurück zum Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prüfe Zugriffsrechte
  if (report.visibility === "PRIVATE" && report.authorId !== session.user.id) {
    redirect("/dashboard");
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
      redirect("/dashboard");
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportDetail reportId={params.id} userId={session.user.id} />
      </main>
    </div>
  );
}

