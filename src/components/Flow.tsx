import { useCallback, useRef, useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
import ContentTypesList from "./ContentTypesList";
import ComponentDetail from "./ComponentDetail";
import { toast } from "react-toastify";
import { useContentTypes } from "./ContentTypesContext";

const nodeTypes = { customNode: Component };
const edgeTypes = { customEdge: CustomEdge };

export default function Flow({ botId }: { botId: number }) {
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
  const { contentTypes, setContentTypes, getPathOfContent } = useContentTypes();

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      setLoading(true);
      if (connection.target && connection.source) {
        const targetNode: undefined | Node<ComponentType> =
          flowInstance.getNode(connection.target);
        const prevComponentId: number = parseInt(connection.source);
        if (targetNode && contentTypes) {
          api
            .patch(
              `${getPathOfContent(targetNode.data.component_content_type)}${connection.target}/`,
              {
                previous_component: prevComponentId,
              },
            )
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
                  flowInstance.deleteElements({
                    edges: [
                      {
                        id: `e${targetNode.data.previous_component}-${newEdge.target}`,
                      },
                    ],
                  });

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
      }
    },

    [setEdges, botId, contentTypes],
  );
  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) => {
      const position = flowInstance.screenToFlowPosition({
        x: x ?? window.innerWidth / 2,
        y: y ?? window.innerHeight / 2,
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
          const {
            id,
            previous_component,
            component_name,
            component_type,
            component_content_type,
            position_x,
            position_y,
          } = res.data;
          const compo: number = component_content_type.id;
          const componentData: ComponentType = {
            id,
            previous_component,
            component_name,
            component_content_type: compo,
            component_type,
            position_x,
            position_y,
          };
          const newNode: Node<ComponentType> = {
            id: `${componentData.id}`,
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
      draggingNodeXY.y !== node.position.y &&
      contentTypes
    ) {
      setLoading(true);
      api
        .patch(
          `${getPathOfContent(node.data.component_content_type)}${node.id}/`,
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

  useEffect(() => {
    setLoading(true);

    api
      .get(`/component/${botId}/content-type/`)
      .then((data) => {
        setContentTypes(data.data);
      })
      .catch((err) => {
        toast(err.message);
      });

    api
      .get(`/component/${botId}/schema/`)
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
                data: { ...element },
              }),
            );

            if (element.previous_component) {
              const previous_component: number = element.previous_component;
              setEdges((edg) =>
                edg.concat({
                  id: `e${previous_component}-${element.id}`,
                  source: previous_component.toString(),
                  target: element.id.toString(),
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
            setNode={setUnattendedComponent}
          />
        </div>
      )}
    </>
  );
}
