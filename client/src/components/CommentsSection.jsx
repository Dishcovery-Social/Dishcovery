import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import {
  createComment,
  deleteComment,
  getComments,
} from "../services/CommentsAPI.js";
import Comment from "./Comment.jsx";

export default function CommentsSection({ recipeId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(recipeId);
        setComments(data);
      } catch {
        setError(true);
        toast.error("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await createComment(recipeId, text.trim());
      setComments((prev) => [...prev, newComment]);
      setText("");
    } catch {
      toast.error("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(recipeId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  return (
    <div className="w-full max-w-md bg-primary">
      <p className="text-secondary text-center font-heading text-lg font-semibold p-1">
        Comments
      </p>
      <div className="flex flex-col gap-3 p-4">
        {loading ? (
          <p className="text-secondary text-sm text-center">
            Loading comments...
          </p>
        ) : error ? (
          <p className="text-secondary text-sm text-center">
            Failed to load comments. Please try again later.
          </p>
        ) : comments.length === 0 ? (
          <p className="text-secondary text-sm text-center">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
        {user && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full rounded-xl p-3 text-sm text-ink bg-secondary resize-none placeholder:text-ink/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="self-end px-5 py-1.5 rounded-full bg-secondary text-ink text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
