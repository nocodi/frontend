import { createContext, ReactNode, useState, useContext } from "react";
import { ContentType } from "../types/Component";

type ContentTypesContextType = [
  ContentType[] | undefined,
  React.Dispatch<React.SetStateAction<ContentType[] | undefined>>,
];

const ContentTypesContext = createContext<ContentTypesContextType>([
  undefined,
  () => {},
]);

export const ContentTypesProvider = ({ children }: { children: ReactNode }) => {
  const [contentTypes, setContentTypes] = useState<ContentType[] | undefined>();

  return (
    <ContentTypesContext.Provider value={[contentTypes, setContentTypes]}>
      {children}
    </ContentTypesContext.Provider>
  );
};

export const useContentTypes = () => {
  return useContext(ContentTypesContext);
};
