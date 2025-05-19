import { ComponentType, ContentType } from "../types/Component";
import { Edge, Node, useReactFlow } from "reactflow";

import { BotData } from "../types/BotData";
import React from "react";
import { WorkflowParams } from "../pages/Workflow";
import api from "./api";
import { formValuesType } from "../types/ComponentDetailForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const useContentTypes = (fetchTime: number = Infinity) => {
  const { botId } = useParams<WorkflowParams>();

  const { data: contentTypes } = useQuery<ContentType[]>({
    queryKey: ["contentTypes"],
    queryFn: () =>
      api
        .get<ContentType[]>(`/component/${botId}/content-type/`)
        .then((res) => res.data),
    staleTime: fetchTime,
  });

  return { contentTypes };
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

  useQuery({
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
        } else {
          const defaultTemplate: Node<ComponentType>[] = [
            {
              id: "1",
              position: flowInstance.screenToFlowPosition({
                x: window.innerWidth / 2 - 300,
                y: window.innerHeight / 2 - 100,
              }),
              type: "customNode",
              selected: false,
              data: {
                id: 1,
                component_name: "Start Chat",
                component_type: "TRIGGER",
                component_content_type: 1,
                position_x: window.innerWidth / 2 - 300,
                position_y: window.innerHeight / 2 - 100,
                previous_component: null,
              },
            },
            {
              id: "2",
              position: flowInstance.screenToFlowPosition({
                x: window.innerWidth / 2 - 100,
                y: window.innerHeight / 2 - 100,
              }),
              type: "customNode",
              selected: false,
              data: {
                id: 2,
                component_name: "Welcome Message",
                component_type: "TELEGRAM",
                component_content_type: 2,
                position_x: window.innerWidth / 2 - 100,
                position_y: window.innerHeight / 2 - 100,
                previous_component: 1,
              },
            },
            {
              id: "3",
              position: flowInstance.screenToFlowPosition({
                x: window.innerWidth / 2 + 100,
                y: window.innerHeight / 2 - 100,
              }),
              type: "customNode",
              selected: false,
              data: {
                id: 3,
                component_name: "Check User Input",
                component_type: "CONDITIONAL",
                component_content_type: 3,
                position_x: window.innerWidth / 2 + 100,
                position_y: window.innerHeight / 2 - 100,
                previous_component: 2,
              },
            },
            {
              id: "4",
              position: flowInstance.screenToFlowPosition({
                x: window.innerWidth / 2 + 100,
                y: window.innerHeight / 2 + 100,
              }),
              type: "customNode",
              selected: false,
              data: {
                id: 4,
                component_name: "Process Response",
                component_type: "CODE",
                component_content_type: 4,
                position_x: window.innerWidth / 2 + 100,
                position_y: window.innerHeight / 2 + 100,
                previous_component: 3,
              },
            },
            {
              id: "5",
              position: flowInstance.screenToFlowPosition({
                x: window.innerWidth / 2 + 300,
                y: window.innerHeight / 2 + 100,
              }),
              type: "customNode",
              selected: false,
              data: {
                id: 5,
                component_name: "Send Reply",
                component_type: "TELEGRAM",
                component_content_type: 5,
                position_x: window.innerWidth / 2 + 300,
                position_y: window.innerHeight / 2 + 100,
                previous_component: 4,
              },
            },
          ];

          // Add default nodes
          defaultTemplate.forEach((node) => {
            setNodes((nds) => nds.concat(node));
          });

          // Add default edges
          setEdges((edg) =>
            edg.concat(
              {
                id: "e1-2",
                source: "1",
                target: "2",
                type: "customEdge",
              },
              {
                id: "e2-3",
                source: "2",
                target: "3",
                type: "customEdge",
              },
              {
                id: "e3-4",
                source: "3",
                target: "4",
                type: "customEdge",
              },
              {
                id: "e4-5",
                source: "4",
                target: "5",
                type: "customEdge",
              },
            ),
          );
        }
        return true;
      }),
  });
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
