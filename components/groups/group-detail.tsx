"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import toast from "react-hot-toast";
import Image from "next/image";

interface GroupDetailProps {
  groupId: string;
  userId: string;
}

export function GroupDetail({ groupId, userId }: GroupDetailProps) {
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
        setIsMember(
          data.members.some((m: any) => m.userId === userId) ||
            data.ownerId === userId
        );
      }
    } catch (error) {
      toast.error("Fehler beim Laden der Gruppe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Gruppe beigetreten");
        loadGroup();
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Beitreten");
      }
    } catch (error) {
      toast.error("Fehler beim Beitreten zur Gruppe");
    }
  };

  const handleLeave = async () => {
    if (!confirm("Möchtest du die Gruppe wirklich verlassen?")) return;

    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Gruppe verlassen");
        router.push("/groups");
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Verlassen");
      }
    } catch (error) {
      toast.error("Fehler beim Verlassen der Gruppe");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Lädt...</div>;
  }

  if (!group) {
    return <div className="text-center py-8">Gruppe nicht gefunden</div>;
  }

  return (
    <div className="space-y-6">
      {/* Gruppen-Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            {group.description && (
              <p className="text-gray-600 mb-4">{group.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {group.owner.image && (
                  <Image
                    src={group.owner.image}
                    alt={group.owner.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>Erstellt von {group.owner.name || "Unbekannt"}</span>
              </div>
              <span>
                {format(new Date(group.createdAt), "dd.MM.yyyy", { locale: de })}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-gray-600">
                {group._count.members} Mitglieder
              </span>
              <span className="text-sm text-gray-600">
                {group._count.reports} Berichte
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                group.isPublic
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {group.isPublic ? "Öffentlich" : "Privat"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            {isMember ? (
              <Button onClick={handleLeave} variant="outline">
                Verlassen
              </Button>
            ) : (
              <Button onClick={handleJoin}>Beitreten</Button>
            )}
          </div>
        </div>
      </div>

      {/* Mitglieder */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Mitglieder ({group.members.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.members.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
            >
              {member.user.image && (
                <Image
                  src={member.user.image}
                  alt={member.user.name || ""}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{member.user.name || "Unbekannt"}</div>
                <div className="text-sm text-gray-500 capitalize">
                  {member.role.toLowerCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Berichte */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Berichte ({group.reports.length})
          </h2>
          {isMember && (
            <Link href={`/reports/new?groupId=${groupId}`}>
              <Button>Neuer Bericht</Button>
            </Link>
          )}
        </div>

        {group.reports.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Noch keine Berichte in dieser Gruppe
          </p>
        ) : (
          <div className="space-y-4">
            {group.reports.map((report: any) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-lg">{report.title}</h3>
                {report.description && (
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {report.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>
                    {format(new Date(report.createdAt), "dd.MM.yyyy", {
                      locale: de,
                    })}
                  </span>
                  <span>{report._count.comments} Kommentare</span>
                  <span>{report._count.ratings} Bewertungen</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


