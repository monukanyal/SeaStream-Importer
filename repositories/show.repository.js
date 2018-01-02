const db = require('../db'),
joinPath = require('path.join'),
http = require('http');
var request = require('request');

class ShowRepository {
	save(show) {
        	
      return new Promise((resolve, reject) => {

var options = {
  uri: 'http://localhost:80/shows/save',
  method: 'POST',
  body:  show,
  json:true
  };

request(options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		resolve(body);
	}
	else {
		reject(error);
	}
	
});

    // return new Promise((resolve, reject) => {
    //   db.shows.insert(show, err => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    });
  }

  getShowByTitle(title) {
	  //console.log(title);
 return new Promise((resolve, reject) => {
 http.get("http://localhost:80/shows/title/"+ title, function (res) {           
            res.on("data", function (result) {          
                var respone = JSON.parse(result);						
                if(respone.statusCode==404){				
resolve(null);         
                }
                else{					
					resolve(respone); }                      
            });
        }).on('error', function (e) {		
		reject(e);
		});

  
  });

    // return new Promise((resolve, reject) => {
    //   db.shows.findOne({ title: { $regex: new RegExp(title, 'i') } }, (err, show) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(show);
    //     }
    //   });
    // });
  }

   CheckShowExists(title) {
	    return new Promise((resolve, reject) => {
      http.get("http://localhost:80/shows/exists/" + title, function (res) {           
            res.on("data", function (result) {
                var respone = JSON.parse(result);
                resolve(respone);               
            });
        }).on('error', function (e) { reject();   });

      // db.movies.findOne({ title: { $regex: new RegExp(title, 'i') } }, (err, movie) => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(movie);
      //   }
      // });
    });
  }

   getShowByInfo(title, season, episode) {
 return new Promise((resolve, reject) => {
 http.get("http://localhost:80/shows/showExists/"+  joinPath(title, season, episode), function (res) {           
            res.on("data", function (result) {   
            	var respone = JSON.parse(result);
                if(respone.statusCode==404){
resolve(null);         
                }
                else{resolve(respone);         }
                      
            });
        }).on('error', function (e) {reject();});

  
  });}

   saveSeasons(seasons) {
		
   	return new Promise((resolve, reject) => {
   		var options = {
   			uri: 'http://localhost:80/shows/saveseasons',
   			method: 'POST',
   			body: seasons,
   			json: true
   		};

   		request(options, function (error, response, body) {

			   if(error){
  reject(error);
			   }

   			else if (!error && response.statusCode == 200) {
   				resolve(body);
   			}
			   else {
				   resolve(null);
			   }
   		});

   		// return new Promise((resolve, reject) => {
   		//   db.shows.insert(show, err => {
   		//     if (err) {
   		//       reject(err);
   		//     } else {
   		//       resolve();
   		//     }
   		//   });
   	});
   }

   getSeasonByShowInfo(showid, season) { 
   	return new Promise((resolve, reject) => {
   		http.get("http://localhost:80/shows/seasonid/"+ joinPath(showid, season), function (res) {
   			res.on("data", function (result) {
   				var respone = JSON.parse(result);
   				if (respone.statusCode == 404) {
   					resolve(null);
   				}
   				else { resolve(respone); }
   			});
   		}).on('error', function (e) { reject();});


   	});
   }

   saveEpisode(episode) {
	
   	return new Promise((resolve, reject) => {
   		var options = {
   			uri: 'http://localhost:80/shows/saveepisode',
   			method: 'POST',
   			body: episode,
   			json: true
   		};

   		request(options, function (error, response, body) {

			   if (error){
  reject(error);
			   }

   			else if (!error && response.statusCode == 200) {
   				resolve(body);
   			}
			   else {
				   resolve(error);
			   }
   		});

   		// return new Promise((resolve, reject) => {
   		//   db.shows.insert(show, err => {
   		//     if (err) {
   		//       reject(err);
   		//     } else {
   		//       resolve();
   		//     }
   		//   });
   	});
   }

   getEpisode(seasonid, episode) {
   	return new Promise((resolve, reject) => {
   		http.get("http://localhost:80/shows/episode/"+ joinPath(seasonid, episode), function (res) {
   			res.on("data", function (result) {
   				var respone = JSON.parse(result);
				   
   				if (respone.statusCode == 404) {
   					resolve(null);
   				}
   				else { resolve(respone); }

   			});
   		}).on('error', function (e) { reject(); });


   	});
   }

}

module.exports = new ShowRepository();