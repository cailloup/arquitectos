"use client"
import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Map(IA)',
  description: 'lorem',
}

export default function RootLayout({ children }) {
  
   return (
    <html lang="es">
      <body className={inter.className}>
        <NavBar/>
          <GoogleMapsLoader>
            {children}
          </GoogleMapsLoader>
        </body>
    </html>
  ) 
}

const GoogleMapsContext = createContext();
export const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript(GoogleMapsConfig.scriptInit);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && !loadError) {
      setApiLoaded(true);
    }
  }, [isLoaded, loadError]);

  return (
    <GoogleMapsContext.Provider value={isLoaded}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);