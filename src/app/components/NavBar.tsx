"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavBarProps extends React.ComponentPropsWithoutRef<"nav"> {
  links: { href: string; label: string; highlight?: string }[];
  customLinkStyles?: string;
  customHighlightStyles?: string;
}

export default function NavBar({
  links,
  customLinkStyles,
  customHighlightStyles,
  ...props
}: NavBarProps) {
  const path = usePathname();
  return (
    <nav className={`${props.className} flex justify-start gap-10`}>
      {links.map(({ href, label, highlight }) => (
        <Link
          key={href}
          className={`${customLinkStyles} uppercase ${path.includes(highlight ?? href) ? customHighlightStyles ?? "font-bold" : ""}`}
          href={href}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
