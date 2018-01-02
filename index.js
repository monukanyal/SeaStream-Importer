var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;


app.on('ready', ()=>{
    mainWindow = new BrowserWindow({width: 1024, height: 764, title: "app", webPreferences: {"nodeIntegration":true}});
   
    mainWindow.loadURL('file://' + __dirname + '/index.html');    
        var secondWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    })
    // secondWindow.loadURL('file://' + __dirname + '/app/second.html');
    
    // ipc.on('open-custom' ,() => {
    //     secondWindow.show();
    // })
    
});