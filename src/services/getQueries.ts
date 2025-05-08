import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { ContentType } from "../types/Component";
import { useParams } from "react-router-dom";
import { WorkflowParams } from "../pages/Workflow";

export const useContentTypes = () => {
  const { botId } = useParams<WorkflowParams>();

  const { data: contentTypes, isLoading } = useQuery<ContentType[]>({
    queryKey: ["contentTypes", botId],
    queryFn: () =>
      api
        .get<ContentType[]>(`/component/${botId}/content-type/`)
        .then((res) => res.data),
    retry: 2,
    staleTime: Infinity, // Keep data fresh indefinitely
  });

  return { contentTypes, isLoading };
};
