import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayout from "@/components/layout/RootLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Asset Map Manager",
  description: "ระบบจัดการทรัพย์สินแบบครบวงจร",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <RootLayout>{children}</RootLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
