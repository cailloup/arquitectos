"use client"
import '@/styles/pages/register.css';
import "react-toastify/dist/ReactToastify.css";
import Map from "@/components/map";
import {toast,ToastContainer} from "react-toastify"
import {useRef,useState,useEffect } from "react";
import {Marker,Autocomplete} from "@react-google-maps/api";
import ArchytecstApi from '@/apis/builddingsApi';
import { Button } from '@/components/Assests';

const buildingTypes = ["C. C. Municipal","Comercial","Educativo","Esparcimiento","Historico","Hotelera","Municipal","Publico","Religioso","Urbano","Vivienda","Otro"]
const buildingStyles = ["Centro Europeo","Modernismo","Prefabricado","Tradicional","Otro"]

export default function Register() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [marKerPosition,setMarkerPosition] = useState()
  const [geocoder, setGeocoder] = useState( /** @type {window.google.maps.Geocoder | null} */ (null));
  const [file, setFile] = useState(null);
  const inputRef = useRef(null)
  const formRef = useRef(/** @type {HTMLElement | null} */(null))
  const [county,setCounty] = useState(null)
  const archytecstApi = new ArchytecstApi()
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
    if(map && marKerPosition){
      if(map.getZoom !=18){
        map.setZoom(18)
      }
      map.panTo(marKerPosition)
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

  const sendBuild = () =>{
    
    if(!marKerPosition?.lng || !marKerPosition?.lng){
      return  new Promise (  (resolve,reject) =>{
        const error = new Error('Error al seleccionar la ubicacion');
        console.log(error);
        reject(error); 
      })
    }
     
    formData.architect= `${event.target.elements.archytectName.value}  ${event.target.elements.archytectSurname.value}`
    formData.city = event.target.elements.county.value
    formData.location = event.target.elements.address.value
    formData.isProtected = event.target.elements.buildProtected.value == "on"?"true":"false"
    formData.name = event.target.elements.buildName.value
    formData.builtDate = event.target.elements.buildDate.value
    formData.image = file
    formData.period = event.target.elements.buildPeriod.value
    formData.state = event.target.elements.buildState.value
    formData.style = event.target.elements.buildStyle.value
    formData.type = event.target.elements.buildType.value
    formData.longitude = String(marKerPosition.lng)
    formData.lat = String(marKerPosition.lat)

    return archytecstApi.postBuilding(formData) 
      
  }

  function togleForm(){
    if (formRef.current.classList.contains("zeroForm")) {
      formRef.current.classList.remove("zeroForm");
      formRef.current.classList.add("fullForm");
      return
    }

    if (formRef.current.classList.contains('fullForm')) {
      formRef.current.classList.remove('fullForm');
      formRef.current.classList.add('zeroForm');
      return
    }
  }


  function handleSubmit(event) {
    event.preventDefault();

    toast.promise(
      sendBuild,
      {
        pending: 'Agregando edificio',
        success: 'Edificio agregado correctamente 👌',
        error: 'Hubo un error al agregar el edificio 🤯'
      }
    )

  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  useEffect(() => {
    if(!county){
      setMarkerPosition(null)
    }
  }, [county]);

  const handleMapClick = (event) => {
    if(county){
      const location = {position: event.latLng.toJSON()};
      handleMapChanges(location)
    }
  }

  function changeCountyHandler(){
    setCounty(null)
  }

  return (
  
      <main className="main-register">
        <section className= {county==null?"mapSection full-width":"mapSection"} >
          <Map onLoad={onLoad} onMapClick={handleMapClick} geocoder={geocoder} selectedCounty={county} setSelectedCounty={setCounty} >
            <Marker position={marKerPosition}/>
          </Map>
        </section>
        <section ref={formRef}  className={"formSection fullForm"} style={county==null?{right:"-100%"}:'' }>
        <div  className='leftBar' onClick={togleForm}>
          <div className='leftBarLine'/> 
        </div>
          <h1>Registrar edificio</h1><br/><br/>
          <form className='formRegister' onSubmit={handleSubmit}>
            
            <label> Partido</label><br/>
            <input id="county" className="formInput redOnly" type="text"  value={county?county.name:'' } readOnly="readOnly"/> <br/><br/>
            <Button secondary onClick={changeCountyHandler}> Cambiar</Button><br/>
            
            <br/><br/>
            
            <label> Direccion</label><br/>
            <InputMap 
                onTextChange={handleMapChanges}
                bounds={county?.bounds}
            >
              <input id="address"  className="formInput" onKeyPress={handleEnterPress} ref={inputRef}   type="text" required placeholder="Ingrese una direccion"  />
            </InputMap>
            <br/>
            <label> Nombre</label><br/>
            <input id="buildName" className="formInput" type="text" required placeholder="ingrese nombre del edificio" />
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
              <div>
                <label>Tipologia</label>
                <select className="formSelect" name="tipo de edificio" id="buildType" placeholder=' Tipo de edificio'>
                  {buildingTypes.map( (buildingType) => <option key={buildingType}  value={buildingType}>{buildingType}</option>)}
                </select>
              </div>
              <div>
                <label> Estilo</label>
                <select className="formSelect" name="estilo de edificio" id="buildStyle">
                  {buildingStyles.map( (buildingStyle) => <option key={buildingStyle} value={buildingStyle}>{buildingStyle}</option>)}
                </select>
              </div>
            </div>
            <br/>
            <label>Estado</label><br/>
            <input id="buildState" className="formInput" type="text"  placeholder="ingrese estado del edificio" />
            <br/><br/>
            <div style={{   display: "flex",
                            flexDirection: "row",
                            alignItems: "center"}}>
              <label>Protegido</label>
              <input type="checkbox" id="buildProtected" style={{marginLeft:"10px",width:"15px",height:"15px"}}/>
            </div>
            <br/>
            <label>Fecha</label>
            <input id="buildDate" type="date"  name="buildDate"
            min="1800-01-01" max={new Date().toISOString().split("T")[0]}/>
            
            <br/><br/>
            <label>Epoca</label>
            <input id="buildPeriod" className="formInput" type="text" required placeholder="ingrese nombre del edificio" />
            
            <br/><br/>
            <Button type="submit" className="right" >Agregar edificio</Button>
          </form>
        </section>
      </main>
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
