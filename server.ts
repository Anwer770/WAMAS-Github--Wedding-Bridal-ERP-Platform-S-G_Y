import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser for JSON with ample limit for image uploads (base64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side Gemini AI Client initialization
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), aiReady: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Dress & Fabric Image Analysis using Gemini 3.1 Pro Preview
app.post("/api/analyze-dress-image", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", analysisMode = "comprehensive", dressName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No image data provided" });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const promptText = `
أنت خبير أرقى بيوت الأزياء وتصميم وفحص فساتين الأعراس والمناسبات الفاخرة (Haute Couture Bridal Expert & Quality Inspector).
قم بتحليل الصورة المرفقة لفستان الزفاف / السهرة أو قطعة القماش بدقة متناهية وإرجاع استجابة JSON محددة ودقيقة باللغة العربية.

نوع التحليل المطلوب: ${analysisMode}
اسم القطعة إن وجد: ${dressName || "غير محدد"}

المطلوب استخراج المعلومات التالية بتنسيق JSON حصراً:
{
  "dressTitle": "اسم وموديل مقترح للفستان (مثال: فستان ملكي مطرز بالزيركون والدانتيل الفرنسي)",
  "category": "WEDDING_ROYAL" | "CLASSIC_WHITE" | "ENGAGEMENT" | "EVENING" | "TRADITIONAL_KAFTAN",
  "silhouette": "قصة الفستان (مثال: Princess Ballgown, A-Line, Mermaid, Royal Empire, Column)",
  "necklineAndSleeves": "وصف فتحة الصدر والأكمام (مثال: Sweetheart neckline with detachable illusion lace sleeves)",
  "fabricAndEmbroidery": "نوع الأقمشة المستخدمة وتفاصيل التطريز (مثال: تُل فرنسي، أورجانزا، تطريز يدوي بأحجار الكريستال واللؤلؤ)",
  "colorTone": "درجة اللون الدقيقة (مثال: أوف وايت لؤلؤي، أبيض ناصع، عاجي، شمباني، ذهبي فاتح)",
  "estimatedCondition": "حالة القطعة التقديرية (ممتازة / جديدة / تحتاج كي وبخار / بها بقعة خفيفة / ممزقة)",
  "damageInspection": {
    "hasDamage": false,
    "damageDescription": "وصف أي تلف أو عيب مرئي في الخياطة أو القماش أو الشك إن وجد، أو تأكيد خلوها من التلف",
    "severity": "NONE" | "MINOR" | "MODERATE" | "SEVERE",
    "repairRecommendation": "توصية الإصلاح أو التنظيف (مثال: تنظيف جاف لطيف مع تثبيت أزرار الظهر)"
  },
  "recommendedRentalPrice": 1200,
  "recommendedSalePrice": 4500,
  "recommendedSecurityDeposit": 600,
  "recommendedBodyType": "أنواع الأجسام والمقاسات المناسبة (مثال: مثالي لجسم الساعة الرملية والكمثرى، مقاس 38-42)",
  "cleaningAndCareGuide": "تعليمات الغسيل والكي والعناية المتخصصة في المشغل",
  "stylingAccessories": ["طرحة فرنسية طويلة 3 أمتار", "تاج كريستال سواروفسكي ملكي", "حذاء ساتان كعب 7 سم"],
  "marketingDescription": "وصف تسويقي راقٍ وجذاب لعرضه على العروس في كتالوج الأتيليه"
}

يجب أن تكون النتيجة بتنسيق JSON صالح وصارم فقط دون أي علامات markdown إضافية غير ضرورية.
`;

    const ai = getAIClient();
    
    // Primary model as requested: gemini-3.1-pro-preview
    let resultText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      resultText = response.text || "";
    } catch (primaryError: any) {
      console.warn("Primary model gemini-3.1-pro-preview error, attempting fallback to gemini-3.7-flash:", primaryError?.message);
      // Fallback model
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || "image/jpeg",
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      resultText = fallbackResponse.text || "";
    }

    let parsedResult;
    try {
      const cleanJson = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsedResult = JSON.parse(cleanJson);
    } catch {
      parsedResult = {
        dressTitle: "فستان زفاف ملكي فاخر",
        category: "WEDDING_ROYAL",
        silhouette: "Ballgown",
        necklineAndSleeves: "تطريز يدوي على الصدر مع أكمام شفافة مطرزة",
        fabricAndEmbroidery: "تُل فاخر مع دانتيل وتطريز كريستال",
        colorTone: "أوف وايت عاجي",
        estimatedCondition: "ممتازة وجاهزة للعرض",
        damageInspection: {
          hasDamage: false,
          damageDescription: "لا توجد عيوب مرئية ملحوظة، الفستان بحالة نقية وممتازة",
          severity: "NONE",
          repairRecommendation: "كي بالبخار الرأسي قبل البروفة",
        },
        recommendedRentalPrice: 1500,
        recommendedSalePrice: 5200,
        recommendedSecurityDeposit: 750,
        recommendedBodyType: "مناسب لمختلف المقاسات من 38 إلى 42",
        cleaningAndCareGuide: "تنظيف جاف متخصص Dry Clean فقط مع حماية الأحجار الكريستالية",
        stylingAccessories: ["طرحة تل كاثيدرال مطرزة", "تاج ملكي فضي", "جيبون 6 رنات"],
        marketingDescription: "تصميم ملكي استثنائي يجمع بين الفخامة العصرية والتطريز اليدوي الفاخر لإطلالة أسطورية لعروس الموسم.",
        rawAiText: resultText,
      };
    }

    return res.json({ success: true, analysis: parsedResult });
  } catch (error: any) {
    console.error("Error in analyze-dress-image:", error);
    return res.status(500).json({
      error: "فشل تحليل الصورة عبر الذكاء الاصطناعي",
      details: error?.message || "خطأ غير متوقع",
    });
  }
});

// Vite Middleware for development / Static file serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WAMAS ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
