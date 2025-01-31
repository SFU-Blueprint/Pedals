import NavBar from "@/components/NavBar";


export default function ManagerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar
        className="fixed left-20 top-20 z-30"
        links={[
          { href: "/change-access-code", label: "Change Access Code" },
          { href: "/export", label: "Export" }
        ]}
      />
      {children}
    </>
  );
}
