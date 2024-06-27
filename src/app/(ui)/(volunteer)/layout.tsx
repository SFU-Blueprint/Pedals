import TimeDisplay from "@/components/layouts/TimeDisplay";

export default function VolunteerLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col bg-pedals-lightgrey">
      <TimeDisplay className="pl-20 pt-20" />
      {children}
    </section>
  );
}
