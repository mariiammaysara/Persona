import "./globals.css";

export const metadata = {
  title: "Persona",
  description: "Character AI Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
