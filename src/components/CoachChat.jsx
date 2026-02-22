import { useState, useEffect, useRef } from 'react';
import { DEMO_COACHES, getDemoMessages, saveDemoMessage, getDemoAutoResponse } from '../data/demoCoaches';

const CoachChat = ({ relationshipId, coach, userId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [demoMessages, setDemoMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isDemo = relationshipId?.startsWith('demo-rel-');
  const demoCoachId = isDemo ? relationshipId.replace('demo-rel-', '') : null;
  const demoCoach = isDemo ? DEMO_COACHES.find(c => c.id === demoCoachId) : null;

  useEffect(() => {
    if (isDemo) {
      const existing = getDemoMessages(relationshipId);
      if (existing.length === 0) {
        // Seed welcome message from coach
        const welcomeMsg = {
          id: `demo-welcome-${Date.now()}`,
          sender_id: demoCoachId,
          message: getDemoAutoResponse(demoCoachId),
          created_at: new Date().toISOString(),
          read: true,
          message_type: 'chat',
        };
        const seeded = saveDemoMessage(relationshipId, welcomeMsg);
        setDemoMessages(seeded);
      } else {
        setDemoMessages(existing);
      }
      return;
    }
    coach.loadMessages(relationshipId);
    coach.markRead(relationshipId);
    coach.subscribeToMessages(relationshipId);

    return () => {
      coach.unsubscribeFromMessages();
    };
  }, [relationshipId]);

  const messages = isDemo ? demoMessages : coach.messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;
    setNewMessage('');

    if (isDemo) {
      const userMsg = {
        id: `demo-msg-${Date.now()}`,
        sender_id: userId || 'me',
        message: text,
        created_at: new Date().toISOString(),
        read: false,
        message_type: 'chat',
      };
      const updated = saveDemoMessage(relationshipId, userMsg);
      setDemoMessages([...updated]);

      // Auto-response after 2 seconds
      setTimeout(() => {
        const autoReply = {
          id: `demo-reply-${Date.now()}`,
          sender_id: demoCoachId,
          message: "Thanks for your message! I'll get back to you with a personalised response shortly. Keep up the great work! 💪",
          created_at: new Date().toISOString(),
          read: true,
          message_type: 'chat',
        };
        const withReply = saveDemoMessage(relationshipId, autoReply);
        setDemoMessages([...withReply]);
      }, 2000);

      inputRef.current?.focus();
      return;
    }

    await coach.sendMessage(relationshipId, text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr.slice(11, 16);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -my-8">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 border-b border-white/5">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-lg font-bold text-white">Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {isDemo && demoCoach && (
          <div className="flex justify-center">
            <div className="text-center px-4 py-2 bg-amber-500/10 rounded-full">
              <span className="text-[11px] text-amber-400 font-medium">Demo chat with {demoCoach.authorEmoji} {demoCoach.authorName}</span>
            </div>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === userId || msg.sender_id === 'me';
          const isSystem = msg.message_type === 'system' || msg.message_type === 'program_update';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[11px] text-slate-400">{msg.message}</span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${isMe ? 'order-1' : ''}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-app-surface text-slate-200 rounded-bl-md'
                }`}>
                  {msg.message}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : ''}`}>
                  <span className="text-[10px] text-slate-500">{formatTime(msg.created_at)}</span>
                  {isMe && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={msg.read ? 'text-blue-400' : 'text-slate-500'}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 py-3 border-t border-white/5">
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 bg-app-surface/50 text-white text-sm px-4 py-2.5 rounded-2xl outline-none resize-none placeholder:text-slate-600 border border-white/5 focus:border-blue-500/30 transition-colors"
          style={{ maxHeight: '100px' }}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={`p-2.5 rounded-full transition-all ${
            newMessage.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-400'
              : 'bg-app-surface text-slate-500'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
};

export default CoachChat;
