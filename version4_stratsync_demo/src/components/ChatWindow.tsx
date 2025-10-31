

import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";



interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = messages.some((msg) => msg.sender === "user");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    
 console.log(content);
    try {
      const response = await fetch(
        "https://ss-chatbot-service-431223872160.asia-southeast1.run.app/chatbot/message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: content,
        }
      );

      console.log(response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let data: string;

      if (contentType?.includes("application/json")) {
        const jsonData = await response.json();
        data = jsonData.reply || JSON.stringify(jsonData);
      } else {
        data = await response.text();
      }

      
      await new Promise((res) => setTimeout(res, 500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: `Error: ${error.message || "Please try again."}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!hasUserMessages) {
    return (
      <div className="flex flex-col h-full max-w-full mx-auto bg-white shadow-lg">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="text-center mb-12 max-w-3xl">
            <img
              src="/images/logo.jpeg"
              alt="StratSync Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to StratSync
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Your AI co-pilot for customer success and growth. Ask me anything to get started!
            </p>
          </div>
          <div className="w-full max-w-3xl">
            <InputBar
              onSendMessage={handleSendMessage}
              isDisabled={isTyping}
              isCentered
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-full mx-auto bg-white shadow-lg">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <InputBar onSendMessage={handleSendMessage} isDisabled={isTyping} />
    </div>
  );
};

export default ChatWindow;
