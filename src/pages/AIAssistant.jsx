import { useState, useRef, useEffect } from 'react';
import Topbar from '../components/layout/Topbar';
import styles from './AIAssistant.module.css';

const SUGGESTIONS = [
  'Show abnormal lab results this week',
  'Which tenants have the most DLQ failures?',
  'Summarize today\'s extraction pipeline health',
  'List patients with pending review status',
];

function Message({ msg }) {
  return (
    <div className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
      {msg.role === 'assistant' && (
        <div className={styles.aiAvatar}>AI</div>
      )}
      <div className={styles.bubble}>
        {msg.content}
        {msg.loading && <span className={styles.cursor}>▌</span>}
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your HealthAI assistant. Ask me about pipeline health, patient data, extraction failures, or SLA status.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = `You are a healthcare data platform assistant for HealthAI. 
You help managers, analysts, and data engineers understand pipeline health, patient report processing, SLA status, and extraction quality.
Keep responses concise and data-focused. Use bullet points for lists.
Example context: 1,284 documents processed today, 97.3% extraction success, 18 in DLQ, 5 tenants active.
If asked about specific patients, remind users to use the Patients page for HIPAA-compliant access.`;

  async function sendMessage(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    const aiMsg = { role: 'assistant', content: '', loading: true };
    setMessages(prev => [...prev, aiMsg]);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: reply, loading: false };
        return updated;
      });
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: 'Connection error. Check your API key and network.', loading: false };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className={styles.page}>
      <Topbar title="AI assistant" subtitle="Ask questions about your data" />
      <div className={styles.layout}>
        <div className={styles.chatArea}>
          <div className={styles.messages}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <button key={s} className={styles.suggestion} onClick={() => sendMessage(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className={styles.inputBar}>
            <textarea
              className={styles.input}
              placeholder="Ask about pipeline, patients, SLAs, failures…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? '…' : '↑'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
