import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  CornerDownLeft, 
  Compass, 
  ShieldAlert, 
  Sliders, 
  Route, 
  RotateCcw,
  Zap,
  Volume2
} from 'lucide-react';
import { HighwayCorridor, HIGHWAY_CORRIDORS } from '../data/indiaDigitalTwinData';
import { tacticalAudio } from '../services/tacticalAudio';

interface RoadGuardCopilotOrbProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedHighway: HighwayCorridor;
  onSelectHighway: (highway: HighwayCorridor) => void;
  onOpenWhatIf: () => void;
  onOpenRouteAnalyzer: () => void;
  onOpenEmergency: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  suggestedAction?: {
    label: string;
    actionType: 'select_highway' | 'open_whatif' | 'open_route' | 'open_emergency';
    param?: string;
  };
}

export const RoadGuardCopilotOrb: React.FC<RoadGuardCopilotOrbProps> = ({
  isOpen,
  onToggle,
  selectedHighway,
  onSelectHighway,
  onOpenWhatIf,
  onOpenRouteAnalyzer,
  onOpenEmergency
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'copilot',
      text: `Greetings Officer. I am ROADGUARD COPILOT, your tactical road intelligence assistant. Currently monitoring 6 major National Highway corridors across India. How can I assist your investigation?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    'Why is NH-44 Tamil Nadu high risk?',
    'Show dangerous highways in Maharashtra',
    'Find safer route Chennai to Bengaluru',
    'What happens if rainfall increases by 40%?',
    'Which blackspots need immediate attention?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    tacticalAudio.playRadarPing();
    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      let reply = '';
      let action: Message['suggestedAction'] = undefined;

      if (lower.includes('nh-44') || lower.includes('tamil nadu') || lower.includes('salem') || lower.includes('madurai')) {
        const nh44 = HIGHWAY_CORRIDORS.find(h => h.code === 'NH-44');
        if (nh44) onSelectHighway(nh44);
        reply = `NH-44 through Tamil Nadu (Salem–Namakkal–Madurai) is currently at 78/100 HIGH RISK. Contributing factors: 86% commercial traffic saturation, ongoing monsoon showers reducing photopic visibility to <350m, and severe blind curve curvature at Namakkal S-Bend.`;
        action = { label: 'Center NH-44 on Map', actionType: 'select_highway', param: 'NH-44-TN' };
      } else if (lower.includes('maharashtra') || lower.includes('mumbai') || lower.includes('pune') || lower.includes('bhor')) {
        const mpew = HIGHWAY_CORRIDORS.find(h => h.id === 'NH-48-MUM-PUN');
        if (mpew) onSelectHighway(mpew);
        reply = `The Mumbai-Pune Expressway & Bhor Ghat section (NH-48) is at 84/100 CRITICAL RISK. The 8.5% downhill gradient combined with brake thermal overload on heavy container lorries and valley fog constitutes the primary collision trigger.`;
        action = { label: 'Focus Mumbai-Pune Corridor', actionType: 'select_highway', param: 'NH-48-MUM-PUN' };
      } else if (lower.includes('route') || lower.includes('chennai to bengaluru') || lower.includes('safer')) {
        reply = `I have analyzed 3 interstate routes between Chennai and Bengaluru. Route B (via Chittoor Bypass) delivers a 43 Risk Score compared to 61 on primary NH-48, avoiding the Sriperumbudur industrial freight bottleneck with only a 16-minute travel delta.`;
        action = { label: 'Open Safety Route Analyzer', actionType: 'open_route' };
      } else if (lower.includes('rain') || lower.includes('rainfall') || lower.includes('what if') || lower.includes('simulation')) {
        reply = `Simulating +40% monsoon precipitation elevates the current risk from 78 to 94 (+16 points), triggering severe hydroplaning alerts and cascading traffic backlogs onto adjacent state highways.`;
        action = { label: 'Run Scenario Lab', actionType: 'open_whatif' };
      } else if (lower.includes('blackspot') || lower.includes('emergency')) {
        reply = `AI DBSCAN clustering has detected 4 active blackspots. The highest priority is Namakkal Thuraiyur S-Bend (38 fatalities over 3 years). Nearest Level-1 Trauma Hospital is Government Mohan Kumaramangalam Super-Specialty (6.4 min response).`;
        action = { label: 'View Emergency Network', actionType: 'open_emergency' };
      } else {
        reply = `Analysis confirmed for ${selectedHighway.name}. The current risk index is ${selectedHighway.riskScore}/100 with ${selectedHighway.confidenceScore}% model confidence. Would you like to inspect causal SHAP factors or simulate civil engineering interventions?`;
      }

      setMessages(prev => [...prev, {
        id: `c-${Date.now()}`,
        sender: 'copilot',
        text: reply,
        suggestedAction: action
      }]);
      tacticalAudio.playRadarPing();
    }, 900);
  };

  return (
    <>
      {/* Closed Floating Orb (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => { tacticalAudio.playRadarPing(); onToggle(); }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#070B14]/95 backdrop-blur-md border border-violet-500/50 text-white shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:border-violet-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2.5 font-mono text-xs"
          title="Open ROADGUARD AI Copilot"
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
          </div>
          <span className="font-extrabold tracking-wider hidden sm:inline">ROADGUARD COPILOT</span>
        </button>
      )}

      {/* Expanded Tactical Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] z-50 bg-[#070B14]/95 backdrop-blur-xl border border-violet-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono text-xs select-none">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-violet-950/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300">
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              </div>
              <div>
                <div className="font-black text-white text-[11px] tracking-wide">ROADGUARD COPILOT</div>
                <div className="text-[9px] text-emerald-400">● LIVE MAP INTELLIGENCE LINKED</div>
              </div>
            </div>

            <button
              onClick={() => { tacticalAudio.playRadarPing(); onToggle(); }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-violet-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Interactive Map Trigger Button */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => {
                      tacticalAudio.playRadarPing();
                      if (msg.suggestedAction?.actionType === 'open_whatif') onOpenWhatIf();
                      else if (msg.suggestedAction?.actionType === 'open_route') onOpenRouteAnalyzer();
                      else if (msg.suggestedAction?.actionType === 'open_emergency') onOpenEmergency();
                    }}
                    className="mt-1 px-2.5 py-1 rounded bg-violet-950/80 hover:bg-violet-900 text-violet-300 border border-violet-500/30 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3 h-3 text-violet-400" />
                    <span>{msg.suggestedAction.label}</span>
                  </button>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-slate-900 rounded-lg w-20 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce delay-200"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1 bg-slate-950/40">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[10px] whitespace-nowrap cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-2.5 border-t border-slate-800 bg-[#070B14] flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Ask Copilot about any highway or risk..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
