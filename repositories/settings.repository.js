const db = require('../db'),
http = require('http');

class SettingsRepository {
  
  getFolderPathByTitle(Name) {
    
       return new Promise((resolve, reject) => {
               http.get("http://localhost:80/settings/getfolder/"+ Name, function (res) {    
         res.on("data", function (result) {              
                var respone = JSON.parse(result);                 
                              return resolve(respone);                
            });
        }).on('error', function (e) {console.log("please run letcus-app first.");});
});     
  }

  getAllFolderPath() {
     return new Promise((resolve, reject) => {
          http.get("http://localhost:80/settings/folders/", function (res) {        
            res.on("data", function (result) {             
                var respone = JSON.parse(result); 
                              return resolve(respone);                
            });
        }).on('error', function (e){console.log("please run letcus-app first.");});
});   
    
    // return new Promise((resolve, reject) => {
    //   db.settings.find({}, (err, setting) => {
    //           if (err) {
    //       reject(err);
    //     } else {               
    //      return resolve(setting);
    //               }
    //   });
    // });
  }
} 

module.exports = new SettingsRepository();

