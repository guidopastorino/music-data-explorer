import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative w-full flex items-center justify-center py-6 mt-12 text-muted-foreground text-sm gap-2">
      <Image
        src="/icons/favicon-32x32.png"
        alt="Music Data Explorer Logo"
        width={24}
        height={24}
        className="inline-block rounded-lg"
        priority
      />
      <span>
        <strong>Music Data Explorer</strong>. Created by Guido
      </span>
    </footer>
  );
}