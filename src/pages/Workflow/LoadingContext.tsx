import { createContext, useContext } from "react";

export type LoadingContextType = React.Dispatch<React.SetStateAction<boolean>>;
export const LoadingContext = createContext<LoadingContextType>(() => {});
export const useLoading = () => useContext(LoadingContext);
