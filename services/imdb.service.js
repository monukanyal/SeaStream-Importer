const imdb = require('imdb-api'),
	request = require('request'),
API_KEY = '3826993d2b0fe69554800426868bb782',
		 https = require('https');
var logger = require('./logger.service');

class ImdbService {
    getMetadata(title, type) {
      //console.log("getMetadata : " + title);
           return new Promise((resolve, reject) => {
        imdb.getReq({ name: title, type : type }, (err, data) => {   
        if (err) {
 logger.error('Response  getMetadata Err  : '+ JSON.stringify(err));			
          // todo: log the error here?
         // console.log('error handled in imdbService: ', err);
           reject(err);
        }
		else { 	logger.error('Response  getMetadata data  : '+ JSON.stringify(data));
		resolve(data);}
        
      });
    });
  }

	 getMetadatabyId(id) {	
		 logger.error('Request  getMetadatabyId   : '+ id);

           return new Promise((resolve, reject) => {
        imdb.getReq({ id: id }, (err, data) => {  
        if (err) {        
		 logger.error('Response  getMetadatabyId Err  : '+ JSON.stringify(err));
           reject(err);
        }
		else {

		 logger.error('Response  getMetadatabyId data  : '+ JSON.stringify(data));
         resolve(data);
		}

      });
    });
  }

	 getMetadataFromTmdbByTitle(title) {

		  logger.error('Request  getMetadataFromTmdbByTitle  : '+ title);

         return new Promise((resolve, reject) => {
    			request.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${title}`, (error, response, body) => {
    		    				if (error) {
									logger.error('Response  getMetadataFromTmdbByTitle error  : '+ JSON.stringify(error));
    					reject(error);
    				}
					else {	

						try{
	var bodyAsObject = JSON.parse(body); 

						logger.error('Response  getMetadataFromTmdbByTitle data  : '+ JSON.stringify(bodyAsObject));

					    				if (bodyAsObject.results != undefined && bodyAsObject.results != []) {
    					var movieDetails = bodyAsObject.results[0];						

					    resolve(movieDetails);
    				}
    				else { resolve();}
					}catch(ex){resolve();}
					}
						
					
    			});
    		});
  }

	 getImdbIdromTvId(tvid) {		
		 	logger.error('Request  getImdbIdromTvId tvid : '+ tvid);
         return new Promise((resolve, reject) => {					
    			request.get(`https://api.themoviedb.org/3/movie/${tvid}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    		
    				if (error) {
						logger.error('Response  getImdbIdromTvId error  : '+ JSON.stringify(error));
    					reject(error);
    				}
					else {

						try{
						var bodyAsObject = JSON.parse(body);    
							logger.error('Response  getImdbIdromTvId data  : '+ JSON.stringify(bodyAsObject));
							
										    				if (bodyAsObject != undefined && bodyAsObject != []) {
    					var movieDetails = bodyAsObject;
					    resolve(movieDetails);
    				}
    				else { resolve();}}catch(ex){resolve();}
					}

						
    			});
    		});
  }

  

    getMetadataFromTmdb(imdb_id) {

			logger.error('Request  getMetadataFromTmdb imdb_id : '+ imdb_id);

   return new Promise((resolve, reject) => {
    			request.get(`https://api.themoviedb.org/3/find/${imdb_id}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`, (error, response, body) => {
    		
    				if (error) {
						logger.error('Response  getMetadataFromTmdb error  : '+ JSON.stringify(error));
    					reject(error);
    				}					
					else {
							try{

						
							var bodyAsObject = JSON.parse(body);      
								logger.error('Response  getMetadataFromTmdb data  : '+ JSON.stringify(bodyAsObject));
					    				if ((bodyAsObject.tv_results != undefined && bodyAsObject.tv_results != [])  || (bodyAsObject.movie_results != undefined && bodyAsObject.movie_results != [])) {
    				
						if (bodyAsObject.tv_results != undefined && bodyAsObject.tv_results != [])
						{	var tvShowDetails = bodyAsObject.tv_results[0];
 resolve(tvShowDetails);
						}

						else if  (bodyAsObject.movie_results != undefined && bodyAsObject.movie_results != []){
var tvShowDetails = bodyAsObject.movie_results[0];
 resolve(tvShowDetails);
						}
						else {
							resolve();
						}
					   
    				}
    				else { resolve();}

						}catch(ex){
resolve();
							}
					}

					
    			});
    		});
    }

    getSeasonsDataFromTmdb(tvid) {

		logger.error('Request  getSeasonsDataFromTmdb tvid : '+ tvid);


    	return new Promise((resolve, reject) => {
    	request.get(`https://api.themoviedb.org/3/tv/${tvid}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    			if (error) {
    				// todo: handle the error
					logger.error('Response  getSeasonsDataFromTmdb data  : '+ JSON.stringify(bodyAsObject));
    				reject(error);
    			}

else {
		    if (body) {

				try {
		    	var bodyAsObject = JSON.parse(body);
				logger.error('Response  getSeasonsDataFromTmdb data  : '+ JSON.stringify(bodyAsObject));			
						if (bodyAsObject.seasons != undefined && bodyAsObject.seasons != []) {
    									    resolve(bodyAsObject.seasons);
    				}
else { logger.error('Response  getSeasonsDataFromTmdb no data   : '+ JSON.stringify(bodyAsObject)); resolve(); }
		   }
				catch(ex){resolve();}
		    }
    			else { resolve(); }

				
}
    	
    		});
    	});
    }

    getEpisodeDataFromTmdb(tvid, season, episode) {

			logger.error('Request  getEpisodeDataFromTmdb tvid  season episode : '+ tvid + "!"+ season + "!"+  episode );

    	return new Promise((resolve, reject) => {

    			request.get(`https://api.themoviedb.org/3/tv/${tvid}/season/${season}/episode/${episode}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    			if (error) {

					logger.error('Response  getEpisodeDataFromTmdb error  : '+ JSON.stringify(error));

    				// todo: handle the error
    				reject(error);
    			}
				else {
    			if (body) {

try {			var bodyAsObject = JSON.parse(body);

						logger.error('Response  getEpisodeDataFromTmdb data  : '+ JSON.stringify(bodyAsObject));

    				resolve(bodyAsObject);}catch(ex){
	resolve();
}
    	
    			}
    			else { resolve(null); }
				}

    		
    		});
    	});
    }


	  getEpisodesByImdbid(imdbid) {

    logger.error('Request  getEpisodesByImdbid imdbid : '+ imdbid );

    	return new Promise((resolve, reject) => {

    			request.get(`https://api.themoviedb.org/3/tv/${tvid}/season/${season}/episode/${episode}?api_key=${API_KEY}&language=en-US`, (error, response, body) => {
    			if (error) {

					logger.error('Response  getEpisodeDataFromTmdb error  : '+ JSON.stringify(error));

    				// todo: handle the error
    				reject(error);
    			}
				else {
    			if (body) {

try{

	
    				var bodyAsObject = JSON.parse(body);

						logger.error('Response  getEpisodeDataFromTmdb data  : '+ JSON.stringify(bodyAsObject));

    				resolve(bodyAsObject);}catch(ex){
	resolve(null);
}
    
    			}
    			else { resolve(null); }
				}

    		
    		});
    	});
  }
}

module.exports = new ImdbService();