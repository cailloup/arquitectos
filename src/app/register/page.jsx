"use client";
import { libraries } from '@/apis/googleMapsConfig';
import '@/styles/register.css';
import styles from './register.module.css';
import {LoadScript } from '@react-google-maps/api';
import { useState, useRef } from 'react';
import { Map, InputMap } from '@/apis/GoogleMaps';

export default function Register() {
  const [markerState, setMarkerState] = useState({
    position: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    address: 'Villa Gesell, Provincia de Buenos Aires',
  });
  const inputRef = useRef(null);
  const [geocoder, setGeocoder] = useState(null);


  const handleMarkerChange = (newMarker) => {
    setMarkerState(newMarker);
  };
  
  return (
    <LoadScript googleMapsApiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY" libraries={libraries} onLoad={()=> setGeocoder(new window.google.maps.Geocoder()) }>
      <main className={styles.main}>
        
        <section className={styles.mapSection}>
        <Map defaultCenter={markerState.position}
          mapStyles={mapStyle}
          options={mapOptions}
          onMarkerChange={handleMarkerChange}
          limitArea={true}
          radio={10} 
          geocoder={geocoder}
          markerState={markerState}
          inputRef={inputRef}
        />
        </section>

        <section className={styles.formSection}>
        <label className={styles.label} for="text-input">Direccion</label>
          <InputMap 
            defaultCenter={markerState.position}
            limitArea={true}
            radio={10} 
            onMarkerChange={handleMarkerChange}
          >
          <input
                className={styles.input}
                ref={inputRef}
                type="text"
                placeholder="Ingrese una dirección y presione Enter para actualizar el marcador"
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    handleInputChange(event);
                  }
                }}
              />
          </InputMap>
        </section>

      </main>
    </LoadScript>
  );
}

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
height: '100%', 

}