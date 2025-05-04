import './globals.scss';
import { Providers } from '@/app/providers';
import "./globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Weather App</title>
        <meta name="description" content="Weather application showing forecasts for selected cities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}