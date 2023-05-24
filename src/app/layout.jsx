import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mapa Virtual Arquitectura Patrimonial',
  description: 'lorem',
}

export default function RootLayout({ children }) {

   return (
    <html lang="es">
      <body className={inter.className}>
        <NavBar>
          {children}
        </NavBar>
      </body>
    </html>
  ) 
}

