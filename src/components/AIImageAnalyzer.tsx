import React, { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  DollarSign,
  ShieldCheck,
  Tag,
  Layers,
  Wand2,
  PlusCircle,
  RefreshCw,
  Info
} from "lucide-react";
import { AIAnalysisResult, PhysicalItem } from "../types/wamas";

interface AIImageAnalyzerProps {
  onAddDressToCatalog?: (dress: Partial<PhysicalItem>) => void;
  currency: string;
}

export const AIImageAnalyzer: React.FC<AIImageAnalyzerProps> = ({
  onAddDressToCatalog,
  currency,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [analysisMode, setAnalysisMode] = useState<"comprehensive" | "damage_check" | "pricing_audit">("comprehensive");
  const [dressNameInput, setDressNameInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample bridal dresses for fast 1-click test
  const SAMPLE_IMAGES = [
    {
      title: "فستان زفاف دانتيل ملكي",
      url: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "فستان ميرميد حرير إيطالي",
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "فستان خطوبة ياقوتي مطرز",
      url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "فستان يحتاج فحص تنظيف وتعديل",
      url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      // Convert url to base64 via canvas or fetch
      const response = await fetch(url);
      const blob = await response.blob();
      setMimeType(blob.type || "image/jpeg");
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setSelectedImage(url);
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage) {
      setError("يرجى اختيار أو رفع صورة الفستان أولاً");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-dress-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: mimeType,
          analysisMode: analysisMode,
          dressName: dressNameInput,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "فشل التحليل");
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء الاتصال بنموذج Gemini");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDressFromAnalysis = () => {
    if (!analysisResult || !onAddDressToCatalog) return;

    const newDress: Partial<PhysicalItem> = {
      name: analysisResult.dressTitle,
      category: (analysisResult.category as any) || "WEDDING_ROYAL",
      fabric: analysisResult.fabricAndEmbroidery,
      rentalPrice: analysisResult.recommendedRentalPrice,
      salePrice: analysisResult.recommendedSalePrice,
      securityDeposit: analysisResult.recommendedSecurityDeposit,
      acquisitionCost: Math.round(analysisResult.recommendedSalePrice * 0.5),
      color: analysisResult.colorTone,
      size: "38",
      state: "AVAILABLE",
      condition: analysisResult.damageInspection.hasDamage ? "MINOR_WEAR" : "EXCELLENT",
      imageUrl: selectedImage || "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
      notes: `${analysisResult.marketingDescription} - تعليمات الغسيل: ${analysisResult.cleaningAndCareGuide}`,
    };

    onAddDressToCatalog(newDress);
    alert("تم إنشاء مسودة الفستان ونقل بيانات التحليل إلى الكتالوج بنجاح! 👗✨");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>مدعوم بنموذج Google Gemini 3.1 Pro Preview</span>
            </div>
            <h1 className="text-2xl font-bold font-serif-luxury tracking-tight">
              تحليل وفحص فساتين الزفاف والأقمشة بالذكاء الاصطناعي
            </h1>
            <p className="text-purple-200/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              قم برفع صورة فستان زفاف أو سهرة أو تفاصيل تطريز القماش للتعرف الفوري على القصة، نوع الأقمشة، تقييم التلفيات، التوصية بالأسعار، ومطابقة الملحقات.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <div className="text-xs text-purple-200 font-medium">زمن الاستجابة المتوقع</div>
              <div className="text-base font-bold text-amber-300">أقل من ثانيتين ⚡</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Upload Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>1. رفع أو اختيار صورة الفستان</span>
            </h2>

            {/* Hidden input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                selectedImage
                  ? "border-purple-300 bg-purple-50/20"
                  : "border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/10"
              }`}
            >
              {selectedImage ? (
                <div className="space-y-3">
                  <div className="relative mx-auto max-h-64 rounded-lg overflow-hidden border border-slate-200 shadow-xs group">
                    <img
                      src={selectedImage}
                      alt="Selected Dress"
                      className="w-full h-56 object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <RefreshCw className="w-4 h-4" />
                      انقر لتغيير الصورة
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">تم اختيار الصورة بنجاح</p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-700">اسحب وأفلت صورة الفستان هنا</span>
                    <span className="text-xs text-slate-500"> أو انقر لاختيار ملف من جهازك</span>
                  </div>
                  <p className="text-[11px] text-slate-400">يدعم صيغ JPG, PNG, WEBP بدقة عالية</p>
                </div>
              )}
            </div>

            {/* Sample Images Quick Pick */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-600 mb-2 block">
                أو جرب على نماذج فساتين جاهزة:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-right transition-all text-xs text-slate-700 group cursor-pointer"
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-8 h-8 rounded-md object-cover shrink-0"
                    />
                    <span className="truncate text-[11px] font-medium group-hover:text-purple-700">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">نوع التحليل المفضل:</label>
                <select
                  value={analysisMode}
                  onChange={(e) => setAnalysisMode(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="comprehensive">✨ فحص شامل (الموديل، الأقمشة، المقاسات، والأسعار)</option>
                  <option value="damage_check">🔍 فحص العيوب والتلفيات (تقرير الاسترجاع والفحص الفني)</option>
                  <option value="pricing_audit">💰 تدقيق وتوصية الأسعار وقيمة التأمين</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">اسم/كود الفستان (اختياري):</label>
                <input
                  type="text"
                  value={dressNameInput}
                  onChange={(e) => setDressNameInput(e.target.value)}
                  placeholder="مثال: فستان العروس إليزا DR-2026-001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={runAnalysis}
                disabled={loading || !selectedImage}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                  loading || !selectedImage
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 transform hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التحليل بواسطة Gemini 3.1 Pro Preview...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>بدء التحليل الذكي للقطعة</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right/Analysis Results Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {analysisResult ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
              {/* Header result */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    نتيجة الفحص المؤكدة ✨
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 font-serif-luxury">
                    {analysisResult.dressTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    القصة: <span className="font-semibold text-slate-700">{analysisResult.silhouette}</span> | الدرجة: <span className="font-semibold text-slate-700">{analysisResult.colorTone}</span>
                  </p>
                </div>

                {onAddDressToCatalog && (
                  <button
                    onClick={handleCreateDressFromAnalysis}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>حفظ كفستان في الكتالوج</span>
                  </button>
                )}
              </div>

              {/* Price & Deposit Recommendations */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-center">
                  <div className="text-[11px] text-amber-800 font-medium">سعر الإيجار المقترح</div>
                  <div className="text-lg font-black text-amber-900 mt-0.5">
                    {analysisResult.recommendedRentalPrice} <span className="text-xs font-bold">{currency}</span>
                  </div>
                </div>

                <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 text-center">
                  <div className="text-[11px] text-blue-800 font-medium">مبلغ التأمين المسترد</div>
                  <div className="text-lg font-black text-blue-900 mt-0.5">
                    {analysisResult.recommendedSecurityDeposit} <span className="text-xs font-bold">{currency}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-center">
                  <div className="text-[11px] text-emerald-800 font-medium">سعر البيع المقترح</div>
                  <div className="text-lg font-black text-emerald-900 mt-0.5">
                    {analysisResult.recommendedSalePrice} <span className="text-xs font-bold">{currency}</span>
                  </div>
                </div>
              </div>

              {/* Damage & Condition Inspection */}
              <div className={`p-4 rounded-xl border ${
                analysisResult.damageInspection.hasDamage
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-emerald-50/60 border-emerald-200 text-emerald-900"
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  {analysisResult.damageInspection.hasDamage ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>تنبيه فحص التلفيات: وُجدت ملاحظات على القطعة ({analysisResult.damageInspection.severity})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>تقرير الفحص الفني: الفستان بحالة نقية وممتازة 100%</span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-1.5 leading-relaxed">
                  {analysisResult.damageInspection.damageDescription}
                </p>
                {analysisResult.damageInspection.repairRecommendation && (
                  <div className="mt-2 text-xs font-semibold pt-2 border-t border-current/10">
                    💡 توصية المشغل / المغسلة: {analysisResult.damageInspection.repairRecommendation}
                  </div>
                )}
              </div>

              {/* Details & Fabrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span>الأقمشة وتفاصيل التطريز:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult.fabricAndEmbroidery}
                  </p>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                    <Scissors className="w-4 h-4 text-purple-600" />
                    <span>فتحة الصدر والأكمام:</span>
                  </div>
                  <p className="text-slate-600">
                    {analysisResult.necklineAndSleeves}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-indigo-600" />
                    <span>الملحقات والإكسسوارات المتناسقة:</span>
                  </div>
                  <ul className="space-y-1 text-slate-600">
                    {analysisResult.stylingAccessories?.map((acc, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="font-bold text-slate-800 flex items-center gap-1.5 pt-2 border-t border-slate-200">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span>الأجسام والمقاسات الملائمة:</span>
                  </div>
                  <p className="text-slate-600">
                    {analysisResult.recommendedBodyType}
                  </p>
                </div>
              </div>

              {/* Marketing description */}
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 text-xs">
                <span className="font-bold text-purple-900 block mb-1">
                  📢 نص الوصف التسويقي المقترح في كتالوج العرائس:
                </span>
                <p className="text-purple-950/80 leading-relaxed italic">
                  "{analysisResult.marketingDescription}"
                </p>
              </div>

              {/* Care guide */}
              <div className="text-[11px] text-slate-500 bg-slate-100/70 p-2.5 rounded-lg">
                🧼 <span className="font-bold text-slate-700">دليل الغسيل والتنظيف الجاف بالمشغل:</span> {analysisResult.cleaningAndCareGuide}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-3 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-purple-500">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-700">بانتظار رفع وتحليل صورة الفستان</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  اختر صورة من جهازك أو من النماذج الجاهزة ثم اضغط "بدء التحليل الذكي" لاستخراج كامل المواصفات الفنية والتسعير.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
