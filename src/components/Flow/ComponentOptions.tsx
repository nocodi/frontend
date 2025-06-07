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
  return (
    <div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: 7,
          height: 7,
        }}
      ></Handle>
      {component_type != "TRIGGER" && (
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
