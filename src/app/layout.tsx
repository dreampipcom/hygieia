import type { Metadata } from "next";
import "@dreampipcom/oneiros/styles";

export const metadata: Metadata = {
  title: process.env.PATTERNS_TITLE,
  description: process.env.PATTERNS_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>{children}</body>
    </html>
  );
}
