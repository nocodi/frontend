import { DnDProvider } from "../Context/DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";
import { UnattendedComponentProvider } from "../Context/UnattendedComponentContext";
import { BtnCounterProvider } from "../Context/BtnCounterCtx";

function DnDFlow() {
  return (
    <ReactFlowProvider>
      <BtnCounterProvider>
        <UnattendedComponentProvider>
          <DnDProvider>
            <Flow />
          </DnDProvider>
        </UnattendedComponentProvider>
      </BtnCounterProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
