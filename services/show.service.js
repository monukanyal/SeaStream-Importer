'use strict';

const request = require('request'),
      API_KEY = '3826993d2b0fe69554800426868bb782',
      https = require('https'),
      imdb = require('imdb-api'),
      db = require('../db'),
       imdbService = require('./imdb.service'),
       imageService = require('./image.service'),
        movieService = require('./movie.service'),
          showRepository = require('../repositories/show.repository'),
		  joinPath = require('path.join'),	  
            settingsService = require('./setting.service');
var logger = require('./logger.service');

class ShowService {
	_mapMovieObject(movie, data) {
		movie.title = data.title;
		movie.released = data.year;
		movie.runtime = data.runtime;
		movie.description = data.description;
		movie.genres = data.genres;
		movie.cast = data.cast;
		movie.rated = data.rated;
		movie.rating = data.rating;
		movie.director = data.director;
		movie.writer = data.writer;
		movie.imdbid = data.imdbid;
		movie.season = data.season;
		movie.episode = data.episode;
		movie.seriesid = data.seriesid;
		movie.tvid = data.tvid;
		movie.backdrop = data.backdrop;
		movie.poster = data.poster;
		return movie;
	}
save(show, path, season) {  
			var newshowID = '';
		let newMovie = this._mapMovieObject({}, show);
		newMovie.file = path;
		newMovie.vttfile = newMovie.file.replace('.mp4', '.vtt');
		settingsService.getDirectoryPath('posters').then(setting => {
newMovie.poster='';
			if (show.backdrop != null){
	newMovie.poster = joinPath(setting,show.poster);
			}
			settingsService.getDirectoryPath('backdrops').then(setting => {

newMovie.backdrop='';
			if (show.backdrop != null){
	   newMovie.backdrop = joinPath(setting,show.backdrop);
			}
				showRepository.save(newMovie).then(newshow => {
					//newshowID = newshow._id;
					var response = { poster_path: show.poster, backdrop_path: show.backdrop };
				
				movieService._processBackdropAndPoster(response);
					movieService._processCast(newMovie.cast);				
					//Seasons			
					this.getSeasons(newshow, path, season);

				});

			});
		});



		// movieRepository.getByTitle(title)
		//   .then(movie => {            
		//       if (movie.statusCode == 404) {
		//           this._addMovie(title, path);
		//       } else if (movie.movie !== path || !movie.description) {
		//           this._updateMovie(movie, path);
		//       }
		//   })
		//   .catch(err => {
		//       // logger.error(error);
		//      // console.log(err);
		//   });

	}

	getShowInfoByTitle(showObj, path) {
		var title = showObj.show;
		 logger.error('Request getShowInfoByTitle '+ title + "!"+ path);

		return new Promise((resolve, reject) => {
			imdbService.getMetadata(title, 'series')
				 .then(show => {
				 	if (show) {
				 		imdbService.getMetadataFromTmdb(show.imdbid).then(showInfo => {	
				 			if (showInfo != null) {
					
				 				let showNewObj = {
				 					title: show.title,
				 					released: show._year_data,
				 					runtime: show.runtime,
				 					description: show.plot,
				 					genres: [],
				 					cast: [],
				 					rated: show.rated,
				 					rating: show.rating,
				 					director: show.director,
				 					writer: show.writer,
				 					imdbid: show.imdbid,
				 					poster: show.poster,
				 					season: showObj.season,
				 					episode: showObj.episode,
				 					seriesid: show.seriesid
				 				};
				 				showNewObj.genres = show.genres.split(', ');
				 				showNewObj.cast = show.actors.split(', ');
				 				showNewObj.tvid = showInfo.id;
				 				showNewObj.backdrop = showInfo.backdrop_path;
				 				showNewObj.poster = showInfo.poster_path;
				 				showNewObj.description = showInfo.overview;
								 showNewObj.file = path;
				 				resolve(showNewObj);
								}
				 		})
									.catch( () =>{
										let showInfo = {
				 			title: title,
				 			file: path,
				 			season: showObj.season,
				 			episode: showObj.episode,
				 			genres: ["Home Shows"]
				 		};
				 		resolve(showInfo);
									} );

				 	}
				 	else {
				 		let showInfo = {
				 			title: title,
				 			file: path,
				 			season: showObj.season,
				 			episode: showObj.episode,
				 			genres: ["Home Shows"]
				 		};
				 		resolve(showInfo);
				 	}
				 })
				 		.catch( () =>{
										let showInfo = {
				 			title: title,
				 			file: path,
				 			season: showObj.season,
				 			episode: showObj.episode,
				 			genres: ["Home Shows"]
				 		};
				 		resolve(showInfo);
									} );;
		});
	}

	getSeasons(show, path,season_num) {
		 logger.error('Request getSeasons '+ show.tvid + "!"+ path);
		imdbService.getSeasonsDataFromTmdb(show.tvid).then(showSeasons => {
			if (showSeasons) {
			var seasons = [];
				settingsService.getDirectoryPath('posters').then(setting => {
					for (var i = 0; i < showSeasons.length; i++) {
	
						if (showSeasons[i].season_number==season_num)
						{
									var newposter ="";					
							if (showSeasons[i].poster_path != null){
							newposter = joinPath(setting , showSeasons[i].poster_path);
							}
							let season = {
							season: showSeasons[i].season_number,
							poster: newposter,
							showid: show._id,
							id: showSeasons[i].id
						}

						var response = { poster_path: showSeasons[i].poster_path, backdrop_path: '' };
						movieService._processBackdropAndPoster(response);					
						seasons.push(season);
						showRepository.saveSeasons(seasons).then(() => {							
						showRepository.getSeasonByShowInfo(show._id, show.season).then(season => {
							if (season != null)
							{								
							this.getEpisode(show, season._id, path);
							}
							
						});
					});
						}
					}
				});
			}
		});
	}

getEpisode(showObj, seasonid, path) {
							logger.error('Request getEpisode '+ showObj.title + "!"+ path);
		imdbService.getMetadata(showObj.title, "series")
			.then(show => {		
				if (show) {					
					show.episodes((err, moreThings) => {							
						var imdbid = '';
						var isEpisodeExists = false;
						for (var i = 0; i < moreThings.length; i++) {
													if (moreThings[i].season == showObj.season && moreThings[i].episode == showObj.episode) {
								isEpisodeExists = true;
								imdbid = moreThings[i].imdbid;
							imdb.getById(imdbid, (err, showimdb) => {
							
									if (err || !showimdb) {									
										var newMovie = {
											title: showObj.title,
											file: path,
											season: showObj.season,
											episode: showObj.episode,
											genres: ["Home Shows"]
										};
										showRepository.save(newMovie);
									//	reject(err);
									} else {
								imdbService.getEpisodeDataFromTmdb(showObj.tvid, showObj.season, showObj.episode).then(showInfo => {
									if (showInfo) {
										settingsService.getDirectoryPath('posters').then(setting => {
											settingsService.getDirectoryPath('backdrops').then(setting2 => {

												let showNewObj = {
													title: showimdb.title,
													released: showimdb._year_data,
													runtime: showimdb.runtime,
													description: showimdb.plot,
													genres: [],
													cast: [],
													rated: showimdb.rated,
													rating: showimdb.rating,
													director: showimdb.director,
													writer: showimdb.writer,
													imdbid: showimdb.imdbid,
													poster: showimdb.poster,
													season: showimdb.season,
													episode: showimdb.episode,
													seriesid: showimdb.seriesid
												};
												showNewObj.genres = showimdb.genres.split(', ');
												showNewObj.cast = showimdb.actors.split(', ');
												showNewObj.tvid = showInfo.id;
												if (showInfo.still_path == undefined && showInfo.still_path == null){
													showInfo.still_path="";
												}
												
												showNewObj.backdrop = joinPath(setting2,showInfo.still_path);
												showNewObj.poster = joinPath(setting,showInfo.still_path);
												
												showNewObj.description = showInfo.overview;
												showNewObj.seasonid = seasonid;
												
												
												showNewObj.file = path;
												showNewObj.vttfile = path.replace('.mp4', '.vtt');
											
												var response = { poster_path: showInfo.still_path, backdrop_path: showInfo.still_path };
												showRepository.saveEpisode(showNewObj).then(() => {
												movieService._processBackdropAndPoster(response);
													movieService._processCast(showNewObj.cast);
												});

											});

										});
											}
										})
									}
								});

								break;
							}
						}

						if (!isEpisodeExists){
									var homeEpisodes = "Home Episodes";									
								var newEpisode = {
									title: showobj.title,
									file: path,
									genres : homeEpisodes.split(','),
									vttfile : path.replace('.mp4', '.vtt')
              						};
              showRepository.saveEpisode(newEpisode);
						}
					});

				}
			}).catch(()=> {  
				var homeEpisodes = "Home Episodes";
              var newEpisode = {
                  title: showobj.title,
                  file: path,
                  genres : homeEpisodes.split(','),
                  vttfile : path.replace('.mp4', '.vtt')
              };
              showRepository.saveEpisode(newEpisode);
                 });
	}
}

module.exports = new ShowService();