"use client"
import '@/styles/pages/map.css';
import Map from "@/components/map";
import { useState, useEffect } from "react";
import { Marker,InfoWindow } from "@react-google-maps/api";
import Autosuggest from 'react-autosuggest';
import NavBar from '@/components/NavBar';
import {useGoogleMaps} from '@/apis/googleMapsConfig'; 
import { BuildingAPI } from "@/apis/archytectApi";
import LoadScreen from "@/components/LoadScreen";
export default function sandBox(){
    const [countyName,setCountyName] = useState(null)
    const [redirect,setRedirect] = useState(false)
    const isLoaded = useGoogleMaps();
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type Building */ (null)));
    const [buildings,setBuildings] = useState((/** @type [Building] */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))

    useEffect(() => { //se selecciono un partido
        console.log("me ejecuto");
        if(countyName){
            console.log("api");
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

    if (!isLoaded || redirect) return <LoadScreen/>
    return (
        <NavBar setRedirect={setRedirect}>
            <main>
                
                <Map setCountyName={setCountyName} setM={setMap} >
                    {buildings&&buildings.map( (building) => (
                        <Marker
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
        listStyle: "none"
  
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