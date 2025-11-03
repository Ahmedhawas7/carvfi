import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Mic, Bot, User } from 'lucide-react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'مرحباً! أنا المساعد الافتراضي لـ CarVFi، كيف يمكنني مساعدتك اليوم؟',
      sender: 'AI',
      timestamp: new Date(),
      isCurrentUser: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        isCurrentUser: true
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsLoading(true);

      // محاكاة استجابة AI
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: `هذه استجابة من الذكاء الاصطناعي لرسالتك: "${newMessage}". كيف يمكنني مساعدتك أكثر؟`,
          sender: 'AI',
          timestamp: new Date(),
          isCurrentUser: false
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden modern-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold">المساعد الافتراضي CarVFi</h3>
            <p className="text-sm text-white/80">متصل وجاهز للمساعدة</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div className={`flex items-start space-x-2 space-x-reverse ${message.isCurrentUser ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.isCurrentUser ? 'bg-blue-500' : 'bg-purple-500'
              }`}>
                {message.isCurrentUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.isCurrentUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-2 space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none shadow-sm px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2 space-x-reverse">
          <button type="button" className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
            <Paperclip size={20} />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-yellow-500 transition-colors">
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            <Send size={20} />
          </button>
          <button type="button" className="p-2 text-gray-500 hover:text-green-500 transition-colors">
            <Mic size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
