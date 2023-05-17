"use client"
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const MAP_OPTIONS_DEFAULT = {
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    mapTypeId: 'roadmap',
    zoom: 14,
    center: { lat: -37.266919903698266, lng: -56.9869653399663462 },
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }]
  }
const GESELL = { lat: -37.266919903698266, lng: -56.9869653399663462 }
const MADARIAGA ={ lat: -37.001944, lng: -57.136111}

const GoogleMapsConfig = {
  scriptInit: {
    googleMapsApiKey: "AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY",//process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  },
  LIBRARIES:LIBRARIES,
  MAP_OPTIONS_DEFAULT:MAP_OPTIONS_DEFAULT,
  GESELL:GESELL,
  MADARIAGA:MADARIAGA
}

export default GoogleMapsConfig

const GoogleMapsContext = createContext();
export const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useLoadScript(GoogleMapsConfig.scriptInit);
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && !loadError) {
      setApiLoaded(true);
    }
  }, [isLoaded, loadError]);

  return (
    <GoogleMapsContext.Provider value={isLoaded}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);

