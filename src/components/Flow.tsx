import "reactflow/dist/style.css";

import { ComponentType, ContentType } from "../types/Component";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  DefaultEdgeOptions,
  Edge,
  MiniMap,
  Node,
  NodeDragHandler,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { useBotSchema, useContentTypes } from "../services/getQueries";
import { useCallback, useRef, useState } from "react";

import Component from "./Component";
import ComponentDetail from "./ComponentDetail";
import ContentTypesList from "./ContentTypesList";
import CustomEdge from "./EdgeComponent";
import { Plus } from "lucide-react";
import api from "../services/api";
import { getPathOfContent, makeNode } from "../utils/freqFuncs";
import { toast } from "react-toastify";
import { useDnD } from "../components/DnDContext";
import { useLoading } from "../pages/Workflow";
import { useUnattended } from "./UnattendedComponentContext";

const nodeTypes = { customNode: Component };
const edgeTypes = { customEdge: CustomEdge };

export default function Flow() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [draggingNodeXY, setDraggingNodeXY] = useState<{
    x: number;
    y: number;
  }>({ x: -1, y: -1 });

  const reactFlowWrapper = useRef(null);
  const flowInstance = useReactFlow();
  const [content] = useDnD();
  const [unattendedComponent, setUnattendedComponent] = useUnattended();

  const [nodes, setNodes, onNodeChange] = useNodesState<ComponentType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const setLoading = useLoading();
  useBotSchema(setNodes, setEdges);
  const { contentTypes } = useContentTypes(0);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setLoading(true);
      if (connection.target && connection.source) {
        const targetNode: undefined | Node<ComponentType> =
          flowInstance.getNode(connection.target);

        const prevComponentId: number = parseInt(connection.source);
        if (targetNode && contentTypes) {
          const newEdgeId: string = `e${connection.source}-${connection.target}`;
          const exists = flowInstance.getEdge(newEdgeId);
          if (!exists) {
            api
              .patch(
                `${getPathOfContent(targetNode.data.component_content_type, contentTypes)}${connection.target}/`,
                {
                  previous_component: prevComponentId,
                },
              )
              .then(() => {
                if (connection.source && connection.target) {
                  const newEdge: Edge<DefaultEdgeOptions> = {
                    id: newEdgeId,
                    source: connection.source,
                    target: connection.target,
                    type: "customEdge",
                  };

                  const prevEdgeId: string = `e${targetNode.data.previous_component}-${newEdge.target}`;
                  // update previous_component of targetNode

                  setNodes((nds) =>
                    nds.map((item) =>
                      item.id === targetNode.id ?
                        {
                          ...item,
                          data: {
                            ...item.data,
                            previous_component: parseInt(connection.source!),
                          },
                        }
                      : item,
                    ),
                  );
                  // update new edge
                  flowInstance.deleteElements({ edges: [{ id: prevEdgeId }] });
                  flowInstance.addEdges(newEdge);
                }
              })
              .catch((err) => {
                toast(err.message);
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            setLoading(false);
          }
        }
      }
    },

    [setEdges, contentTypes],
  );
  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) => {
      const position = flowInstance.screenToFlowPosition({
        x: x ?? window.innerWidth / 2 + Math.random() * 50 + 1,
        y: y ?? window.innerHeight / 2 + Math.random() * 50 + 1,
      });
      api
        .post(`${content.path.split(".ir")[1]}`, {
          component_content_type: content.id,
          component_name: content.name,
          position_x: position.x,
          position_y: position.y,
          previous_component: null,
        })
        .then((res) => {
          const newNode = makeNode(res.data as ComponentType, position);
          flowInstance.addNodes(newNode);
          setUnattendedComponent(newNode.data);
        })
        .catch((err) => {
          toast(err.message);
        });
    },
    [flowInstance, setNodes],
  );
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!content) return;

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
      draggingNodeXY.y !== node.position.y &&
      contentTypes
    ) {
      setLoading(true);
      api
        .patch(
          `${getPathOfContent(node.data.component_content_type, contentTypes)}${node.id}/`,
          {
            position_x: node.position.x,
            position_y: node.position.y,
          },
        )
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

  return (
    <>
      <div className="h-full w-full text-primary">
        <div className="relative h-full w-full bg-base-300">
          <div
            onClick={() => setIsPanelOpen(true)}
            className="group btn absolute right-0 z-1 mt-5 mr-5 flex h-10 w-12 items-center justify-center rounded-xl border-2 btn-outline btn-primary"
          >
            <Plus strokeWidth={5} />
          </div>

          <div
            className={`absolute right-0 z-1 flex h-full w-67 bg-base-200 text-base-content transition-transform duration-400 ${
              isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {isPanelOpen && (
              <ContentTypesList
                onClose={() => setIsPanelOpen(false)}
                addSelectedComponent={addSelectedComponent}
              />
            )}
          </div>

          <div className="h-full w-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodeChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView={true}
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
        <div className="absolute z-50 flex h-screen w-screen items-center justify-center">
          <ComponentDetail
            node={unattendedComponent}
            onClose={() => setUnattendedComponent(undefined)}
          />
        </div>
      )}
    </>
  );
}
