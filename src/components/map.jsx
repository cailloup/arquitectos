"use client"

import { Polygon,GoogleMap,Marker } from "@react-google-maps/api"
import React, { useState, useEffect } from 'react';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
import { BuildingAPI } from "@/apis/archytectApi";
import { counties } from '@/data/counties';


export default function Map ({children,onLoad,onCountySelect,onMapClick,changeCounty}){
    const [selectedCounty,setSelectedCounty] = useState(null)
    const [options,setOptions] = useState(defaultOptions)
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    useEffect(() => {
        if(onCountySelect){
            onCountySelect(selectedCounty)
        }
        if(selectedCounty==null){
          setOptions(defaultOptions)
          if (map !=null){
            map.setZoom(10)
          }
        }else{
            
            
          if(map){
            map.panTo(selectedCounty.center)
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
                  center: selectedCounty.center, 
                  restriction: {
                  latLngBounds: BuildingAPI.utils.limitArea(selectedCounty.center,50),
                  strictBounds: true
                }})
          }
        }
      }, [selectedCounty]);

      useEffect(() => {   //en caso de aprear escape
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
      useEffect(() => {   //en caso de aprear escape
        if(changeCounty){
          setSelectedCounty(null)
        }
      }, [changeCounty]); 

    const handlePolygonClick = (event, county) => {
        setSelectedCounty(county)
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

  const defaultOptions={...GoogleMapsConfig.MAP_OPTIONS_DEFAULT,minZoom: 7,zoom:10,styles: [
    {
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    }],
        center: center, 
        restriction: {
        latLngBounds: BuildingAPI.utils.limitArea(center,400),
        strictBounds: true
    }}