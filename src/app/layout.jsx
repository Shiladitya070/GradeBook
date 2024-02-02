import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grade Book",
  description: "Easy way to get grades for your classes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <NavBar className="sticky top-0" />
        {children}
      </body>
    </html>
  );
}
