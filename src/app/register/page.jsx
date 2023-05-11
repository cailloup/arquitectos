"use client";
import '@/styles/register.css';
import styles from './register.module.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '800px',
  boxShadow: '-1px -1px 17px 2px rgba(0,0,0,0.75) inset',
  border: 'solid 2px black'
};

const options = {
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  mapTypeId: 'roadmap',
  zoom: 14,
  minZoom: 16
};

export default function Register() {
  const [center, setCenter] = useState({
    lat: -37.266919903698266,
    lng: -56.9869653399663462
  });
  const [markerPosition, setMarkerPosition] = useState(center);
  const [mapView, setMapView] = useState(0);
  const inputRef = useRef(null);

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const address = inputRef.current.value;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { location } = results[0].geometry;
          setCenter(location);
          setMarkerPosition(location);
        }
      });
    }
  };

  const handleMapClick = (event) => {
    setMarkerPosition(event.latLng.toJSON());
  };

  return (
    <main className={styles.main}>
      <div className={styles.registerForm}>
        <form action="" method="post">
          <div className='inputs'>
            <label htmlFor="direccion" placeholder=''>Direccion</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              placeholder='Direccion re loca'
              required
              ref={inputRef}
              onKeyPress={handleEnterPress}
            />
            <label htmlFor="Arquitecto">Arquitecto</label>
            <input type="text" id="Arquitecto" name="Arquitecto" placeholder='Miguel Angel Peralta' />
            <label htmlFor="last">Fecha de construccion</label>
            <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </div>
        </form>
      </div>
      <LoadScript googleMapsApiKey="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY">
        <GoogleMap
          onClick={handleMapClick}
          onLoad={(map) => setMapView(map)}
          mapContainerStyle={containerStyle}
          center={center}
          options={options}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </LoadScript>
    </main>
  );
}
