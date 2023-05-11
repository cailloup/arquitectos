"use client"
import styles from './page.module.css';
import { Map } from '@/apis/GoogleMaps';
import { useState } from 'react';


export default function Home() {

  const [markerPosition, setMarkerPosition] = useState({
    position: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    address: 'Villa Gesell, Provincia de Buenos Aires',
  });

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
      <h1>Algun dia pondre un mapa para que todos puedan verlo</h1>
      <p>Latitud: {markerPosition.position.lat || '-'}</p>
      <p>Longitud: {markerPosition.position.lng || '-'}</p>
      <p>Direccion: {markerPosition.address || '-'}</p>
      <Map
        apiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY"
        defaultCenter={markerPosition.position}
        mapStyles={mapStyle}
        options={mapOptions}
        onMarkerChange={handleMarkerChange}
        limitArea={true}
        radio={10} //10km teoricamente xd
      />
    </main>
  );
}
