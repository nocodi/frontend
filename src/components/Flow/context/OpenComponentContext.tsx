import { createContext, ReactNode, useState, useContext } from "react";
import { ComponentType } from "../../../types/Component";

type OpenComponentContextType = [
  ComponentType | undefined,
  React.Dispatch<React.SetStateAction<ComponentType | undefined>>,
];

const OpenComponentContext = createContext<OpenComponentContextType>([
  undefined,
  () => {},
]);

export const OpenComponentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openComponent, setOpenComponent] = useState<
    ComponentType | undefined
  >();

  return (
    <OpenComponentContext.Provider value={[openComponent, setOpenComponent]}>
      {children}
    </OpenComponentContext.Provider>
  );
};

export const useOpenComponent = () => {
  return useContext(OpenComponentContext);
};
