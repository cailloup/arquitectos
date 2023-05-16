import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import { GoogleMapsLoader } from '@/apis/googleMapsConfig';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Map(IA)',
  description: 'lorem',
}

export default function RootLayout({ children }) {
  
   return (
    <html lang="es">
      <body className={inter.className}>
          <GoogleMapsLoader>
            {children}
          </GoogleMapsLoader>
        </body>
    </html>
  ) 
}

