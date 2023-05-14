"use client"
import styles from './page.module.css';
import { GOOGLE_MAPS_API_KEY,LIBRARIES,MAP_OPTIONS_DEFAULT,GESELL } from '@/apis/googleMapsConfig';
import { GoogleMap,Marker,useLoadScript,InfoWindow } from "@react-google-maps/api";
import { limitArea } from '@/apis/GoogleMaps';
import { useState,useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { BuildingAPI,Building } from '@/apis/archytectApi';


 export default function Drawing() {

  
 
  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [selectedPlace, setSelectedPlace] = useState((/** @type Building */ (null)));
  const [map,setMap] = useState(null)
  const [buildings,setBuildings] = useState((/** @type [Building] */ (null)))
  const [loaded,setLoaded] = useState(false)
  const InfoWindowContent = ( {place} ) => (
    <div className={styles.buildingCard}>
      <h2>  {place.name} </h2>
      <img className={styles.buildingPicture} src={place.image} alt="" />
      <div className={styles.buildingDescription}>
      <p>Partido: {place.city}</p>
      <p>Arquitecto: {place.architect}</p>
      <p>Estilo: {place.style}</p>
      <p>Tipo: {place.type}</p>
      </div>
    </div>
  );

  useEffect(() => {
    BuildingAPI.getBuildings(setBuildings)
  }, []);



 
  if(!isLoaded) return <main className={styles.main}><h1>y si la luna nos obseva a vos y yo?...</h1></main>

  return (
    <main className={styles.main}>
      
      <GoogleMap 
        onLoad={(map)=>setMap(map)}
        options={{...MAP_OPTIONS_DEFAULT,restriction: { latLngBounds: limitArea(GESELL,10),strictBounds: false}}}
        mapContainerStyle={{width: "100%", height: "calc(100vh - 72px)", top:"72px" ,position:"absolute"}}
      >

        {buildings&&buildings.map( (building) => (
          <Marker
            key={building.uuid}
            position={{lat:parseFloat(building.lat),lng: parseFloat(building.longitude)}}
            onClick={() => setSelectedPlace(building)}
          />
        ) )}
        
        {selectedPlace && (
          <InfoWindow
            position={{lat:parseFloat(selectedPlace.lat),lng: parseFloat(selectedPlace.longitude)}}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <InfoWindowContent place={selectedPlace} />
          </InfoWindow>
        )}


      </GoogleMap>
      <SearchBar map={map} setSelectedPlace={setSelectedPlace} buildings={buildings} ></SearchBar>
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
    console.log(suggestion); // Aquí se imprime el objeto de la lista que coincide con la sugerencia seleccionada
    map.panTo(suggestion.position);
    map.setZoom(18)
    setSelectedPlace(suggestion)
  };


  const onChange = (event, { newValue }) => {
    setValue(newValue);
    buildings.find( build )
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'yo solo soy uno mas en la tierra',
     value,
    onChange: (_, { newValue }) => {
      setValue(newValue);
    },
  };

  const myTheme = {
    container: {
      position: 'absolute',
      top: '82px',
      zIndex:'15',
      width:'80%'
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
      onSuggestionSelected={onSuggestionSelected} // Agregamos el evento onSuggestionSelected
    />
  );
};