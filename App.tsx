
import React, { useState, useCallback } from 'react';
import { Grade, Subject, ChatMessage } from './types';
import SelectionPanel from './components/SelectionPanel';
import ChatInterface from './components/ChatInterface';
import { askEduGenie } from './services/geminiService';

const App: React.FC = () => {
  const [grade, setGrade] = useState<Grade | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!grade || !subject) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await askEduGenie(grade, subject, text, history);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [grade, subject, messages]);

  const handleClearChat = () => {
    setGrade(null);
    setSubject(null);
    setMessages([]);
    setError(null);
  };

  const isConfigured = grade && subject;

  return (
    <div className="min-h-screen pb-12 bg-slate-50/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              EduGenie AI
            </h1>
          </div>
          <button 
            onClick={handleClearChat}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-100 bg-white"
          >
            Reset Session
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Only show welcome header when not configured */}
        {!isConfigured && (
          <div className="mb-8 animate-in fade-in duration-700">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Ready to learn something new?
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              Personalize your AI tutor by choosing your grade and subject. EduGenie adapts its explanations to match your academic level perfectly.
            </p>
          </div>
        )}

        {/* Configuration Wizard */}
        <SelectionPanel 
          currentGrade={grade} 
          currentSubject={subject} 
          onGradeChange={(g) => {
            setGrade(g);
            if (!g) setSubject(null);
          }} 
          onSubjectChange={setSubject} 
        />

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Chat Component - Only visible when fully configured */}
        {isConfigured && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <ChatInterface 
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              grade={grade}
              subject={subject}
            />

            {/* Educational Footer Tips - Only show when chatting */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in duration-1000 delay-500">
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900 text-sm mb-2">Be Specific</h4>
                <p className="text-xs text-indigo-700/80 leading-relaxed">
                  Instead of "Help with math", try "Explain how to solve quadratic equations using the formula."
                </p>
              </div>
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-sm mb-2">Ask Why</h4>
                <p className="text-xs text-emerald-700/80 leading-relaxed">
                  EduGenie is great at reasoning. Ask for the "logic" or "historical context" behind a concept.
                </p>
              </div>
              <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
                <h4 className="font-bold text-amber-900 text-sm mb-2">Test Yourself</h4>
                <p className="text-xs text-amber-700/80 leading-relaxed">
                  Ask "Can you quiz me on the key events of the Industrial Revolution?" to practice active recall.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
