import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

//
// THIS IS THE CORRECT PATH.
//
import { AuthProvider } from "./lib/auth-context";

export const metadata: Metadata = {
  title: "Coopa - The Cooperative Advantage",
  description: "Bulk buying coordination platform for Nigerian cooperatives.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Coopa",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="" suppressHydrationWarning={true}> 
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}