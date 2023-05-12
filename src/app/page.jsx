"use client"
import styles from './page.module.css';
import { buildings } from '@/data/builds';
import { GOOGLE_MAPS_API_KEY,LIBRARIES,MAP_OPTIONS_DEFAULT,GESELL } from '@/apis/googleMapsConfig';
import { GoogleMap,Marker,useLoadScript,InfoWindow } from "@react-google-maps/api";
import { limitArea } from '@/apis/GoogleMaps';
import { useState } from 'react';

export default function Home() {

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  
  const InfoWindowContent = ( {place} ) => (
    <div className={styles.buildingCard}>
      <h2>  {place.name} </h2>
      <img className={styles.buildingPicture} src={place.picture} alt="" />
      <div className={styles.buildingDescription}>
        <p>{place.description}</p>
      </div>
    </div>
  );

  if(!isLoaded) return <main className={styles.main}><h1>y si la luna nos obseva a vos y yo?...</h1></main>

  return (
    <main className={styles.main}>

      <GoogleMap 
        options={{...MAP_OPTIONS_DEFAULT,restriction: { latLngBounds: limitArea(GESELL,10),strictBounds: false}}}
        mapContainerStyle={{width: "100%",height: "100vh"}}
      >

        {buildings.map( (buildig) => (
          <Marker
            position={buildig.position}
            onClick={() => setSelectedPlace(buildig)}
          />
        ) )}
        
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <InfoWindowContent place={selectedPlace} />
          </InfoWindow>
        )}


      </GoogleMap>

    </main>
  );
}
