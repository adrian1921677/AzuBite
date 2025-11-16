"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyStateMascot } from "@/components/ui/mascot";
import toast from "react-hot-toast";

export function GroupsList() {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const url = searchTerm
        ? `/api/groups?search=${encodeURIComponent(searchTerm)}&isPublic=true`
        : "/api/groups?isPublic=true";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (error) {
      toast.error("Fehler beim Laden der Gruppen");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Gruppe beigetreten");
        loadGroups();
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Beitreten");
      }
    } catch (error) {
      toast.error("Fehler beim Beitreten zur Gruppe");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Lädt...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Suchfeld */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Gruppen suchen..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            loadGroups();
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Gruppenliste */}
      {groups.length === 0 ? (
        <EmptyStateMascot message="Noch keine Gruppen gefunden. Erstelle eine neue Gruppe oder suche nach öffentlichen Gruppen!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              {group.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{group._count.members} Mitglieder</span>
                <span>{group._count.reports} Berichte</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/groups/${group.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Ansehen
                  </Button>
                </Link>
                <Button
                  onClick={() => handleJoin(group.id)}
                  className="flex-1"
                >
                  Beitreten
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


