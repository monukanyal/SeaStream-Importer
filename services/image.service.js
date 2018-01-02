const request = require('request'),
      API_KEY = '3826993d2b0fe69554800426868bb782',
      https = require('https');
      var logger = require('./logger.service');

class ImageService {
  getActorImage(name) {
    logger.error('Request getActorImage '+ name);
    return new Promise((resolve, reject) => {
      request.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${name}`, (error, response, body) => {
        if (error) {
          logger.error('Response getActorImage  error'+ JSON.stringify(error));
          // todo: handle the error
          reject(error);
        }
else {
   // todo: what if there are multiple results?
  try
   {     
    
        var bodyAsObject = JSON.parse(body);    
           logger.error('Response getActorImage  data'+ JSON.stringify(bodyAsObject));

        if (bodyAsObject.results != undefined){       
        var actor = bodyAsObject.results[0];
        if (actor != undefined && actor !=[])
        {
           if (actor.profile_path != undefined)
        {

        https.get(`https://image.tmdb.org/t/p/w300_and_h450_bestv2${actor.profile_path}`, function (profileResponse) {
          var image_data = '';
          profileResponse.setEncoding('binary');

          profileResponse.on('data', function (chunk) {
            image_data += chunk
          });

          profileResponse.on('end', function () {
            resolve(image_data)
          });
        });}  else { resolve();}
        }  else { resolve();}
         }
         else { resolve();}
}catch(ex) { resolve();}
}
     
      });
    });
  }

  getBackdropImage(backdropPath) {
       return new Promise((resolve, reject) => {
      https.get(`https://image.tmdb.org/t/p/w500${backdropPath}`, function (backdropResponse) {
        var image_data = '';
      
      try{
          backdropResponse.setEncoding('binary');

        backdropResponse.on('data', function (chunk) {
          image_data += chunk
        });

        backdropResponse.on('end', function () {
          resolve(image_data)
        });

      }
      catch(e){ reject(e)}
      
      }).on('error', function () {
          reject()
        });    
     
    });
  }

  getPosterImage(posterPath) {    

    return new Promise((resolve, reject) => {
      https.get(`https://image.tmdb.org/t/p/w342${posterPath}`, function (posterResponse) {
        var image_data = '';

        try{
        posterResponse.setEncoding('binary');      

        posterResponse.on('data', function (chunk) {
          image_data += chunk
        });

        posterResponse.on('end', function () {
          resolve(image_data);
        });

        }
        catch(e){ reject(e)}

      }).on('error', function () {
          reject()
        }); 
    });
  }

  getPosterAndBackdropPath(imdbid, type) {
  
     logger.error('Request getPosterAndBackdropPath '+ imdbid);

  	return new Promise((resolve, reject) => {
      request.get(`https://api.themoviedb.org/3/find/${imdbid}?api_key=${API_KEY}&language=en-US&external_source=imdb_id`, (error, response, body) => {
        
         var backdropPath = "", posterPath = "";
       try
   {  
     var responseAsObject = JSON.parse(body);
         

        if (type == 'movies'){
        	if (responseAsObject.movie_results != [] && responseAsObject.movie_results != undefined)
          {
 var movie = responseAsObject.movie_results[0];
       logger.error('Request getPosterAndBackdropPath data '+ movie);
        if (movie != null){
                   if (movie.poster_path != undefined) 
              posterPath = movie.poster_path;
         
          if (movie.backdrop_path != undefined)
         backdropPath = movie.backdrop_path;
        }
          }
      }
      else if (type == 'episode')
      {
      	if (responseAsObject.tv_episode_results != [] && responseAsObject.tv_episode_results != undefined)
          {

         var episode = responseAsObject.tv_episode_results[0];
         
if (episode != null){
                   if (episode.still_path != undefined) 
              posterPath = episode.still_path;         
        //   if (movie.backdrop_path != undefined)
        //  backdropPath = movie.backdrop_path;
        }
      }}
   }catch(ex){ reject(ex)}
        resolve({ poster_path: posterPath, backdrop_path: backdropPath });
      }).on('error', function () {
          reject()
        }); 
    });
  }

}

module.exports = new ImageService();