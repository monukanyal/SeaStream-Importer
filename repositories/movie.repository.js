const db = require('../db'),
http = require('http');
var request = require('request');



class MovieRepository {

  save(movie) {
        return new Promise((resolve, reject) => {

var options = {
  uri: 'http://localhost:80/movie/save',
  method: 'POST',
  body:  movie,
  json:true
  };

request(options, function (error, response, body) {  
  if (!error && response.statusCode == 200) {    
     //console.log(response.statusCode);
  }else
  {
    console.log(response.statusCode);
  }
});



// console.log(options);

//    http.request(options, function (res) {

//             console.log('movie import status: ' + res.statusCode);
//              console.log('Headers: ' + JSON.stringify(res.headers));
//             res.on("data", function (result) {
//                 var respone = result;
//                 console.log("respone : " + respone);
//                 if (respone.success) {
                   
//                 }
//             });
//         }).on('error', function (e) { console.log(e);}).end(body);      
   
  });
    // return new Promise((resolve, reject) => {
    //   db.movies.update({ title: movie.title }, movie, { upsert: true }, err => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });
  }

  getByTitle(title) {
    return new Promise((resolve, reject) => {
      http.get("http://localhost:80/movie/title/"+ title, function (res) {           
            res.on("data", function (result) {
                var respone = JSON.parse(result);
               // console.log('sAVED:'+respone);
                resolve(respone);               
            });
        }).on('error', function (e) {});

      // db.movies.findOne({ title: { $regex: new RegExp(title, 'i') } }, (err, movie) => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(movie);
      //   }
      // });
    });
  }

    CheckMovieExists(title, filename) {   
    return new Promise((resolve, reject) => {
      http.get("http://localhost:80/movie/exists/"+ title+"/"+ filename, function (res) {           
            res.on("data", function (result) {              
                var respone = JSON.parse(result);
               // console.log('exists response:'+JSON.stringify(respone));
                resolve(respone);               
            });
        }).on('error', function (e) {console.log(e);});

      // db.movies.findOne({ title: { $regex: new RegExp(title, 'i') } }, (err, movie) => {
      //   if (err) {
      //     reject(err);
      //   } else {
      //     resolve(movie);
      //   }
      // });
    });
  }



 getFolderPathByTitle(Name) {
   return new Promise((resolve, reject) => {
          http.get("http://localhost:80/settings/getfolder/"+ Name, function (res) {        
            res.on("data", function (result) {             
                var respone = JSON.parse(result); 
                              return resolve(respone);                
            });
        }).on('error', function (e) {});
});     
  }

  removeRecord(path) {
   return new Promise((resolve, reject) => {     
        var options = {
  uri: 'http://localhost:80/movie/remove',
  method: 'POST',
  body:  {path : path},
  json:true
  };

request(options, function (error, response, body) {   
  if (!error && response.statusCode == 200) {   
    resolve(); 
  }
  else {
    resolve();
  }
});

});     
  }

}

module.exports = new MovieRepository();