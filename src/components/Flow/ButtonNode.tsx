import { Handle, NodeProps, Position } from "reactflow";
import { ComponentType } from "../../types/Component";

function ButtonNode({ isConnectable }: NodeProps<ComponentType>) {
  //   const flowInstance = useReactFlow();
  //   const setUnattendedComponent = useUnattended()[1];
  //   const setLoading = useLoading();
  //   const { contentTypes } = useContentTypes();

  return (
    <div className="tooltip tooltip-primary">
      <div className="tooltip-content">
        <div className="text-xs">salam</div>
      </div>
      <div className="bg-parent h-1 w-1">
        <Handle
          type="source"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{
            width: 7,
            height: 7,
            backgroundColor: "#376a5e",
          }}
        ></Handle>
      </div>
    </div>
  );
}

export default ButtonNode;
