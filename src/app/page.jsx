"use client"
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { Map } from '@/apis/GoogleMaps';
import { useState } from 'react';


export default function Home() {
  const [markerPosition, setMarkerPosition] = useState({
    position: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    address: '',
  });
  const handleMarkerChange = (position) => {
    setMarkerPosition(position);
    console.log(markerPosition);
  };

  return (
    <main className={styles.main}>
      <h1>Algun dia pondre un mapa para que todos puedan verlo</h1>
      <p>Latitud: {markerPosition.position.lat || '-'}</p>
      <p>Longitud: {markerPosition.position.lng || '-'}</p>
      <p>Direccion: {markerPosition.address || '-'}</p>
      <Map
        apiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY"
        defaultCenter={markerPosition.position}
        mapStyles={{ width: '100%', height: '800px', border: 'solid 2px black' }}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          mapTypeId: 'roadmap',
          zoom: 14,
          minZoom: 16,
        }}
        onMarkerChange={handleMarkerChange}
      />
    </main>
  );
}
