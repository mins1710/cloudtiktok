// index.js

const express = require("express");
const http = require("http"); // Node.js HTTP module
const WebSocket = require("ws"); // WebSocket library
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/toktok";
const bodyParser = require("body-parser");

const wsController = require("./controllers/wsController"); // Import WebSocket controller
require("./startup/startup")();
const path = require("path");
const { getAllDevices, getDevices } = require("./controllers/deviceController");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
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
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "public")));
=======
app.use(express.static("public"));
>>>>>>> fb9bb8c (zz)

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket route for sending messages to all devices
wss.on("connection", wsController.handleConnection); // Import WebSocket controller);
// Route to render the dashboard.html file
<<<<<<< HEAD
app.get("/dashboard", async (req, res) => {  
  const devices = await getDevices(req.query.connection);
  return res.render("dashboard", { devicesServer: devices.data});
  // res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

=======
app.get('/dashboard', (req, res) => {
    return res.render('dashboard',{"server": "127.0.0.1"});
    // res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });
  
>>>>>>> fb9bb8c (zz)
// Route to check status of a device

app.use("/device", require("./routes/deviceRoutes"));

app.get("/check-status", (req, res) => {
  res.json({ devices: wsController.getAllConnectedDevices() });
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
