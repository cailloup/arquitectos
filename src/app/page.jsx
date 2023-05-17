"use client"
import '@/styles/pages/map.css';
import Map from "@/components/map";
import { useState, useEffect,useRef } from "react";
import { Marker,InfoWindow } from "@react-google-maps/api";
import {useGoogleMaps} from '@/apis/googleMapsConfig'; 
import { BuildingAPI } from "@/apis/archytectApi";
import Autosuggest from 'react-autosuggest';
import NavBar from '@/components/NavBar';
import LoadScreen from "@/components/LoadScreen";
import {DragMenu} from '@/components/dragMenu';
import { assests } from '@/data/assest';

export default function sandBox(){
    const [county,setCounty] = useState(null)
    const [redirect,setRedirect] = useState(false)
    const [geocoder, setGeocoder] = useState( /** @type {window.google.maps.Geocoder | null} */ (null));
    const isLoaded = useGoogleMaps();
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type Building */ (null)));
    const [buildings,setBuildings] = useState((/** @type [Building] */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const selectorColor = useRef()
    const dragMenu = useRef(/** @type {DragMenu | null} */ (null) );
  
    useEffect(() => { //se selecciono un partido
        if(county?.name){
            BuildingAPI.endPonts.getBuildingsByCity(county.name,(builds) => setBuildings(builds.map((build)  => {return {...build,color: assests.colors.blue} } )) )
        }
      }, [county]);
      
    useEffect(() => { //onBuildChange
        if(map && selectedBuilding ){
          const location = BuildingAPI.utils.getPosition(selectedBuilding);
          if(map.getZoom!=17){
            map.setZoom(17)
          }
          map.panTo(location)
        }
      }, [selectedBuilding]);

      const handleSelectedBuildingChange = (newSelectedBuilding) => {
        const updatedBuildings = buildings.map((building) =>
          building.uuid === newSelectedBuilding.uuid ? newSelectedBuilding  : building
        );
    
        setSelectedBuilding(newSelectedBuilding);
        setBuildings(updatedBuildings);
      };

      function onLoad(mapa){
        setGeocoder(new window.google.maps.Geocoder())
        setMap(mapa)
      }

      function play(src){
        new Audio(src).play();
        dragMenu.current.setLeft(250)
        
      }

    if (!isLoaded || redirect) return <LoadScreen/>
   
    return (
        <NavBar setRedirect={setRedirect}>
            <main className='main-map'>
              <DragMenu ref={dragMenu}>
                <div className='filters-container'>
                  <h1>Filtros | Detalles mas exactos?</h1>
                  <button onClick={() => play(assests.audios.vela)} className='send-button' style={{float:"unset"}}> vela </button>
                  {selectedBuilding && 
                    <div>
                      <h1> {selectedBuilding.name}</h1>
                      <img style={{width:"250px",aspectRatio:"16/9"}} src={selectedBuilding.image} alt="" />
                        <h3>color:</h3>
                        <select  ref={selectorColor} name="" id="color" style={{width:"250px", marginBottom:"10px", marginRight:"10px"}}>
                          {Object.entries(assests.colors).map( ([name, value]) =>
                            <option  key={name} value={value} >{name}</option>
                          )}
                        </select>
                        <button onClick={() => handleSelectedBuildingChange({...selectedBuilding,color:selectorColor.current.value}) } className='send-button' style={{float:"unset"}}> color </button>
                    </div>
                  }
                </div>
              </DragMenu>
                {county &&< button onClick={() => setCounty(null)} className='send-button button-back'> Volver </button>}
                <Map onCountySelect={setCounty} onLoad={onLoad}  geocoder={geocoder} setSelectedCounty={setCounty} selectedCounty={county}>
                    {buildings&&buildings.map( (building,index) => (
                        <Marker
                        icon={assests.icons.mapPoint( building.color? building.color : assests.colors.green )}
                        key={building.uuid}
                        label={{
                          text: building.name,
                          fontSize: '24px', // Aumenta el tamaño de la fuente
                          color:"black",
                        }}
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
      onKeyDown: (event) => { 
        if (event.key === 'Enter') {
          const value = event.target.value.toLowerCase()
          const suggestion = suggestions.find((suggestion) => suggestion.name.toLowerCase() == value)
           if(suggestion ){
              onSuggestionSelected(event, { suggestion:suggestion });
           }
        }

          
         }
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
    <h2 style={{backgroundColor: place.color}}>  {place.name} </h2>
    <img className="buildingPicture" src={place.image} alt="" />
    <div className="buildingDescription">
      <p>Partido: {place.city}</p>
      <p>Arquitecto: {place.architect}</p>
      <p>Estilo: {place.style}</p>
      <p>Tipo: {place.type}</p>
    </div>
  </div>
);
