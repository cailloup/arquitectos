"use client"
import styles from './register.module.css';
import LoadScreen from '@/components/LoadScreen';
import GoogleMapsConfig from '@/apis/googleMapsConfig';
import {useRef,useState,useEffect } from "react";
import {useLoadScript,GoogleMap,Marker,Autocomplete} from "@react-google-maps/api";
import { BuildingAPI } from "@/apis/archytectApi";

export default function Register() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marKerPosition,setMarkerPosition] = useState()
  const [geocoder, setGeocoder] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null)
  

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GoogleMapsConfig.GOOGLE_MAPS_API_KEY,
    libraries: GoogleMapsConfig.LIBRARIES,
  });

  const formData ={
      image:"",
      period:"",
      city:"",
      architect:"",
      type:"",
      longitude:"",
      builtDate:"",
      isProtected:"",
      name:"",
      location:"",
      style:"",
      state:"",
      lat:"",
      enabled:true
  }


  useEffect(() => {
    if(map){
      map.panTo(marKerPosition)
      if(map.getZoom !=18){
        map.setZoom(18)
      }
    }
  }, [marKerPosition]);

  function onLoad(mapa){
    setGeocoder(new window.google.maps.Geocoder())
    setMap(mapa)
  }

  const handleMapChanges = (location) => {
    setMarkerPosition(location.position)
  
    if(!location.address){
      geocoder.geocode({ location: location.position }, (results, status) => {
        if (status === 'OK') {
          const number = results[0].address_components[0].long_name
          const street = results[0].address_components[1].long_name
          const city = results[0].address_components[2].long_name
          const streetNCity =  ` ${street} ${number}, (${city})`
          inputRef.current.value=streetNCity;
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const address = inputRef.current.value;
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const  location  = {position: results[0].geometry.location};
          handleMapChanges(location);
        }
      });
    }
  };

  function handleSubmit(event) {
    event.preventDefault();

    formData.architect= `${event.target.elements.archytectName.value}  ${event.target.elements.archytectSurname.value}`
    formData.city = event.target.elements.county.value
    formData.location = event.target.elements.address.value
    formData.longitude = String(marKerPosition.lng)
    formData.lat = String(marKerPosition.lat)
    formData.isProtected = "false"
    formData.name = event.target.elements.buildName.value
    formData.builtDate = "15/10/1997"
    formData.image = file
    formData.period = "15/10/1997"
    formData.state = "0km"
    formData.style = event.target.elements.buildStyle.value
    formData.type = event.target.elements.buildType.value

    const resolution = (success)=> {
      if(success){
        alert("edificio agregado correctamete")
      }else{
        alert("hubo un error al agregar el edificio")
      }
    }
    
    BuildingAPI.endPonts.postBuilding(formData,resolution) 
    
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  if (!isLoaded) return <LoadScreen/>
 
  return (
    <main className={styles.main}>
      <section className={styles.mapSection}>
        <Map onLoad={onLoad} handleMapChanges={handleMapChanges} marKerPosition={marKerPosition} bounds={BuildingAPI.utils.limitArea(GoogleMapsConfig.GESELL,10)} options={{... GoogleMapsConfig.MAP_OPTIONS_DEFAULT, center:GoogleMapsConfig.GESELL}} />
      </section>
      <section className={styles.formSection}>
        <h1>Registrar edificio</h1><br/><br/>
        
        <form onSubmit={handleSubmit}>
          
          <label> Partido</label><br/>
          <input id="county" className="formInput redOnly" type="text"  value={"Partido de Villa Gesell"} readOnly="readOnly"/> <br/><br/>
          <button className="secondary-button" >Cambiar</button><br/>
          
          <br/><br/>
          
          <label> Direccion</label><br/>
          <InputMap 
              onTextChange={handleMapChanges}
              bounds={BuildingAPI.utils.limitArea(GoogleMapsConfig.GESELL,10)}
          >
            <input id="address" className="formInput" onKeyPress={handleEnterPress} ref={inputRef} type="text"  placeholder="Ingrese una direccion"  />
          </InputMap>
          <br/>
          <label> Nombre</label><br/>
          <input id="buildName" className="formInput" type="text"  placeholder="ingrese nombre del edificio" />
          <br/><br/>
          <label> Arquitecto</label><br/>
          <div className="form-row-2Columns">
            <input id="archytectName" className="formInput" type="text"  placeholder="nombre" />
            <input id="archytectSurname" className="formInput" type="text"  placeholder="apellido" />
          </div>
          
          <br/>
          
          <label> Imagen del edificio</label><br/>
          <input onChange={handleFileChange} id="image" className="formInput" type="file" accept="image/*" title="Seleccionar imagen" />
          
          <br/><br/>
        
          <div className="form-row-2Columns">
          <label> Tipo de edificio</label>
          <label> Estilo arquitectonico</label>
            <select className="formSelect" name="tipo de edificio" id="buildType">
              <option value="sabatica">sectario</option>
              <option value="religiosa">asuntos oficiales</option>
              <option value="andaluz">andaluz</option>
              <option value="empirica">empirica</option>
            </select>

            <select className="formSelect" name="estilo de edificio" id="buildStyle">
              <option value="gotico">gotico</option>
              <option value="verano">verano</option>
              <option value="salado">salado</option>
              <option value="congreso nacional de los pelados por el calentamiento de global">congreso nacional de los pelados por el calentamiento de global</option>
            </select>
          </div>
          <br />

          <button type="submit" className="send-button" >Agregar edificio</button>
        </form>
      </section>
    </main>
   )
}

function Map({onLoad,handleMapChanges,marKerPosition,bounds,options}){
  const handleMapClick = (event) => {
    const location = {position: event.latLng.toJSON()};
    handleMapChanges(location)
  }

  return (
    <GoogleMap 
      onLoad={map => {onLoad(map) }}
      mapContainerClassName={styles.mapContainer}
      options={!bounds? options:{...options,restriction: { latLngBounds: bounds,strictBounds: false}}}
      onClick={handleMapClick}
      >
      <Marker
        position={marKerPosition}
      />
    </GoogleMap>
  )
}



function InputMap({onTextChange,children,bounds}){
  const [autocomplete, setAutocomplete] = useState(null);

  return(
    <Autocomplete
                bounds={!bounds ? undefined : bounds}
                onLoad={(auto) =>  setAutocomplete(auto)}
                onPlaceChanged={() => {
                  const place = autocomplete.getPlace();
                  if (place.geometry) {
                    const newPosition = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    };
                    const location = { position: newPosition, address: place.formatted_address };
                    onTextChange(location);
                  } else {
                    console.error('No se ha encontrado la dirección seleccionada');
                  }
                }}
                options={!bounds? undefined:{strictBounds: true}}  
                
          >
          {children}
            
    </Autocomplete>
  )
}
