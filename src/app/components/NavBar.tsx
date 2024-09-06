"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavBarProps extends React.ComponentPropsWithoutRef<"nav"> {
  links: { href: string; label: string; highlight?: string }[];
}

export default function NavBar({ links, ...props }: NavBarProps) {
  const path = usePathname();
  return (
    <nav className={`${props.className} flex justify-between gap-10`}>
      {links.map(({ href, label, highlight }) => (
        <Link
          key={href}
          className={`uppercase ${path.includes(highlight || href) ? "font-bold" : ""}`}
          href={href}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
