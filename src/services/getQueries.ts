import { ComponentType, ContentType } from "../types/Component";
import { ReactFlowInstance } from "reactflow";

import { BotData } from "../types/BotData";
import { WorkflowParams } from "../pages/Workflow";
import api from "./api";
import { formValuesType } from "../types/ComponentDetailForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { populateFlow } from "../components/Flow/populateFlow";

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

export const useComponentDetails = (
  pathOfComponent: string,
  id: number | string,
) => {
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
          reply_markup_supported,
          ...rest
        } = res.data;
        return rest;
      }),
  });

  return { details, isFetching };
};

export const useBotSchema = (flowInstance: ReactFlowInstance) => {
  const { botId } = useParams<WorkflowParams>();

  useQuery({
    queryKey: ["botSchema"],
    queryFn: () =>
      api.get<ComponentType[]>(`/component/${botId}/schema/`).then((res) => {
        populateFlow(flowInstance, res.data);
        return true;
      }),
  });

  return false;
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
