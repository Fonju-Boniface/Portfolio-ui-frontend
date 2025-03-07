"use client"
import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import Image from "next/image";
import ToggleComponent from "./components/ToggleComponent";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        
        <p
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300
            bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
            dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
            lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-primary "
        >
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div
          className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t
            from-white via-white dark:from-black dark:via-black lg:static lg:size-auto
            lg:bg-none gap-x-1"
        >
          <ThemeColorToggle />
          <ThemeModeToggle />
        </div>
      </div>

      <div
        className="  relative z-[-1] flex place-items-center before:absolute before:h-[300px]
          before:w-full before:-translate-x-1/2 before:rounded-full
          before:bg-gradient-radial before:from-white before:to-transparent
          before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px]
          after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200
          after:via-blue-200 after:blur-2xl after:content-['']
          before:dark:bg-gradient-to-br before:dark:from-transparent
          before:dark:to-primary before:dark:opacity-10 after:dark:from-sky-900
          after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px]
          sm:after:w-[240px] before:lg:h-[360px]"
      >
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <ToggleComponent />
    </main>
  );
}



//  {/* User Display Name and Email */}
//             {/* <p className="font-bold">{user.displayName ?? "User"}</p> */}
//             {/* <p className="text-sm text-gray-600">{user.email}</p> */}