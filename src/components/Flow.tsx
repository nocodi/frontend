import { useCallback, useRef, useState, useEffect } from "react";

import Component from "./Component";
import CustomEdge from "./EdgeComponent";
import { ContentType, ComponentType } from "../types/Component";

import ReactFlow, {
  useReactFlow,
  Edge,
  Connection,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  Node,
  NodeDragHandler,
  DefaultEdgeOptions,
} from "reactflow";

import "reactflow/dist/style.css";

import { useLoading } from "../pages/Workflow";
import { useDnD } from "../components/DnDContext";
import { useUnattended } from "./UnattendedComponentContext";

import api from "../services/api";
import getContentTypes from "../services/getContents";

import ContentTypesList from "./ContentTypesList";
import ComponentDetail from "./ComponentDetail";

import { toast } from "react-toastify";

const nodeTypes = { customNode: Component };
const edgeTypes = { customEdge: CustomEdge };

export default function Flow({ botId }: { botId: number }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFlowAvailable, setIsFlowAvailable] = useState(false); // checks if there are any components available, if not, means we should make a flow on first component creation

  const [draggingNodeXY, setDraggingNodeXY] = useState<{
    x: number;
    y: number;
  }>({ x: -1, y: -1 });

  const reactFlowWrapper = useRef(null);
  const flowInstance = useReactFlow();
  const [content] = useDnD();
  const [unattendedComponent, setUnattendedComponent] = useUnattended();
  const setLoading = useLoading();

  const [nodes, setNodes, onNodeChange] = useNodesState<ComponentType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);

  const [isFirstLoad, _setIsFirstLoad] = useState(true);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setLoading(true);
      if (connection.target) {
        const nextComponentId: number = parseInt(connection.target);
        api
          .patch(`flow/${botId}/component/${connection.source}`, {
            next_component: nextComponentId,
          })
          .then(() => {
            if (connection.source && connection.target) {
              const newEdge: Edge<DefaultEdgeOptions> = {
                id: `e${connection.source}-${connection.target}`,
                source: connection.source,
                target: connection.target,
                type: "customEdge",
              };
              const exists = edges.some((edge) => edge.id === newEdge.id);
              if (!exists) {
                setEdges((eds) => eds.concat(newEdge));
              }
            }
          })
          .catch((err) => {
            toast(err.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [setEdges, botId],
  );

  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) => {
      setLoading(true);

      const position = flowInstance.screenToFlowPosition({
        x: x ?? window.innerWidth / 2,
        y: y ?? window.innerHeight / 2,
      });
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
              .then(() => {
                setIsFlowAvailable(true);
              })
              .catch((err) => {
                toast(err.message);
              });
          }

          const componentData: ComponentType = {
            id: res.data.id,
            object_id: null,
            next_component: null,
            name: res.data.name,
            content_type: res.data.content_type,
            position_x: position.x,
            position_y: position.y,
          };
          const newNode: Node<ComponentType> = {
            id: `${res.data.id}`,
            type: "customNode",
            position: position,
            selected: false,
            data: componentData,
          };
          setNodes((nds) => nds.concat(newNode));
          setUnattendedComponent(newNode.data);
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

      if (!content) {
        return;
      }

      makeNewComponent(content, event.clientX, event.clientY);
    },
    [content, makeNewComponent],
  );

  const addSelectedComponent = (content: ContentType) => {
    makeNewComponent(content);
  };

  const nodeDragEnter: NodeDragHandler = (
    _event: React.MouseEvent,
    node: Node,
  ) => {
    setDraggingNodeXY({ x: node.position.x, y: node.position.y });
  };
  const nodeDragExit: NodeDragHandler = (
    _event: React.MouseEvent,
    node: Node,
  ) => {
    if (
      draggingNodeXY.x !== node.position.x &&
      draggingNodeXY.y !== node.position.y
    ) {
      setLoading(true);
      api
        .patch(`flow/${botId}/component/${node.id}/`, {
          position_x: node.position.x,
          position_y: node.position.y,
        })
        .then(() => {})
        .catch((err) => {
          setNodes(() =>
            nodes.map((item) =>
              item.id === node.id ?
                {
                  ...item,
                  position: { x: draggingNodeXY.x, y: draggingNodeXY.y },
                }
              : item,
            ),
          );
          toast(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    if (contentTypes.length === 0) {
      getContentTypes()
        .then((data) => {
          setContentTypes(data);
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
      });

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
                  type: "customEdge",
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
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView={isFirstLoad}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStart={nodeDragEnter}
              onNodeDragStop={nodeDragExit}
            >
              <Background />
              <MiniMap pannable={true} zoomable={true} />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
      {unattendedComponent && (
        <div className="absolute z-50 h-screen w-screen content-center p-4 backdrop-blur-xs">
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
  );
}
