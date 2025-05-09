import { ComponentType, ContentType } from "../types/Component";
import { Edge, Node, useReactFlow } from "reactflow";

import { BotData } from "../types/BotData";
import React from "react";
import { WorkflowParams } from "../pages/Workflow";
import api from "./api";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formValuesType } from "../types/ComponentDetailForm";

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

export const useBots = () => {
  const {
    data: bots,
    isFetching,
    refetch,
  } = useQuery<BotData[]>({
    queryKey: ["bots"],
    queryFn: () => api.get<BotData[]>(`bot/my-bots/`).then((res) => res.data),
  });

  return { bots, isFetching, refetch };
};
