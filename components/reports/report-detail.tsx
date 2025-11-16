"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import toast from "react-hot-toast";
import Image from "next/image";

interface ReportDetailProps {
  reportId: string;
  userId: string;
}

export function ReportDetail({ reportId, userId }: ReportDetailProps) {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    loadReport();
    loadComments();
    loadRatings();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (error) {
      toast.error("Fehler beim Laden des Berichts");
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Kommentare:", error);
    }
  };

  const loadRatings = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/ratings`);
      if (res.ok) {
        const data = await res.json();
        setRatings(data);
        const userR = data.find((r: any) => r.user.id === userId);
        if (userR) {
          setUserRating(userR.value);
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Bewertungen:", error);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/download`);
      if (res.ok) {
        const data = await res.json();
        window.open(data.downloadUrl, "_blank");
      } else {
        toast.error("Fehler beim Generieren der Download-URL");
      }
    } catch (error) {
      toast.error("Fehler beim Download");
    }
  };

  const handleRating = async (value: number) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (res.ok) {
        setUserRating(value);
        loadRatings();
        loadReport(); // Aktualisiere Durchschnittsbewertung
        toast.success("Bewertung gespeichert");
      }
    } catch (error) {
      toast.error("Fehler beim Speichern der Bewertung");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          parentId,
        }),
      });

      if (res.ok) {
        setNewComment("");
        loadComments();
        toast.success("Kommentar hinzugefügt");
      } else {
        const error = await res.json();
        toast.error(error.error || "Fehler beim Hinzufügen des Kommentars");
      }
    } catch (error) {
      toast.error("Fehler beim Hinzufügen des Kommentars");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Lädt...</div>;
  }

  if (!report) {
    return <div className="text-center py-8">Bericht nicht gefunden</div>;
  }

  return (
    <div className="space-y-6">
      {/* Bericht-Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{report.title}</h1>
            {report.description && (
              <p className="text-gray-600 mb-4">{report.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                {report.author.image && (
                  <Image
                    src={report.author.image}
                    alt={report.author.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{report.author.name || "Unbekannt"}</span>
              </div>
              <span>
                {format(new Date(report.createdAt), "dd.MM.yyyy", { locale: de })}
              </span>
              {report.profession && <span>{report.profession}</span>}
              {report.trainingYear && (
                <span>{report.trainingYear}. Ausbildungsjahr</span>
              )}
              <span className="capitalize">{report.visibility.toLowerCase()}</span>
            </div>
            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {report.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bewertung */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-600">Bewertung: </span>
              <span className="font-semibold">
                {report.averageRating.toFixed(1)} ⭐ ({report.ratingCount})
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  className={`text-2xl ${
                    userRating && value <= userRating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
            <Button onClick={handleDownload} variant="outline">
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Kommentare */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Kommentare ({comments.length})
        </h2>

        {/* Neuer Kommentar */}
        <form onSubmit={(e) => handleSubmitComment(e)} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Schreibe einen Kommentar..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          />
          <Button type="submit" disabled={isSubmittingComment}>
            {isSubmittingComment ? "Lädt..." : "Kommentar hinzufügen"}
          </Button>
        </form>

        {/* Kommentarliste */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Noch keine Kommentare
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                userId={userId}
                reportId={reportId}
                onReply={() => loadComments()}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  userId,
  reportId,
  onReply,
}: {
  comment: any;
  userId: string;
  reportId: string;
  onReply: () => void;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          parentId: comment.id,
        }),
      });

      if (res.ok) {
        setReplyText("");
        setShowReplyForm(false);
        onReply();
        toast.success("Antwort hinzugefügt");
      }
    } catch (error) {
      toast.error("Fehler beim Hinzufügen der Antwort");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-start gap-2 mb-2">
        {comment.author.image && (
          <Image
            src={comment.author.image}
            alt={comment.author.name || ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="font-semibold">{comment.author.name || "Unbekannt"}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(comment.createdAt), "dd.MM.yyyy HH:mm", { locale: de })}
          </div>
          <p className="mt-2">{comment.content}</p>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sm text-primary-600 hover:text-primary-700 mt-2"
          >
            Antworten
          </button>
        </div>
      </div>

      {showReplyForm && (
        <form onSubmit={handleReply} className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Antwort schreiben..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Lädt..." : "Antworten"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText("");
              }}
            >
              Abbrechen
            </Button>
          </div>
        </form>
      )}

      {/* Antworten */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-4 space-y-3">
          {comment.replies.map((reply: any) => (
            <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
              <div className="flex items-start gap-2">
                {reply.author.image && (
                  <Image
                    src={reply.author.image}
                    alt={reply.author.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {reply.author.name || "Unbekannt"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(reply.createdAt), "dd.MM.yyyy HH:mm", {
                      locale: de,
                    })}
                  </div>
                  <p className="mt-1 text-sm">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


