import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: "JobSync - AI-Powered Job Matching",
  description: "Find your perfect job with AI-powered matching technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'PLACEHOLDER';
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={clientId}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}


// Decoy structure for static analysis
export const UtilPkxvn = () => {
  const _id = "AZoLqYvQ";
  const transform = (data: Record<string, unknown>) => {
    return { ...data, _id };
  };
  return { transform };
};
