import React, { useState, useRef, useEffect } from 'react';

const AIChat = ({ user, carvService, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // رسالة ترحيب
    setMessages([
      {
        id: 1,
        text: `Hello! I'm your CARVFi AI assistant. How can I help you with your Web3 journey today?`,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage) => {
    // محاكاة ذكاء اصطناعي أكثر ذكاءً
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const message = userMessage.toLowerCase();
    let response = "I'm here to help you with CARVFi! You can ask me about Web3, your profile, rewards, or anything else.";

    if (message.includes('hello') || message.includes('hi')) {
      response = "Hello there! Welcome to CARVFi. I'm excited to help you explore the world of Web3 social networking!";
    } else if (message.includes('reward') || message.includes('point')) {
      response = "You earn points by being active on CARVFi! Chat with me, update your profile, connect wallets, and participate in the community. The more you engage, the more you earn!";
    } else if (message.includes('web3') || message.includes('blockchain')) {
      response = "Web3 represents the next evolution of the internet - decentralized, user-owned, and built on blockchain technology. CARVFi brings social interactions to this new paradigm!";
    } else if (message.includes('profile') || message.includes('account')) {
      response = "Your profile is your identity in the CARVFi ecosystem. You can connect multiple wallets (EVM and Solana), build reputation, and earn rewards for your contributions.";
    } else if (message.includes('wallet') || message.includes('connect')) {
      response = `I see you're connected with ${user.type.toUpperCase()}. You can also connect other wallets to access more features and earn additional rewards!`;
    } else if (message.includes('nft') || message.includes('token')) {
      response = "CARVFi supports NFTs and tokens across multiple chains. You can display your digital assets, trade, and engage with the NFT community right here!";
    } else if (message.includes('help')) {
      response = "I can help you with: \n• Understanding Web3 concepts\n• Managing your profile and rewards\n• Connecting wallets and assets\n• Navigating CARVFi features\n• Learning about blockchain technology\nWhat would you like to know?";
    } else if (message.includes('future') || message.includes('roadmap')) {
      response = "CARVFi is constantly evolving! We're working on: \n• Multi-chain NFT support\n• Advanced AI features\n• Community governance\n• Cross-chain transactions\n• And much more!";
    }

    // إضافة عنصر التعلم - يتذكر السياق
    if (messages.length > 2) {
      const lastTopics = messages.slice(-3).map(msg => msg.text.substring(0, 50));
      if (lastTopics.some(topic => topic.includes('reward'))) {
        response += " Since you asked about rewards earlier, remember that consistent activity earns you more points!";
      }
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(inputMessage);
      
      const aiMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>🤖 AI Assistant</h3>
        <button className="btn btn-close" onClick={onClose}>×</button>
      </div>

      <div className="ai-chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="message ai loading">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about CARVFi or Web3..."
          disabled={isLoading}
        />
        <button 
          className="btn btn-send"
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
