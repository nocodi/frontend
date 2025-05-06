import { createContext, ReactNode, useState, useContext } from "react";
import { ContentType } from "../types/Component";

type ContentTypesContextType = {
  contentTypes: ContentType[] | undefined;
  setContentTypes: React.Dispatch<
    React.SetStateAction<ContentType[] | undefined>
  >;
  getPathOfContent: (id: number) => string | undefined;
};

const ContentTypesContext = createContext<ContentTypesContextType>({
  contentTypes: undefined,
  setContentTypes: () => {},
  getPathOfContent: () => undefined,
});

export const ContentTypesProvider = ({ children }: { children: ReactNode }) => {
  const [contentTypes, setContentTypes] = useState<ContentType[] | undefined>();

  const getPathOfContent = (id: number): string | undefined => {
    const content = contentTypes?.find((content) => content.id === id);
    return content?.path?.split(".ir")[1];
  };

  return (
    <ContentTypesContext.Provider
      value={{ contentTypes, setContentTypes, getPathOfContent }}
    >
      {children}
    </ContentTypesContext.Provider>
  );
};

export const useContentTypes = () => {
  return useContext(ContentTypesContext);
};
