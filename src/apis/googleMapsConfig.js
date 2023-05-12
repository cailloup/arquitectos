export const LIBRARIES = ['places'];
export const GOOGLE_MAPS_API_KEY="AIzaSyATNDswrRQLqhoxDwYh9B9W0Jp90NVGcEY"

export const MAP_OPTIONS_DEFAULT = {
    mapTypeControl: false,
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
export const GESELL = { lat: -37.266919903698266, lng: -56.9869653399663462 }