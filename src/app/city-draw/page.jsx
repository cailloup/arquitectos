"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Polygon,useLoadScript,Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY,LIBRARIES,MAP_OPTIONS_DEFAULT,GESELL,MADARIAGA } from '@/apis/googleMapsConfig';
import styles from '../page.module.css'
import { gesellPath,madariagaPath } from './polly';
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
  
  const handlePolygonClick = (event, polygonName) => {
    alert("parece que queres saber mas sobre "+ polygonName +" pero pablo tenia paja de seguir, con esto mostro lo pijudo que es xd")
  };
  
  const handleNamedPolygonClick = (polygonName) => (event) => {
    handlePolygonClick(event, polygonName);
  };
  

  return (
    <main>
      <GoogleMap
        options={{...MAP_OPTIONS_DEFAULT,styles: [
            {
              featureType: "*",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }],center: GESELL,zoom:10}}

        mapContainerStyle={{width: "100%", height: "calc(100vh - 72px)", top:"72px" ,position:"absolute"}}
      >
        <Marker
          key={"a"}
          position={GESELL}
          label={{
            text: "Villa Gesell",
            fontSize: '24px', // Aumenta el tamaño de la fuente
            color:"white"
          }}
          icon= {{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0}
        }
        />
        <Marker
          key={"a"}
          position={MADARIAGA}
          label={{
            text: "General Madariaga",
            fontSize: '24px', // Aumenta el tamaño de la fuente
          }}
          icon= {{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0}
        }
        />
          <Polygon
            path ={gesellPath}
            onClick={handleNamedPolygonClick('Villa Gesell')}
            options={{
              strokeColor: 'black',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: 'blue',
              fillOpacity: 0.35,
            }}
          />
        <Polygon
        onClick={handleNamedPolygonClick('General Madariaga')}
            path ={madariagaPath}
            options={{
              strokeColor: 'black',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: 'red',
              fillOpacity: 0.35,
            }}
          />
      </GoogleMap>
      </main>
  );
}

export default Map;

