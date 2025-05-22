import { toast } from "react-toastify";
import { useState } from "react";

export type DeleteBotDialogProps = {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  setDelSelected: React.Dispatch<React.SetStateAction<string | null>>;
  botId: string;
  onDelete: (botId: string) => Promise<void>;
};

export default function DeleteBotDialog({
  onDelete,
  botId,
  setDelSelected,
  modalRef,
}: DeleteBotDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onDelete(botId);
      modalRef.current?.close();
      setDelSelected(null);
    } catch (error) {
      toast.error("Failed to delete bot. Please try again.");
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-bold">Delete bot {botId}?</h3>
      <div className="modal-action">
        <button onClick={handleDelete} className="btn btn-primary">
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          className="btn"
          onClick={() => {
            modalRef.current?.close();
          }}
        >
          Cancel
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </>
  );
}
