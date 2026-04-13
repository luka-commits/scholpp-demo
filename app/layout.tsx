import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCHOLPP Reisekoordinator — Digitaler Agent",
  description:
    "Digitaler Projektassistent für Reisekoordination bei SCHOLPP Holding GmbH. Erstellt durch Meisterwerk.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
