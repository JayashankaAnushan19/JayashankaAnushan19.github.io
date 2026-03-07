/* ═══════════════════════════════════════════
   voice.js — AI Voice Assistant
   Uses: Web Speech API (mic + TTS, free, no key)
         Anthropic API (Claude brain, Claude-in-Claude)
═══════════════════════════════════════════ */

// ── KNOWLEDGE BASE about Jayashanka ───────
const SYSTEM_PROMPT = `You are JAY-AI, a concise voice assistant embedded in Jayashanka Anushan's personal portfolio website. Your job is to answer questions about Jayashanka in a friendly, professional, and knowledgeable way.

Here is everything you know about Jayashanka Anushan:

PERSONAL:
- Full name: Jayashanka Anushan
- Location: Dubai, UAE
- Currently pursuing MSc in Robotics
- Quote: "Robots will not replace humans — they will extend human capability."

PROFESSIONAL SUMMARY:
Automation-focused Robotics Engineer with hands-on experience across robotics systems, embedded devices, cloud robotics, and real-world operations automation. Builds at the intersection of software, hardware, and infrastructure — from ROS-based control systems and embedded prototypes to deploying production-ready IT, networking, and smart infrastructure on-site. Currently pursuing an MSc in Robotics while leading automation and operations initiatives in a commercial environment.

RESEARCH INTERESTS:
- Humanoid Robotics
- Human-Robot Interaction (HRI)
- Emotionally Intelligent Robots
- Auditory Perception in Robots
- Robot Vision and Sensor Fusion
- Assistive Robotics for Elderly

TECHNICAL SKILLS:
- Robotics: ROS2 Humble, ROS1 Noetic, Nav2, MoveIt2, Gazebo, RVIZ2
- Cloud: AWS, ROSBridge, MQTT, REST APIs, Docker
- Embedded: Arduino, ESP32, Raspberry Pi, STM32, NVIDIA Jetson, KiCad
- AI/ML: PyTorch, OpenCV, TensorFlow, YOLO, MediaPipe, Sensor Fusion
- Languages: Python, C++, C, Bash, MATLAB, URDF/XACRO
- Infrastructure: Smart Warehousing, Logistics Automation, CCTV/PoE, Networking, Linux

ONLINE PRESENCE:
- GitHub: github.com/JayashankaAnushan19
- LinkedIn: linkedin.com/in/jayashanka-anushan
- YouTube: youtube.com/@jayashankaanushan1336
- Medium: medium.com/@jayasankaanushan199
- Stack Overflow: stackoverflow.com/users/11253065/jayashanka-anushan
- Instagram: instagram.com/jayashankaanushan

CURRENT STATUS:
- Open to R&D collaborations
- MSc research active
- Working on humanoid robotic perception research
- Publications upcoming

INSTRUCTIONS:
- Keep answers SHORT (2-4 sentences max) — they will be read aloud
- Be warm, professional, and enthusiastic about robotics
- If asked something you don't know about Jayashanka, say so honestly
- Don't make up projects or publications
- Use natural spoken language, avoid bullet points in spoken responses
- If asked "what can you do" or "help", list a few things you can answer`;

// ── STATE ─────────────────────────────────
let isOpen = false;
let isSpeaking = false;
let isListening = false;
let recognition = null;
let synth = window.speechSynthesis;
let conversationHistory = [];

// ── DOM REFS ──────────────────────────────
const fab         = document.getElementById('voice-fab');
const panel       = document.getElementById('voice-panel');
const closeBtn    = document.getElementById('vp-close');
const logEl       = document.getElementById('vp-log');
const textInput   = document.getElementById('vp-text-input');
const sendBtn     = document.getElementById('vp-send');
const micBtn      = document.getElementById('vp-mic');
const waveEl      = document.getElementById('vp-wave');
const statusEl    = document.getElementById('vp-status');
const navVoiceBtn = document.getElementById('nav-voice-btn');

// ── PANEL OPEN / CLOSE ────────────────────
function openPanel() {
  isOpen = true;
  panel.classList.add('open');
  fab.setAttribute('aria-expanded', 'true');
  if (logEl.children.length === 0) {
    addMessage('assistant', "Hi! I'm JAY-AI. Ask me anything about Jayashanka — his skills, research, projects, or how to get in touch. You can type or use the mic! 🤖");
  }
}
function closePanel() {
  isOpen = false;
  panel.classList.remove('open');
  stopListening();
  stopSpeaking();
}

fab.addEventListener('click', () => isOpen ? closePanel() : openPanel());
closeBtn?.addEventListener('click', closePanel);
navVoiceBtn?.addEventListener('click', () => isOpen ? closePanel() : openPanel());

// ── ADD MESSAGE TO LOG ────────────────────
function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `vp-msg ${role}`;
  msg.textContent = text;
  logEl.appendChild(msg);
  logEl.scrollTop = logEl.scrollHeight;
  return msg;
}

// ── CALL CLAUDE API ───────────────────────
async function askClaude(userText) {
  conversationHistory.push({ role: 'user', content: userText });

  // Show typing indicator
  const typing = addMessage('assistant', '...');
  setStatus('thinking', 'Thinking...');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: conversationHistory.slice(-8) // keep last 8 turns
      })
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Try again!";

    typing.textContent = reply;
    conversationHistory.push({ role: 'assistant', content: reply });

    setStatus('speaking', 'Speaking...');
    speak(reply);

  } catch (err) {
    console.warn('Claude API error:', err);
    const fallback = getFallbackResponse(userText);
    typing.textContent = fallback;
    setStatus('speaking', 'Speaking...');
    speak(fallback);
  }
}

// ── LOCAL FALLBACK (if API unavailable) ───
function getFallbackResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('skill') || t.includes('tech') || t.includes('know'))
    return "Jayashanka specialises in ROS2, embedded systems, cloud robotics with AWS, and AI perception using PyTorch and OpenCV. He codes in Python and C++.";
  if (t.includes('research') || t.includes('msc') || t.includes('phd'))
    return "He's pursuing an MSc in Robotics focusing on humanoid robotic perception and emotionally intelligent assistive robots for elderly environments.";
  if (t.includes('location') || t.includes('where') || t.includes('dubai'))
    return "Jayashanka is based in Dubai, UAE, where he leads robotics and automation initiatives while pursuing his MSc.";
  if (t.includes('contact') || t.includes('reach') || t.includes('email'))
    return "You can connect with Jayashanka on LinkedIn at linkedin.com/in/jayashanka-anushan, or check his GitHub at github.com/JayashankaAnushan19.";
  if (t.includes('github') || t.includes('project') || t.includes('code'))
    return "Jayashanka's public projects are on GitHub under JayashankaAnushan19, covering ROS2, embedded systems, and robot navigation.";
  if (t.includes('youtube') || t.includes('video'))
    return "His robot demos and tutorials are on YouTube at youtube.com/@jayashankaanushan1336.";
  return "I'm Jay's portfolio assistant! Ask me about his skills, research, projects, or how to get in touch.";
}

// ── SPEECH SYNTHESIS (TTS) ────────────────
function speak(text) {
  if (!synth) return;
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate  = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to pick a good English voice
// Pick the best warm female English voice available
  const voices = synth.getVoices();
  const preferred =
    // Chrome: Google US English female (best quality)
    voices.find(v => v.name === 'Google US English' && v.lang === 'en-US') ||
    // Edge/Windows: Microsoft neural female voices
    voices.find(v => v.name.includes('Aria') && v.lang.startsWith('en')) ||
    voices.find(v => v.name.includes('Jenny') && v.lang.startsWith('en')) ||
    voices.find(v => v.name.includes('Zira') && v.lang.startsWith('en')) ||
    voices.find(v => v.name.includes('Samantha') && v.lang.startsWith('en')) ||
    // Safari/iOS
    voices.find(v => v.name === 'Samantha') ||
    // Any English female fallback
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('female')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;

  // Slightly slower and warmer tone
  utterance.rate  = 0.92;
  utterance.pitch = 1.08;

  utterance.onstart = () => {
    isSpeaking = true;
    fab.classList.add('speaking');
    waveEl.className = 'vp-wave speaking';
    setStatus('speaking', 'Speaking...');
  };
  utterance.onend = () => {
    isSpeaking = false;
    fab.classList.remove('speaking');
    waveEl.className = 'vp-wave';
    setWaveIdle();
    setStatus('ready', 'Ready');
  };
  utterance.onerror = () => {
    isSpeaking = false;
    fab.classList.remove('speaking');
    setStatus('ready', 'Ready');
  };

  synth.speak(utterance);
}

function stopSpeaking() {
  if (synth && synth.speaking) {
    synth.cancel();
    isSpeaking = false;
    fab.classList.remove('speaking');
  }
}

// ── SPEECH RECOGNITION (STT) ──────────────
function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    micBtn?.setAttribute('title', 'Speech recognition not supported in this browser');
    micBtn?.setAttribute('disabled', true);
    return null;
  }

  const rec = new SR();
  rec.continuous = false;
  rec.interimResults = true;
  rec.lang = 'en-US';

  rec.onstart = () => {
    isListening = true;
    micBtn?.classList.add('active');
    fab.classList.add('listening');
    waveEl.className = 'vp-wave listening';
    setStatus('active', 'Listening...');
  };

  rec.onresult = (e) => {
    const interim = Array.from(e.results)
      .map(r => r[0].transcript).join('');
    if (textInput) textInput.value = interim;

    if (e.results[e.results.length - 1].isFinal) {
      const final = e.results[e.results.length - 1][0].transcript.trim();
      if (final) {
        if (textInput) textInput.value = '';
        sendMessage(final);
      }
    }
  };

  rec.onerror = (e) => {
    console.warn('Speech recognition error:', e.error);
    isListening = false;
    micBtn?.classList.remove('active');
    fab.classList.remove('listening');
    waveEl.className = 'vp-wave';
    setWaveIdle();
    setStatus('ready', 'Ready');
  };

  rec.onend = () => {
    isListening = false;
    micBtn?.classList.remove('active');
    fab.classList.remove('listening');
    waveEl.className = 'vp-wave';
    setWaveIdle();
    if (!isSpeaking) setStatus('ready', 'Ready');
  };

  return rec;
}

function startListening() {
  if (!recognition) recognition = initSpeechRecognition();
  if (!recognition) return;
  stopSpeaking();
  try { recognition.start(); } catch(e) {}
}

function stopListening() {
  if (recognition && isListening) {
    try { recognition.stop(); } catch(e) {}
  }
}

micBtn?.addEventListener('click', () => {
  if (isListening) stopListening();
  else startListening();
});

// ── SEND MESSAGE ──────────────────────────
function sendMessage(text) {
  const trimmed = (text || textInput?.value || '').trim();
  if (!trimmed) return;
  if (textInput) textInput.value = '';
  addMessage('user', trimmed);
  setStatus('active', 'Processing...');
  askClaude(trimmed);
}

sendBtn?.addEventListener('click', () => sendMessage());
textInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// ── SUGGESTION CHIPS ──────────────────────
document.querySelectorAll('.vp-chip').forEach(chip => {
  chip.addEventListener('click', () => sendMessage(chip.textContent));
});

// ── HELPERS ───────────────────────────────
function setStatus(state, text) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = 'vp-status ' + (state === 'ready' ? '' : state);
}

function setWaveIdle() {
  if (waveEl) {
    document.querySelectorAll('.wave-bar').forEach(b => b.style.height = '4px');
  }
}

// Load voices async (needed for Chrome)
if (synth) {
  synth.getVoices();
  synth.addEventListener('voiceschanged', () => synth.getVoices());
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  recognition = initSpeechRecognition();
  setStatus('ready', 'Ready');
});
