import { toast } from "react-toastify";
import { useState } from "react";

export type DeleteBotDialogProps = {
  botId: string;
  onDelete: (botId: string) => Promise<void>;
  onClose: () => unknown;
};

export default function DeleteBotDialog({
  botId,
  onDelete,
  onClose,
}: DeleteBotDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onDelete(botId);
      onClose();
    } catch (error) {
      toast.error("Failed to delete bot. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-bold">Delete bot {botId}?</h3>
      <div className="modal-action">
        <button onClick={handleDelete} className="btn btn-error">
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </>
  );
}
