// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar'; // Import the Navbar component

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agro Assignment',
  description: 'Fresh Vegetables & Fruits Online Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Include the Navbar here sravan kumar  */}
        <main>{children}</main> {/* Your page content */}
      </body>
    </html>
  );
}