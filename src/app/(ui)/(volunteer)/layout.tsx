import TimeDisplay from "./components/TimeDisplay";

export default function VolunteerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-screen flex-col bg-pedals-lightgrey">
      <TimeDisplay className="pl-20 pt-20" />
      {children}
    </section>
  );
}
