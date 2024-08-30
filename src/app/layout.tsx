import type { Metadata } from "next";

import { AuthProvider } from "@/lib/auth";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Toaster } from "react-hot-toast";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: {
    template: "%s | 雙峰祭オンラインシステム",
    default: "雙峰祭オンラインシステム",
  },
  description: "",
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
        {process.env.NEXT_PUBLIC_GTMID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTMID} />}
      </body>
    </html>
  );
}
