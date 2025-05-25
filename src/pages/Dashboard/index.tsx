import { Cog, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import DeleteBotDialog from "./DeleteBotDialog";
import EditBotDialog from "./EditBotDialog";
import { Link } from "react-router-dom";
import NewBotDialog from "./NewBotDialog";
import ProfileDialog from "./ProfileDialog";
import SearchBar from "../../components/searchBar";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useBots } from "../../services/getQueries";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const { bots, isFetching, refetch } = useBots();
  const [editSelected, setEditSelected] = useState<string | null>(null);
  const [delSelected, setDelSelected] = useState<string | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleCreateBot = async (newBot: {
    name: string;
    token: string;
    description: string;
  }) => {
    await api.post("bot/create-bot/", newBot);
    toast.success("Bot created successfully!");
    refetch().catch((err) => {
      toast(err.message);
    });
  };

  const handleEditBot = async (
    botId: string | null,
    bot: {
      name: string;
      token: string;
      description: string;
    },
  ) => {
    await api.patch(`bot/my-bots/${botId}`, bot);
    toast.success("Bot edited successfully!");
    refetch().catch((err) => {
      toast(err.message);
    });
  };

  const handleDeleteBot = async (botId: string) => {
    await api.delete(`bot/my-bots/${botId}/`);
    toast.success("Bot deleted successfully!");
    refetch().catch((err) => {
      toast(err.message);
    });
  };

  const filtered =
    query == "" ? bots : (
      bots?.filter(
        (bot) =>
          bot.name.toLowerCase().includes(query.toLowerCase()) ||
          bot.description.toLowerCase().includes(query.toLowerCase()),
      )
    );

  return (
    <div className="min-h-screen w-screen bg-base-300">
      <div className="container mx-auto flex min-h-screen flex-col gap-4 p-4">
        <div className="mt-10 flex items-center justify-between gap-2">
          <h2 className="mr-auto text-3xl font-bold">Your Bots</h2>
          <NewBotDialog onCreate={handleCreateBot} />
          <dialog ref={modalRef} className="modal">
            <div className="modal-box">
              {editSelected && (
                <EditBotDialog
                  modalRef={modalRef}
                  onEdit={handleEditBot}
                  botId={editSelected}
                  bots={bots}
                  setSelected={setEditSelected}
                />
              )}
              {delSelected && (
                <DeleteBotDialog
                  onDelete={handleDeleteBot}
                  botId={delSelected}
                  setDelSelected={setDelSelected}
                  modalRef={modalRef}
                />
              )}
            </div>

            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <ProfileDialog />
        </div>

        {isFetching ?
          <LoaderCircle className="m-auto size-10 animate-spin" />
        : bots ?
          bots.length ?
            <>
              <SearchBar
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {filtered?.length ?
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((item) => (
                    <div
                      key={item.id}
                      className="card-border card bg-base-100 transition-transform duration-300 ease-in-out sm:hover:scale-105"
                    >
                      <div className="card-body">
                        <h3 className="card-title">{item.name}</h3>
                        <p>{item.description}</p>
                        <div className="flex w-full flex-row gap-3">
                          <Link
                            to={`bot/${item.id}`}
                            className="btn mt-4 w-1/2 btn-primary"
                          >
                            Open Bot
                          </Link>
                          <button
                            className="btn mt-4 btn-secondary"
                            onClick={() => {
                              setEditSelected(item.id);
                              modalRef.current?.showModal();
                            }}
                          >
                            <Cog />
                          </button>
                          <button
                            className="btn mt-4 btn-error"
                            onClick={() => {
                              setDelSelected(item.id);
                              modalRef.current?.showModal();
                            }}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              : <p className="m-auto">Nothing Matched Your Query.</p>}
            </>
          : <p className="m-auto">No Bot yet.</p>
        : <p className="m-auto">Failed to load bots.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
