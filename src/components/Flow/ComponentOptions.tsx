import { Cog, Trash2 } from "lucide-react";
import { ComponentType } from "../../types/Component";
import { useUnattended } from "../Context/UnattendedComponentContext";
import { Handle, Position, useReactFlow } from "reactflow";
import { useLoading } from "../../pages/Workflow";
import { useContentTypes } from "../../services/getQueries";
import api from "../../services/api";
import { getPathOfContent } from "../../utils/freqFuncs";
import { toast } from "react-toastify";

type ComponentHeaderProps = {
  id: string;
  data: ComponentType;
};

export const ComponentHeader = ({ id, data }: ComponentHeaderProps) => {
  const flowInstance = useReactFlow();
  const setLoading = useLoading();
  const { contentTypes } = useContentTypes();
  const setUnattendedComponent = useUnattended()[1];

  function deleteComponent() {
    setLoading(true);
    if (contentTypes) {
      api
        .delete(
          `${getPathOfContent(data.component_content_type, contentTypes)}${id}/`,
        )
        .then(() => {
          flowInstance.deleteElements({ nodes: [{ id: id }] });
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <div className="invisible flex h-3 flex-row justify-center gap-1 text-base-content opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100">
      <Trash2
        onClick={() => deleteComponent()}
        className="size-3 cursor-pointer hover:text-patina-400"
      />
      <Cog
        onClick={() => setUnattendedComponent(data)}
        className="size-3 cursor-pointer hover:text-patina-400"
      />
    </div>
  );
};

type ComponentHandlesProps = {
  component_type:
    | "TELEGRAM"
    | "TRIGGER"
    | "CONDITIONAL"
    | "CODE"
    | "BUTTON"
    | "GROUP";
  isConnectable: boolean;
};

export const ComponentHandles = ({
  component_type,
  isConnectable,
}: ComponentHandlesProps) => {
  const handles = [0, 1, 2, 3, 4, 5];
  if (component_type == "CONDITIONAL") {
    return (
      <>
        <div className="">
          {handles.map((handleId, i) => (
            <Handle
              key={handleId}
              type="source"
              id={String(handleId)}
              position={Position.Right}
              isConnectable={isConnectable}
              title={String(handleId)}
              style={{
                width: 7,
                height: 7,
                top: 10 * i,
              }}
            />
          ))}
        </div>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          isConnectableStart={false}
          style={{
            width: 1,
            height: 8,
            borderRadius: 1,
          }}
        />
      </>
    );
  }
  return (
    <div>
      {component_type != "GROUP" && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{
            width: 7,
            height: 7,
          }}
        ></Handle>
      )}
      {!["TRIGGER", "BUTTON"].includes(component_type) && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          isConnectableStart={false}
          style={{
            width: 1,
            height: 8,
            borderRadius: 1,
          }}
        />
      )}
    </div>
  );
};
