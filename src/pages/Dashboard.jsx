import { analyzeText } from "../services/api";
import React, { useState, useEffect } from "react";
import { LayoutGrid, FileText, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import UploadBox from "../components/UploadBox";
import DetectionGauge from "../components/DetectionGauge";
import HighlightedText from "../components/HighlightedText";
import FingerprintAnalysis from "../components/FingerprintAnalysis";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import ComparisonPanel from "../components/ComparisonPanel";
import ExportPanel from "../components/ExportPanel";
import { mockDemoData } from "../data/mockAnalysis";

export default function Dashboard({ setPage }) {
  const [textInput, setTextInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);

  // Perhitungan Karakter & Kata Real-time
  const charCount = textInput.length;
  const wordCount = textInput.trim() === "" ? 0 : textInput.trim().split(/\s+/).length;

  // Fitur Demo Mode: Mengisi data dummy siap uji otomatis
  const handleLoadDemo = () => {
    setTextInput(mockDemoData.text);
  };

  const handleRunAnalysis = async () => {
  if (textInput.trim().length < 10) {
    alert("Masukkan minimal 10 karakter teks untuk memulai analisis.");
    return;
  }

  setAnalyzing(true);
  setResult(null);

  // Tetap tampilkan animasi loading — bisa dipertahankan
  const steps = [
    "Membaca segmen dokumen...",
    "Menganalisis keteraturan pola kalimat (Burstiness)...",
    "Menghitung bobot prediksi semantik (Perplexity)...",
    "Kalkulasi AI Confidence Score...",
    "Selesai! Menyusun berkas enkripsi laporan.",
  ];

  let currentStep = 0;
  setLoadingStep(steps[currentStep]);
  const interval = setInterval(() => {
    currentStep++;
    if (currentStep < steps.length) {
      setLoadingStep(steps[currentStep]);
    } else {
      clearInterval(interval);
    }
  }, 900);

  try {
    // Panggil API backend
    const apiResult = await analyzeText(textInput);

    // Hentikan animasi loading
    clearInterval(interval);
    setAnalyzing(false);

    // Gabungkan hasil API dengan data pendukung dari mockData
    // (fingerprint, radar, dll belum dari backend — tetap pakai mock)
    setResult({
  ...mockDemoData,

  segments: apiResult.segments,
  fingerprint: apiResult.fingerprint,
  radarMetrics: apiResult.radarMetrics,
  composition: apiResult.composition,
  comparisonReasons: apiResult.comparisonReasons,
  suggestions: apiResult.suggestions,

  text: textInput,

  stats: {
    aiScore: apiResult.ai_probability,
    humanScore: apiResult.human_probability,
    confidenceScore: apiResult.confidence,
    riskLevel:
      apiResult.ai_probability > 60
        ? "Tinggi"
        : apiResult.ai_probability > 35
        ? "Sedang"
        : "Rendah",
  },
});

  } catch (error) {
    clearInterval(interval);
    setAnalyzing(false);
    alert(`Gagal menghubungi server: ${error.message}`);
  }
};

  // Fungsi interaktif memperbarui hasil teks murni saat saran parafrase diterapkan
  const handleApplyParafrase = (id, fixedText) => {
    if (!result) return;
    
    // Perbarui segmen highlight visual
    const updatedSegments = result.segments.map((seg) => {
      // Jika segmen 1 diganti, ubah tipenya menjadi 'human' (hijau) karena sudah diperbaiki
      if (id === 101 && seg.id === 1) {
        return { ...seg, text: fixedText, type: "human", aiProbability: 12 };
      }
      if (id === 102 && seg.id === 2) {
        return { ...seg, text: fixedText, type: "human", aiProbability: 15 };
      }
      return seg;
    });

    // Sesuaikan nilai skor global agar ikut turun setelah teks diperbaiki
    const newAiScore = Math.max(15, result.stats.aiScore - 28);
    
    setResult({
      ...result,
      stats: {
        ...result.stats,
        aiScore: newAiScore,
        humanScore: 100 - newAiScore,
        riskLevel: newAiScore > 60 ? "Tinggi" : newAiScore > 35 ? "Sedang" : "Rendah"
      },
      segments: updatedSegments
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Dashboard */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => setPage("home")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft size={14} /> Back to Landing Page
          </button>
          
          {/* Tombol Demo Presentasi */}
          <button
            onClick={handleLoadDemo}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={14} className="text-purple-600 animate-spin-slow" />
            ⚡ Gunakan Data Contoh (Demo Mode)
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SISI KIRI: INPUT AREA (5 Kolom Grid) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Input Dokumen Teks</label>
                <span className="text-[11px] font-mono font-medium text-slate-400">Realtime Monitor</span>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Tempelkan teks atau artikel Anda di sini untuk mendeteksi fabrikasi kecerdasan buatan..."
                className="w-full h-64 p-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none placeholder:text-slate-300"
              />

              <div className="flex justify-between items-center text-xs text-slate-400 font-medium font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span>Karakter: {charCount}</span>
                <span>Kata: {wordCount}</span>
              </div>

              <div className="py-2">
                <UploadBox onFileSelect={(fileName) => setTextInput(`[Konten Berkas Diunggah: ${fileName}]\n\n` + mockDemoData.text)} />
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {analyzing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menganalisis...
                  </>
                ) : (
                  "Analisis Sekarang"
                )}
              </button>
            </div>

            {/* Tampilan Status Loading Simulasi */}
            {analyzing && (
              <div className="bg-indigo-900 text-white p-4 rounded-xl border border-indigo-950 shadow-inner space-y-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Core Engine Simulation</span>
                </div>
                <p className="text-xs text-slate-100 font-mono">Status: {loadingStep}</p>
              </div>
            )}
          </div>

          {/* SISI KANAN: HASIL ANALISIS (7 Kolom Grid) */}
          <div className="lg:col-span-7 space-y-6">
            {!result && !analyzing && (
              <div className="border border-dashed border-slate-200 bg-white rounded-3xl p-16 text-center text-slate-400 flex flex-col items-center justify-center min-h-[500px]">
                <LayoutGrid size={48} className="text-slate-200 mb-4 stroke-[1.5]" />
                <h4 className="font-bold text-slate-700">Menunggu Input Teks</h4>
                <p className="text-xs max-w-xs mx-auto mt-1 leading-normal">Silakan isi teks di area kiri atau pilih opsi 'Demo Mode' untuk melihat kalkulasi diagram visualisasi.</p>
              </div>
            )}

            {result && !analyzing && (
              <div className="space-y-6 animate-fadeIn">
                {/* Gauge Score */}
                <DetectionGauge 
                  aiScore={result.stats.aiScore} 
                  humanScore={result.stats.humanScore} 
                  confidence={result.stats.confidenceScore} 
                  risk={result.stats.riskLevel} 
                />

                {/* Highlight Teks Interaktif */}
                <HighlightedText segments={result.segments} />

                {/* Fitur Unggulan USP: Fingerprint */}
                <FingerprintAnalysis data={result.fingerprint} />

                {/* Grafik Recharts Dashboard */}
                <AnalyticsDashboard radarData={result.radarMetrics} pieData={result.composition} />

                {/* Komparasi Alasan Logika */}
                <ComparisonPanel reasons={result.comparisonReasons} />


                {/* Panel Export berkas */}
                <ExportPanel />
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}