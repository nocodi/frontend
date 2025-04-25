import { DnDProvider } from "./DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";
import { UnattendedComponentProvider } from "./UnattendedComponentContext";

function DnDFlow({ botId }: { botId: number }) {
  return (
    <ReactFlowProvider>
      <UnattendedComponentProvider>
        <DnDProvider>
          <Flow botId={botId} />
        </DnDProvider>
      </UnattendedComponentProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
