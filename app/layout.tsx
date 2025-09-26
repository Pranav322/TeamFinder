import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import NavBar from "./components/Navbar";
import FloatingChat from "./components/FloatingChat";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeamFinder",
  description: "Lets you choose right teammate or project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <NavBar />
          {children}
          <FloatingChat />
        </body>
      </AuthProvider>
    </html>
  );
}
