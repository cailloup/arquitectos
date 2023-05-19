"use client"

import { Polygon,GoogleMap,Marker } from "@react-google-maps/api"
import React, { useState, useEffect } from 'react';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
import { counties } from '@/data/counties';

export default function Map ({children,onLoad,onMapClick,geocoder,setSelectedCounty,selectedCounty}){
    const [options,setOptions] = useState(defaultOptions)
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    useEffect(() => {
        if(selectedCounty==null && map){
          map.setOptions(defaultOptions)
          map.setZoom(8)
        }else{
          if(map){
            map.setZoom(map.getZoom()+2)
            map.panTo(selectedCounty.center)
            map.setOptions({
              restriction: {latLngBounds: selectedCounty.bounds, strictBounds:false },
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }]
            })
          }
          
        }
      }, [selectedCounty]);

      useEffect(() => {   //en caso de aprear escape regiistro
        function handleEscapeKeyPress(event) {
          if (event.key === 'Escape') {
            setSelectedCounty(null)
          }
        }
        
        document.addEventListener('keydown', handleEscapeKeyPress);
        
        return () => {
          document.removeEventListener('keydown', handleEscapeKeyPress);
        };
      }, []); 

    const handlePolygonClick = (event, county) => {
      getCounty(geocoder,county,setSelectedCounty)
    };

    const handleNamedPolygonClick = (county) => (event) => {
        handlePolygonClick(event, county);
    };
    
    return(
      <GoogleMap
        onLoad={(map) => {onLoad(map);setMap(map) }}
        options={options}
        mapContainerStyle={{width: "100%", height: "100%"}}
      >
        { selectedCounty==null? counties.map((countie) => (
          
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
                fillOpacity: 0.58,
              }}
            >
              
            </Polygon>
          </Marker>
        )):
        <>
        {children}
          <Polygon
                onClick={onMapClick}
                path ={selectedCounty.paths}
                options={{
                  strokeColor: 'black',
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  fillColor: "transparent",
                  fillOpacity: 0,
                }}
          />
        </>
                }
      </GoogleMap>
    )
  }

  const center = counties.find( (county) =>  county.name == "Mar Chiquita").center;

  const defaultOptions={...GoogleMapsConfig.MAP_OPTIONS_DEFAULT,
    minZoom:8,
    zoom:8,
    styles: [{
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    }],
        center: center, 
        restriction: {
        latLngBounds: limitArea(center,1200),
        strictBounds: true
    }}


function getCounty (geocoder, selectedcounty,setCounty){
      const name = `Partido de ${selectedcounty.name}`
      geocoder.geocode({ address: name }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location
          const bounds = results[0].geometry.bounds
          const county = {
            name: name,
            location: location,
            paths: selectedcounty.paths,
            bounds: {
              north: bounds.getNorthEast().lat(),
              south: bounds.getSouthWest().lat(),
              east: bounds.getNorthEast().lng(),
              west: bounds.getSouthWest().lng(),
            },
            center:bounds.getCenter()
          }
          setCounty(county)
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      })
}

function limitArea (position,radioKm){
  const bounds = {
    north: position.lat + radioKm/2 * 0.0089,
    south: position.lat - radioKm/2 * 0.0089,
    east: position.lng + radioKm/2 * 0.0089,
    west: position.lng - radioKm/2 * 0.0089 
  }
  return bounds
}