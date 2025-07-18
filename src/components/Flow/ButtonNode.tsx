import { Handle, NodeProps, Position } from "reactflow";
import { ComponentType } from "../../types/Component";

function ButtonNode({ data, isConnectable }: NodeProps<ComponentType>) {
  return (
    <div className="tooltip">
      <div className="tooltip-content bg-base-content text-base-300">
        <div className="text-xs">{data.component_name}</div>
      </div>
      <div className="bg-parent h-1 w-1">
        <Handle
          type="source"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!h-2 !w-2 !bg-base-content"
        ></Handle>
      </div>
    </div>
  );
}

export default ButtonNode;
