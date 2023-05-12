"use client"
import { GOOGLE_MAPS_API_KEY, LIBRARIES, MAP_OPTIONS_DEFAULT,GESELL } from "@/apis/googleMapsConfig"; 
import {useRef,useState,useEffect } from "react";
import { GoogleMap,useLoadScript,Marker,Autocomplete,useGoogleMap } from "@react-google-maps/api";
import styles from './register.module.css';

export default function Register() {
  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marKerPosition,setMarkerPosition] = useState()
  const [geocoder, setGeocoder] = useState(null);
  const inputRef = useRef(null)


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
    //map.panTo(location.position);
    map.panTo(location.position)
    if(map.getZoom !=18){
      map.setZoom(18)
    }
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


  function limitArea(location,radioKm){
    const bounds = {
      north: location.lat + radioKm * 0.0089,
      south: location.lat - radioKm * 0.0089,
      east: location.lng + radioKm * 0.0089,
      west: location.lng - radioKm * 0.0089 
    }
  
    return bounds
  }


  if(!isLoaded) return (
    <main className={styles.mainLoad}>
      Cargando mister ... 
    </main>
  )

  return (


    <main className={styles.main}>
      <section className={styles.mapSection}>
        <Map onLoad={onLoad} handleMapChanges={handleMapChanges} marKerPosition={marKerPosition} bounds={limitArea(GESELL,10)} />
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


export function InputMap({onTextChange,children,bounds}){

  const [autocomplete, setAutocomplete] = useState(null);

  return(
    <Autocomplete
                bounds={!bounds ? undefined : bounds}
                onLoad={(auto) =>  setAutocomplete(auto)}
                onPlaceChanged={() => {
                  const place = autocomplete.getPlace();
                  if (place.geometry) {
                    const newPosition = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    };
                    const location = { position: newPosition, address: place.formatted_address };
                    onTextChange(location);
                  } else {
                    console.error('No se ha encontrado la dirección seleccionada');
                  }
                }}
                options={!bounds? undefined:{strictBounds: true}}  
                
          >
          {children}
            
          </Autocomplete>
  )
}

function Map({onLoad,handleMapChanges,marKerPosition,bounds}){
  
  const handleMapClick = (event) => {
    const location = {position: event.latLng.toJSON()};
    handleMapChanges(location)
  }

  return (
    <GoogleMap 
    onLoad={map => {onLoad(map) }}
      mapContainerClassName={styles.mapContainer}
      options={!bounds? MAP_OPTIONS_DEFAULT:{...MAP_OPTIONS_DEFAULT,restriction: { latLngBounds: bounds,strictBounds: false}}}
      onClick={handleMapClick}
      >
      <Marker
        position={marKerPosition}
      />
    </GoogleMap>
  )
}

