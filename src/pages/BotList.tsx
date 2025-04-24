import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import SearchBar from "../components/searchBar";

type BotData = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  user: string;
  token: string;
};

const BotList = () => {
  const [bots, setBots] = useState<BotData[]>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newBot, setNewBot] = useState({
    name: "",
    token: "",
    description: "",
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = () => {
    api
      .get<BotData[]>("bot/my-bots/")
      .then((res) => {
        setBots(res.data);
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateBot = () => {
    api
      .post("bot/create-bot/", newBot)
      .then(() => {
        toast.success("Bot created successfully!");
        setShowModal(false);
        setNewBot({ name: "", token: "", description: "" });
        fetchBots();
      })
      .catch((err) => {
        toast.error(err.message);
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
    <div className="min-h-screen w-full bg-base-200">
      <div className="container mx-auto flex min-h-screen flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="mt-10 mb-2 text-3xl font-bold text-cream-900">
            Your Bots
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn mt-10 btn-primary"
          >
            Create Bot
          </button>
        </div>
        {loading ?
          <svg
            className="m-auto size-10 animate-spin text-cream-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
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
                      className="card bg-base-100 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105"
                    >
                      <div className="card-body">
                        <h3 className="card-title">{item.name}</h3>
                        <p>{item.description}</p>
                        <Link
                          to={`/workflow/${item.id}`}
                          className="btn mt-4 btn-primary"
                        >
                          Open Bot
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              : <p className="m-auto text-cream-500">
                  Nothing Matched Your Query.
                </p>
              }
            </>
          : <p className="m-auto text-cream-500">No Bot yet.</p>
        : <p className="m-auto text-cream-500">Faild to load bots.</p>}
      </div>

      {/* Create Bot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="card w-96 bg-base-100 p-6 shadow-xl">
            <h3 className="mb-4 pb-4 text-xl font-bold">Create New Bot</h3>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Bot Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter bot name"
                className="input-bordered input w-full"
                value={newBot.name}
                onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
              />
            </div>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Bot Token</span>
              </label>
              <input
                type="text"
                placeholder="Enter bot token"
                className="input-bordered input w-full"
                value={newBot.token}
                onChange={(e) =>
                  setNewBot({ ...newBot, token: e.target.value })
                }
              />
            </div>
            <div className="form-control mb-4 w-full">
              <label className="label">
                <span className="label-text">Bot Description</span>
              </label>
              <input
                type="text"
                placeholder="Enter bot description"
                className="input-bordered input w-full"
                value={newBot.description}
                onChange={(e) =>
                  setNewBot({ ...newBot, description: e.target.value })
                }
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setNewBot({ name: "", token: "", description: "" });
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateBot}
                disabled={!newBot.name || !newBot.token}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotList;
