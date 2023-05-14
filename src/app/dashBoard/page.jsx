"use client"
import { useState,useEffect } from "react"
import { BuildingAPI,Building } from "@/apis/archytectApi"
import {toast,ToastContainer} from "react-toastify"
import LoadScreen from "@/components/LoadScreen"
import styles from '../../styles/pages/DashBoard.module.css'
import "react-toastify/dist/ReactToastify.css";
export default function DashBoard(){
    const [buildings,setBuildings] = useState((/** @type [Building] */ (null))) 
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
            console.log("actualizando edificios");
            BuildingAPI.endPonts.getBuildings(setBuildings); // TODO: pido la lista devuelta o solo la actualizo localmente

          });

    }

    if(!buildings) return <LoadScreen/>
    return(
        <main className={styles.main}>
             <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
            <div className={styles.titleContainer}>
                <h1>Panel de control</h1>
            </div>
            <br />
            
            
            <div className={"tableContainer"}>
                <table>
                    <tbody>
                        <tr>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Arquitecto</th>
                            <th>Localidad</th>
                            <th>Accion</th>
                        </tr>
                        {buildings&& buildings.map((building) => 
                        <tr key={building.uuid}>
                            
                            <td>{building.name}</td>
                            <td>{building.location}</td>
                            <td>{building.architect}</td>
                            <td>{building.city}</td>
                            <td>
                                <div className="buttonsContainer">
                                    <button className="adminButton" id={building.uuid} onClick={() => deleteBuilding(building.uuid)}> eliminar </button> 
                                    <button className="adminButton"> modificar </button> 
                                </div>
                                
                            </td>
                            
                        </tr>
                        )}
                        
                    </tbody>
                </table>
            </div>
            
        </main>
    )
}