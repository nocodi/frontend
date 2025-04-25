import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import { ContentType } from "../types/Component";

type DnDContextType = [
  ContentType | null,
  Dispatch<SetStateAction<ContentType | null>>,
];

const DnDContext = createContext<DnDContextType>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [component, setComponent] = useState<ContentType | null>(null);

  return (
    <DnDContext.Provider value={[component, setComponent]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
