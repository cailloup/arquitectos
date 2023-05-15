"use client"
import LoadScreen from '@/components/LoadScreen';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
import React, { useState, useEffect } from 'react';
import { GoogleMap, Polygon,useLoadScript,Marker } from '@react-google-maps/api';
import { counties } from '@/data/counties';
import { BuildingAPI } from '@/apis/archytectApi';


const center = counties.find( (county) =>  county.name == "Mar Chiquita").center;

const defaultOptions={...GoogleMapsConfig.MAP_OPTIONS_DEFAULT,minZoom: 7,zoom:10,styles: [
  {
    featureType: "*",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }],
    center: center, 
    restriction: {
    latLngBounds: BuildingAPI.utils.limitArea(center,400),
    strictBounds: true
  }}

function Map() {
  const [county,setCounty] = useState(null)
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [options,setOptions] = useState(defaultOptions)

  const {isLoaded} = useLoadScript({
    googleMapsApiKey:   GoogleMapsConfig.GOOGLE_MAPS_API_KEY,
    libraries: GoogleMapsConfig.LIBRARIES,
  });
  useEffect(() => {
    if(county==null){
      setOptions(defaultOptions)
      if (map !=null){
        map.setZoom(10)
      }
      
    }else{
      if(map){
        map.panTo(county.center)
        if(map.getZoom !=14){
          map.setZoom(14)
        }

        setOptions(
          {...GoogleMapsConfig.MAP_OPTIONS_DEFAULT,minZoom: 10,zoom:14,styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }],
              center: county.center, 
              restriction: {
              latLngBounds: BuildingAPI.utils.limitArea(county.center,50),
              strictBounds: true
            }})
      }
    }
  }, [county]);
  

  useEffect(() => {
    function handleEscapeKeyPress(event) {
      if (event.key === 'Escape') {
        console.log('La tecla Escape fue presionada');
        setCounty(null)
      }
    }
    
    document.addEventListener('keydown', handleEscapeKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, []); 

  const handlePolygonClick = (event, county) => {
    setCounty(county)
  };
  
  const handleNamedPolygonClick = (county) => (event) => {
    handlePolygonClick(event, county);
  };

  if (!isLoaded) return <LoadScreen/>

  return (
    <main>
      <GoogleMap

        onLoad={map => setMap(map)}
        options={options}

        mapContainerStyle={{width: "100%", height: "100%"}}
      >
            { county==null? counties.map((countie) => (
              
              <Marker
                onClick={handleNamedPolygonClick(countie)}
                key={countie.name}
                position={countie.center}
                label={{
                  text: countie.name,
                  fontSize: '24px', // Aumenta el tamaño de la fuente
                  color:"black"
                }}
                icon= {{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 0}
                }
              > 
                <Polygon
                  path ={countie.paths}
                  onClick={handleNamedPolygonClick(countie)}
                  options={{
                    strokeColor: 'black',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: countie.color,
                    fillOpacity: 0.88,
                  }}
                >
                  
                </Polygon>
              </Marker>
            )):
            <Polygon
                  path ={county.paths}
                  options={{
                    strokeColor: 'black',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: "transparent",
                    fillOpacity: 0,
                  }}
                ></Polygon>
            
            }
      </GoogleMap>
      </main>
  );
}

export default Map;

