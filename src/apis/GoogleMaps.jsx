"use client"
import React, { useState, lazy } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

const LoadScript = lazy(() => import('@react-google-maps/api').then(module => ({ default: module.LoadScript })));

export function Map({ apiKey, mapStyles, defaultCenter, options, onMarkerChange }) {
 
    const [markerPosition, setMarkerPosition] = useState(null);
    const [markerAddress, setMarkerAddress] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const handleMapClick = (event) => {
    
    const newPosition = event.latLng.toJSON()
    setMarkerPosition(newPosition);
    if (onMarkerChange) {
       
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: event.latLng }, (results, status) => {
                if (status === 'OK') {
                setMarkerAddress(results[0].formatted_address);
                const markerNew = { position: newPosition, address: results[0].formatted_address }
                
                onMarkerChange(markerNew);
                } else {
                console.error('Geocode was not successful for the following reason: ' + status);
                }})
        
    }
  }

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSelectedAddress(inputValue);
  
    if (inputValue) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: inputValue }, (results, status) => {
        if (status === 'OK') {
          const newPosition = results[0].geometry.location.toJSON();
          setMarkerPosition(newPosition);
          setSelectedAddress(results[0].formatted_address);
          if (onMarkerChange) {
            onMarkerChange({ position: newPosition, address: results[0].formatted_address });
          }
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center=  {markerPosition?markerPosition:defaultCenter}
        options={options}
        onClick={handleMapClick}
        onMarkerChange={onMarkerChange}
      >
        {markerPosition && (    
          <Marker
            position={markerPosition}
          />
        )}
      </GoogleMap>
      <div>
      <Autocomplete
  onLoad={(auto) => setAutocomplete(auto)}
  onPlaceChanged={() => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPosition(newPosition);
      setMarkerAddress(place.formatted_address);
      setSelectedAddress(place.formatted_address);
      if (onMarkerChange) {
        onMarkerChange({ position: newPosition, address: place.formatted_address });
      }
    } else {
      console.error('No se ha encontrado la dirección seleccionada');
    }
  }}
>
        <input
          type="text"
          placeholder="Ingrese una dirección y presione Enter para actualizar el marcador"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleInputChange(event);
            }
          }}
        />
        </Autocomplete>
      </div>
    </LoadScript>
  );
}
