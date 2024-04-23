/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

export interface CurrentUserContextType {
  user: any | null;
  setUser: Function;
}

const UserContext = createContext<CurrentUserContextType | null>(null);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any | null>({ email: "yooseryvathana@gmail.com" });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
  return useContext(UserContext);
};
