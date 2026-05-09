export const metadata = {
  title: "Vinted Lister — AI Listing Generator",
  description: "Upload a photo, get a full Vinted listing with realistic UK pricing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0A0F" }}>
        {children}
      </body>
    </html>
  );
}
