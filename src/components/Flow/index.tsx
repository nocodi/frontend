import { DnDProvider } from "./DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";
import { OpenComponentProvider } from "./OpenComponentContext";

function FlowWrapper() {
  return (
    <ReactFlowProvider>
      <OpenComponentProvider>
        <DnDProvider>
          <Flow />
        </DnDProvider>
      </OpenComponentProvider>
    </ReactFlowProvider>
  );
}

export default FlowWrapper;
