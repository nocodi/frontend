import React, { useContext, useState } from "react";
import { createContext, ReactNode } from "react";

type BtnCounter = [number, React.Dispatch<React.SetStateAction<number>>];

const BtnCounterCtx = createContext<BtnCounter>([0, () => {}]);

export const BtnCounterProvider = ({ children }: { children: ReactNode }) => {
  const [BtnCount, setBtnCount] = useState<number>(0);

  return (
    <BtnCounterCtx.Provider value={[BtnCount, setBtnCount]}>
      {children}
    </BtnCounterCtx.Provider>
  );
};

export const useBtnCounter = () => {
  return useContext(BtnCounterCtx);
};
