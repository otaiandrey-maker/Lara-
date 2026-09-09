import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    status: "online",
    mensagem: "Lara está online e pronta para ajudar."
  });
});

app.post("/chat", async (req, res) => {
  try {
    const mensagem = req.body?.mensagem;

    if (!mensagem || typeof mensagem !== "string") {
      return res.status(400).json({
        erro: "Envie uma mensagem para a Lara."
      });
    }

    const response = await ai.models.generateContent({
     model: "gemini-3.8-flash",
      contents: mensagem,
      config: {
        systemInstruction:
          "Seu nome é Lara. Você é uma assistente virtual brasileira, educada, inteligente, prestativa e objetiva. Responda sempre em português do Brasil. Ajude o usuário de forma clara e natural."
      }
    });

    res.json({
      resposta: response.text
    });

  } catch (error) {
    console.error("Erro ao conversar com o Gemini:", error);

    res.status(500).json({
      erro: "Não consegui falar com a inteligência da Lara neste momento."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lara backend online na porta ${PORT}`);
});
