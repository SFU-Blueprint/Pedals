export default function VolunteerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-screen flex-col bg-pedals-lightgrey">
      {/* <TimeDisplay className="pl-20 pt-20 sticky top-0" /> */}
      {children}
    </section>
  );
}
