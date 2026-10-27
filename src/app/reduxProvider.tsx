"use client";

import { useAuthListener } from "@/hooks/useAuth";
import { makeStore, type AppStore } from "@/redux/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useRef } from "react";
import { Provider } from "react-redux";

const AuthListener = () => {
  useAuthListener();
  return null;
};

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  return (
    <Provider store={storeRef.current}>
      <AuthListener />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
