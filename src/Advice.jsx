import { useState, useMemo } from "react";
import "./Advice.css"; // saara styling (colors, animations, hover effects) is file mein hai

// ---------------------------------------------
// 1) STATIC DATA
// ---------------------------------------------

// Category chips jo upar dikhte hain (Life / Career / Focus)
// 'id' internally use hota hai (state, BANK lookup ke liye)
// 'label' user ko dikhne wala text hai
const CATEGORIES = [
  { id: "life", label: "Life" },
  { id: "career", label: "Career" },
  { id: "focus", label: "Focus" },
];

// Har category ke liye advice quotes ka pool (array).
// Jab user dial pe click karega, isi array me se ek random quote uthega.
const BANK = {
  life: [
    "Let go of what you can't control — you'll save your energy for what you can.",
    "A small step today beats a big decision made tomorrow.",
    "Every day is a fresh start — don't carry yesterday's weight into it.",
    "Look for small joys; the big moments will find you on their own.",
    "Hard times pass. Just hold your ground.",
    "Practice gratitude — what you have is already enough.",
    "Sometimes stopping is also a way of moving forward.",
    "A small smile can change someone's entire day.",
  ],
  career: [
    "The hardest part of any task is always starting — so just start.",
    "Set your own pace — don't run someone else's race.",
    "If you want people to listen to you, listen to them first.",
    "Small habits build big change, especially at work.",
    "Admitting a mistake isn't weakness, it's wisdom.",
    "Not every hard question needs an immediate answer.",
    "The habit of listening is worth more than the habit of talking.",
    "Every day feels harder for those who never plan.",
  ],
  focus: [
    "Before a quick decision, take one slow breath.",
    "Dream big, but start with something small.",
    "If something keeps draining you, it's worth rethinking.",
    "Rest is necessary, but don't let it outrank your purpose.",
    "Measure yourself against who you were yesterday, not against others.",
    "The thing that scares you is usually the best place to learn.",
    "Don't trade today's peace for tomorrow's worry.",
    "The real lessons are the ones you can't be taught.",
  ],
};

// Helper function: current category ke pool se ek random advice line nikalti hai
function draw(category) {
  const pool = BANK[category];
  // Math.random() 0 se 1 ke beech decimal deta hai, use array index me convert kar rahe hain
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------------------------------------------
// 2) MAIN COMPONENT
// ---------------------------------------------
export default function AdviceOracle() {
  // ----- State variables (component ki "memory") -----

  const [category, setCategory] = useState("life");
  // ^ kaunsi category abhi active hai (default "life")

  const [selected, setSelected] = useState(null);
  // ^ dial pe kaunsa number (1-8) click hua hai (shuru me koi nahi -> null)

  const [flipped, setFlipped] = useState(false);
  // ^ card flip ho chuki hai ya nahi (false = front dikh raha hai / number,
  //   true = back dikh raha hai / advice text)

  const [advice, setAdvice] = useState("");
  // ^ jo advice line draw hui hai wo yahan store hoti hai

  const [spinKey, setSpinKey] = useState(0);
  // ^ ye sirf ek "trick" variable hai. Har baar naya number ho ya same number
  //   dobara click ho, hum ye value +1 kar dete hain taake React us card ko
  //   "fresh" element samjhe aur animation dobara se (0 se) chale.
  //   (React me 'key' prop change hone se element re-mount hota hai)

  // ----- Dial ke 8 points ki positions calculate karna -----
  const positions = useMemo(() => {
    const R = 128; // circle ka radius (pixels me) — dial kitna bada hoga

    // 8 numbers ko circle par barabar faasle par rakhne ke liye trigonometry:
    // har point ka angle = (uska index / total points) * pura circle (2π)
    // "- Math.PI / 2" isliye taake number 1 sabse upar se start ho (12 o'clock jaisa)
    return Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * 2 * Math.PI - Math.PI / 2;
      return {
        n: i + 1,                    // number 1 se 8 tak
        x: Math.cos(angle) * R,      // horizontal position
        y: Math.sin(angle) * R,      // vertical position
      };
    });
  }, []); // [] ka matlab: ye calculation sirf ek baar ho, dobara re-render pe nahi

  // ----- Jab user dial ka koi number click kare -----
  function pick(n) {
    setSelected(n);      // step 1: konsa number select hua, wo save karo
    setFlipped(false);   // step 2: card ko wapas "front" pe le aao (unflip)
    setSpinKey((k) => k + 1); // step 3: fresh animation trigger karne ke liye key badlo

    // requestAnimationFrame = browser ko bolna "agla frame render hone se pehle ye chalao"
    // Isse hum ensure karte hain ke unflip (front dikhna) pehle screen pe render ho jaye,
    // uske baad hi naya advice set ho aur flip animation shuru ho — warna animation glitch karegi
    requestAnimationFrame(() => {
      setAdvice(draw(category)); // step 4: current category se random advice nikalo
      requestAnimationFrame(() => setFlipped(true)); // step 5: ab card ko flip kardo (back dikhao)
    });
  }

  // ----- Jab user category chip (Life/Career/Focus) change kare -----
  function changeCategory(id) {
    setCategory(id);     // nayi category set karo
    setSelected(null);   // purana selected number hata do
    setFlipped(false);   // card ko unflip kardo
    setAdvice("");       // purani advice bhi clear kardo
    // (taake category change karne pe screen "reset" ho jaye, purani state na dikhe)
  }

  // ---------------------------------------------
  // 3) UI (JSX) — jo actually screen pe dikhta hai
  // ---------------------------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, #1c1a2e 0%, #12101C 55%, #0c0a14 100%)",
        color: "#EDEAF6",
        fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 20px 72px",
      }}
    >
      {/* ---------- Header: title aur subtitle ---------- */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#FFD166", fontWeight: 700 }}>
          The Advice Oracle
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, margin: "8px 0 4px" }}>
          Choose your number
        </h1>
        <p style={{ color: "#8b87a3", fontSize: 14, margin: 0, maxWidth: 380 }}>
          Pick a category, then touch a point on the ring to draw your advice.
        </p>
      </div>

      {/* ---------- Category chips (Life / Career / Focus buttons) ---------- */}
      <div style={{ display: "flex", gap: 10, marginBottom: 44, flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            // agar ye chip active category hai to "active" class bhi lagegi (highlight ke liye)
            className={"chip" + (category === c.id ? " active" : "")}
            onClick={() => changeCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ---------- Circular dial + beech me flip card ---------- */}
      <div
        style={{
          position: "relative", // taake andar ke absolute-positioned elements isi ke relative se position lein
          width: 340,
          height: 340,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* halki si glowing ring, sirf decoration ke liye */}
        <div
          className="ring-pulse"
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />

        {/* 8 number buttons — 'positions' array se calculate ki hui x,y jagah pe rakhe jaate hain */}
        {positions.map((p) => (
          <button
            key={p.n}
            // agar ye wahi number hai jo currently selected hai, to "active" class lagti hai (highlight)
            className={"dial-node" + (selected === p.n ? " active" : "")}
            style={{
              // container ke center (50%) se x,y offset karke exact position set kar rahe hain
              // -22px isliye kyunki button ka width/height 44px hai, to usko center karna hai
              left: `calc(50% + ${p.x}px - 22px)`,
              top: `calc(50% + ${p.y}px - 22px)`,
            }}
            onClick={() => pick(p.n)}
          >
            {p.n}
          </button>
        ))}

        {/* ---------- Flip card (dial ke beech me) ---------- */}
        {/* 'flip-scene' perspective deta hai taake 3D rotation realistic lage */}
        <div className="flip-scene" style={{ width: 190, height: 190 }}>
          {/* key={spinKey} — har naye click pe ye poora element React ke liye "naya" ban jata hai,
              isliye animation hamesha fresh (shuru se) chalti hai, chahe same number dobara click ho */}
          <div key={spinKey} className={"flip-card" + (flipped ? " is-flipped" : "")}>

            {/* FRONT face — jab tak card flip nahi hui, ye dikhta hai (selected number) */}
            <div
              className="flip-face"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <span style={{ fontSize: 42, color: "#6C5CE7", fontFamily: "Georgia, serif" }}>
                {selected ?? "?"}
                {/* ?? matlab: agar selected null hai to "?" dikhao, warna number dikhao */}
              </span>
            </div>

            {/* BACK face — flip hone ke baad ye dikhta hai (advice text) */}
            <div
              className="flip-face flip-back"
              style={{
                background: "linear-gradient(160deg,#241f3d,#171429)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  textAlign: "center",
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  // sirf jab flipped ho tabhi fadeIn animation chalao, warna "none"
                  animation: flipped ? "fadeIn .4s ease .3s both" : "none",
                }}
              >
                {advice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- "Draw again" button ---------- */}
      {/* sirf tab dikhta hai jab koi number already selected ho */}
      {selected && (
        <button
          onClick={() => pick(selected)} // wahi number dobara pick karke nayi advice draw karo
          style={{
            marginTop: 40,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#B9B4D0",
            borderRadius: 999,
            padding: "9px 22px",
            fontSize: 13,
            cursor: "pointer",
            transition: "border-color .15s, color .15s",
          }}
          // hover pe border color badalne ke liye inline JS event handlers
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF7F6B")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
        >
          Draw again on {selected}
        </button>
      )}
    </div>
  );
}
