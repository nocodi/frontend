import { useCallback, useRef, useState, useEffect } from "react";

import Component from "./Component";
import { ContentType, ComponentType } from "../types/Component";
import ContentTypesList from "./ContentTypesList";

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
} from "reactflow";

import "reactflow/dist/style.css";

import { DnDProvider, useDnD } from "../components/DnDContext";
import api from "../services/api";
import ComponentDetail from "./ComponentDetail";
import getComponents from "../services/getComponents";
import { toast } from "react-toastify";

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { customNode: Component };

function Flow({ botId }: { botId: number }) {
  const [unattendedComponent, setUnattendedComponent] =
    useState<ComponentType>();
  const [loading, setLoading] = useState(true);
  // Component Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFlowAvailable, setIsFlowAvailable] = useState(false); // checks if there are any components available, if not, means we should make a flow on first component creation

  const reactFlowWrapper = useRef(null);
  const flowInstance = useReactFlow();
  // const initialNodes = [
  //   {
  //     id: "1",
  //     position: flowInstance.screenToFlowPosition({
  //       x: 50,
  //       y: 50,
  //     }),
  //     type: "customNode",
  //     selected: false,
  //     data: {
  //       id: 1,
  //       next_component: null,
  //       name: "hi",
  //       content_type: 10,
  //       object_id: null,
  //     },
  //   },
  //   {
  //     id: "2",
  //     position: flowInstance.screenToFlowPosition({
  //       x: 150,
  //       y: 150,
  //     }),
  //     type: "customNode",
  //     selected: false,
  //     data: {
  //       id: 2,
  //       next_component: null,
  //       name: "bye",
  //       content_type: 12,
  //       object_id: null,
  //     },
  //   },
  // ];
  const [component] = useDnD();

  // Edges and Nodes
  const [nodes, setNodes, onNodeChange] = useNodesState<ComponentType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) => {
      const position = flowInstance.screenToFlowPosition({
        x: x ?? window.innerWidth / 2,
        y: y ?? window.innerHeight / 2,
      });
      setLoading(true);

      api
        .post(`/flow/${botId}/component/`, {
          content_type: content.id,
          name: content.name,
          position_x: position.x,
          position_y: position.y,
        })
        .then((res) => {
          if (!isFlowAvailable) {
            api
              .post(`flow/${botId}/`, { start: res.data.id })
              .then((res) => {
                setIsFlowAvailable(true);
                const nodeData: ComponentType = {
                  object_id: undefined,
                  next_component: undefined,
                  name: "Salam",
                  content_type: 0,
                };
                const newNode: ComponentType = {
                  id: `${res.data.start_component.id}`,
                  type: "customNode",
                  position: position,
                  selected: false,
                  data: nodeData,
                };

                setNodes((nds) => nds.concat(newNode));
                setUnattendedComponent(newNode);
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
    [flowInstance, botId, isFlowAvailable, setNodes],
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

  const addSelectedComponent = (component: ContentType) => {
    makeNewComponent(component);
  };

  useEffect(() => {
    if (contentTypes.length === 0) {
      getComponents()
        .then((data) => {
          setContentTypes(data);
          //console.log(data);
        })
        .catch((err) => {
          toast(err.message);
        });
    }
    api
      .get(`flow/${botId}/`)
      .then((res) => {
        if (res.data.length > 0) {
          setIsFlowAvailable(true);
        }
      })
      .catch((err) => {
        toast(err.message);
      })
      .finally(() => {});

    api
      .get(`flow/${botId}/component`)
      .then((res) => {
        setNodes([]);
        setEdges([]);
        const components: ComponentType[] = res.data;
        if (res.data.length > 0) {
          components.forEach((element: ComponentType) => {
            setNodes((nds) =>
              nds.concat({
                id: element.id.toString(),
                position: flowInstance.screenToFlowPosition({
                  x: element.position_x,
                  y: element.position_y,
                }),
                type: "customNode",
                selected: false,
                data: element,
              }),
            );

            if (element.next_component != null) {
              const next_component: number = element.next_component;
              setEdges((edg) =>
                edg.concat({
                  id: `e${element.id}-${element.next_component}`,
                  source: element.id.toString(),
                  target: next_component.toString(),
                }),
              );
            }
          });
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
                  <ContentTypesList
                    onClose={() => setIsPanelOpen(false)}
                    addSelectedComponent={addSelectedComponent}
                    contentTypes={contentTypes}
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
          {unattendedComponent && (
            <div className="absolute z-50 h-screen w-screen content-center backdrop-blur-xs">
              <ComponentDetail
                botId={botId}
                node={unattendedComponent}
                setNode={setUnattendedComponent}
                nodes={nodes}
                setNodes={setNodes}
                contentTypes={contentTypes}
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
