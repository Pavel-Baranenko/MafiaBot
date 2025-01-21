import type { Metadata } from "next";
import React from "react";
import StoreWrapper from "@/store/provider";
import Top from "@/components/Top";
import "../scss/index.scss";



export const metadata: Metadata = {
  title: "Mafia",
  description: "Мафия в Барнауле",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body >
        <div className="wrapper">
          <StoreWrapper>
            <Top />
            {children}
          </StoreWrapper>
        </div>
      </body>
    </html>
  );
}
