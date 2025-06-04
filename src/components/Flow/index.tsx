import { DnDProvider } from "../Context/DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";
import { UnattendedComponentProvider } from "../Context/UnattendedComponentContext";

function DnDFlow() {
  return (
    <ReactFlowProvider>
      <UnattendedComponentProvider>
        <DnDProvider>
          <Flow />
        </DnDProvider>
      </UnattendedComponentProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
