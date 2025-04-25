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
      : <div className="h-screen overflow-hidden">
          <div className="flex h-full w-full flex-col divide-y divide-base-100 text-neutral">
            <div className="h-15 shrink-0 bg-primary px-5">
              <div>title whatever</div>
            </div>
            <DnDFlow botId={Number(botId)} />
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
