import { DnDProvider } from "./DnDContext";
import { ReactFlowProvider } from "reactflow";
import Flow from "./Flow";
import { UnattendedComponentProvider } from "./UnattendedComponentContext";
import { ContentTypesProvider } from "./ContentTypesContext";

function DnDFlow({ botId }: { botId: number }) {
  return (
    <ContentTypesProvider>
      <ReactFlowProvider>
        <UnattendedComponentProvider>
          <DnDProvider>
            <Flow botId={botId} />
          </DnDProvider>
        </UnattendedComponentProvider>
      </ReactFlowProvider>
    </ContentTypesProvider>
  );
}

export default DnDFlow;
