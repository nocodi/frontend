import { useParams } from "react-router-dom";
import DnDFlow from "../components/DndFlow";

type WorkflowParams = {
  id: string;
};

function Workflow() {
  const { id } = useParams<WorkflowParams>();
  return (
    <>
      {!id || isNaN(Number(id)) ?
        <div>Not a Number</div>
      : <div className="h-screen overflow-hidden text-white">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            <div className="h-15 shrink-0 bg-patina-300 px-5">
              <div className="">title whatever</div>
            </div>
            <DnDFlow botId={Number(id)} />
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
