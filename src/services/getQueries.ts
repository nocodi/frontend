import { ComponentType, ContentType } from "../types/Component";
import { Node, Edge, EdgeProps, ReactFlowInstance } from "reactflow";

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

type useBotSchemaProps = {
  flowInstance: ReactFlowInstance;
  setNodes: React.Dispatch<
    React.SetStateAction<Node<ComponentType, string | undefined>[]>
  >;
  setEdges: React.Dispatch<React.SetStateAction<Edge<EdgeProps>[]>>;
};

export const useBotSchema = ({
  flowInstance,
  setNodes,
  setEdges,
}: useBotSchemaProps) => {
  const { botId } = useParams<WorkflowParams>();

  useQuery({
    queryKey: ["botSchema"],
    queryFn: () =>
      api.get<ComponentType[]>(`/component/${botId}/schema/`).then((res) => {
        populateFlow({
          setNodes: setNodes,
          setEdges: setEdges,
          flowInstance: flowInstance,
          components: res.data,
        });
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
