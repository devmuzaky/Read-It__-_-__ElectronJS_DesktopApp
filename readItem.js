// Modules

const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')

// Offscreen BrowserWindow
let offscreenWindow

// Exported readItem function

module.exports = (url, callback) => {
    // Create offscreenWindow
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
        offscreen: true
        }
    })

    // Load item url
    offscreenWindow.loadURL(url)

    // Wait for content to finish loading
    offscreenWindow.webContents.on('did-finish-load', e => {
        // Get page title
        let title = offscreenWindow.getTitle()

        // Get screenshot (thumbnail)
        offscreenWindow.webContents.capturePage().then(image => {
        // Get image as dataURL
        let screenshot = image.toDataURL()

        // Execute callback with new item object
        callback({title, screenshot, url})

        // Clean up
        offscreenWindow.close()
        offscreenWindow = null
        })
    })
}
