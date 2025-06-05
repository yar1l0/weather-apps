import './globals.scss';
import { Providers } from '@/app/providers';
import RegisterSW from '@/components/RegisterSW';

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Providers>
          {children}
          <RegisterSW />
        </Providers>
      </body>
    </html>
  );
}