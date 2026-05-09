"use client";

import { useState, useRef, useCallback } from "react";

const TEAL = "#00D4AA";
const DARK = "#0A0A0F";
const CARD = "#13131A";
const BORDER = "#1E1E2E";
const TEXT = "#E8E8F0";
const MUTED = "#6B6B8A";

const S = {
  app: { minHeight: "100vh", background: DARK, color: TEXT, fontFamily: "'DM Mono','Courier New',monospace", display: "flex", flexDirection: "column", alignItems: "center" },
  header: { width: "100%", borderBottom: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, background: "rgba(10,10,15,0.97)", position: "sticky", top: 0, zIndex: 10, boxSizing: "border-box" },
  logo: { width: 34, height: 34, background: `linear-gradient(135deg, ${TEAL}, #00A896)`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
  main: { width: "100%", maxWidth: 680, padding: "32px 16px 80px", boxSizing: "border-box" },
  heroTitle: { fontSize: "clamp(24px,5vw,38px)", fontWeight: 800, lineHeight: 1.15, margin: "0 0 10px" },
  accent: { color: TEAL },
  heroSub: { fontSize: 13, color: MUTED, lineHeight: 1.7, margin: "0 0 24px" },
  card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20, marginBottom: 14 },
  cardLabel: { fontSize: 11, letterSpacing: "0.14em", color: TEAL, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 },
  dropzone: { border: `2px dashed ${BORDER}`, borderRadius: 10, padding: "32px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", userSelect: "none" },
  dropzoneHover: { borderColor: TEAL, background: "rgba(0,212,170,0.05)" },
  previewWrap: { position: "relative" },
  previewImg: { width: "100%", maxHeight: 280, objectFit: "contain", background: "#0D0D15", borderRadius: 10, display: "block" },
  removeBtn: { position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.8)", border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT, width: 28, height: 28, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" },
  row: { display: "flex", gap: 10, flexWrap: "wrap" },
  field: { flex: 1, minWidth: 120 },
  label: { display: "block", fontSize: 11, letterSpacing: "0.1em", color: MUTED, textTransform: "uppercase", marginBottom: 6 },
  input: { width: "100%", background: DARK, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", color: TEXT, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" },
  select: { width: "100%", background: DARK, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "10px 12px", color: TEXT, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", cursor: "pointer" },
  btn: { width: "100%", background: `linear-gradient(135deg, ${TEAL}, #00B896)`, border: "none", borderRadius: 11, padding: 14, color: "#000", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  btnOff: { opacity: 0.35, cursor: "not-allowed" },
  bar: { width: "100%", height: 3, background: BORDER, borderRadius: 99, overflow: "hidden", marginTop: 12 },
  barFill: { height: "100%", background: `linear-gradient(90deg, ${TEAL}, #00A896)`, animation: "ld 1.4s ease-in-out infinite" },
  err: { background: "rgba(255,80,80,0.07)", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 9, padding: "12px 14px", fontSize: 12, color: "#FF8888", marginTop: 10, lineHeight: 1.6, wordBreak: "break-word" },
  resultCard: { background: CARD, border: `1px solid ${TEAL}44`, borderRadius: 14, padding: 20, marginTop: 20, position: "relative", overflow: "hidden", animation: "fu 0.3s ease forwards" },
  glow: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` },
  priceNum: { fontSize: 42, fontWeight: 800, color: TEAL, lineHeight: 1, letterSpacing: "-0.02em" },
  priceRange: { fontSize: 13, color: MUTED, paddingBottom: 4 },
  priceRow: { display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 18, flexWrap: "wrap" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 16 },
  metaBox: { background: DARK, border: `1px solid ${BORDER}`, borderRadius: 9, padding: "8px 12px" },
  metaLbl: { fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 },
  metaVal: { fontSize: 13, fontWeight: 600 },
  listTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 9px", lineHeight: 1.3 },
  listDesc: { fontSize: 13, color: "#A8A8C0", lineHeight: 1.75, margin: "0 0 16px", whiteSpace: "pre-wrap" },
  tags: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  tag: { background: "rgba(0,212,170,0.1)", border: `1px solid rgba(0,212,170,0.2)`, borderRadius: 5, padding: "3px 8px", fontSize: 11, color: TEAL },
  copyRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  copyBtn: { background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 16px", color: TEXT, fontSize: 12, fontFamily: "inherit", cursor: "pointer" },
  copyBtnAccent: { borderColor: TEAL + "55", color: TEAL },
};

const CSS = `
@keyframes ld{0%{width:0%;margin-left:0}50%{width:55%;margin-left:22%}100%{width:0%;margin-left:100%}}
@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
`;

function readFileAsDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("Good");
  const [category, setCategory] = useState("Clothing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState("");
  const fileRef = useRef();

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP)");
      return;
    }
    try {
      const dataURL = await readFileAsDataURL(file);
      setImage({ dataURL, base64: dataURL.split(",")[1], mimeType: file.type });
      setResult(null);
      setError("");
    } catch (e) {
      setError("Failed to read image: " + e.message);
    }
  }, []);

  const generate = async () => {
    if (!image || !brand.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.base64,
          mimeType: image.mimeType,
          brand: brand.trim(),
          category,
          condition,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const fullListing = result
    ? `${result.title}\n\n${result.description}\n\n${(result.tags || []).map((t) => "#" + t).join(" ")}`
    : "";

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      <div style={S.header}>
        <div style={S.logo}>✦</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.07em" }}>VINTED.LIST</div>
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.12em" }}>AI LISTING GENERATOR</div>
        </div>
      </div>

      <div style={S.main}>
        <h1 style={S.heroTitle}>Snap it.<br /><span style={S.accent}>Price it. List it.</span></h1>
        <p style={S.heroSub}>Upload a photo, add the brand — get a full Vinted listing with realistic UK pricing instantly.</p>

        <div style={S.card}>
          <div style={S.cardLabel}>01 — Photo</div>
          {!image ? (
            <div
              style={{ ...S.dropzone, ...(dragging ? S.dropzoneHover : {}) }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current.click()}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>📷</div>
              <p style={{ fontSize: 13, color: MUTED, margin: "0 0 4px" }}>Tap to upload or drop photo here</p>
              <p style={{ fontSize: 11, color: "#3D3D5A", margin: 0 }}>JPG · PNG · WEBP</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div style={S.previewWrap}>
              <img src={image.dataURL} alt="item" style={S.previewImg} />
              <button style={S.removeBtn} onClick={() => { setImage(null); setResult(null); }}>✕</button>
            </div>
          )}
        </div>

        <div style={S.card}>
          <div style={S.cardLabel}>02 — Details</div>
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Brand *</label>
            <input style={S.input} placeholder="Nike, Zara, Levi's…" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div style={S.row}>
            <div style={S.field}>
              <label style={S.label}>Category</label>
              <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                {["Clothing", "Shoes", "Bags", "Accessories", "Sportswear", "Vintage", "Kids"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Condition</label>
              <select style={S.select} value={condition} onChange={(e) => setCondition(e.target.value)}>
                {["New with tags", "Like new", "Good", "Fair", "Poor"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          style={{ ...S.btn, ...(!image || !brand.trim() || loading ? S.btnOff : {}) }}
          disabled={!image || !brand.trim() || loading}
          onClick={generate}
        >
          {loading ? "⏳ Analysing…" : "✦ Generate Vinted Listing"}
        </button>

        {loading && <div style={S.bar}><div style={S.barFill} /></div>}
        {error && <div style={S.err}>⚠ {error}</div>}

        {result && (
          <div style={S.resultCard}>
            <div style={S.glow} />
            <div style={S.cardLabel}>✦ Your Listing</div>
            <div style={S.priceRow}>
              <div style={S.priceNum}>£{result.suggestedPrice}</div>
              <div style={S.priceRange}>Range £{result.priceMin}–£{result.priceMax}</div>
            </div>
            <div style={S.metaGrid}>
              {[["Item", result.itemName], ["Style", result.style], ["Colour", result.colour], ["Material", result.material]].map(([l, v]) => (
                <div key={l} style={S.metaBox}>
                  <div style={S.metaLbl}>{l}</div>
                  <div style={S.metaVal}>{v || "—"}</div>
                </div>
              ))}
            </div>
            <div style={S.listTitle}>{result.title}</div>
            <div style={S.listDesc}>{result.description}</div>
            <div style={S.tags}>
              {(result.tags || []).map((t) => <span key={t} style={S.tag}>#{t}</span>)}
            </div>
            <div style={S.copyRow}>
              <button style={S.copyBtn} onClick={() => copy(result.title, "t")}>{copied === "t" ? "✓ Copied" : "Copy title"}</button>
              <button style={S.copyBtn} onClick={() => copy(result.description, "d")}>{copied === "d" ? "✓ Copied" : "Copy description"}</button>
              <button style={{ ...S.copyBtn, ...S.copyBtnAccent }} onClick={() => copy(fullListing, "a")}>{copied === "a" ? "✓ Copied!" : "✦ Copy full listing"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
