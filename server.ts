import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Request, type Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  for (const envFile of ['.env.local', '.env']) {
    if (fs.existsSync(envFile)) {
      try {
        process.loadEnvFile(envFile);
      } catch {
        // Ignore missing/invalid local env files
      }
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_ID = 'gemini-4-hydrogen';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const app = express();
app.use(express.json({ limit: '1mb' }));

// POST /api/gemini/menu - Generate dish suggestion from ingredients
app.post('/api/gemini/menu', async (req: Request, res: Response) => {
  try {
    const { ingredients, style } = req.body ?? {};
    if (!ingredients || typeof ingredients !== 'string' || !ingredients.trim()) {
      res.status(400).json({ error: 'Ingredienti mancanti.' });
      return;
    }

    const ai = getAiClient();
    const prompt = `
      Sei un esperto chef africano e copywriter di menu per la piattaforma MESA AirAFRIC.
      Ho questi ingredienti: "${ingredients.trim()}".
      Voglio creare un piatto tradizionale africano nello stile: "${typeof style === 'string' && style.trim() ? style.trim() : 'Tradizionale Casalingo'}".
      
      Genera un nome autentico e attraente per il piatto della tradizione culinaria africana (es. Attiéké, Garba, Jollof Rice, Doro Wat, Ndolé, Yassa, Tajine, etc.), una descrizione appetitosa e culturale (massimo 150 caratteri), 
      un prezzo suggerito in Euro (basato sugli ingredienti) e alcuni tag pertinenti.
      Rispondi ESCLUSIVAMENTE con un oggetto JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['dishName', 'description', 'suggestedPrice', 'tags'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.status(502).json({ error: 'Risposta vuota dal modello AI.' });
      return;
    }

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error in /api/gemini/menu:', error);
    const message = error instanceof Error ? error.message : 'Errore nella generazione del menu.';
    res.status(500).json({ error: message });
  }
});

// POST /api/gemini/admin-report - Admin strategic AI report
app.post('/api/gemini/admin-report', async (req: Request, res: Response) => {
  try {
    const { totalApplications = 0, pendingCount = 0 } = req.body ?? {};
    const ai = getAiClient();

    const prompt = `Agisci come un consulente strategico per MESA. 
      Analizza le candidature cuochi: ${Number(totalApplications)} totali, ${Number(pendingCount)} in attesa di verifica HACCP e documenti. 
      Fornisci 3 consigli pratici all'amministratore per valutare e attivare i profili cuoco in modo sicuro e rapido.`;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    res.json({ report: response.text || 'Analisi completata con successo.' });
  } catch (error) {
    console.error('Error in /api/gemini/admin-report:', error);
    const message = error instanceof Error ? error.message : 'Errore nella generazione del report.';
    res.status(500).json({ error: message });
  }
});

// POST /api/gemini/concierge - MESA AI Concierge chat
app.post('/api/gemini/concierge', async (req: Request, res: Response) => {
  try {
    const { message } = req.body ?? {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Messaggio mancante.' });
      return;
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: message.trim(),
      config: {
        systemInstruction:
          "Sei l'AI Concierge di MESA, un'app premium di food delivery da cuochi casalinghi. Sei raffinato, amichevole e molto esperto di tradizioni culinarie. Rispondi in modo conciso e invoglia l'utente a ordinare piatti autentici.",
      },
    });

    res.json({
      reply: response.text || 'Scusa, ho avuto un piccolo intoppo in cucina. Puoi ripetere?',
    });
  } catch (error) {
    console.error('Error in /api/gemini/concierge:', error);
    const message = error instanceof Error ? error.message : 'Errore del Concierge AI.';
    res.status(500).json({ error: message });
  }
});

// POST /api/gemini/heritage-story - Dish cultural story
app.post('/api/gemini/heritage-story', async (req: Request, res: Response) => {
  try {
    const { dishName, chefName, chefNationality, chefBio, ingredients } = req.body ?? {};
    if (!dishName || !chefName) {
      res.status(400).json({ error: 'Dati piatto o cuoco mancanti.' });
      return;
    }

    const ai = getAiClient();
    const prompt = `
      Agisci come un antropologo del gusto e un poeta gastronomico.
      Racconta la "storia dell'anima" di questo piatto: "${dishName}" cucinato da "${chefName}" (${chefNationality || ''}).
      Lo chef dice di sé: "${chefBio || ''}".
      Ingredienti chiave: "${ingredients || 'Tradizionali'}".

      Genera un oggetto JSON con:
      1. "story": Un breve paragrafo evocativo che parla delle radici culturali e familiari del piatto.
      2. "sensoryDetails": Una descrizione di ciò che l'utente sentirà al primo morso (profumi, consistenze).
      3. "ritual": Un consiglio su come consumare il piatto (es. "Spegni le luci, accendi una candela...").
      4. "pairing": Una raccomandazione di sottofondo musicale o bevanda.
      
      Usa un tono caloroso, solenne e artigianale. Rispondi SOLO in formato JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING },
            sensoryDetails: { type: Type.STRING },
            ritual: { type: Type.STRING },
            pairing: { type: Type.STRING },
          },
          required: ['story', 'sensoryDetails', 'ritual', 'pairing'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      res.status(502).json({ error: 'Risposta vuota dal modello AI.' });
      return;
    }

    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error in /api/gemini/heritage-story:', error);
    const message = error instanceof Error ? error.message : 'Errore nella generazione della storia.';
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.use((req: Request, res: Response, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api/')) {
        res.sendFile(path.join(distDir, 'index.html'));
        return;
      }
      next();
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MESA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
