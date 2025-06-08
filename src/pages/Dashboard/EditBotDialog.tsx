import { useEffect, useState } from "react";

import { BotData } from "../../types/BotData";
import { toast } from "react-toastify";

export type EditBotDialogProps = {
  bots: BotData[] | undefined;
  botId: string | null;
  onEdit: (
    botId: string | null,
    bot: {
      name: string;
      token: string;
      description: string;
    },
  ) => Promise<void>;
  onClose: () => unknown;
};

export default function EditBotDialog({
  bots,
  botId,
  onEdit,
  onClose,
}: EditBotDialogProps) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setToken("");
    setDescription("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onEdit(botId, { name, token, description });
      resetForm();
      onClose();
    } catch (error) {
      toast.error("Failed to edit bot. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const bot = bots?.find((bot) => bot.id === botId);
    setName(bot ? bot.name : "");
    setToken(bot ? bot.token : "");
    setDescription(bot ? bot.description : "");
  }, [bots, botId]);

  return (
    <div>
      <h3 className="text-lg font-bold">Edit Bot</h3>
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
            {isSubmitting ? "Editing..." : "Edit"}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
