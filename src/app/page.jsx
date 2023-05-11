"use client"
import { libraries } from '@/apis/googleMapsConfig';
import styles from './page.module.css';
import { Map,InputMap } from '@/apis/GoogleMaps';
import { LoadScript } from '@react-google-maps/api';
import { useState, useRef  } from 'react';

export default function Home() {

  const [markerState, setMarkerState] = useState({
    position: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    address: 'Villa Gesell, Provincia de Buenos Aires',
  });
  const inputRef = useRef(null);
  const [geocoder, setGeocoder] = useState(null);


  const handleMarkerChange = (newMarker) => {
    setMarkerState(newMarker);
  };

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
                      height: '800px', 
                      border: 'solid 2px black',
  }
  const handleInputChange = (event) => {
      
    const inputValue = event.target.value;
  
    if (inputValue) {
        
        geocoder.geocode({ address: inputValue }, (results, status) => {

            if (status === 'OK') {
              setMarkerState({ position: results[0].geometry.location.toJSON(), address: formattedAddress(results[0]) }) 
            } else {
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
  };
              
  return (
    <main className={styles.main}>
      <p>Latitud: {markerState.position.lat || '-'}</p>
      <p>Longitud: {markerState.position.lng || '-'}</p>
      <p>Direccion: {markerState.address || '-'}</p>
      


      <LoadScript googleMapsApiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY" libraries={libraries} onLoad={()=> setGeocoder(new window.google.maps.Geocoder()) }>
        

        <InputMap 
          defaultCenter={markerState.position}
          limitArea={true}
          radio={10} 
          onMarkerChange={handleMarkerChange}
        >
        <input
              className={styles.browser}
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
          
      </LoadScript>
    </main>
  );
}

function formattedAddress(address){
  const addressComponents = address.address_components;
  const streetNumber = addressComponents.find(comp => comp.types.includes('street_number')).long_name;
  const streetName = addressComponents.find(comp => comp.types.includes('route')).long_name;
  return `${streetNumber} ${streetName}`;
}