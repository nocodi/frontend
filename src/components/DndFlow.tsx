import { useCallback, useRef, useState, useEffect } from "react";

import Component from "./Component";
import { ComponentType, NodeComponent } from "../types/Component";
import ComponentList from "./ComponentList";

import ReactFlow, {
  useReactFlow,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";

import { DnDProvider, useDnD } from "../components/DnDContext";
import api from "../services/api";
import { toast } from "react-toastify";
import ComponentDetail from "./ComponentDetail";

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { customNode: Component };

function Flow({ botId }: { botId: number }) {
  const [currentComponent, setcurrentComponent] =
    useState<Node<NodeComponent>>();
  const [loading, setLoading] = useState(true);
  // Component Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isBullseye, setIsBullseye] = useState(true); // checks if there are any components available, if not, means we should make a flow on first component creation

  // Edges and Nodes
  const [nodes, setNodes, onNodeChange] = useNodesState<NodeComponent>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [component] = useDnD();

  const [contentTypes, setContentTypes] = useState<ComponentType[]>([]);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const makeNewComponent = useCallback(
    (component: ComponentType, x?: number, y?: number) => {
      const position = screenToFlowPosition({
        x: x ?? window.innerWidth / 2,
        y: y ?? window.innerHeight / 2,
      });
      setLoading(true);

      api
        .post(`/flow/${botId}/component/`, {
          content_type: component.id,
          name: "Salam",
          position_x: position.x,
          position_y: position.y,
        })
        .then((res) => {
          if (isBullseye) {
            api
              .post(`flow/${botId}/`, { start: res.data.id })
              .then((res) => {
                setIsBullseye(false);
                const nodeData: NodeComponent = {
                  object_id: undefined,
                  next_component: undefined,
                  name: "Salam",
                  content_type: component,
                };
                const newNode: Node<NodeComponent> = {
                  id: `${res.data.start_component.id}`,
                  type: "customNode",
                  position: position,
                  selected: false,
                  data: nodeData,
                };

                setNodes((nds) => nds.concat(newNode));
                setcurrentComponent(newNode);
              })
              .catch((err) => {
                toast(err.message);
              });
          }
        })
        .catch((err) => {
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setNodes, screenToFlowPosition, botId, setIsBullseye, isBullseye],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!component) {
        return;
      }

      makeNewComponent(component, event.clientX, event.clientY);
    },
    [component, makeNewComponent],
  );

  const addSelectedComponent = (component: ComponentType) => {
    makeNewComponent(component);
  };

  useEffect(() => {
    api
      .get(`flow/${botId}/`)
      .then((res) => {
        if (res.data.length > 0) {
          setIsBullseye(false);
        }
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [botId]);

  return (
    <>
      {loading ?
        <svg
          className="m-auto size-10 animate-spin text-cream-900"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      : <>
          <div className="h-full w-full">
            <div className="relative h-full w-full bg-patina-900">
              <div
                onClick={() => setIsPanelOpen(true)}
                className="group btn absolute right-0 z-1 mt-5 mr-5 flex h-10 w-12 items-center justify-center rounded-xl border-2 text-white btn-outline hover:border-accent"
              >
                <svg
                  className="h-6 w-6 group-hover:text-accent"
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
                    strokeWidth="5"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </div>

              <div
                className={`absolute right-0 z-1 flex h-full w-67 bg-patina-300 transition-transform duration-400 ${
                  isPanelOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {isPanelOpen && (
                  <ComponentList
                    onClose={() => setIsPanelOpen(false)}
                    addSelectedComponent={addSelectedComponent}
                    contentTypes={contentTypes}
                    setContentTypes={setContentTypes}
                  />
                )}
              </div>

              <div
                className="h-full w-full rounded-lg border border-gray-700"
                ref={reactFlowWrapper}
              >
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodeChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  fitView
                  nodeTypes={nodeTypes}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                >
                  <Background />
                  <MiniMap pannable={true} zoomable={true} />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          </div>
          {currentComponent && (
            <div className="absolute z-50 h-screen w-screen content-center backdrop-blur-xs">
              <ComponentDetail
                botId={botId}
                node={currentComponent}
                setNode={setcurrentComponent}
                nodes={nodes}
                setNodes={setNodes}
              />
            </div>
          )}
        </>
      }
    </>
  );
}

function DnDFlow({ botId }: { botId: number }) {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Flow botId={botId} />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
