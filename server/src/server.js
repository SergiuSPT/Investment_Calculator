import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TWELVE_API_KEY = process.env.TWELVE_API_KEY;
const EODHD_API_KEY = process.env.EODHD_API_KEY;
const date = new Date().toISOString().split('T')[0];
const yearAgo = new Date().setFullYear(new Date().getFullYear() - 1);
const dateYearAgo = new Date(yearAgo).toISOString().split('T')[0];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
  cors({
    origin: [ 'http://localhost:5173',
        'https://investmentcalculator-production-ffae.up.railway.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  })
);

app.get("/api/SP500", async (req, res) => {
    try {
        console.log("Received request for S&P 500 data");
        const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=SPY&start_date=${dateYearAgo}&end_date=${date}&interval=1month&apikey=${TWELVE_API_KEY}`);
        const data = response.data;
        return res.json(data);
    }catch (error) {
        console.error("Error fetching S&P 500 data:", error);
        res.status(500).json({ error: "Failed to fetch S&P 500 data" });
    }
});

app.get("/api/Nasdaq", async (req, res) => {
    try {
        console.log("Received request for Nasdaq data");
        const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=QQQ&start_date=${dateYearAgo}&end_date=${date}&interval=1month&apikey=${TWELVE_API_KEY}`);
        const data = response.data;
        return res.json(data);
        
    }catch (error) {
        console.error("Error fetching Nasdaq data:", error);
        res.status(500).json({ error: "Failed to fetch Nasdaq data" });
    }
});

app.get("/api/FTSE_Europe", async (req, res) => {
    try {
        console.log("Received request for FTSE Europe data");
        const response = await axios.get(`https://eodhd.com/api/eod/VGK.US?api_token=${EODHD_API_KEY}&fmt=json&from=${dateYearAgo}&to=${date}&period=m`);
        const data = response.data;
        return res.json(data);
    }catch (error) {
        console.error("Error fetching FTSE Europe data:", error);
        res.status(500).json({ error: "Failed to fetch FTSE Europe data" });
    }
});

app.get("/api/STOXX50", async (req, res) => {
    try {
        console.log("Received request for STOXX 50 data");
        const response = await axios.get(`https://eodhd.com/api/eod/FEZ.US?api_token=${EODHD_API_KEY}&fmt=json&from=${dateYearAgo}&to=${date}&period=m`);
        const data = response.data;
        return res.json(data);
    }catch (error) {
        console.error("Error fetching STOXX 50 data:", error);
        res.status(500).json({ error: "Failed to fetch STOXX 50 data" });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});