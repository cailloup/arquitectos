"use client"
import React, { useState, lazy, useRef  } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

const LoadScript = lazy(() => import('@react-google-maps/api').then(module => ({ default: module.LoadScript })));

export function Map({ apiKey, mapStyles, defaultCenter, options, onMarkerChange,limitBounds }){
    const [autocomplete, setAutocomplete] = useState(null);
    const [markerState, setMarkerState] = useState({});
    const inputRef = useRef(null);

    function updateMarker(newMarker){
      
      setMarkerState(newMarker)   
      
      if(onMarkerChange){
          onMarkerChange(newMarker);
      }

      inputRef.current.value= newMarker.address
    }


    function formattedAddress(address){
      const addressComponents = address.address_components;
      const streetNumber = addressComponents.find(comp => comp.types.includes('street_number')).long_name;
      const streetName = addressComponents.find(comp => comp.types.includes('route')).long_name;
      return `${streetNumber} ${streetName}`;
    }

    const handleMapClick = (event) => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: event.latLng }, (results, status) => {

                if (status === 'OK') {
                  updateMarker({ position: event.latLng.toJSON(), address: formattedAddress(results[0]) }) 
                } else {
                  console.error('Geocode was not successful for the following reason: ' + status);
                }
        })
    }

    const handleInputChange = (event) => {
      
      const inputValue = event.target.value;
    
      if (inputValue) {
          const geocoder = new window.google.maps.Geocoder();
          
          geocoder.geocode({ address: inputValue }, (results, status) => {

              if (status === 'OK') {
                updateMarker({ position: event.latLng.toJSON(), address: formattedAddress(results[0]) }) 
              } else {
                  console.error('Geocode was not successful for the following reason: ' + status);
              }
          });
      }
    };

    function HandleplaceChaged() {
      return () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          const markerNew = { position: newPosition, address: place.formatted_address };
          setMarkerState(markerNew);
          if (onMarkerChange) {
            onMarkerChange(markerNew);
          }
        } else {
          console.error('No se ha encontrado la dirección seleccionada');
        }
      };
    }

    return (
      <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
        
        <div>
          <Autocomplete
                bounds={limitBounds}
                onLoad={(auto) =>  setAutocomplete(auto)}
                onPlaceChanged={HandleplaceChaged()}
                options={{strictBounds: true}}  
          >

            <input
              ref={inputRef}
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
        
        <GoogleMap
          bounds={limitBounds}
          mapContainerStyle={mapStyles}
          zoom={14}
          center=  {markerState.position?markerState.position:defaultCenter}
          options={options}
          onClick={handleMapClick}
          onMarkerChange={onMarkerChange}
        >

        {markerState.position && (    
          <Marker
            position={markerState.position}
          />
        )}

        </GoogleMap>
      </LoadScript>
    );
}
