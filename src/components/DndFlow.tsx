import { DnDProvider } from "./DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";

function DnDFlow({ botId }: { botId: number }) {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Flow botId={botId} />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
