"use client"
import { useState, useEffect, useRef } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import Autosuggest from 'react-autosuggest';
import { toast, ToastContainer } from "react-toastify";

import '@/styles/pages/map.css';
import "react-toastify/dist/ReactToastify.css";

import Map from "@/components/map";
import NavBar from '@/components/NavBar';
import LoadScreen from "@/components/LoadScreen";
import { DragMenu } from '@/components/dragMenu';

import { useGoogleMaps } from '@/apis/googleMapsConfig';
import ArchytecstApi, { Building } from '@/apis/builddingsApi';
import { assests } from "@/data/assest";

const buildingTypes = ["C. C. Municipal","Comercial","Educativo","Esparcimiento","Historico","Hotelera","Municipal","Publico","Religioso","Urbano","Vivienda","Otro"]


export default function sandBox(){
    const [county,setCounty] = useState(null)
    const [redirect,setRedirect] = useState(false)
    const [geocoder, setGeocoder] = useState( /** @type {window.google.maps.Geocoder | null} */ (null));
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type {Building} */ (null)));
    const [buildings,setBuildings] = useState((/** @type {[Building] || null} */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [allBuildings, setAllBuildings] = useState(/** @type google.maps.Map */ (null))
    const selectorColor = useRef(/** @type {HTMLInputElement} */ (null) )
    const selectorType = useRef( /** @type {HTMLInputElement} */ (null))
    const dragMenu = useRef(/** @type {DragMenu | null} */ (null) ); 
    const archytecstApi = new ArchytecstApi()
    /**
     * @type {boolean}
     */
    const isLoaded = useGoogleMaps();
    
    useEffect(() => { //se selecciono un partido
        if(!county?.name)
          return  
          
        toast.promise(
          archytecstApi.getBuildingsByCity(county.name)
          .then( buildings => {setAllBuildings(buildings); setBuildings(buildings)} ),
          {
            pending: 'Buscando edificios',
            success: 'edificios encontrados correctamente 👌',
            error: 'Hubo un error al obtener los edificios 🤯'
          }
        )
        
    }, [county]);
      
    useEffect(() => { //onBuildChange
      if(!map || !selectedBuilding )
        return
      if(map.getZoom!=17){
        map.setZoom(17)
      }
      map.panTo(selectedBuilding.location)

      }, [selectedBuilding]);
      
      const handleSelectedBuildingChange = (newSelectedBuilding) => {
        const updatedBuildings = buildings.map((building) =>
          building.uuid === newSelectedBuilding.uuid ? newSelectedBuilding  : building
        );
    
        setSelectedBuilding(newSelectedBuilding);
        setBuildings(updatedBuildings);
        setAllBuildings(updatedBuildings);
      };

      function onLoad(mapa){
        setGeocoder(new window.google.maps.Geocoder())
        setMap(mapa)
      }

    if (!isLoaded || redirect) return <LoadScreen/>
   
    return (
      <>
      <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <NavBar setRedirect={setRedirect}>
          
          <main className='main-map'>
            <DragMenu ref={dragMenu}>
              <div className='filters-container'>
                <h1>Filtros | Detalles mas exactos?</h1><br />
                <select ref={selectorType} name="" id="selecttor">
                  {buildingTypes.map(type =><option key={type} value={type}>{type}</option> )  }
                  <option value="Todos">Todos</option>
                </select><br /><br />
                <button onClick={() => setBuildings( allBuildings.filter( (building ) => building.type==selectorType.current.value ||selectorType.current.value =="Todos" ) )} className='send-button' style={{float:"unset"}}> Filtrar </button>
                <br /><br />
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
                      <button onClick={() =>{ selectedBuilding.refColor=selectorColor.current.value ; handleSelectedBuildingChange(selectedBuilding)}} className='send-button' style={{float:"unset"}}> color </button>
                  </div>
                }
              </div>
            </DragMenu>
              {county &&< button onClick={() => setCounty(null)} className='send-button button-back'> Volver </button>}
              <Map onCountySelect={setCounty} onLoad={onLoad}  geocoder={geocoder} setSelectedCounty={setCounty} selectedCounty={county}>
                  {buildings&&buildings.map( (building) => (
                      <Marker
                      icon={assests.icons.mapPoint( building.refColor )}
                      key={building.uuid}
                      label={{
                        text: building.name,
                        fontSize: '24px', // Aumenta el tamaño de la fuente
                        color:"black",
                      }}
                      position={building.location}
                      onClick={() => setSelectedBuilding(building)}
                      />
                  ) )}
                  
                  {selectedBuilding && (
                      <InfoWindow
                      position={selectedBuilding.location}
                      onCloseClick={() => setSelectedBuilding(null)}
                      >
                      <InfoWindowContent place={selectedBuilding} />
                      </InfoWindow>
                  )}
                  <SearchBar setSelectedPlace={setSelectedBuilding} buildings={buildings} ></SearchBar>
              </Map>
          </main>  
      </NavBar>
      </>
        
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


/**
 * @param {{ place: Building }} props - Propiedades del componente.
 * @returns {JSX.Element} El contenido del InfoWindow.
 */
const InfoWindowContent = (  {place} ) => (
  <div className="buildingCard">
    
    <img className="buildingPicture" src={place.image} alt="" />
    <div className="buildingDescription">
      <p>{place.name}</p>
      <p>Año: {place.builtDate}</p>
      <p>Constructor: {place.architect}</p>
      <p>Ubicacion: {place.address}</p>
      <p>Estilo: {place.style}</p>
      <p>Tipo: {place.type}</p>
    </div>
  </div>
);
