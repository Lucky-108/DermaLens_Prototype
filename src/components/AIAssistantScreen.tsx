import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, ScreeningResult } from '../types';
import { AIService } from '../services/aiService';

interface AIAssistantScreenProps {
  currentResult: ScreeningResult | null;
  onBack: () => void;
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ currentResult, onBack }) => {
  const initialGreeting = currentResult
    ? `Your screening showed a ${currentResult.categoryTitle.toLowerCase()} with ${currentResult.confidence}% model confidence. Remember that this is an initial screening support tool, not a medical diagnosis. I can explain what your result means and when to consult a doctor!`
    : "Hello! I am the DermaLens AI Assistant. I can help answer questions about skin screening results, ABCDE monitoring guidelines, and when to seek a dermatologist's care.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    'What does my result mean?',
    'What should I monitor?',
    'When should I see a dermatologist?',
    'Can you explain the result simply?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const botReply = await AIService.generateAssistantResponse(currentResult, query, messages);
      const assistantMsg: ChatMessage = {
        id: `msg_ast_${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          text: 'I apologize, I am temporarily unable to process your question. Please consult a medical professional if you have health concerns.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#050505',
        position: 'relative',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        <button className="btn-ghost" onClick={onBack} style={{ padding: '6px' }}>
          <ArrowLeft size={20} color="white" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
              DERMALENS AI
            </h3>
            <p className="tech-label" style={{ fontSize: '0.68rem', color: '#A7A7A7' }}>
              EXPLAIN YOUR SCREENING RESULT
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                gap: '8px',
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 214, 0, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    border: '1px solid rgba(255, 214, 0, 0.3)',
                  }}
                >
                  <Bot size={15} />
                </div>
              )}

              <div
                style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-control)',
                  backgroundColor: isUser ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: isUser ? '#000000' : 'white',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  borderLeft: isUser ? 'none' : '3px solid var(--primary)',
                  fontSize: '0.84rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-line',
                  fontWeight: isUser ? 700 : 500,
                }}
              >
                {msg.text}
                <div
                  style={{
                    fontSize: '0.64rem',
                    marginTop: '4px',
                    textAlign: 'right',
                    color: isUser ? 'rgba(0,0,0,0.65)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={14} />
            </div>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-control)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderLeft: '3px solid var(--primary)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Loader2 size={13} className="animate-spinner" color="var(--primary)" /> THINKING...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div
        style={{
          padding: '8px 14px',
          overflowX: 'auto',
          display: 'flex',
          gap: '6px',
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface-elevated)',
              color: 'var(--primary)',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'background-color 0.1s ease',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Text Input Footer */}
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: '#0A0A0A',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <input
          type="text"
          placeholder="Ask about your screening result..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{
            flex: 1,
            height: '42px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--border-subtle)',
            padding: '0 14px',
            fontSize: '0.84rem',
            outline: 'none',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'white',
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-control)',
            backgroundColor: 'var(--primary)',
            color: '#000000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            opacity: inputText.trim() ? 1 : 0.4,
            transition: 'opacity 0.1s ease',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
