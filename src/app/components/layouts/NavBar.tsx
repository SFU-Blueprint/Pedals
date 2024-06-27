"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar({
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  const pathname = usePathname();
  return (
    <nav className={`${props.className} flex justify-between gap-10`}>
      <Link
        className={`${pathname === "/checkin" ? "active" : ""}`}
        href="/checkin"
      >
        CHECK IN
      </Link>
      <Link
        className={`${pathname === "/register" ? "active" : ""}`}
        href="/register"
      >
        REGISTER
      </Link>
      <Link
        className={`${pathname === "/manage" ? "active" : ""}`}
        href="/manage"
      >
        MANAGE
      </Link>
    </nav>
  );
}
