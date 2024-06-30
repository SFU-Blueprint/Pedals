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
        className={`${pathname === "/checkin" ? "font-bold" : ""}`}
        href="/checkin"
      >
        CHECK IN
      </Link>
      <Link
        className={`${pathname === "/register" ? "font-bold" : ""}`}
        href="/register"
      >
        REGISTER
      </Link>
      <Link
        className={`${pathname === "/manage" || pathname === "/manage-login" ? "font-bold" : ""}`}
        href="/manage-login"
      >
        MANAGE
      </Link>
    </nav>
  );
}
