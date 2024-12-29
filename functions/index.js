
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors")({origin: true}); // Enable CORS for all origins
app.use(cors);
const admin = require("firebase-admin");
admin.initializeApp();
