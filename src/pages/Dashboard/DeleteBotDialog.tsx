import { useRef, useState } from "react";

import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export type DeleteBotDialogProps = {
  botId: string;
  onDelete: (botId: string) => Promise<void>;
};

export default function DeleteBotDialog({
  onDelete,
  botId,
}: DeleteBotDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [hidden, setIshidden] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await onDelete(botId);
      modalRef.current?.close();
    } catch (error) {
      toast.error("Failed to delete bot. Please try again.");
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Open button */}
      <button
        className="btn mt-4 btn-error"
        onClick={() => modalRef.current?.showModal()}
      >
        <Trash2 />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Delete bot?</h3>
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
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
