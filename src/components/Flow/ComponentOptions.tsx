import { Cog, Trash2 } from "lucide-react";
import { ComponentType } from "../../types/Component";
import { useUnattended } from "../Context/UnattendedComponentContext";
import { Handle, Position } from "reactflow";

type ComponentHeaderProps = {
  data: ComponentType;
  deleteComponent: () => void;
};

export const ComponentHeader = ({
  data,
  deleteComponent,
}: ComponentHeaderProps) => {
  const setUnattendedComponent = useUnattended()[1];

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
