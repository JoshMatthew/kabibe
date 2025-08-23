import {useState, useRef, useEffect } from 'react';
import conch from './assets/conch.png'
import './App.css'

function App() {
  const answers = [
    'Ang aking kasagutan ay... Indi po ateee',
    'Oo baka mamaya',
    'Edi wow sayo',
    'Pwedeng oo pwedeng hindiiii',
    'Mukha kang lechon',
    'Wag na baka makidlatan ka pa eh',
    'Mukha kang adobong manok',
    'Pwede pero ngayon lang at d na pwede ulit ble',
    'Bahala ka sa buhay mo',
    'Tanong mo muna kay sa crush mo bago sakin',
    'Suntok sa buwan yan beh',
    'Oo pero may plot twist',
    'Hindi, kasi busy ako mag ML',
    'Try ulit bukas, baka iba sagot',
    'Secret, bawal pa sabihin 😏',
    'Kung para sayo, babalik yan',
    'Oo, kaso baka umiyak ka',
    'Pwedeng oo kung may Jollibee ka',
    'Ayoko sagutin, baka ma-ghost ka'
  ];

  const [answer, setAnswer] = useState("");
  const [voices, setVoices] = useState([]);
  const speakingRef = useRef(false);

  // Load voices (Chrome loads them async; listen for "voiceschanged")
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const v = synth.getVoices();
      if (v && v.length) setVoices(v);
    };

    // try immediately
    loadVoices();
    // then subscribe for async load (Chrome)
    synth.addEventListener("voiceschanged", loadVoices);

    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);


  function speak(text) {
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    // Cancel anything queued to avoid overlaps/spam-click
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    // Try Tagalog/Filipino voice first; fall back to anything
    const preferred =
      voices.find(v => /^(fil|tl)-/i.test(v.lang)) ||
        voices.find(v => v.lang.startsWith("en-")) ||
        voices[0];

    if (preferred) utter.voice = preferred;
    // Hint language (helps some UAs pick better prosody)
    utter.lang = preferred?.lang || "fil-PH";

    // Tweak delivery
    utter.rate = 1.0;  // 0.1–10
    utter.pitch = 1.0; // 0–2
    utter.volume = 1.0;

    speakingRef.current = true;
    utter.onend = () => (speakingRef.current = false);

    synth.speak(utter);
  }
  
  function handleClick() {
    const pick = answers[Math.floor(Math.random() * answers.length)];
    setAnswer(pick);
    speak(pick); // 🔊 say it out loud
  }

  return (
    <main className="container">
      {/* Pass the dialog text to ::after via CSS var (note the quotes) */}
      <div
        className="conch"
        style={{ "--answer": `"${answer || "..."}"` }}
        data-empty={String(!answer)}
      >
        <img src={conch} alt="Green pixel conch shell" />
      </div>

      <button onClick={handleClick}>Get answers</button>
    </main>
  )
}

export default App
