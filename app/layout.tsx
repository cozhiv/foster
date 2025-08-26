import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  variable: "--font-azbuki",
  src: '../public/fonts/Azbuki-Regular.woff2',
  weight: '400',
  style: 'normal',
  // [
  //   {
  //    path: '../styles/NotoSansGlagolitic-Regular.ttf',
  //    style: 'normal',
     
  //   },
  //   {
  //     path: '../styles/Azbuki-Regular.woff2',
  //     style: 'normal',
  //     weight: "900"
  //   }
  // ],
  
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roster",
  description: "Shared List and shared budget. Shared organization of a celebration. Create Lists, add Friends to lists, create and delete items and collect them in parallel with your firends.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  className={myFont.className}>
      <body
        className={`${ myFont.variable } ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
