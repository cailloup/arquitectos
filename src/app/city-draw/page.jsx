"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polygon,useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY,LIBRARIES,MAP_OPTIONS_DEFAULT,GESELL } from '@/apis/googleMapsConfig';
import styles from '../page.module.css'
import { roberto } from './polly';
const city = 'Villa gesell'; // Nombre de la ciudad que deseas dibujar en el mapa



function Map() {
  const [bounds, setBounds] = useState(null);

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if(!isLoaded) return
    // Utilizamos la API de geocodificación inversa de Google Maps para obtener los límites de la ciudad
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: city }, (results, status) => {
      if (status === 'OK') {
        const cityBounds = results[0].geometry.bounds;
        setBounds({
          north: cityBounds.getNorthEast().lat(),
          south: cityBounds.getSouthWest().lat(),
          east: cityBounds.getNorthEast().lng(),
          west: cityBounds.getSouthWest().lng(),
        });
      } else {
        console.error('Error al obtener los límites de la ciudad');
      }
    });
  }, [isLoaded]);



  if(!isLoaded) return <main className={styles.main}><h1>y si la luna nos obseva a vos y yo?...</h1></main>
  
  return (
    <main>
      <GoogleMap
        options={{...MAP_OPTIONS_DEFAULT,center: GESELL}}
        zoom={10}
        mapContainerStyle={{width: "100%", height: "calc(100vh - 72px)", top:"72px" ,position:"absolute"}}
      >
        {bounds && (
          <Polygon
            path ={roberto}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
            }}
          />
        )}
      </GoogleMap>
      </main>
  );
}

export default Map;