import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import DeleteModal from "./DeleteModal.jsx";

export default function Comment({ comment, onDelete }) {
  const { user } = useAuth();
  const isOwner = user?.username === comment.username;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-secondary rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {comment.profile_image ? (
          <img
            src={comment.profile_image}
            alt={`${comment.username} avatar`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0" />
        )}
        <span className="font-semibold text-ink">{comment.username}</span>
        {isOwner && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="ml-auto text-xs bg-red-100 text-red-600 hover:bg-red-200 rounded-full px-3 py-0.5"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-sm leading-snug text-ink">{comment.body}</p>
      {showModal && (
        <DeleteModal
          message="Are you sure you want to delete this comment?"
          onConfirm={() => {
            setShowModal(false);
            onDelete(comment.id);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
