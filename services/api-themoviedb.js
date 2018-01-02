 
//"use strict"
const _ = require('lodash'),
    Boom = require('boom'),
     request = require('request'),
      API_Key = '3826993d2b0fe69554800426868bb782',
    apikey ="f853e223";

  class ApiTheMovie {


moviedetail(title)
      {
          return new Promise((resolve, reject) => {  
            //https://api.themoviedb.org/3/search/movie?api_key='+ API_Key+ '&query='+ title
            
          request.get('http://www.omdbapi.com/?t='+title+'&apikey='+apikey+'&Type=movie', (error, response, body) => {
            if (error) {               
            reject(error);
            }
            else {  
            var bodyAsObject = JSON.parse(body);   
            resolve(bodyAsObject);                   
          /* if (bodyAsObject.results != undefined && bodyAsObject.results != []) {
            var namelist = bodyAsObject.results;            

            resolve(namelist);

            } 
            else { resolve();} */
            }
            });
          });
      }
    
}

module.exports = ApiTheMovie ;

