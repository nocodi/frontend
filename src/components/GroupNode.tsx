import { Handle, NodeProps, Position } from "reactflow";
import { ComponentType } from "../types/Component";

export const GroupNode = ({
  data,
  isConnectable,
}: NodeProps<ComponentType>) => {
  return (
    <div className="group-node h-20 w-30">
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
      <div className="">{data.component_name}</div>
    </div>
  );
};
