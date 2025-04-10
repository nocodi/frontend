import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

type WorkflowData = {
  id: string;
  name: string;
};

const ItemList = () => {
  const [workflows, setWorkflows] = useState<WorkflowData[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<WorkflowData[]>("bot/my-bots/")
      .then((res) => {
        setWorkflows(res.data);
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Item List</h2>
      <ul>
        {workflows?.map((item) => (
          <li key={item.id}>
            <Link to={`/workflow/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
