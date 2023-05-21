"use client"
import { useState, useEffect, useRef } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import Autosuggest from 'react-autosuggest';
import { toast } from "react-toastify";
import '@/styles/pages/map.css';
import "react-toastify/dist/ReactToastify.css";
import Map from "@/components/map";
import { DragMenu } from '@/components/dragMenu';
import ArchytecstApi, { Building } from '@/apis/builddingsApi';
import { assests } from "@/data/assest";
import { Button,Select,Input } from "@/components/Assests";
export default function MainScreen(){
    const [county,setCounty] = useState(null)
    const [geocoder, setGeocoder] = useState( /** @type {window.google.maps.Geocoder | null} */ (null));
    const [selectedBuilding, setSelectedBuilding] = useState((/** @type {Building} */ (null)));
    const [buildings,setBuildings] = useState((/** @type {[Building] || null} */ (null)))
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [filterCondition, setFilterCondition] = useState( () => (building) => true);
    const selectorColor = useRef(/** @type {HTMLInputElement} */ (null) )
    const selectorType = useRef( /** @type {HTMLInputElement} */ (null))
    const dragMenu = useRef(/** @type {DragMenu | null} */ (null) ); 
    const archytecstApi = new ArchytecstApi()
    
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
   
    return (
      <div className='main-map'>
        <DragMenu ref={dragMenu}>
          <div className='filters-container'>
            <h1>Filtros | Detalles mas exactos?</h1><br />
            <Select ref={selectorType} name="" id="selecttor">
              {assests.buildingTypes.map(type =><option key={type} value={type}>{type}</option> )  }
              <option value="Todos">Todos</option>
            </Select><br /><br />
            <Button onClick={() => setFilterCondition( () => (building) => building.type==selectorType.current.value ||selectorType.current.value =="Todos" )}  style={{float:"unset"}}> Filtrar </Button>
            <br /><br />
            {selectedBuilding && 
              <div>
                <h1> {selectedBuilding.name}</h1>
                <img style={{width:"250px",aspectRatio:"16/9"}} src={selectedBuilding.image} alt="" />
                  <h3>color:</h3>
                  <Select  ref={selectorColor} name="" id="color" style={{width:"250px", marginBottom:"10px", marginRight:"10px"}}>
                    {Object.entries(assests.colors).map( ([name, value]) =>
                      <option  key={name} value={value} >{name}</option>
                    )}
                  </Select>
                  <Button onClick={() =>{ selectedBuilding.refColor=selectorColor.current.value ; handleSelectedBuildingChange(selectedBuilding)}} style={{float:"unset"}}> color </Button>
              </div>
            }
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
                    fontSize: '24px',
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
              <SearchBar setSelectedPlace={setSelectedBuilding} buildings={buildings?.filter(filterCondition)} ></SearchBar>
          </Map>
      </div>  
    )
}


//Otras cosas

const SearchBar = ({setSelectedPlace,buildings}) => {
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
