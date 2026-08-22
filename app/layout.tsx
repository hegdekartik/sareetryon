import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SareeStudio — Virtual Saree Try-On AI",
  description:
    "Mobile-friendly, clean, and minimal Virtual Saree Try-On web application powered by AI. Try authentic sarees onto reference person images with high identity preservation.",
  keywords: ["virtual try-on", "saree try on", "AI saree", "IDM-VTON", "fashion AI", "ethnic wear"],
  authors: [{ name: "SareeStudio AI" }],
  openGraph: {
    title: "SareeStudio — Virtual Saree Try-On AI",
    description: "Instant high-fidelity virtual saree try-on with consistent reference persona preservation.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-purple-600 selection:text-white bg-background text-gray-100 min-h-dvh flex flex-col">
        {children}
      </body>
    </html>
  );
}
