"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs = require("fs");
var win, serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = { width: 1024, height: 848 }; //electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require("".concat(__dirname, "/node_modules/electron"))
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    var template = [
        {
            label: "メニュー",
            submenu: [
                { label: "Print", click: function () { return print_to_pdf(); } },
                { label: "Debug", click: function () { return win.webContents.openDevTools(); } }
            ]
        }
    ];
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
    //win.webContents.openDevTools();
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', createWindow);
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
// ローカルファイルにアクセスする ///////////////////////////////
electron_1.ipcMain.on('read-csv-file', function (event) {
    var csvpath = path.join(__dirname, 'dist/assets/data.csv');
    var csvstr = fs.readFileSync(csvpath, 'utf-8');
    event.returnValue = csvstr;
});
function print_to_pdf() {
    var pdfPath = path.join(__dirname, 'print.pdf');
    win.webContents.printToPDF({}, function (error, data) {
        if (error)
            throw error;
        fs.writeFile(pdfPath, data, function (error) {
            if (error) {
                throw error;
            }
            electron_1.shell.openExternal('file://' + pdfPath);
        });
    });
}
//# sourceMappingURL=main.js.map