import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "雙峰祭オンラインシステム",
  description: "",
  icons: [
    {
      rel: "icon",
      url: "/favicon.png",
      sizes: "any",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Toaster />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
