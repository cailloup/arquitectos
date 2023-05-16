"use client"
import '@/styles/pages/map.css';
import Map from "@/components/map";
import { useState, useEffect } from "react";
import { Marker,InfoWindow } from "@react-google-maps/api";
import {useGoogleMaps} from '@/apis/googleMapsConfig'; 
import { BuildingAPI } from "@/apis/archytectApi";
import Autosuggest from 'react-autosuggest';
import NavBar from '@/components/NavBar';
import LoadScreen from "@/components/LoadScreen";

export default function sandBox(){
    const [countyName,setCountyName] = useState(null)
    const [redirect,setRedirect] = useState(false)
    const isLoaded = useGoogleMaps();
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type Building */ (null)));
    const [buildings,setBuildings] = useState((/** @type [Building] */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    useEffect(() => { //se selecciono un partido
        if(countyName){
            BuildingAPI.endPonts.getBuildingsByCity(countyName,setBuildings)
        }
      }, [countyName]);
      
    useEffect(() => { //onBuildChange
        if(map && selectedBuilding ){
          map.panTo(BuildingAPI.utils.getPosition(selectedBuilding))
          if(map.getZoom!=17){
            map.setZoom(17)
          }
        }
      }, [selectedBuilding]);

      function handleCountyChange(county){
        if(county){
          setCountyName(`Partido de ${county.name}`)
        }
        
      }

    if (!isLoaded || redirect) return <LoadScreen/>

    const svgMarker = {
    
    };
    
    return (
        <NavBar setRedirect={setRedirect}>
            <main>
                
                <Map onCountySelect={handleCountyChange} onLoad={(map) => setMap(map)} >
                    {buildings&&buildings.map( (building,index) => (
                        <Marker
                        icon={{
                          path: "M-1.547 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                          fillColor: index%2==0?"#1fbd93":"green" ,
                          fillOpacity: 0.85,
                          strokeWeight: 0,
                          rotation: 0,
                          scale: 2,
                          anchor: new google.maps.Point(0, 20),
                        }}
                        key={building.uuid}
                        position={{lat:parseFloat(building.lat),lng: parseFloat(building.longitude)}}
                        onClick={() => setSelectedBuilding(building)}
                        />
                    ) )}
                    
                    {selectedBuilding && (
                        <InfoWindow
                        position={{lat:parseFloat(selectedBuilding.lat),lng: parseFloat(selectedBuilding.longitude)}}
                        onCloseClick={() => setSelectedBuilding(null)}
                        >
                            <InfoWindowContent place={selectedBuilding} />
                        </InfoWindow>
                    )}
                    <SearchBar setSelectedPlace={setSelectedBuilding} buildings={buildings} ></SearchBar>
                </Map>
            </main>  
        </NavBar>
    )
}


//Otras cosas

const SearchBar = ({setSelectedPlace,buildings}) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  
    const getSuggestions = (inputValue) => {
      const inputValueLowerCase = inputValue.toLowerCase();
      return buildings.filter(
        (building) =>
          building.name.toLowerCase().includes(inputValueLowerCase)
      );
    };
    
    const getSuggestionValue = (suggestion) => suggestion.name;
  
    const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;
  
    const onSuggestionSelected = (event, { suggestion }) => { 
      setSelectedPlace(suggestion)
    };
  
    const onSuggestionsFetchRequested = ({ value }) => {
      setSuggestions(getSuggestions(value));
    };
  
    const onSuggestionsClearRequested = () => {
      setSuggestions([]);
    };
  
    const inputProps = {
      placeholder: 'Ingrese nombre del edificio',
       value,
      onChange: (_, { newValue }) => {
        setValue(newValue);
      },
    };
  
    const myTheme = {
      container: {
        position: 'absolute',
        top: '10px',
        zIndex:'9',
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '187px',
        paddingRight:'10%',
  
      },
  
      suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: '1',
        marginTop: '10',
        left: '0',
        right: '0',
        listStyle: "none",
        top: '31px',
        paddingLeft: '187px',
        paddingRight:'10%',
      },
  
      suggestion: {
        backgroundColor: 'white',
        cursor: 'pointer',
        padding: '0.5rem 1rem'
      },
  
      suggestionHighlighted: {
        backgroundColor: '#ddd'
      }
    };
  
    return (
      <Autosuggest  
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={myTheme}
        onSuggestionSelected={onSuggestionSelected}
      />
    );
  };

const InfoWindowContent = ( {place} ) => (
    <div className="buildingCard">
      <h2>  {place.name} </h2>
      <img className="buildingPicture" src={place.image} alt="" />
      <div className="buildingDescription">
      <p>Partido: {place.city}</p>
      <p>Arquitecto: {place.architect}</p>
      <p>Estilo: {place.style}</p>
      <p>Tipo: {place.type}</p>
      </div>
    </div>
  );