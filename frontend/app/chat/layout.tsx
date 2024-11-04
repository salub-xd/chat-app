'use client';

import store from "@/redux/store";
import { Provider } from "react-redux";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <div>
        {children}
      </div>
    </Provider>
  );
}
