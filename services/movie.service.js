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
        var uniqid = require('uniqid'); // @mkcode
        var images = require("images"); //@mkcode

class MovieService {

    import(title,path,mainpath,metajson) {    

     var file = path,filename =''; 
      if (file != undefined)
      {       
    
      if (file.indexOf('/')> 0)
      {
            filename = file.split('/')[file.split('/').length-1]
      }
      else { filename = file.split('\\')[file.split('\\').length-1]}     

          }
            console.log('filename:'+filename);
            console.log('title:'+title);

          movieRepository.CheckMovieExists(title, filename)
          .then(movie => {       
              //console.log('checked movie status:'+JSON.stringify(movie));              
              if (!movie.success) {
                  this._addMovie(title,path,mainpath,metajson);
                 
              } 
              
              //else if (movie.movie !== path || !movie.description) {
                 // this._updateMovie(movie, path);
             // }
          })
          .catch(err => {
              // logger.error(error);
              console.log(err);
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


    _addMovie(title,path, mainpath,metajson) {       
               logger.error('Request _addMovie : '+ title);
        //winston.info('Request _addMovie : '+ title);
           console.log('Saving data:--'+metajson);
               
            
              let newMovie = this._mapMovieObjectnew({},metajson);
             //Add Home Movies category when no description found by api
              if (newMovie.genres =='')
              {
                  var homeMovies = "Home Movies";
                  newMovie.genres = homeMovies.split(',');
              }
               newMovie.file = path;
              // newMovie.vttfile =path.replace('.mpd', '.vtt'); 

                  // newMovie.poster = joinPath('E:/Movies/'+title, '/poster.jpg');
                  // newMovie.backdrop = joinPath('E:/Movies/'+title, '/backdrop.jpg');
                  //newMovie.poster = joinPath(mainpath+'/'+title, '/poster.jpg');
                  // newMovie.backdrop = joinPath(mainpath+'/'+title, '/backdrop.jpg');

                  settingsService.getDirectoryPath('posters').then(setting=> {
                    var poster='/'+uniqid()+'.jpg';
                    var backdrop='/'+uniqid()+'.jpg';
                    newMovie.poster = joinPath(setting, poster);
                    var posterimgpath=joinPath(mainpath+'/'+title, '/poster.jpg');
                    var backdropimgpath= joinPath(mainpath+'/'+title, '/backdrop.jpg');
                  settingsService.getDirectoryPath('backdrops').then(setting=> {     

                  newMovie.backdrop = joinPath(setting, backdrop);
                
                  movieRepository.save(newMovie);                  
                      this._processBackdropAndPoster(poster,posterimgpath,backdrop,backdropimgpath);
                  });
              });
               // newMovie.poster = pathposter;
              // newMovie.backdrop =pathbackdrop;

               // movieRepository.save(newMovie);  
             
    }

    _mapMovieObjectnew(movie,metajson){  
        
            // console.log('map movie new');
                movie.title =metajson.title;
                movie.released = metajson.released;
                movie.runtime = metajson.duration+' min';
                movie.description = metajson.description;
                movie.genres= metajson.genres;
                movie.cast=metajson.cast;
                //movie.rated = "R";
               // movie.rating = "7.0";
               // movie.director = "Robert Stromberg";
               // movie.writer ="Linda Woolverton (screenplay)";
               // movie.imdbid = "tt1587311";
                  return movie;
         
                
    }
          
    
   /* _mapMovieObject(movie, data,pathmeta){
      console.log('map movie old');
       fs.readFile(pathmeta, 'utf8', function (err, result) {
          if (err) throw err;
          console.log('map movie old inside');
          var oldobj = JSON.parse(result);
                movie.title =oldobj.title;
                movie.released = data.year;
                movie.runtime = oldobj.duration+' *min';
                movie.description = oldobj.description;
                movie.genres= oldobj.genres;
                movie.cast=oldobj.cast;
                movie.rated = data.rated;
                movie.rating = data.rating;
                movie.director = data.director;
                movie.writer = data.writer;
                movie.imdbid = data.imdbid;
                  return movie;
          });
       
    }*/

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
 _processBackdropAndPoster(poster,posterimgpath,backdrop,backdropimgpath) {
    
      //images("E:/Movies/Tere Naam/poster.jpg").save("E:/Movies/Tere Naam/output.jpg");
            if (poster!= null) {
             settingsService.getDirectoryPath('posters').then(setting=> {              
                    images(posterimgpath).save(joinPath(setting, poster));
              });
          }
        
              if (backdrop != null) {
                    settingsService.getDirectoryPath('backdrops').then(setting=> {
                        images(backdropimgpath).save(joinPath(setting, backdrop));
                  });
              }
       
    }
    /*_processBackdropAndPoster(posterAndBackdropPath) {
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
*/
    removeData(path){
movieRepository.removeRecord(path).then(()=> { return; });
    }

}

module.exports = new MovieService();