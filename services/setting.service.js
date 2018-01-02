'use strict';

const request = require('request'),
      fs = require('fs'),
       
      settingsRepository = require('../repositories/settings.repository');
      
      class SettingService {
          getDirectoryPath(name){
                 return new Promise((resolve, reject) => {
      settingsRepository.getFolderPathByTitle(name)
                    .then(setting => {  
                                  return resolve(setting.folderPath);             
          })
          });

      }

              getAllDirectoryPath(){
  return new Promise((resolve, reject) => {
      settingsRepository.getAllFolderPath()
                    .then(setting => {
                    //console.log(setting);   
                                   return resolve(setting);             
          })        
          });

      }

      }

      module.exports = new SettingService();