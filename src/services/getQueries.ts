import { ComponentType, ContentType } from "../types/Component";
import { Edge, Node, useReactFlow } from "reactflow";

import { BotData } from "../types/BotData";
import React from "react";
import { WorkflowParams } from "../pages/Workflow";
import api from "./api";
import { formValuesType } from "../types/ComponentDetailForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { determineType } from "../utils/freqFuncs";

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

export const useBotSchema = () => {
  const { botId } = useParams<WorkflowParams>();

  const { data: components } = useQuery({
    queryKey: ["botSchema"],
    queryFn: () =>
      api
        .get<ComponentType[]>(`/component/${botId}/schema/`)
        .then((res) => res.data),
  });

  return { components };
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
