// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar'; // Import the Navbar component
import { CartProvider } from '../contexts/CartContext'; // Adjust path if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Agro Assignment',
  description: 'Fresh Vegetables & Fruits Online Store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar /> {/* Include the Navbar here */}
          <main>{children}</main> {/* Your page content */}
        </CartProvider>
      </body>
    </html>
  );
}