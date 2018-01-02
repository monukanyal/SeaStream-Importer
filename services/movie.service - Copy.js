'use strict';

const request = require('request'),
      fs = require('fs'),
      joinPath = require('path.join'),
      imdb = require('imdb-api'),
      imdbService = require('./imdb.service'),
      imageService = require('./image.service'),
      movieRepository = require('../repositories/movie.repository'),
        settingsService = require('../services/setting.service');
var logger = require('./logger.service');


class MovieService {

    import(title, path) {    

 var file = path,
      filename ='';
     
      if (file != undefined)
      {       
    
      if (file.indexOf('/')> 0)
      {
 filename = file.split('/')[file.split('/').length-1]
      }
      else { filename = file.split('\\')[file.split('\\').length-1]}     

          }

               movieRepository.CheckMovieExists(title, filename)
          .then(movie => {                     
              if (!movie.success) {
                  this._addMovie(title, path);
              } 
              
              //else if (movie.movie !== path || !movie.description) {
                 // this._updateMovie(movie, path);
             // }
          })
          .catch(err => {
              // logger.error(error);
             // console.log(err);
          });
    }

getDirectoryPath(name){   
              settingsRepository.getFolderPathByTitle('movies')
              .then(setting => {
                  return setting.folderPath;
                       })
          .catch(err => {
              // logger.error(error);
              //console.log(err);
          });
          }

    _addMovie(title, path) {       
               logger.error('Request _addMovie : '+ title);
        //winston.info('Request _addMovie : '+ title);
        console.log('start add movie path:'+path);
        imdbService.getMetadata(title, 'movie')
          .then(data => {             
              let newMovie = this._mapMovieObject({}, data);
           //Add Home Movies category when no description found by api
              if (newMovie.genres =='')
              {
                  var homeMovies = "Home Movies";
                  newMovie.genres = homeMovies.split(',');
              }
                //console.log("let passed");
                newMovie.file = path;
                 newMovie.vttfile = path.replace('.mp4', '.vtt');
                            imageService.getPosterAndBackdropPath(newMovie.imdbid, 'movies')
                .then(response => {                  
                         
                	settingsService.getDirectoryPath('posters').then(setting=> {
  newMovie.poster='';
                          if (response.poster_path != null) {
                           
		                newMovie.poster = joinPath(setting, response.poster_path);
                       
                          }

                                       settingsService.getDirectoryPath('backdrops').then(setting=> {     

                                     newMovie.backdrop ='';
                                             if (response.poster_path != null) {
		             newMovie.backdrop = joinPath(setting , response.backdrop_path);
                          }  
                    movieRepository.save(newMovie);                  
                    this._processBackdropAndPoster(response);
                     });});
                });

              this._processCast(newMovie.cast);
          })
          .catch(() => {             
              imdbService.getMetadataFromTmdbByTitle(title)
          .then(data => {   
imdbService.getImdbIdromTvId(data.id).then(tmdpInfo=> {

 imdbService.getMetadatabyId(tmdpInfo.imdb_id).then(info=> {

 let newMovie = this._mapMovieObject({}, info);

  var homeMovies = "Home Movies";   
//   var newMovie = {
//                   title: title,
//                   file: path,
//                   genres : homeMovies.split(','),
//                   description :info.overview
//               };

 newMovie.file = path;
 newMovie.description=tmdpInfo.overview;
                 newMovie.vttfile = path.replace('.mp4', '.vtt');
                 

                       	settingsService.getDirectoryPath('posters').then(setting=> {      
 newMovie.poster = '';
                                if (tmdpInfo.backdrop_path != null)          
                               {
 newMovie.poster = joinPath(setting, tmdpInfo.poster_path);
                               }	
		               
                                       settingsService.getDirectoryPath('backdrops').then(setting=> {

                                            newMovie.backdrop = '';

                                if (tmdpInfo.backdrop_path != null)          
                               {
	newMovie.backdrop = joinPath(setting,tmdpInfo.backdrop_path);  
                               }
                                                           
                    
                   var response = { poster_path: tmdpInfo.poster_path, backdrop_path: tmdpInfo.backdrop_path };
                   
                    movieRepository.save(newMovie);                  
                    this._processBackdropAndPoster(response);
                     });});

this._processCast(newMovie.cast);

              });

});   
                          
                 }).catch(()=> {
  var homeMovies = "Home Movies";
                
              var newMovie = {
                  title: title,
                  file: path,
                  genres : homeMovies.split(','),
                  vttfile : path.replace('.mp4', '.vtt')
              };
              movieRepository.save(newMovie);
                 });

             //Add Home Movies category when no description found by api           
                
          });
    }

    _mapMovieObject(movie, data){
        movie.title = data.title;
        movie.released = data.year;
        movie.runtime = data.runtime;
        movie.description = data.plot;
        movie.genres = data.genres.split(', ');
        movie.cast = data.actors.split(', ');
        movie.rated = data.rated;
        movie.rating = data.rating;
        movie.director = data.director;
        movie.writer = data.writer;
        movie.imdbid = data.imdbid;
        return movie;
    }

    _updateMovie(movie, path) {
        imdbService.getMetadata(movie.title, 'movie')
          .then(data => {
              this._mapMovieObject(movie, data);
              movie.file = path;
               movie.vttfile = path.replace('.mp4', '.vtt');
              imageService.getPosterAndBackdropPath(movie.imdbid, 'movies')
                .then(response => {
                     settingsService.getDirectoryPath('posters').then(setting=> {
                    movie.poster =joinPath(setting,response.poster_path);
                      settingsService.getDirectoryPath('backdrops').then(setting=> {
                      	movie.backdrop = joinPath(setting,response.backdrop_path);

                      	if (response.poster_path == '') {
                      		movie.poster = '';
                      		movie.backdrop = '';
                      	}

                    movieRepository.save(movie);
                    this._processBackdropAndPoster(response);
                      });
                     });
                });

              this._processCast(movie.cast);
          })
          .catch(() => {
              movie.file = path;
              movieRepository.save(movie);
          });
    }

    _processCast(cast){
    
    if (cast){
        cast.map(actor => {
            imageService.getActorImage(actor)
              .then(image => {
                   settingsService.getDirectoryPath('actors').then(setting=> {
                  fs.writeFile(joinPath(setting, actor + '.jpg'), image, 'binary', function (err) {
                      // todo: do something useful here (log error or something)
                  });
                   });
              });
        });
    }
    }

    _processBackdropAndPoster(posterAndBackdropPath) {
        imageService.getPosterImage(posterAndBackdropPath.poster_path)
        .then(image => {
            if (posterAndBackdropPath.poster_path!= null) {
             settingsService.getDirectoryPath('posters').then(setting=> {              

            fs.writeFile(joinPath(setting, posterAndBackdropPath.poster_path), image, 'binary', function (err) {
               
            });
        });
    }
        });
      imageService.getBackdropImage(posterAndBackdropPath.backdrop_path)
        .then(image => {
              if (posterAndBackdropPath.backdrop_path != null) {
              settingsService.getDirectoryPath('backdrops').then(setting=> {
            fs.writeFile(joinPath(setting, posterAndBackdropPath.backdrop_path), image, 'binary', function (err) {
              
            });
              });
              }
        });
    }

    removeData(path){
movieRepository.removeRecord(path).then(()=> { return; });
    }

}

module.exports = new MovieService();