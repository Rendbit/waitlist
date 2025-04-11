import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import userRoutes from "./routes/user";

// Load environment variables from .env
dotenv.config();

// Initialize Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/waitlist-api/user", userRoutes);

app.post("/waitlist-api/conversion-rates", async (req: any, res: any) => {
  const { inputAmount, symbol } = req.body;

  if (!inputAmount || !symbol) {
    return res
      .status(400)
      .json({ message: "inputAmount and symbol are required" });
  }

  try {
    const headers = {
      "X-CMC_PRO_API_KEY": `${process.env.CMC_API_KEY}`,
    };

    // Get XLM rates in USD and NGN
    const xlmUrl = `${process.env.CMC_API_URL}${symbol}`;
    const xlmResponse = await fetch(xlmUrl, { headers });
    const xlmData = await xlmResponse.json();

    if (!xlmData.data || !xlmData.data.XLM) {
      throw new Error("Failed to fetch XLM rates");
    }

    // Get USD to currency rate
    const currencyUrl = `${process.env.EXCHANGE_RATE_URL}`;
    const currencyResponse = await fetch(currencyUrl);
    const currencyData = await currencyResponse.json();
    const usdToCurrencyRate = currencyData.rates[symbol];

    // Extract rates from CoinMarketCap response
    const xlmToCurrency = xlmData.data.XLM.quote[symbol].price;

    // Calculate inverse rates
    const currencyToXlm = Number(inputAmount) / xlmToCurrency;

    res.json({
      xlmToCurrency,
      currencyToXlm,
      usdToCurrencyRate,
    });
  } catch (error: any) {
    console.error("Error fetching conversion rates:", error);
    res.status(500).json({
      message: "Error fetching conversion rates",
      error: error.message,
    });
  }
});

// Default route
app.get("/api", (req: Request, res: Response) => {
  res.send("Welcome to the RendBit Waitlist API");
});

// Handle 404 (Not Found) — always JSON, never look for file
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
