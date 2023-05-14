"use client"
import { GOOGLE_MAPS_API_KEY, LIBRARIES, MAP_OPTIONS_DEFAULT,GESELL } from "@/apis/googleMapsConfig"; 
import {useRef,useState,useEffect } from "react";
import {useLoadScript} from "@react-google-maps/api";
import styles from './register.module.css';
import { Map,InputMap,limitArea } from "@/apis/GoogleMaps";
import { BuildingAPI } from "@/apis/archytectApi";




export default function Register() {

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
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

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marKerPosition,setMarkerPosition] = useState()
  const [geocoder, setGeocoder] = useState(null);
  const inputRef = useRef(null)

  //Cuando cambio el marcador de lugar centro el mapa
  useEffect(() => {
    if(map){
      map.panTo(marKerPosition)
      if(map.getZoom !=18){
        map.setZoom(18)
      }
    }
  }, [marKerPosition]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

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

  if(!isLoaded) return (
    <main className={styles.mainLoad}>
      Cargando mister ... 
    </main>
  )

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
    formData.image = event.target.elements.image.value
    formData.period = "15/10/1997"
    formData.state = "0km"
    formData.style = event.target.elements.buildStyle.value
    formData.type = event.target.elements.buildType.value
    console.log(formData);

    const resolution = (success)=> {
      if(success){
        alert("edificio agregado correctamete")
      }else{
        alert("hubo un error al agregar el edificio")
      }
    }

    BuildingAPI.createBuilding(formData,resolution) 
      
  }

  return (
    <main className={styles.main}>
      <section className={styles.mapSection}>
        <Map onLoad={onLoad} handleMapChanges={handleMapChanges} marKerPosition={marKerPosition} bounds={limitArea(GESELL,10)} options={{... MAP_OPTIONS_DEFAULT, center:GESELL}} />
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
              bounds={limitArea(GESELL,10)}
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
          <input id="image" className="formInput" type="file" accept="image/*" title="Seleccionar imagen" />
          
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
