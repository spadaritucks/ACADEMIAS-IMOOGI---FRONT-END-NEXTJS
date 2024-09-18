import './globals.css'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../Components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalProvider } from '@/Components/errors/errorContext';
import GlobalModal from "@/Components/errors/GlobalModal";
import { ChakraProvider } from '@chakra-ui/react'



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACADEMIAS IMOOGI",
  description: "Academia da Familia Brasileira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={inter.className}>


        <ChakraProvider>
          <ModalProvider>
            {children}
            <GlobalModal />
          </ModalProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
