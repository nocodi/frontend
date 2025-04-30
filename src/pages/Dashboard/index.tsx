import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import SearchBar from "../../components/searchBar";
import NewBotDialog from "./NewBotDialog";
import ProfileDialog from "./ProfileDialog";
import { LoaderCircle } from "lucide-react";

type BotData = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  user: string;
  token: string;
};

const Dashboard = () => {
  const [bots, setBots] = useState<BotData[]>();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchBots = () => {
    api
      .get<BotData[]>("bot/my-bots/")
      .then((res) => {
        setBots(res.data);
      })
      .catch((err) => {
        toast(err.message, { position: "top-left", autoClose: 3000 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateBot = (newBot: {
    name: string;
    token: string;
    description: string;
  }) => {
    api
      .post("bot/create-bot/", newBot)
      .then(() => {
        toast.success("Bot created successfully!", {
          position: "top-left",
          autoClose: 3000,
        });
        fetchBots();
      })
      .catch((err) => {
        toast.error(err.message, { position: "top-left", autoClose: 3000 });
      });
  };

  useEffect(fetchBots, []);

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
          <ProfileDialog />
        </div>
        {loading ?
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
                        <Link
                          to={`bot/${item.id}`}
                          className="btn mt-4 btn-primary"
                        >
                          Open Bot
                        </Link>
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
