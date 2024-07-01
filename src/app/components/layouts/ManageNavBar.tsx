"use client";

import Link from "next/link";

export default function ManageNavBar({
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav className={`${props.className} flex justify-between gap-10`}>
      <Link href="/checkin">CHANGE ACCESS CODE</Link>
      <Link href="/register">EXPORT</Link>
    </nav>
  );
}
