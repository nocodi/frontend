import { useParams } from "react-router-dom";
import DnDFlow from "../components/DndFlow";

export type WorkflowParams = {
  botId: string;
};

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  return (
    <>
      {!botId || isNaN(Number(botId)) ?
        <div>Not a Number</div>
      : <div className="h-screen overflow-hidden text-white">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            {/* <div className="h-15 shrink-0 bg-primary px-5">
              <div className="">title whatever</div>
            </div> */}
            <DnDFlow botId={Number(botId)} />
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
