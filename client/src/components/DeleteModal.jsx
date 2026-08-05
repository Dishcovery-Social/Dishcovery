export default function DeleteModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-2xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4">
        <p className="text-ink font-semibold text-center">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-full bg-background text-ink text-sm hover:brightness-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-full bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
