// index.js

const express = require("express");
const http = require("http"); // Node.js HTTP module
const WebSocket = require("ws"); // WebSocket library
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const scriptController = require('./controllers/scriptController');
const config = require('config');

const wsController = require("./controllers/wsController"); // Import WebSocket controller
require("./startup/startup")();
const path = require("path");
const { getAllDevices, getDevices } = require("./controllers/deviceController");
const {getAllGroups} = require("./controllers/groupController");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const mongoURI = config.get('mongoURI');
console.log(mongoURI);
app.set("view engine", "ejs");
// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Serve static files from the public directory
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/uploads/scripts')))

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket route for sending messages to all devices
wss.on("connection", wsController.handleConnection); // Import WebSocket controller);
// Route to render the dashboard.html file
app.get("/dashboard", async (req, res) => {  
  const devices = await getDevices(req.query.connection);
  const scripts = await scriptController.getAllScripts();
  return res.render("manage", { devices: devices.data , scripts: scripts});
});
app.get("/groups", async (req, res) => {  
  const devices = await getDevices(req.query.connection);
  const groups = await getAllGroups();
  const scripts = await scriptController.getAllScripts();
  return res.render("group", { devices: devices.data , scripts: scripts,groups: groups});
});

// Route to check status of a device

app.use("/device", require("./routes/deviceRoutes"));
app.use("/resource", require("./routes/proxyRoutes"));
app.use("/  ", require("./routes/scriptRoutes"));
app.use("/data", require("./routes/accountRoutes"));


app.get("/check-status", (req, res) => {
  res.json({ devices: wsController.getAllConnectedDevices() });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
