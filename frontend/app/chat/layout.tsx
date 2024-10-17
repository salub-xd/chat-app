import type { Metadata } from "next";
import ChatContact from "@/components/app/Chat-Contact";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
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
        <div className={'flex flex-col pt-2 overflow-hidden'}>
            <div className="flex h-screen overflow-hidden">
                <div className="flex w-full">
                    <ResizablePanelGroup
                        direction="horizontal"
                        className=" rounded-lg border md:min-w-[1450px]"
                        
                    >
                        <ResizablePanel defaultSize={25} minSize={20}>
                            <div className="flex h-full">
                                <ChatContact />
                            </div>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={75} minSize={40}>
                            <div className="flex  h-full items-center justify-center my-6">
                                {children}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}