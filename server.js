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
         var storage = require('node-persist');
         storage.initSync({dir: 'temporarydata'});




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
          storage.setItemSync('path',setting[i].folderPath);
      }
 else if (setting[i].folderName=="tvshows")
      {
        paths.push(setting[i].folderPath);
      }
    }
console.log("****Seastream Importer started watching****");
var j=0;
chokidar.watch(paths, {usePolling: true,
  interval: 100,
  atomic:true }).on('all', function(event, file) {
    //console.log(event+' :'+file);
   
     if(path.extname(file) ==='.mpd') 
    {
        if (event == 'unlink')
        {     
           console.log("removing Movie");
          movieService.removeData(file);
     
        }
        else if(event=="add" || event =="change" || event =="addDir") 
        {

            // storage.setItemSync('mp4path',file);
        }
      
    }

   if (path.extname(file) === '.json') {    
      var newfile=file.replace(path.basename(file), "");
        console.log("folderpath: " + newfile);
        //console.log("file: " + file);
      // console.log("basename: " + path.basename(file)) ;
      if(event=="add" || event =="change" || event =="addDir") 
      {
               fs.readFile(file, 'utf8', function (err, data) {
                    if (err) throw err;
                    var obj = JSON.parse(data);               
                    var Title=obj.title;
                    var mpdpath=newfile+'Manifest.mpd';
                      j++;
                      var index = queue._queue.map(function (e) { return e.title; }).indexOf(Title);
                        if (index === -1) 
                        {     
                            queue.push({ title: Title, path:mpdpath, metajson:obj }, 3500*j);             
                        }
                    }); 
              
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
//console.log("function: "+JSON.stringify(item));
workerService.process(item.title,item.path,storage.getItemSync('path'),item.metajson);
   setTimeout(function(){   
   }, 2000);
}

