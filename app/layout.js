export const metadata = {
  title: "Free Life Insurance Quote | LifeHelpQuote",
  description: "Get a free, no-obligation life insurance quote in 60 seconds. Find affordable coverage to protect your family.",
  keywords: "life insurance, free quote, term life, final expense, family coverage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
