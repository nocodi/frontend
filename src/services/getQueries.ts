import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { ComponentType, ContentType } from "../types/Component";
import { useParams } from "react-router-dom";
import { WorkflowParams } from "../pages/Workflow";
import { formValuesType } from "../components/ComponentDetail";
import { Edge, Node, useReactFlow } from "reactflow";
import React from "react";

export const useContentTypes = () => {
  const { botId } = useParams<WorkflowParams>();

  const { data: contentTypes, isFetching: isFetchingContents } = useQuery<
    ContentType[]
  >({
    queryKey: ["contentTypes"],
    queryFn: () =>
      api
        .get<ContentType[]>(`/component/${botId}/content-type/`)
        .then((res) => res.data),
  });

  return { contentTypes, isFetchingContents };
};

export const useComponentDetails = (pathOfComponent: string, id: number) => {
  const { data: details, isFetching } = useQuery<formValuesType>({
    queryKey: ["componentDetails"],
    queryFn: () =>
      api.get<formValuesType>(`${pathOfComponent}${id}`).then((res) => {
        const {
          id,
          previous_component,
          component_name,
          component_type,
          component_content_type,
          position_x,
          position_y,
          bot,
          object_id,
          content_type,
          ...rest
        } = res.data;
        return rest;
      }),
  });

  return { details, isFetching };
};

export const useBotSchema = (
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >,
  setEdges: React.Dispatch<React.SetStateAction<Edge<Edge>[]>>,
) => {
  const { botId } = useParams<WorkflowParams>();
  const flowInstance = useReactFlow();

  const { isFetching: isFetchingData } = useQuery({
    queryKey: ["botSchema"],
    queryFn: () =>
      api.get<ComponentType[]>(`/component/${botId}/schema/`).then((res) => {
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
        return true;
      }),
  });

  return { isFetchingData };
};
