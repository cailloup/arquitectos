"use client"
import { useState,useEffect } from "react"
import { BuildingAPI,Building } from "@/apis/archytectApi"
import {toast,ToastContainer} from "react-toastify"
import LoadScreen from "@/components/LoadScreen"
import styles from '@/styles/pages/dashBoard.module.css' 
import "react-toastify/dist/ReactToastify.css";
export default function DashBoard(){ 
    const [buildings,setBuildings] = useState((/** @type [Building] */ [])) 
    const [selectedBuildings,setSelectedBuildings] = useState([]) 
    const [sortedType,setSortedType] = useState('')
    const [searchValue, setSearchValue] = useState("");
    
    useEffect(() => { //onPageLoad
        BuildingAPI.endPonts.getBuildings(setBuildings)
    }, []);

    function deleteBuilding(id) {

        toast.promise(
            () => BuildingAPI.endPonts.deleteBuilding(id),
            {
              pending: 'Eliminando edificio',
              success: 'Edificio eliminado correctamente 👌',
              error: 'Hubo un error al eliminar el edificio 🤯'
            }
          ).then(() => {
            BuildingAPI.endPonts.getBuildings(setBuildings); // TODO: pido la lista devuelta o solo la actualizo localmente

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
            toast.error('Error: debe seleccionar edificios para eleminar', {
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
        building.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );

    const filteredSelectedBuildings = selectedBuildings.filter((buildingId) => filteredBuildings.map((building) => building.uuid).includes(buildingId) )
    
    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    if(!buildings) return <LoadScreen/>
    return(
        <main className={styles.main}>
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
          <div className="centeredElements">
                <div className={styles.titleContainer}>
                    <h1>Panel de control</h1>
                </div>
                <br />
                
                <div className="optionsContainer">
                    <button className="adminButton"  onClick={() => deleteAllBuildingsSelecteds()}> Eliminar </button> 
                    <button className="adminButton" onClick={() => alert("Hay que esperar a que marcelo traiga la freature de miami")}> Modificar </button> 
                    <input placeholder="Nombre del edificio" onChange={handleInputChange}/>
                </div>

                <p className="buildingIndicator">Edificios seleccionados: {filteredSelectedBuildings.length}/{filteredBuildings.length} </p>
                <hr/>
            </div>
            <div className={"tableContainer"}>
                <table>
                    <tbody>
                        <tr>
                            <th onClick={() => toggleSort("name")} className={sortedType.includes("name")?'thSelected':''} >Nombre</th>
                            <th onClick={() => toggleSort("location")} className={sortedType.includes("location")?'thSelected':''} >Direccion</th>                                       
                            <th onClick={() => toggleSort("architect")} className={sortedType.includes("architect")?'thSelected':''} >Arquitecto</th>
                            <th onClick={() => toggleSort("city")} className={sortedType.includes("city")?'thSelected':''} >Localidad</th>
                        </tr>
                        {filteredBuildings.map((building) => 
                        <tr key={building.uuid} onClick={()=> toggleBuild(building.uuid)}  className={selectedBuildings.includes(building.uuid) ? "tr-selected" : ""}   >
                            
                            <td>{building.name}</td>
                            <td>{building.location}</td>
                            <td>{building.architect}</td>
                            <td>{building.city}</td>
                            
                        </tr>
                        )}
                        
                    </tbody>
                </table>
            </div>
            
        </main>
    )
}