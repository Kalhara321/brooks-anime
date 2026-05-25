"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
type Comment = {
  id: string;
  animeId: number;
  userName: string;
  content: string;
  createdAt: Date;
};

const REACTIONS = ["🔥", "❤️", "😂", "😮", "👏"];

export default function Comments({ animeId }: { animeId: number }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session?.user) return;
    setComments([
      {
        id: Date.now().toString(),
        animeId,
        userName: session.user.name || "Fan",
        content: newComment,
        createdAt: new Date(),
      },
      ...comments,
    ]);
    setNewComment("");
  };

  return (
    <div className="glass rounded-2xl p-6 border border-violet-500/15">
      <div className="flex flex-wrap gap-2 mb-6">
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-violet-500/20 text-lg transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="input-cyber resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button type="submit" className="btn-neon !py-2 !px-6 rounded-xl text-xs">
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-5 glass rounded-xl text-center border border-violet-500/20">
          <p className="text-zinc-400 text-sm mb-3">Sign in to join the discussion</p>
          <button type="button" onClick={() => signIn()} className="btn-neon-outline rounded-xl text-xs">
            Sign In
          </button>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-zinc-600 text-center py-8 text-sm">No comments yet — start the conversation!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-sm font-bold">
                  {c.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{c.userName}</p>
                  <p className="text-[10px] text-zinc-600">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-zinc-300 text-sm">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
