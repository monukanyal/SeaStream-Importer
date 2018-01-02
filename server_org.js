'use strict';
const watch = require('watch'),
      path = require('path'),
      fs = require('fs'),
      //jsmediatags = require('jsmediatags'),
      queue = require('./poor-mans-queue'),
      workerService = require('./services/worker.service'),
           movieService = require('./services/movie.service'),
      logger = require('./services/logger.service'),
        settingsService = require('./services/setting.service');
        const db = require('./db'),
        chokidar = require('chokidar'),
         movie_title_cleaner = require('./title-cleaner');

//settingsService.getAllDirectoryPath().then(setting=> {           
//for(var i=0; i<setting.length; i++){ 
//var dir = setting[i].folderPath;
//if (!fs.existsSync(dir)){
//    fs.mkdirSync(dir);
//}
//}
// });

if (process.env.NODE_ENV === 'skip') {
  // workerService.process('Castle.S01E02.WEB-DL.720p-MaRS', '/Users/Ben/Desktop/Castle.S01E01.WEB-DL.720p-MaRS.mp4');
  workerService.process('Deepwater Horizon', '/files/Deepwater Horizon.mp4');
} else if (process.env.NODE_ENV === 'queue') {
  queue.setEventHandler(newMovieEvent);
  queue.push('Deepwater Horizon');
  setTimeout(() => queue.push('Sully'), 10000);
  setTimeout(() => queue.push('The Intern'), 30000);
} else {
  queue.setEventHandler(newMovieEvent);
  settingsService.getAllDirectoryPath().then(setting=> {
    if (setting.length > 0)
    { 
      var paths =[];
    for (var i =0; i<setting.length;i++){

      if (setting[i].folderName=="movies")
      {
        paths.push(setting[i].folderPath);
      }
 else if (setting[i].folderName=="tvshows")
      {
        paths.push(setting[i].folderPath);
      }
    }
console.log("importer started watching");
var j=0;
    chokidar.watch(paths, {usePolling: true,
  interval: 100,
atomic:true }).on('all', function(event, file) {
    
   if (path.extname(file) === '.mpd') {    

     console.log("file: " + file)   ;

    if (event == 'unlink')
    {     
             
        movieService.removeData(file);
    }
    else if(event=="add" || event =="change" || event =="addDir") 
    {
       var cleanTitleObject =   movie_title_cleaner.cleanupTitle(path.parse(file).name);
       console.log("Name of file:"+cleanTitleObject.title);
      j++;
        //  getTitle(file)
        //           .then(title => {
                    var index = queue._queue.map(function (e) { return e.title; }).indexOf(cleanTitleObject.title);
                    if (index === -1) {            
                      queue.push({ title: cleanTitleObject.title, path: file }, 3500*j);             
                    }
                  // })
                  // .catch(error => logger.error(error));
      }
 
   }
});
    }
    else {
      console.log("folder name is not defined. Please do first using lectus app.");
    }
})

}

function newMovieEvent() {  
var item = queue.shift();
workerService.process(item.title, item.path);
  // setTimeout(function(){   
  // }, 10000);
}

// function getTitle(filename) {
//   return new Promise((resolve, reject) => {
//     jsmediatags.read(filename, {
//       onSuccess: function (tag) {
//         var title;
//         if (!tag.tags.title) {
//           title = path.parse(filename).name;
//         } else {
//           title = tag.tags.title;
//         }
//         resolve(title);
//       },
//       onError: function (error) {
//         reject(error);
//       }
//     });
//   });
// }
