import { createContext, useContext } from "react";
import { ContentType } from "../types/Component";
import { ReactNode } from "react";
import { useState } from "react";

type ContentTypeContextType = [
  ContentType[],
  React.Dispatch<React.SetStateAction<ContentType[]>>,
];

const contentTypeContext = createContext<ContentTypeContextType>([
  [],
  () => {},
]);
export const ContentTypesProvider = ({ children }: { children: ReactNode }) => {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);

  return (
    <contentTypeContext.Provider value={[contentTypes, setContentTypes]}>
      {children}
    </contentTypeContext.Provider>
  );
};
export const useContentTypes = () => {
  return useContext(contentTypeContext);
};
