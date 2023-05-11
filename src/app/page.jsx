"use client"
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import { Map } from '@/apis/GoogleMaps';
import { useState } from 'react';
import Head from 'next/head';


export default function Home() {
  
  const [markerPosition, setMarkerPosition] = useState({
    position: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    address: 'Villa Gesell, Provincia de Buenos Aires',
  });

  const [limitBounds,setLimitBounds] = useState({  
    north: markerPosition.position.lat + 0.1,
    south: markerPosition.position.lat - 0.1,
    east: markerPosition.position.lng + 0.1,
    west: markerPosition.position.lng - 0.1, })

  const handleMarkerChange = (position) => {
    setMarkerPosition(position);
  };

  const mapOptions = {
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        zoomControl: true,
                        mapTypeId: 'roadmap',
                        zoom: 14,
                        restriction: {
                          latLngBounds: limitBounds,
                          strictBounds: false,
                        },
                        styles: [
                          {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                          }]
  }

  const mapStyle = { 
                      width: '100%', 
                      height: '800px', 
                      border: 'solid 2px black',
  }
  
              
  return (
    <main className={styles.main}>
      <Head>
        <script src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY`}></script>
        
    </Head>
      <h1>Algun dia pondre un mapa para que todos puedan verlo</h1>
      <p>Latitud: {markerPosition.position.lat || '-'}</p>
      <p>Longitud: {markerPosition.position.lng || '-'}</p>
      <p>Direccion: {markerPosition.address || '-'}</p>
      <Map
        limitBounds={limitBounds}
        apiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY"
        defaultCenter={markerPosition.position}
        mapStyles={mapStyle}
        options={mapOptions}
        onMarkerChange={handleMarkerChange}
      />
    </main>
  );
}
