import {
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import ComponentType from "../types/Component";

type DnDContextType = [
  ComponentType | null,
  Dispatch<SetStateAction<ComponentType | null>>,
];

const DnDContext = createContext<DnDContextType>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [component, setComponent] = useState<ComponentType | null>(null);

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
