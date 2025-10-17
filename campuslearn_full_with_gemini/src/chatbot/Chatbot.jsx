import React, { useState, useRef, useEffect } from 'react';
import { lookupFAQ, queryAI, getTutorsForModule, sendEmailToTutors } from './chatbotService';
import { useAuth } from '../utils/auth';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi, I'm CampusLearn Assistant. Ask about modules, topics, or accounts.", source: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const auth = useAuth();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages(m => [...m, { sender: 'user', text, source: 'user' }]);
    setInput('');
    setLoading(true);

    const faq = await lookupFAQ(text);
    if (faq) {
      setMessages(m => [...m, { sender: 'bot', text: faq.answer, source: 'faq' }]);
      setLoading(false);
      return;
    }

    const ai = await queryAI(text);
    setMessages(m => [...m, { sender: 'bot', text: ai.reply, source: 'ai' }]);
    setLoading(false);

    const moduleCode = ai.detectedModule;
    if (moduleCode) {
      const tutors = await getTutorsForModule(moduleCode);
      const student = auth.user || { name: 'Anonymous', email: 'anonymous@domain' };
      if (tutors.length > 0) {
        const emailRes = await sendEmailToTutors(tutors, student, text);
        setMessages(m => [
          ...m,
          { sender: 'bot', text: emailRes.ok ? `Your question was forwarded to the ${moduleCode} tutors.` : 'Failed to notify tutors via email.', source: 'system' }
        ]);
      } else {
        setMessages(m => [...m, { sender: 'bot', text: `No tutors found for module ${moduleCode}.`, source: 'system' }]);
      }
    }
  }

  const closeBtnStyle = {
    position: 'absolute', top: 10, right: 10, background: 'transparent', border: 'none', fontSize: 20, cursor: 'pointer', color: '#555'
  };

  return (
    <div>
      <button aria-label="Open chat" onClick={() => setOpen(o => !o)} style={floatingButtonStyle}>💬</button>
      {open && (
        <div role="dialog" aria-label="CampusLearn chat" style={panelStyle}>
          <div style={headerStyle}>
            <strong>CampusLearn Assistant</strong>
            <button onClick={() => setOpen(false)} style={closeBtnStyle}>✖</button>
          </div>
          <div style={messagesStyle} aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} style={m.sender === 'user' ? userMsgStyle : botMsgStyle}>
                {m.text} {m.source && <span style={{ fontSize: 10, color: '#888', marginLeft: 6 }}>({m.source})</span>}
              </div>
            ))}
            {loading && <div style={botMsgStyle}>Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div style={inputAreaStyle}>
            <input
              ref={inputRef}
              aria-label="Chat input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              style={inputStyle}
              placeholder="Ask about MATH101, enrolment, login..."
            />
            <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

const floatingButtonStyle = { position: 'fixed', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, background: '#0d6efd', color: '#fff', border: 'none', fontSize: 24, cursor: 'pointer', zIndex: 9999 };
const panelStyle = { position: 'fixed', right: 20, bottom: 86, width: 360, maxWidth: '90vw', height: 520, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.1)', zIndex: 9999, display: 'flex', flexDirection: 'column' };
const headerStyle = { padding: 10, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const messagesStyle = { padding: 10, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 };
const userMsgStyle = { alignSelf: 'flex-end', background: '#d9fdd3', padding: '8px 12px', borderRadius: 10, maxWidth: '80%' };
const botMsgStyle = { alignSelf: 'flex-start', background: '#e9e9eb', padding: '8px 12px', borderRadius: 10, maxWidth: '80%' };
const inputAreaStyle = { padding: 10, borderTop: '1px solid #eee', display: 'flex', gap: 8, alignItems: 'center' };
const inputStyle = { flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6 };
