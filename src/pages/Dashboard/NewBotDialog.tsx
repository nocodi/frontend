import { useRef, useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";

type NewBotDialogProps = {
  onCreate: (bot: {
    name: string;
    token: string;
    description: string;
  }) => Promise<void>;
};

const TUTORIAL_STORAGE_KEY = "hasSeenNewBotButtonTutorial";

export default function NewBotDialog({ onCreate }: NewBotDialogProps) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  const newBotButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const resetForm = () => {
    setName("");
    setToken("");
    setDescription("");
  };

  const handleDismissTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setShowTutorial(false);
    modalRef.current?.show();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate({ name, token, description });
      resetForm();
      modalRef.current?.close();
    } catch (error) {
      toast.error("Failed to create bot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showTutorial && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="relative h-full w-full">
            <div className="absolute top-24 left-10 animate-pulse rounded-lg bg-base-100 p-4 shadow-2xl">
              <button
                onClick={handleDismissTutorial}
                className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
              >
                <X className="size-4" />
              </button>
              <h3 className="text-lg font-bold">New Bot Button</h3>
              <p className="py-2">
                Click here to add a new bot by providing its name, token, and a
                short description.
              </p>
              <button
                onClick={handleDismissTutorial}
                className="btn mt-2 btn-sm btn-primary"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        ref={newBotButtonRef}
        className={`btn btn-primary ${showTutorial ? "relative z-50" : ""}`}
        onClick={() => modalRef.current?.showModal()}
      >
        <Plus className="size-6" />
        New Bot
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create New Bot</h3>
          <form onSubmit={handleSubmit}>
            <div className="mt-4 grid w-full grid-cols-1 sm:grid-cols-3 sm:gap-4">
              <label className="label mt-4 sm:mt-0">Bot Name</label>
              <input
                type="text"
                placeholder="Enter bot name"
                className="input-bordered input w-full input-primary sm:col-span-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="label mt-4 sm:mt-0">Bot Token</label>
              <input
                type="text"
                placeholder="Enter bot token"
                className="input-bordered input w-full input-primary sm:col-span-2"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <label className="label mt-4 sm:mt-0">Bot Description</label>
              <input
                type="text"
                placeholder="Enter bot description"
                className="input-bordered input w-full input-primary sm:col-span-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!name || !token || isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetForm();
                  modalRef.current?.close();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
