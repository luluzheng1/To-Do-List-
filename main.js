const electron = require('electron');
const url = require('url');
const path = require('path');

//gets objects from electron
const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready 
app.on('ready', function(){
	// Create new window
	mainWindow = new BrowserWindow({});
	// Load html into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol:'file:', 
		slashes: true
	}));
	// Quit app when closed
	mainWindow.on('closed', function(){
		app.quit();
	});
	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Create add window
function createAddWindow(){
	// Create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Task to To Do List'
	});
	// Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol:'file:', 
		slashes: true
	}));
	// Handle Garbage
	addWindow.on('close', function(){
		addWindow = null;
	});
}

// Create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu:[
			{
				label: 'Add Task',
				accelerator: process.platform == 'darwin' ? 'Command+N' :
				'Ctrl+N',  
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear Task',
				accelerator: process.platform == 'darwin' ? 'Command+D' :
				'Ctrl+D',  
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' :
				'Ctrl+Q',  
				click(){
					app.quit();
				}
			}
		]
	}

];

// Adjust Menu for Mac
if(process.platform == 'darwin'){
	// Add empty object to beginning of Menu
	mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' :
				'Ctrl+I',  
				//Decide which window to open 
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}