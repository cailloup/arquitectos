import { assests } from "@/data/assest";
const apiUrl='https://bold-crow-384002.rj.r.appspot.com/api/v1/'

export default class ArchytecstApi {

    /**
     * Retrieves a list of buildings.
     * @returns {Promise<Building[]>} A promise that resolves with an array of Building objects.
     */
    getBuildings(){
        return  fetch(`${apiUrl}buildings`)
        .then(response => response.json())
        .then(data => {
            if(data?.error){
                throw data.error
            }
            return data.buildings.map( buildingData => new Building(buildingData) )
        })
        .catch(error => {throw error});
    }

    /**
     * Posts a building.
     * @param {buildingData} Object - The Building object to be posted.
     * @returns {Promise<String>} A promise that resolves with a success message upon successful posting.
     */
    postBuilding(buildingData){

        return postImage(buildingData.image)
                .then(url => {
                    const requestBody = JSON.stringify({...buildingData,image:url});
                    fetch(`${apiUrl}building`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: requestBody,
                    })
                    .then( response =>{
                        if(response.ok){
                            return response.json();
                        }else {
                            throw new Error('Ocurrió un error al enviar la solicitud.');
                        }
                    })
                    .then( data =>{
                        if(data.response == "Building added successfully."){
                            return  data.response;
                        }else{
                            throw data.response
                        }
                    })
                })
    }

    /**
     * Retrieves buildings by city.
     * @param {string} city - The city name.
     * @returns {Promise<Building[]>} A promise that resolves with an array of Building objects.
     */
    getBuildingsByCity(city){ 
        const requestBody = JSON.stringify( {city:city} );
        return fetch(`${apiUrl}buildings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        .then(response => response.json())
        .then (data => {
            if(data?.error){
                throw data.error
            }
            return data.buildings.map( buildingData => new Building(buildingData) )
        })
        .catch(error => {
            console.log(error);
            throw error
        })
    }

    /**
     * Deletes a building.
     * @param {Building} building - The building object to be deleted.
     * @returns {Promise<string>} A promise that resolves with a success message.
     */
    deleteBuilding(uuid) {
        return fetch(`${apiUrl}buildings/${uuid}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response?.ok) {
                return response;
            } else {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
          })
          .catch(error => {
            throw error;
          });
    }

    /**
     * Updates a building.
     * @param {Building} building - The building object to be updated.
     * @returns {Promise<string>} A promise that resolves with a success message.
     */
    putBulding(building){
        const requestBody = JSON.stringify(formatBuildingData(building));
    
        fetch(`${apiUrl}buildings/${building.uuid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: requestBody,
          })
          .then(response => {
            if (response.ok) {
                return  'success';
            }else{
                throw error
            }
          })
          .catch(error => {
            throw { success: false, error: error.message };
          });
    }

}

/**
 * Posts an image and returns the image URL.
 * @param {File} image - The image file to be posted.
 * @returns {Promise<string>} A promise that resolves with the URL of the posted image.
 */
function postImage(image){

    const formData = new FormData();
    formData.append('image', image);

    return fetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data =>{ 
        if(data?.error){
            throw error
        }
        return data.imageUrl
        }).catch(error => {throw error });

}

export class Building {
    /**
    * Represents a building object.
    * @class
    * @param {Object} buildingData - The data object containing the building information.
    * @param {string} buildingData.uuid - The UUID of the building.
    * @param {string} buildingData.name - The name of the building.
    * @param {string} buildingData.location - The city where the building is located.
    * @param {string} buildingData.lat - The latitude of the building's location.
    * @param {string} buildingData.longitude - The longitude of the building's location.
    * @param {string} buildingData.address - The address of the building.
    * @param {string} buildingData.image - The URL of the building's image.
    * @param {string} buildingData.period - The period of the building.
    * @param {string} buildingData.city - The city where the building is located.
    * @param {string} buildingData.architect - The architect of the building.
    * @param {string} buildingData.type - The type of the building.
    * @param {string} buildingData.state - The state of the building.
    * @param {string} buildingData.style - The style of the building.
    * @param {string} buildingData.isProtected - The protection status of the building.
    * @property {string} uuid - The UUID of the building.
    * @property {string} name - The name of the building.
    * @property {Object} location - The location coordinates of the building.
    * @property {number} location.lat - The latitude of the building's location.
    * @property {number} location.lng - The longitude of the building's location.
    * @property {string} address - The address of the building.
    * @property {string} image - The URL of the building's image.
    * @property {string} period - The period of the building.
    * @property {string} city - The city where the building is located.
    * @property {string} architect - The architect of the building.
    * @property {string} type - The type of the building.
    * @property {string} state - The state of the building.
    * @property {string} style - The style of the building.
    * @property {Object} isprotected - The protection status of the building.
    * @property {boolean} isprotected.state - The protection state of the building.
    * @property {string} isprotected.info - Additional information about the protection status.
    * @property {string} refColor - The reference color of the building based on its type.
    * @property {string} builtDate - The date of built.
    * @constructor
    */
    constructor(buildingData){
        this.uuid = buildingData.uuid
        this.name = buildingData.name
        this.location = { lat: parseFloat(buildingData.lat),lng: parseFloat(buildingData.longitude)}
        this.address = buildingData.location
        this.image = buildingData.image
        this.period = buildingData.period
        this.city = buildingData.city
        this.architect = buildingData.architect
        this.type = buildingData.type
        this.state = buildingData.state
        this.style = buildingData.style
        this.isProtected = { state: buildingData.isProtected== "true", info:"-"}
        this.refColor = assignColor(this.type)
        this.builtDate = buildingData.builtDate
    }
}

/**
 * Assigns a color hexadecimal value based on the type of building.
 * @param {string} type - The type of the building.
 * @returns {string} - The hexadecimal color value.
 */
export function assignColor(type){
    if (type === "Vivienda"){
        return assests.colors.orange
    }
    if (type === "Religioso"){
        return assests.colors.blue
    }
    if (type === "Publico"){
        return assests.colors.red
    }
    return assests.colors.puple 
}

function formatBuildingData({ image, period, city, name, architect, type, uuid, location, style, state, builtDate, isProtected }) {
    return {
        image,
        period,
        city,
        name,
        architect,
        type,
        uuid,
        longitude: location.lng.toString(),
        builtDate,
        isProtected: isProtected.state.toString(),
        location: address,
        style,
        state,
        lat: location.lat.toString()
    };
}