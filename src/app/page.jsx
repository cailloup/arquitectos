"use client"
import styles from './page.module.css';
import { buildings } from '@/data/builds';
import { GOOGLE_MAPS_API_KEY,LIBRARIES,MAP_OPTIONS_DEFAULT,GESELL } from '@/apis/googleMapsConfig';
import { GoogleMap,Marker,useLoadScript,InfoWindow } from "@react-google-maps/api";
import { limitArea } from '@/apis/GoogleMaps';
import { useState } from 'react';
import Autosuggest from 'react-autosuggest';



 export default function Drawing() {

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map,setMap] = useState(null)

  const InfoWindowContent = ( {place} ) => (
    <div className={styles.buildingCard}>
      <h2>  {place.name} </h2>
      <img className={styles.buildingPicture} src={place.picture} alt="" />
      <div className={styles.buildingDescription}>
        <p>{place.description}</p>
      </div>
    </div>
  );

  if(!isLoaded) return <main className={styles.main}><h1>y si la luna nos obseva a vos y yo?...</h1></main>

  return (
    <main className={styles.main}>
      <SearchBar map={map} setSelectedPlace={setSelectedPlace} ></SearchBar>
      <GoogleMap 
      onLoad={(map)=>setMap(map)}
        options={{...MAP_OPTIONS_DEFAULT,restriction: { latLngBounds: limitArea(GESELL,10),strictBounds: false}}}
        mapContainerStyle={{width: "100%", height: "calc(100vh - 72px)", top:"72px" ,position:"absolute"}}
      >

        {buildings.map( (buildig) => (
          <Marker
            position={buildig.position}
            onClick={() => setSelectedPlace(buildig)}
          />
        ) )}
        
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <InfoWindowContent place={selectedPlace} />
          </InfoWindow>
        )}


      </GoogleMap>

    </main>
  );
}





const SearchBar = ({map,setSelectedPlace}) => {
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
      top: '150px',
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