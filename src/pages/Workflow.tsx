import { useCallback } from "react";

import NodeBox from "../components/NodeBox";

import ReactFlow, {
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

import SidePanel from "../components/SidePanel";

const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 0, y: 0 },
    selected: false,
    data: { label: "Hi", type: "input" },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 150, y: 150 },
    selected: false,
    data: { label: "Middle", type: "input-output" },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 300, y: 300 },
    selected: false,
    data: { label: "Bye", type: "output" },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { customNode: NodeBox };

function Workflow() {
  // Edges and Nodes
  const [nodes, setNodes, onNodeChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-screen text-white">
      <div className="flex flex-row h-full divide-x divide-primary">
        <SidePanel />
        <div className="flex flex-col w-full h-full divide-y divide-primary">
          <div className="h-15 bg-secondary shrink-0 px-5">
            <div className="">top right</div>
          </div>

          <div className="bg-overlay-light w-full h-full">
            <div className="w-full h-full bg-gray-700 relative">
              <div className="flex absolute z-1 right-0 items-center justify-center cursor-pointer w-12 h-10 border-2 rounded-xl mr-5 mt-5 hover:border-red-400 group">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white group-hover:text-red-400"
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
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </div>
              <div className="w-full h-full border border-gray-700 rounded-lg">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodeChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  nodeTypes={nodeTypes}
                >
                  <Background />
                  <MiniMap pannable={true} zoomable={true} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workflow;
