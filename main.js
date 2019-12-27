const { app, BrowserWindow, TouchBar } = require("electron");
const isDev = require("electron-is-dev");

const { TouchBarSlider } = TouchBar;
let window;
let paddle;

const slider = new TouchBarSlider({
  label: "x",
  value: 120,
  minValue: 0,
  maxValue: 256,
  change: value => {
    window.webContents.executeJavaScript(`
      paddle = document.querySelector("#paddle");
      if (paddle) paddle.style.left = "${value}px";
    `);
  }
});

const touchBar = new TouchBar({ items: [slider] });

app.once("ready", () => {
  window = new BrowserWindow({
    width: 800,
    height: 800
  });

  if (isDev) window.webContents.openDevTools();

  window.loadURL("http://127.0.0.1:1234");

  // TODO: build
  // window.loadURL(
  //   isDev
  //     ? "http://localhost:3000"
  //     : `file://${path.join(__dirname, "../build/index.html")}`
  // );

  window.setTouchBar(touchBar);
});
