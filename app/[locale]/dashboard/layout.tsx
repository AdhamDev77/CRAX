export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <main>
      {/* <Navbar /> */}
      {children}
    </main>
  );
}
