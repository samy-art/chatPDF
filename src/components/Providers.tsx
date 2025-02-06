// to wrap our entire app in react-query provider
"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type Props = {
  // wraps up our entire application
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
