import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <QueryProvider>
          <AuthProvider>
            <NextUIProvider>{children}</NextUIProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
