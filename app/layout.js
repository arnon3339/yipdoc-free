import { AuthProvider } from "./Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import TopBar from "@/components/TopBar";
import WraptableProvider from "./TableProvider";
import Loading from "./loading";
import { Suspense } from "react";

const inter = Inter({ 
  subsets: ["latin"] ,
  variable: '--font-inter'
});

export const metadata = {
  title: "Create Next",
  icons: [{ rel: 'icon', url: "/brand-nextjs.svg"}]
};

export default async function RootLayout({ children }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <AuthProvider>
            <TopBar>
            <WraptableProvider>
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </WraptableProvider>
            </TopBar>
            </AuthProvider>
          </body>
        </html>
      );
}
