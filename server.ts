import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Chat Endpoint for the AI concierge buddy
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const client = getGeminiClient();

      const systemInstruction = 
        "You are the Rapid30 AI Assistant Concierge, a highly intelligent and helpful concierge buddy " +
        "assisting users (customers, store liaisons, and driver couriers) on our Commodity Delivery Platform.\n" +
        "- Core platform features: 30-minute rapid localized procurement from hotels, bistros, and grocers, live GPS tracking, and multi-role operations.\n" +
        "- Keep your responses energetic, helpful, professional, and relatively brief.\n" +
        "- If asked about the active order process, explain that liaisons verify items using our QR Verification scanner, driver Vance delivers via offline-sync GPS, and customers authorize receipt with their final handwritten signature touch-canvas.\n" +
        "- Be friendly and polite. Avoid detailed technical descriptions of database replication unless specifically asked.";

      // format conversation history for the SDK
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.content }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || "I was unable to formulate a response. Please check back shortly!";
      res.json({ text });
    } catch (err: any) {
      console.error("Gemini API server exception:", err);
      res.status(500).json({ 
        error: "Failed to connect to the assistant server.", 
        details: err.message || "" 
      });
    }
  });

  // Health probe
  app.get("/api/health", (req, res) => {
    res.json({ status: "active", version: "1.0.0" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RAPID30 SERVER] Running successfully on local port: http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup error:", error);
});
