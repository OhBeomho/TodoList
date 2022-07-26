const {
    app,
    BrowserWindow,
    Menu
} = require("electron");
const ElectronStore = require("electron-store");
ElectronStore.initRenderer();

function createWindow() {
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    window.loadFile("./src/index.html");

    Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});