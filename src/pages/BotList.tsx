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

  useEffect(() => {
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
  }, []);

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
        <h2 className="mt-10 mb-2 text-3xl font-bold">Your Bots</h2>
        {loading ?
          <svg
            className="m-auto size-10 animate-spin"
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
                      className="card border border-base-300 bg-base-100 shadow-xl transition-transform duration-300 ease-in-out hover:scale-105"
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
              : <p className="m-auto text-primary-content">
                  Nothing Matched Your Query.
                </p>
              }
            </>
          : <p className="m-auto text-primary-content">No Bot yet.</p>
        : <p className="m-auto text-primary-content">Faild to load bots.</p>}
      </div>
    </div>
  );
};

export default BotList;
