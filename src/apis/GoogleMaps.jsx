"use client"
import { libraries } from './googleMapsConfig';
import React, { useState, lazy, useRef  } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

const LoadScript = lazy(() => import('@react-google-maps/api').then(module => ({ default: module.LoadScript })));

export function Map({mapStyles, defaultCenter, options, radio, limitArea, onMarkerChange,geocoder,markerState,inputRef}){

  function updateMarker(newMarker){
    inputRef.current.value= newMarker.address
    onMarkerChange(newMarker);
  }

  const handleMapClick = (event) => {
      geocoder.geocode({ location: event.latLng }, (results, status) => {

              if (status === 'OK') {
                updateMarker({ position: event.latLng.toJSON(), address: formattedAddress(results[0]) }) 
              } else {
                console.error('Geocode was not successful for the following reason: ' + status);
              }
      })
  }

  return(
    <GoogleMap
    mapContainerStyle={mapStyles}
    zoom={14}
    center=  {markerState.position}
    options={!limitArea ? options:{... options,restriction: { latLngBounds: limitBounds(defaultCenter,radio),strictBounds: false}}}
    onClick={handleMapClick}
    onMarkerChange={onMarkerChange}
  >

  {markerState.position && (    
    <Marker
      position={markerState.position}
    />
  )}

  </GoogleMap>
  )
}

export function InputMap({defaultCenter, radio, limitArea, onMarkerChange,children}){
  
  const [autocomplete, setAutocomplete] = useState(null);


  return(
    <Autocomplete
                bounds={!limitArea ? undefined : limitBounds(defaultCenter,radio)}
                onLoad={(auto) =>  setAutocomplete(auto)}
                onPlaceChanged={() => {
                  const place = autocomplete.getPlace();
                  if (place.geometry) {
                    const newPosition = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    };
                    const markerNew = { position: newPosition, address: place.formatted_address };
                    onMarkerChange(markerNew);
                  } else {
                    console.error('No se ha encontrado la dirección seleccionada');
                  }
                }}
                options={!limitArea? undefined:{strictBounds: true}}  
          >
          {children}
            
          </Autocomplete>
  )
}

const limitBounds = (center,radio) => { 
  const bounds = {
    north: center.lat + radio * 0.0089,
    south: center.lat - radio * 0.0089,
    east: center.lng + radio * 0.0089,
    west: center.lng - radio * 0.0089 
  }

  return bounds
}

function formattedAddress(address){
  const addressComponents = address.address_components;
  const streetNumber = addressComponents.find(comp => comp.types.includes('street_number')).long_name;
  const streetName = addressComponents.find(comp => comp.types.includes('route')).long_name;
  return `${streetNumber} ${streetName}`;
}