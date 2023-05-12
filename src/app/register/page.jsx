"use client"
import { GOOGLE_MAPS_API_KEY, LIBRARIES, MAP_OPTIONS_DEFAULT,GESELL } from "@/apis/googleMapsConfig"; 
import {useRef,useState,useEffect } from "react";
import {useLoadScript} from "@react-google-maps/api";
import styles from './register.module.css';
import { Map,InputMap,limitArea } from "@/apis/GoogleMaps";


export default function Register() {

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marKerPosition,setMarkerPosition] = useState()
  const [geocoder, setGeocoder] = useState(null);
  const inputRef = useRef(null)

  //Cuando cambio el marcador de lugar centro el mapa
  useEffect(() => {
    if(map){
      map.panTo(marKerPosition)
      if(map.getZoom !=18){
        map.setZoom(18)
      }
    }
  }, [marKerPosition]);


  function onLoad(mapa){
    setGeocoder(new window.google.maps.Geocoder())
    setMap(mapa)
  }

  const handleMapChanges = (location) => {
    setMarkerPosition(location.position)
  
    if(!location.address){
      geocoder.geocode({ location: location.position }, (results, status) => {
        if (status === 'OK') {
          const number = results[0].address_components[0].long_name
          const street = results[0].address_components[1].long_name
          const city = results[0].address_components[2].long_name
          const streetNCity =  ` ${street} ${number}, (${city})`
          inputRef.current.value=streetNCity;
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
  };

  if(!isLoaded) return (
    <main className={styles.mainLoad}>
      Cargando mister ... 
    </main>
  )

  return (
    <main className={styles.main}>
      <section className={styles.mapSection}>
        <Map onLoad={onLoad} handleMapChanges={handleMapChanges} marKerPosition={marKerPosition} bounds={limitArea(GESELL,10)} options={{... MAP_OPTIONS_DEFAULT, center:GESELL}} />
      </section>
      <section className={styles.formSection}>
        <label> Direccion</label><br/>
        <InputMap 
            onTextChange={handleMapChanges}
            bounds={limitArea(GESELL,10)}
        >
          <input ref={inputRef} type="text" className={styles.input} placeholder="Mete la direccion" />
        </InputMap>

        <br/>
        <label> Arquitecto</label><br/>
        <input type="text" className={styles.input} placeholder="decime el nombre" />
        <br/>
      </section>
    </main>
   )
}