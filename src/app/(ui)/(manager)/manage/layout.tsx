import TimeDisplay from "@/components/layouts/TimeDisplay";

export default function ManagerLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col bg-pedals-lightgrey">
      {children}
    </section>
  );
}
