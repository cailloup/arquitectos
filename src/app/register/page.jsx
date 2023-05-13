"use client"
import { GOOGLE_MAPS_API_KEY, LIBRARIES, MAP_OPTIONS_DEFAULT,GESELL } from "@/apis/googleMapsConfig"; 
import {useRef,useState,useEffect } from "react";
import {useLoadScript} from "@react-google-maps/api";
import styles from './register.module.css';
import { Map,InputMap,limitArea } from "@/apis/GoogleMaps";




export default function Register() {

  const {isLoaded } = useLoadScript({
    googleMapsApiKey:   GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

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

  const handleButton = async () => {
      const res = await fetch("https://architectgallery.herokuapp.com/api/v1/ok/buildings", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
    const datos = await res.json();
    console.log()
    alert("un arquitecto: " + datos.buildings[0].architect)
  };

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



  return (
    <main className={styles.main}>
      <section className={styles.mapSection}>
        <Map onLoad={onLoad} handleMapChanges={handleMapChanges} marKerPosition={marKerPosition} bounds={limitArea(GESELL,10)} options={{... MAP_OPTIONS_DEFAULT, center:GESELL}} />
      </section>
      <section className={styles.formSection}>
        <label> Direccion</label><br/>
        <InputMap 
            onTextChange={handleMapChanges}
            bounds={limitArea(GESELL,10)}
        >
          <input className="formInput" onKeyPress={handleEnterPress} ref={inputRef} type="text"  placeholder="Ingrese una direccion" onkeydown="detectarEnter(event)" />
        </InputMap>

        <br/>
        <label> Arquitecto</label><br/>
        <div className="form-row-2Columns">
          <input className="formInput" type="text"  placeholder="nombre" />
          <input className="formInput" type="text"  placeholder="apellido" />
        </div>
        
        <br/>
        
        <label> Imagen del edificio</label><br/>
        <input className="formInput" type="file" accept="image/*" title="Seleccionar imagen" />
        
        <br/><br/>
       
        <div className="form-row-2Columns">
        <label> Tipo de edificio</label>
        <label> Estilo de arquitectonico</label>
          <select className="formSelect" name="tipo de edificio" id="buildType">
            <option value="sabatica">sectario</option>
            <option value="religiosa">asuntos oficiales</option>
            <option value="andaluz">andaluz</option>
            <option value="empirica">empirica</option>
          </select>

          <select className="formSelect" name="estilo de edificio" id="style">
            <option value="gotico">gotico</option>
            <option value="verano">verano</option>
            <option value="salado">salado</option>
            <option value="congreso nacional de los pelados por el calentamiento de global">congreso nacional de los pelados por el calentamiento de global</option>
          </select>
        </div>
        <br />

        <button className="send-button" onClick={handleButton}>Agregar edificio</button>

      </section>
    </main>
   )
}
