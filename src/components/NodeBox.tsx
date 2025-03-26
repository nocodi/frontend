import { Handle, Position, useReactFlow, NodeProps } from "reactflow";

function NodeBox({ id, data, isConnectable }: NodeProps) {
  const instance = useReactFlow();

  return (
    <div className="group flex cursor-pointer flex-col items-center gap-1">
      <div className="invisible flex h-3 w-10 flex-row justify-end gap-0.5 opacity-0 transition-opacity duration-300 ease-in group-hover:visible group-hover:opacity-100">
        <svg
          onClick={() => instance.deleteElements({ nodes: [{ id: id }] })}
          className="h-3 w-3 text-white hover:text-accent"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          className="h-3 w-3 hover:text-accent dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            d="M6 12h.01m6 0h.01m5.99 0h.01"
          />
        </svg>
      </div>
      <div className="relative h-9 w-13 rounded-lg border-2 border-patina-400 bg-patina-200 text-center shadow-lg">
        <div>
          {["input", "input-output"].indexOf(data.type) > -1 && (
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
          {["output", "input-output"].indexOf(data.type) > -1 && (
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
        <div className="text-sm">{data.label}</div>
      </div>
    </div>
  );
}

export default NodeBox;
