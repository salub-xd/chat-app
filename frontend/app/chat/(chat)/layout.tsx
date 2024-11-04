'use client';

import { AppDispatch } from "@/redux/store";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, selectUser } from "@/redux/reducers/auth";

export default function ChatBoxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("User before dispatch:", user);
    if (!user.id) {
      dispatch(fetchUser());
      console.log("User after dispatch:", user);
    }

  }, [dispatch, user]);

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {children}
    </div>
  );
}
