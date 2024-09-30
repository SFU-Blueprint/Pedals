export default function VolunteerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-screen flex-col bg-pedals-lightgrey">
      {children}
    </section>
  );
}
