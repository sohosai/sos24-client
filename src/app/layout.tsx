import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { useAuthState } from "@/lib/firebase";
import SigninPage from "@/components/auth/signin/page";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
                                     children
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
    <body>
    <AuthProvider>
      {children}
    </AuthProvider>
    </body>
    </html>
  );
}
