import { Handle, Position, useReactFlow, NodeProps } from "reactflow";

function NodeBox({ id, data, isConnectable, selected }: NodeProps) {
  const instance = useReactFlow();

  return (
    <div className="cursor-pointer flex flex-col gap-1 group items-center">
      <div className="flex flex-row justify-end gap-0.5 w-10 h-3 invisible group-hover:visible group-hover:opacity-100 opacity-0 transition-opacity ease-in duration-300">
        <svg
          onClick={() => instance.deleteElements({ nodes: [{ id: id }] })}
          className="w-3 h-3 text-white hover:text-accent"
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
          className="w-3 h-3 dark:text-white hover:text-accent"
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
      <div className="relative w-13 h-9 border-2 text-center rounded-lg shadow-lg border-patina-400 bg-patina-200">
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
