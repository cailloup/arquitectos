
/** 
 * @typedef {Object} Building
 * @property {string} architect
 * @property {string} city
 * @property {string} image
 * @property {string} isProtected
 * @property {string} lat
 * @property {string} location
 * @property {string} longitude
 * @property {string} name
 * @property {string} period
 * @property {string} state
 * @property {string} style
 * @property {string} type
 * @property {string} uuid
 */


const apiUrl='https://architectgallery.herokuapp.com/api/v1/'

export const BuildingAPI = {

    createBuilding: function(building,resolution) {
        const requestBody = JSON.stringify(building);
    
        fetch(`${apiUrl}building`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: requestBody,
          })
          .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
          })
          .then(data => {
            if(data.response == "Building added successfully."){
                return { success: true };
            }else{
                return { success: false };
            }
          })
          .then((data)=> resolution(data.success))
          .catch(error => {
            return { success: false, error: error.message };
          });
      },

      getBuildings: function(setBuildings) {
        fetch(`${apiUrl}buildings`)
            .then(response => response.json())
            .then(data => setBuildings(data.buildings))
            .catch(error => console.error(error));
      },

      deleteBuilding: function(id) {//TODO
        return fetch(`${apiUrl}building/${id}`, {
            method: 'DELETE'
          })
          .then(response => {
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
          })
          .catch(error => {
            return { success: false, error: error.message };
          });
      },

      putBuilding: function(id, building) { //TODO
        const requestBody = JSON.stringify(building);
    
        return fetch(`${apiUrl}building/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: requestBody,
          })
          .then(response => {
            if (response.ok) {
                return { success: true };
            } else {
                throw new Error('Ocurrió un error al enviar la solicitud.');
            }
          })
          .catch(error => {
            return { success: false, error: error.message };
          });
      }

}