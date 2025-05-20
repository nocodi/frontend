import { useEffect, useRef, useState } from "react";

import { Cog } from "lucide-react";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { useBotData } from "../../services/getQueries";

export type EditBotDialogProps = {
  botId: string;
  onCreate: (bot: {
    name: string;
    token: string;
    description: string;
  }) => Promise<void>;
};

export default function EditBotDialog({ onCreate, botId }: EditBotDialogProps) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { data, refetch, isFetching } = useBotData(botId);

  const resetForm = () => {
    setName("");
    setToken("");
    setDescription("");
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
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setName(data ? data.name : "");
    setToken(data ? data.token : "");
    setDescription(data ? data.description : "");
  }, []);

  return (
    <>
      {/* Open button */}
      <button
        className="btn mt-4 btn-secondary"
        onClick={() => {
          refetch().catch((err) => toast.error(err));
          modalRef.current?.showModal();
        }}
      >
        <Cog />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          {isFetching ?
            <Loading size={20} />
          : <>
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
            </>
          }
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
