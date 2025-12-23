
import React, { useState, useEffect } from 'react';
import { Ticket, GameState, EvaluationResult } from './types';
import { CANNED_RESPONSES, TICKET_POOL } from './constants';
import { generateNewLocalTicket, evaluateLocalResponse } from './services/geminiService';
import StatsHeader from './components/StatsHeader';
import Terminal from './components/Terminal';
import Snow from './components/Snow';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    score: 0,
    ticketsResolved: 0,
    satisfaction: 85,
    stressLevel: 20,
    inventory: []
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseText, setResponseText] = useState('');
  const [logs, setLogs] = useState<string[]>(["System initialized...", "Welcome, Senior Support Engineer Claus."]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  // Initial tickets
  useEffect(() => {
    const initial = [
      generateNewLocalTicket([]),
      generateNewLocalTicket([TICKET_POOL[0].id])
    ];
    setTickets(initial);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResponseText('');
    setFeedback(null);
  };

  const handleSendResponse = () => {
    if (!selectedTicket || !responseText || isEvaluating) return;

    setIsEvaluating(true);
    addLog(`Transmitting response to ${selectedTicket.sender}...`);
    
    // Artificial delay for "network" feeling
    setTimeout(() => {
      const result = evaluateLocalResponse(selectedTicket, responseText);
      setFeedback(result);
      
      setState(prev => ({
        ...prev,
        score: prev.score + (result.rating * 10),
        ticketsResolved: prev.ticketsResolved + 1,
        satisfaction: Math.min(100, Math.max(0, prev.satisfaction + result.satisfactionImpact)),
        stressLevel: Math.min(100, Math.max(0, prev.stressLevel + result.stressImpact))
      }));

      addLog(`User Rating: ${result.rating}/5. ${result.comment}`);
      
      setTimeout(() => {
        setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
        setSelectedTicket(null);
        setFeedback(null);
        setIsEvaluating(false);
        
        // Always try to keep 3 tickets active
        if (tickets.length < 4) {
          const newTicket = generateNewLocalTicket(tickets.map(t => t.id.split('-')[0]));
          setTickets(prev => [...prev, newTicket]);
          addLog(`Incoming alert: ${newTicket.subject}`);
        }
      }, 3000);
    }, 800);
  };

  const useCannedResponse = (response: string) => {
    setResponseText(prev => prev + (prev ? ' ' : '') + response);
  };

  useEffect(() => {
    if (state.stressLevel >= 100) {
      alert("CRITICAL SYSTEM FAILURE: Santa has reached peak stress levels! Time for a cookie break. Game Over.");
      window.location.reload();
    }
  }, [state.stressLevel]);

  return (
    <>
      <Snow />
      <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto relative z-10">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-900/20">
            <i className="fas fa-gift text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">NorthPole<span className="text-red-500">Mail</span> <span className="text-slate-500 font-light">LocalEdition</span></h1>
            <p className="text-xs text-slate-400 font-medium">Holiday Cloud & Sleigh API Solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-200">Local Cache: Connected</span>
            </div>
          </div>

          <a
            href="https://github.com/deadronos/northpole-mail"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            aria-label="View the project on GitHub"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <i className="fab fa-github text-lg"></i>
          </a>
        </div>
      </header>

      <StatsHeader state={state} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        <div className="lg:col-span-4 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md min-h-0">
          <div className="p-4 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
            <h2 className="font-bold text-slate-200 flex items-center gap-2">
              <i className="fas fa-inbox text-blue-400"></i> Active Tickets ({tickets.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className={`p-3 sm:p-4 rounded-xl cursor-pointer border transition-all ${
                  selectedTicket?.id === ticket.id 
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-900/10' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40'
                }`} 
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] uppercase font-black text-slate-500">{ticket.sender}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    ticket.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                    ticket.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{ticket.difficulty}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{ticket.subject}</h3>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="p-8 text-center text-slate-600 italic text-sm">No active alerts... checking logs...</div>
            )}
          </div>
          <div className="p-4 border-t border-slate-800">
            <Terminal logs={logs} />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md min-h-0">
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl font-black text-white">
                      {selectedTicket.sender.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{selectedTicket.subject}</h2>
                      <p className="text-sm text-slate-400">From: <span className="text-blue-400">{selectedTicket.sender}</span></p>
                    </div>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap font-medium bg-slate-950/30 p-4 rounded-xl border border-slate-800">
                    {selectedTicket.body}
                  </div>
                </div>

                {feedback && (
                  <div className={`p-4 rounded-xl border animate-pulse ${feedback.rating >= 4 ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < feedback.rating ? 'text-yellow-500' : 'text-slate-600'}`}></i>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-white ml-2">Ticket Status: {feedback.rating >= 4 ? 'Resolved' : 'Review Required'}</span>
                    </div>
                    <p className="text-sm text-slate-300 italic">"{feedback.comment}"</p>
                  </div>
                )}

                {!feedback && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {CANNED_RESPONSES.map((resp, i) => (
                        <button 
                          key={i}
                          onClick={() => useCannedResponse(resp)}
                          className="text-[10px] md:text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                        >
                          {resp}
                        </button>
                      ))}
                    </div>
                    <textarea 
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your technical wisdom here... (Tip: Keywords like 'DNS', 'Reboot', 'Database' help!)"
                      className="w-full h-24 md:h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                    ></textarea> 
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedTicket(null)}
                        className="px-6 py-2 rounded-xl text-slate-400 hover:text-slate-200 font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSendResponse}
                        disabled={!responseText || isEvaluating}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-8 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                      >
                        {isEvaluating ? (
                          <><i className="fas fa-spinner animate-spin"></i> Processing...</>
                        ) : (
                          <><i className="fas fa-paper-plane"></i> Send Solution</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-4xl mb-6 text-slate-600 border border-slate-700">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Select a Ticket to Troubleshoot</h2>
              <p className="text-slate-400 max-w-sm">Use your holiday magic and IT expertise to resolve technical issues for the North Pole residents locally.</p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 text-left">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Engineer Tip</p>
                  <p className="text-xs text-slate-300">Custom answers containing technical keywords earn the best ratings!</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 text-left">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Status</p>
                  <p className="text-xs text-slate-300">All local systems nominal. No external API key required.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
        <div>&copy; 202X North Pole IT Department • Secure Connection</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><i className="fas fa-cookie-bite text-orange-500"></i> Local Engine v2.0</span>
          <span className="flex items-center gap-1"><i className="fas fa-snowflake text-blue-400"></i> Offline Support Enabled</span>
        </div>
      </footer>
    </div>
    </>
  );
};

export default App;
