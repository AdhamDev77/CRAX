import Navbar from "../_components/Navbar";


export default async function LocaleLayout({
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