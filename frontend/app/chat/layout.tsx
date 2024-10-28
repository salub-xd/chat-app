import type { Metadata } from "next";


export const metadata: Metadata = {
  title: 'Kisaner - Market - Chat',
  description: 'Explore various categories and latest posts on Kisaner Market.',
};

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
