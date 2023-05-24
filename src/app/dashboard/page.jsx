"use client"
import { useState,useEffect } from "react"
import {toast} from "react-toastify"
import '@/styles/pages/dashBoard.css' 
import ArchytecstApi,{ Building } from "@/apis/builddingsApi"
import { Button, Table,Input } from "@/components/Assests"

export default function DashBoard(){ 
    const [buildings,setBuildings] = useState(/** @type {[Building]} */([]) ) 
    const [selectedBuildings,setSelectedBuildings] = useState([]) 
    const [sortedType,setSortedType] = useState('')
    const [modify,setModify] = useState(false)
    const [searchValue, setSearchValue] = useState("");
    const archytecstApi = new ArchytecstApi();
    const columns = [
        {field:"name",label:"Nombre"}, 
        {field:"address",label:"Dirección"},
        {field:"architect",label:"Arquitecto"},
        {field:"city",label:"Localidad"},
        ]
    useEffect(() => { //onPageLoad
        
        toast.promise(
            () => archytecstApi.getBuildings().then(buildings => setBuildings(buildings)),
            {
              pending: 'obteniendo edificios',
              success: 'Edificios cargados correctamente 👌',
              error: 'Hubo un error al cargar los edificios 🤯'
            }
          );
    }, []);

    function deleteBuilding(id) {

        toast.promise(
            () => archytecstApi.deleteBuilding(id),
            {
              pending: 'Eliminando edificio',
              success: 'Edificio eliminado correctamente 👌',
              error: 'Hubo un error al eliminar el edificio 🤯'
            }
          ).then(() => {
            archytecstApi.getBuildings().then(buildings => setBuildings(buildings)) // TODO: pido la lista devuelta o solo la actualizo localmente
          });

    }

    function toggleBuild(newId){
        if(!selectedBuildings.includes(newId)){
            setSelectedBuildings([...selectedBuildings,newId])
        }else{
            const newBuilds = selectedBuildings.filter( (id) => id!=newId );
            setSelectedBuildings(newBuilds)
        }
    }


    function toggleSort(sortBy) {

        const sortDir = sortedType == `SortBy${sortBy}Asc` ? "desc" : "asc"

        if (sortDir == "asc") {
          setBuildings(buildings.sort((a, b) => b[sortBy].localeCompare(a[sortBy])));
          setSortedType(`SortBy${sortBy}Asc`);
        } else {
          setBuildings(buildings.sort((a, b) => a[sortBy].localeCompare(b[sortBy])));
          setSortedType(`SortBy${sortBy}Dsc`);
        }
    }

    function deleteAllBuildingsSelecteds(){
        if (filteredSelectedBuildings.length==0){
            toast.error('Error: debe seleccionar edificios para eliminar', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
                return
        }
    
        filteredSelectedBuildings.forEach( (id) => {
            deleteBuilding(id)
        } )
    }

    const filteredBuildings = buildings.filter((building) =>
        building.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredSelectedBuildings = selectedBuildings.filter((buildingId) => filteredBuildings.map((building) => building.uuid).includes(buildingId) )
    
    function handleSubmit(event) {
        event.preventDefault();
    
        toast.promise(
        () => modifyBuild(),
          {
            pending: 'Modificando edificio',
            success: 'Edificio modificado correctamente 👌',
            error: 'Hubo un error al modificar el edificio 🤯'
          }
        ).then(() => {
            setSelectedBuildings([]);
            archytecstApi.getBuildings().then(buildings => setBuildings(buildings)); // TODO: pido la lista devuelta o solo la actualizo localmente
        }).then(() => setModify(false));
        
      }


    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    /**
     * 
     * @param {String} uuid 
     * @returns {Building}
     */
    function getBuilding(uuidS)  {
        return buildings.find(({uuid} ) => uuid== uuidS)
    } 

    const modifyBuild = () =>{
        const building = getBuilding( selectedBuildings[0])

        building.setName(event.target.elements.buildName.value)
        building.setArchitect(event.target.elements.buildArchitect.value)
        building.setState(event.target.elements.buildState.value)
        
        return archytecstApi.putBulding(building)
          
      }
    return(
        <div className="main-dashBoard">
            <div className="centeredElements">
                <div className="titleContainer">
                    <h1>Panel de control</h1>
                </div>
                <br />
                
                <div className="optionsContainer">
                    <Button onClick={() => deleteAllBuildingsSelecteds()}> Eliminar </Button> 
                    <Button  disabled={selectedBuildings.length!=1 } onClick={() => setModify(!modify)}> Modificar </Button> 
                    <input placeholder="Nombre del edificio" onChange={handleInputChange}/>
                </div> 
           
            </div>
            <div>
                {selectedBuildings.length==1 && 
                < div className={"tableContainer"} style={{ transform: modify?``:`translateX(${-window.screen.width}px)`  }} >
                    <form onSubmit={handleSubmit}>
                        <label>Nombre</label>
                        <Input id="buildName" placeholder="Ingrese nombre" defaultValue={getBuilding(selectedBuildings[0]).name}/> <br/><br/>
                        <label>Arquitecto</label>
                        <Input id="buildArchitect" placeholder="Ingrese arquitecto" defaultValue={getBuilding(selectedBuildings[0]).architect}/><br/><br/>
                        <label>Estado</label>
                        <Input id="buildState" placeholder="Ingrese estado"  defaultValue={getBuilding(selectedBuildings[0]).state}/><br/><br/>
                        <Button onClick={(e)=> {e.preventDefault(); setModify(false)}} >Volver</Button>
                        <Button type="send" className="right">Aplicar cambios</Button>
                    </form>
                </div>}
                
                
                <div className={"tableContainer"} style={{ transform: modify?`translateX(${window.screen.width}px)`:''  }} >
                    <p className="buildingIndicator">Edificios seleccionados: {filteredSelectedBuildings.length}/{filteredBuildings.length} </p>
                    <Table>
                        <tbody>
                            <tr> 
                                {columns.map( (column) =>
                                    <th key={column.field} onClick={() => toggleSort(column.field)} className={sortedType.includes(column.field)?'thSelected':''} >{column.label}</th>
                                )}
                            </tr>
                            {filteredBuildings.map((building) => 
                            <tr key={building.uuid} onClick={()=> toggleBuild(building.uuid)}  className={selectedBuildings.includes(building.uuid) ? "tr-selected" : ""}   >
                                {columns.map( (column) =>
                                    <td key={column.field}>{building[column.field]}</td>
                                )}
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}