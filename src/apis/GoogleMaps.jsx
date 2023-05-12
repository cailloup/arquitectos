"use client"
import { MAP_OPTIONS_DEFAULT} from "@/apis/googleMapsConfig"; 
import {useState} from "react";
import { GoogleMap,Marker,Autocomplete} from "@react-google-maps/api";
import styles from './map.module.css';



export function Map({onLoad,handleMapChanges,marKerPosition,bounds,options}){
  const handleMapClick = (event) => {
    const location = {position: event.latLng.toJSON()};
    handleMapChanges(location)
  }

  return (
    <GoogleMap 
    onLoad={map => {onLoad(map) }}
      mapContainerClassName={styles.mapContainer}
      options={!bounds? options:{...options,restriction: { latLngBounds: bounds,strictBounds: false}}}
      onClick={handleMapClick}
      >
      <Marker
        position={marKerPosition}
      />
    </GoogleMap>
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

export function limitArea(location,radioKm){
  const bounds = {
    north: location.lat + radioKm * 0.0089,
    south: location.lat - radioKm * 0.0089,
    east: location.lng + radioKm * 0.0089,
    west: location.lng - radioKm * 0.0089 
  }
  return bounds
}