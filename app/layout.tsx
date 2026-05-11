import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zafaran — Premium Food Ordering',
  description: 'Experience premium dining delivered to your door. Handcrafted flavors with the finest ingredients.',
  keywords: 'food ordering, premium restaurant, delivery, online food',
  openGraph: {
    title: 'Zafaran — Premium Food Ordering',
    description: 'Experience premium dining delivered to your door.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
