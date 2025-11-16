import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { EmptyStateMascot, Mascot } from "@/components/ui/mascot";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Lade Dashboard-Daten mit Fehlerbehandlung
  let reports: any[] = [];
  let groups: any[] = [];
  let notifications: any[] = [];

  try {
    [reports, groups, notifications] = await Promise.all([
    prisma.report.findMany({
      where: { authorId: session.user.id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
    prisma.groupMember.findMany({
      where: { userId: session.user.id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            avatar: true,
            _count: {
              select: {
                members: true,
                reports: true,
              },
            },
          },
        },
      },
      take: 5,
    }),
    prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);
  } catch (error) {
    console.error("Fehler beim Laden der Dashboard-Daten:", error);
    // Leere Arrays werden bereits gesetzt, Seite kann trotzdem angezeigt werden
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Willkommen zurück, {session.user.name || session.user.email}!
          </h1>
          <p className="text-gray-600 mt-2">Verwalte deine Berichte und Gruppen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meine Berichte */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meine Berichte</h2>
                <Link href="/reports/new">
                  <Button>Neuer Bericht</Button>
                </Link>
              </div>

              {reports.length === 0 ? (
                <EmptyStateMascot 
                  message="Noch keine Berichtshefte hochgeladen. Starte jetzt und teile dein Wissen mit anderen Auszubildenden!"
                  action={
                    <Link href="/reports/new">
                      <Button>Ersten Bericht hochladen</Button>
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          {report.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {report.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>
                              {format(new Date(report.createdAt), "dd.MM.yyyy", { locale: de })}
                            </span>
                            {report.profession && <span>{report.profession}</span>}
                            {report.trainingYear && (
                              <span>{report.trainingYear}. Ausbildungsjahr</span>
                            )}
                            <span className="capitalize">{report.visibility.toLowerCase()}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right text-sm text-gray-500">
                          <div>{report._count.comments} Kommentare</div>
                          <div>{report._count.ratings} Bewertungen</div>
                          <div>{report.downloadCount} Downloads</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gruppen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Meine Gruppen</h2>
                <Link href="/groups/new">
                  <Button size="sm" variant="outline">+</Button>
                </Link>
              </div>

              {groups.length === 0 ? (
                <div className="text-center py-4">
                  <Mascot size="md" variant="empty" className="mb-2" />
                  <p className="text-gray-500 text-sm">Noch keiner Gruppe beigetreten</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groups.map(({ group }) => (
                    <Link
                      key={group.id}
                      href={`/groups/${group.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {group._count.members} Mitglieder • {group._count.reports} Berichte
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Benachrichtigungen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Benachrichtigungen</h2>

              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <Mascot size="sm" variant="happy" className="mb-2" />
                  <p className="text-gray-500 text-sm">Keine neuen Benachrichtigungen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-primary-50 rounded-lg border border-primary-200"
                    >
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(notification.createdAt), "dd.MM.yyyy HH:mm", {
                          locale: de,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

