"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function InvitePage({ params }: { params: { token: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadGroupInfo();
  }, []);

  const loadGroupInfo = async () => {
    try {
      const res = await fetch(`/api/groups/invite/${params.token}`);
      if (res.ok) {
        const data = await res.json();
        setGroup(data);
      } else {
        toast.error("Ungültiger Einladungs-Link");
        router.push("/groups");
      }
    } catch (error) {
      toast.error("Fehler beim Laden der Gruppen-Info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!session) {
      toast.error("Bitte melde dich zuerst an");
      router.push(`/login?callbackUrl=/groups/invite/${params.token}`);
      return;
    }

    setIsJoining(true);
    try {
      const res = await fetch(`/api/groups/invite/${params.token}`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Erfolgreich beigetreten!");
        const data = await res.json();
        router.push(`/groups/${data.groupId}`);
      } else {
        const error = await res.json();
        if (error.groupId) {
          // Bereits Mitglied
          router.push(`/groups/${error.groupId}`);
        } else {
          toast.error(error.error || "Fehler beim Beitreten");
        }
      }
    } catch (error) {
      toast.error("Fehler beim Beitreten");
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 text-gray-600">Lädt...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Ungültiger Einladungs-Link</h1>
            <p className="text-gray-600 mb-6">
              Dieser Einladungs-Link ist nicht mehr gültig oder existiert nicht.
            </p>
            <Link href="/groups">
              <Button>Zu den Gruppen</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Gruppeneinladung</h1>
            <p className="text-gray-600">
              Du wurdest eingeladen, einer Gruppe beizutreten
            </p>
          </div>

          {/* Gruppen-Info */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {group.avatar ? (
                <Image
                  src={group.avatar}
                  alt={group.name}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-2xl">
                  {group.name[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{group.name}</h2>
                {group.description && (
                  <p className="text-gray-600 mt-1">{group.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
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
              <span>{group._count.members} Mitglieder</span>
              <span>{group._count.reports} Berichte</span>
            </div>
          </div>

          {/* Aktionen */}
          <div className="flex gap-4">
            {session ? (
              <Button
                onClick={handleJoin}
                disabled={isJoining}
                className="flex-1"
              >
                {isJoining ? "Tritt bei..." : "Gruppe beitreten"}
              </Button>
            ) : (
              <Link href={`/login?callbackUrl=/groups/invite/${params.token}`} className="flex-1">
                <Button className="w-full">
                  Anmelden und beitreten
                </Button>
              </Link>
            )}
            <Link href="/groups">
              <Button variant="outline">Abbrechen</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

