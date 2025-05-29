import { createContext, ReactNode, useState, useContext } from "react";
import { ComponentType } from "../../types/Component";

type unattendedComponentContextType = [
  ComponentType | undefined,
  React.Dispatch<React.SetStateAction<ComponentType | undefined>>,
];

const UnattendedComponentContext =
  createContext<unattendedComponentContextType>([undefined, () => {}]);

export const UnattendedComponentProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unattendedComponent, setUnattendedComponent] = useState<
    ComponentType | undefined
  >();

  return (
    <UnattendedComponentContext.Provider
      value={[unattendedComponent, setUnattendedComponent]}
    >
      {children}
    </UnattendedComponentContext.Provider>
  );
};

export const useUnattended = () => {
  return useContext(UnattendedComponentContext);
};
