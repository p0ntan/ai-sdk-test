import Image from "next/image";
import ChatStream from "./ChatStream";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-1 align-center gap-4 w-full row-start-2 items-center sm:items-start h-full">
        <ChatStream />
      </main>
    </div>
  );
}
