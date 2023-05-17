
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

const utils ={
  limitArea: function(position,radioKm){
    const bounds = {
      north: position.lat + radioKm/2 * 0.0089,
      south: position.lat - radioKm/2 * 0.0089,
      east: position.lng + radioKm/2 * 0.0089,
      west: position.lng - radioKm/2 * 0.0089 
    }
    return bounds
  },
  getPosition: function getPosition(building){
    return ({lat:parseFloat(building.lat),lng: parseFloat(building.longitude)})
  },
  getCounty: function (geocoder, selectedcounty,setCounty){
    const name = `Partido de ${selectedcounty.name}`
    geocoder.geocode({ address: name }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location
        const bounds = results[0].geometry.bounds
        const county = {
          name: name,
          location: location,
          paths: selectedcounty.paths,
          bounds: {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng(),
          },
          center:bounds.getCenter()
        }
        setCounty(county)
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    })
  }
}

const endPoints = {

    postBuilding: function(building) {
        return uploadImage(building.image)
        .then(url =>{
            const requestBody = JSON.stringify({...building,image:url});
    
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
                    return  'success';
                }else{
                    return  'error';
                }
              })
              .catch(error => {
                return { success: false, error: error.message };
              });
        } )   
      },

      getBuildings: function(setBuildings) {
        fetch(`${apiUrl}buildings`)
            .then(response => response.json())
            .then(data => setBuildings(data.buildings))
            .catch(error => console.error(error));
      },
      
      getBuildingsByCity: function(city,setBuildings) {
        const requestBody = JSON.stringify( {city:city} );
        fetch(`${apiUrl}buildings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        .then(response => response.json())
        .then(data => setBuildings(data.buildings)) 
        .catch(error => console.error(error));
      },

      deleteBuilding: function(id) {
        return fetch(`${apiUrl}buildings/${id}`, {
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

      putBuilding: function(id, building) { 
        const requestBody = JSON.stringify(building);
    
        fetch(`${apiUrl}buildings/${id}`, {
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
                return  'error';
            }
          })
          .catch(error => {
            return { success: false, error: error.message };
          });
      },
}

function uploadImage(image){
    const formData = new FormData();
    formData.append('image', image);

    return fetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(response => response.imageUrl)
      .catch(error => {
        return { success: false, error: error.message };
      });

  }

  export const BuildingAPI ={
    endPonts:endPoints,
    utils:utils
  }