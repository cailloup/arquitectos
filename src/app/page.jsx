"use client"
import '@/styles/pages/map.css';
import Autosuggest from 'react-autosuggest';
import LoadScreen from '@/components/LoadScreen';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
import { GoogleMap,Marker,useLoadScript,InfoWindow } from "@react-google-maps/api";
import { useState,useEffect } from 'react';
import { BuildingAPI,Building } from '@/apis/archytectApi';


 export default function Drawing() {
  const [selectedBuilding, setSelectedBuilding] = useState((/** @type Building */ (null)));
  const [map,setMap] = useState(/** @type google.maps.Map */ (null))
  const [buildings,setBuildings] = useState((/** @type [Building] */ (null)))
  
  const {isLoaded } = useLoadScript(GoogleMapsConfig.scriptInit);

  useEffect(() => { //onPageLoad
    BuildingAPI.endPonts.getBuildings(setBuildings)
  }, []);

  useEffect(() => { //onBuildChange
    if(map && selectedBuilding ){
      map.panTo(BuildingAPI.utils.getPosition(selectedBuilding))
      if(map.getZoom!=17){
        map.setZoom(17)
      }
    }
  }, [selectedBuilding]);

  if (!isLoaded) return <LoadScreen/>

  return (
    <main>
      
      <GoogleMap 
        onLoad={(map)=>setMap(map)}
        options={{...GoogleMapsConfig.MAP_OPTIONS_DEFAULT,restriction: { latLngBounds: BuildingAPI.utils.limitArea(GoogleMapsConfig.GESELL,10),strictBounds: false}}}
        mapContainerStyle={{width: "100%", height: "100%"}}
      >

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


      </GoogleMap>
      <SearchBar map={map} setSelectedPlace={setSelectedBuilding} buildings={buildings} ></SearchBar>
    </main>
  );
}

const SearchBar = ({map,setSelectedPlace,buildings}) => {
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

//Otras cosas
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