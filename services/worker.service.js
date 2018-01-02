'use strict';

const movieService = require('./movie.service'),
      showService = require('./show.service'),
      showRepository = require('../repositories/show.repository'),
      namedRegexp = require('named-regexp').named;
      var movie_title_cleaner = require('../title-cleaner');

class WorkerService {
  // returns "movie" or "episode" depending on the file name / title
  // episode example Castle(2009) S01 E01.mp4 // Castle(2009)S1E1.mp4
  getMediaType(title) {
    if (/[sS]\d{1,2}/gi.test(title) && /[eE]\d{1,2}/gi.test(title)) {
      return 'episode';
    } else {
      return 'movie';
    }
  }

  process(title, path,mainpath,pathmeta) {
//method for clean the title
 var cleanTitleObject =   movie_title_cleaner.cleanupTitle(title);
      let mediaType = this.getMediaType(cleanTitleObject.title);   
      //console.log('mediaType :'+mediaType); 
    switch (mediaType) {
      case 'episode':
        this._processEpisode(cleanTitleObject.title, path);
        break;
      case 'movie':
        movieService.import(cleanTitleObject.title, path,mainpath,pathmeta);
        break;
    }
  }

  _processEpisode(title, path) {   

   // console.log(title);
  //processing the episodeInfo    
     let episodeInfo = this._getEpisodeInfoFromTitle(title); 
         if (episodeInfo.show != undefined){
     	var movieTitle = episodeInfo.show.replace(this.valid_filetypes, '').trimRight();   
          	showRepository.getShowByTitle(episodeInfo.show)            
      .then(show => {   
			     if (!show) {             
				     showService.getShowInfoByTitle(episodeInfo, path)
					     .then(show => showService.save(show, path, episodeInfo.season));               
     } else {
         show.season =episodeInfo.season;
         show.episode =episodeInfo.episode; 
			     	showRepository.getSeasonByShowInfo(show._id, episodeInfo.season).then(season => {
					     if (season) {                     
					     	showRepository.getEpisode(season._id, episodeInfo.episode).then(episode => {						
							     if (!episode) {   
							     	showService.getEpisode(show, season._id, path);
							     }
						     });
					     } 
               else{
                  showService.getSeasons(show, path, episodeInfo.season);
               }
				     });
			     }
		     })
      .catch()       
      }
  }
  _getEpisodeInfoFromTitle(title){

var titleObj = title.split(/[\s,]+/);
if (titleObj[titleObj.length-1].toLowerCase().indexOf('e') ==0 )
{
var str = titleObj[titleObj.length-2] + ' ' + titleObj[titleObj.length-1];
title = title.replace(str, titleObj[titleObj.length-2]+titleObj[titleObj.length-1]);
}

    let myRe = namedRegexp(/S(:<season>\d{1,2})E(:<episode>\d{1,2})/ig);
    let matched = myRe.exec(title);    
    let episodeInfo = {};
 
 if (matched != null){
    var movieTitle = title.replace(matched[0], '').trimRight();
    if (title.indexOf('.'> 0)){       
  episodeInfo.show = movieTitle.split('.')[0];
    }
    else if (title.indexOf(' '> 0)){    
  episodeInfo.show = title.split(' ')[0];
    }
     episodeInfo.season = matched.capture('season');
    episodeInfo.episode = matched.capture('episode');
      return episodeInfo;
 }
 else {
   console.log("Movie Name Format is not matched.");
 }     // todo: find a more 'sophisticated' way of reading what show it is (strip away the bollocks);   
  }
}

module.exports = new WorkerService();