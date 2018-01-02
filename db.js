'use strict';
const DataStore = require('nedb');
var express = require("express");
var app = express(),
bodyParser = require('body-parser');
var http = require('http');
var request = require('request');
var setting = require('./settings');

app.use(bodyParser.json());

var db = {};

        http.get("http://localhost:80/settings/defaultFolder", function (res) {
           
            res.on("data", function (result) {
                var respone = JSON.parse(result);               
                if (respone.success) {
                    var rootFolder = respone.data[0].folderPath;                   
                    // db.movies = new Datastore(rootFolder + 'databases\\movies.db');
                    // db.shows = new Datastore(rootFolder + 'databases\\shows.db');
                    // db.profiles = new Datastore(rootFolder + 'databases\\profiles.db');
                    // db.watched = new Datastore(rootFolder + 'databases\\watched.db');
                    // db.watching = new Datastore(rootFolder + 'databases\\watching.db');
                    // db.settings = new Datastore(rootFolder + 'databases\\settings.db');
                    // db.movies.loadDatabase();
                    // db.shows.loadDatabase();
                    // db.settings.loadDatabase();
                    // db.profiles.loadDatabase();
                }
            });
        }).on('error', function (e) {});


//var folderPaths = [{ _id: 1
//               , folderName: 'movies'
//               , folderPath: 'C:\\files\\movie\\'               
//            },{ _id: 2
//               , folderName: 'backdrops'
//               , folderPath: 'C:\\files\\backdrops\\'               
//            },{ _id: 3
//               , folderName: 'posters'
//               , folderPath: 'C:\\files\\posters\\'                
//            },
//            { _id: 4
//               , folderName: 'actors'
//               , folderPath: 'C:\\files\\actors\\'               
//            } ,
//             { _id: 5
//               , folderName: 'music'
//               , folderPath: 'C:\\files\\music\\'               
//            }   ,
//             { _id: 6
//               , folderName: 'tvshows'
//               , folderPath: 'C:\\files\\tvshows\\'               
//            }   ,
//            { _id: 7
//               , folderName: 'uploads'
//               , folderPath: 'C:\\files\\uploads\\'               
//            }            ]

// db.settings.find({}, (err, data) => {
//     if (data.length==0){
// db.settings.insert(folderPaths, (err) => {
//    if (err){
//      console.log(err);
//    } else {
//      console.log('Folder paths imported successfully');
//    }
//  });
//     }
// });

// db.profiles.find({}, (err, data) => {
//      if (data.length==0){
//  db.profiles.insert({ _id:1, name: 'lectus', isAdmin: true }, (err) => {
//     if (err){
//       console.log(err);
//     } else {
//       console.log('Lectus profile imported successfully');
//     }
//   });
//      }
//  });

module.exports = db;