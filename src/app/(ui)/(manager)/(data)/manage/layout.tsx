import NavBar from "@/components/NavBar";

export default function ManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-screen flex-col">
      <NavBar
        className="fixed left-20 top-36 z-30 !gap-2"
        customLinkStyles="px-3 py-2 text-lg bg-white hover:bg-pedals-grey"
        customHighlightStyles="!bg-yellow-400"
        links={[
          { href: "/manage/shift", label: "Shifts" },
          { href: "/manage/people", label: "People" }
        ]}
      />
      {children}
    </section>
  );
}
