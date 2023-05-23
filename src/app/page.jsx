"use client"
import { useState, useEffect, useRef } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import Autosuggest from 'react-autosuggest';
import { toast } from "react-toastify";
import '@/styles/pages/map.css';
import "react-toastify/dist/ReactToastify.css";
import Map from "@/components/map";
import { DragMenu } from '@/components/dragMenu';
import ArchytecstApi, { Building, assignColor } from '@/apis/builddingsApi';
import { assests } from "@/data/assest";
import { Button,Select } from "@/components/Assests";
import { useTheme } from 'styled-components';

export default function MainScreen(){
    const [county,setCounty] = useState(null)
    const [geocoder, setGeocoder] = useState( /** @type {window.google.maps.Geocoder | null} */ (null));
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type {Building} */ (null)));
    const [buildings,setBuildings] = useState((/** @type {[Building] || null} */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [filterCondition, setFilterCondition] = useState( () => (building) => true);
    const selectorType = useRef( /** @type {HTMLInputElement} */ (null))
    const dragMenu = useRef(/** @type {DragMenu | null} */ (null) ); 
    const archytecstApi = new ArchytecstApi()
    const theme = useTheme();

    useEffect(() => { //se CountyChange
      if(!county?.name)
        return  
      toast.promise(
        archytecstApi.getBuildingsByCity(county.name)
        .then( buildings => setBuildings(buildings) ),
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
      };

      function onLoad(mapa){
        setGeocoder(new window.google.maps.Geocoder())
        setMap(mapa)
      }
   
     function  getQuantityTypes(buildingType){
        let count = 0;
        buildings.forEach(({type}) => {if( type==buildingType){count++}})
        return count
      }

    return (
      <div className='main-map'>
        <DragMenu ref={dragMenu}>
          <div className='filters-container'>
            
          {county &&<><h1>Buscar edificio</h1> < SearchBar setSelectedPlace={setSelectedBuilding} buildings={buildings?.filter(filterCondition)} ></SearchBar><br/></>}
            <h1>Filtros </h1><br />
            <Select ref={selectorType} name="" id="selecttor" style={{width:"400px"}}>
              {assests.buildingTypes.map(type =><option key={type} value={type}>{type}</option> )  }
              <option value="Todos">Todos</option>
            </Select><br /><br />
            <Button onClick={() => setFilterCondition( () => (building) => building.type==selectorType.current.value ||selectorType.current.value =="Todos" )}  style={{float:"unset"}}> Filtrar </Button>
            <br /><br />
          </div>
        </DragMenu>
          {county &&< Button onClick={() => setCounty(null)} className='button-back'> Volver </Button>}
          <Map onCountySelect={setCounty} onLoad={onLoad}  geocoder={geocoder} setSelectedCounty={setCounty} selectedCounty={county}>
              {buildings&&buildings.filter(filterCondition).map( (building) => (
                  <Marker
                  icon={assests.icons.mapPoint( building.refColor )}
                  key={building.uuid}
                  label={{
                    text: building.name,
                    fontSize: '18px',
                    color:"white",
                    className:"markerLabel"
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
              
          </Map>
         {(county && buildings?.length>0) && <div className="referencesContainer" style={{backgroundColor:theme.primary}}>
                { assests.buildingTypes.filter(type => getQuantityTypes(type)>0).map( reference => 
                  <div key={reference} className="reference">
                    <div className="referencesSquare" style={ {backgroundColor: assignColor(reference)}}>  </div>
                    <p style={{color: assignColor(reference)}}>{reference}: {getQuantityTypes(reference)}</p>
                  </div> )
                  }
          </div>}
      </div>  
    )
}


//Otras cosas

const SearchBar = ({setSelectedPlace,buildings}) => {
  const theme = useTheme();
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (inputValue) => {
    const inputValueLowerCase = inputValue.toLowerCase();
    return buildings.filter((building) =>
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
        }}
    };
  /*
    const myTheme = {
      container: {

        zIndex:'9',
        width:'100%',
        display: 'flex',
        justifyContent: 'center',

      },
  
      suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: '1',
        marginTop: '10',
        bottom:'0',
        left: '0',
        right: '0',
        listStyle: "none",
      },
  
      suggestion: {
        backgroundColor: 'white',
        cursor: 'pointer',
        padding: '0.5rem 1rem'
      },
  
      suggestionHighlighted: {
        backgroundColor: '#ddd'
      }
    };*/
    const myTheme = {
      input: {
        width:'400px',
        backgroundColor:'transparent',
        border:'none',
        borderRadius:'0',
        borderBottom: `solid 2px ${theme.secondary}`,
      },

      suggestionsContainerOpen: {
        position:'absolute',
        width:'400px',
        backgroundColor:theme.primary,
      },

      suggestion: {
        padding:'10px',
        cursor:'pointer',
      },
      suggestionHighlighted: {
        backgroundColor: theme.secondary,
      },
    }

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
 * @param {{ place: Building }} props 
 * @returns {JSX.Element} 
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
