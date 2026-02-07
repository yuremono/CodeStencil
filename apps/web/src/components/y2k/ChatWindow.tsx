"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Send, Minimize2, Maximize2, X } from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

export interface ChatWindowProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  title?: string;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ChatWindow = React.forwardRef<HTMLDivElement, ChatWindowProps>(
  (
    {
      className,
      width = 350,
      height = 400,
      title = "Y2K Chat",
      messages: initialMessages = [],
      onSendMessage,
      isOpen = true,
      onClose,
    },
    ref
  ) => {
    const [messages, setMessages] = React.useState<ChatMessage[]>([
      {
        id: "1",
        sender: "System",
        message: "Welcome to Y2K Chat! Connecting...",
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false,
      },
      ...initialMessages,
    ]);
    const [inputValue, setInputValue] = React.useState("");
    const [isMinimized, setIsMinimized] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    React.useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
      if (inputValue.trim()) {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "You",
          message: inputValue,
          timestamp: new Date().toLocaleTimeString(),
          isOwn: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        onSendMessage?.(inputValue);
        setInputValue("");

        // Simulate response after a delay
        setTimeout(() => {
          const responses = [
            "Cool! That's awesome! :)",
            "Totally agree with you!",
            "Remember when we used ICQ?",
            "ASL? lol",
            "BRB, phone call",
            "Check out this new Winamp skin!",
          ];
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: "Guest_" + Math.floor(Math.random() * 999),
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toLocaleTimeString(),
            isOwn: false,
          };
          setMessages((prev) => [...prev, botMessage]);
        }, 1000 + Math.random() * 2000);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-[#c0c0c0]",
          "border-2 border-[#dfdfdf] border-b-2 border-r-2 border-[#808080]",
          "shadow-lg",
          className
        )}
        style={{ width, height: isMinimized ? "auto" : height }}
      >
        {/* Title bar - Windows 95 style */}
        <div
          className={cn(
            "flex items-center justify-between px-2 py-1",
            "bg-gradient-to-r from-[#000080] via-[#0000a0] to-[#000080]",
            "text-white font-mono text-sm",
            "border-b border-[#808080]"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#c0c0c0] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#ffff00]" />
            </div>
            <span className="font-bold">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={cn(
                "w-4 h-3 flex items-center justify-center",
                "bg-[#c0c0c0] border-t border-l border-white",
                "border-b border-r border-[#808080]",
                "hover:bg-[#dfdfdf]"
              )}
            >
              {isMinimized ? <Maximize2 size={8} /> : <Minimize2 size={8} />}
            </button>
            <button
              onClick={onClose}
              className={cn(
                "w-4 h-3 flex items-center justify-center",
                "bg-[#c0c0c0] border-t border-l border-white",
                "border-b border-r border-[#808080]",
                "hover:bg-[#dfdfdf]"
              )}
            >
              <X size={8} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Menu bar */}
            <div
              className={cn(
                "flex items-center gap-4 px-2 py-0.5",
                "bg-[#c0c0c0] border-b border-[#808080]",
                "text-xs"
              )}
            >
              <button className="hover:bg-[#000080] hover:text-white px-1">
                File
              </button>
              <button className="hover:bg-[#000080] hover:text-white px-1">
                Edit
              </button>
              <button className="hover:bg-[#000080] hover:text-white px-1">
                View
              </button>
              <button className="hover:bg-[#000080] hover:text-white px-1">
                Help
              </button>
            </div>

            {/* Messages area */}
            <div
              className={cn(
                "flex-1 p-2 overflow-y-auto",
                "bg-[#ffffff]",
                "border-b border-[#808080]",
                "min-h-[300px]"
              )}
              style={{ maxHeight: "calc(100% - 120px)" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "mb-2 p-2 font-mono text-xs",
                    "border border-[#c0c0c0]",
                    msg.isOwn
                      ? "bg-[#e0e0ff] ml-8"
                      : "bg-[#f0f0f0] mr-8"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "font-bold",
                      msg.isOwn ? "text-[#000080]" : "text-[#800000]"
                    )}>
                      {msg.sender}
                    </span>
                    <span className="text-[#808080] text-[10px]">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="text-[#000000]">{msg.message}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Online users */}
            <div
              className={cn(
                "px-2 py-1",
                "bg-[#c0c0c0] border-b border-[#808080]",
                "text-xs font-mono"
              )}
            >
              <span className="text-[#008000]">●</span> Online: Guest_123,
              Guest_456, CyberKid2000, NeoMatrix
            </div>

            {/* Input area */}
            <div
              className={cn(
                "p-2 bg-[#c0c0c0]",
                "flex items-center gap-2"
              )}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className={cn(
                  "flex-1 px-2 py-1",
                  "bg-[#ffffff] border-2",
                  "border-t border-l border-white",
                  "border-b border-r border-[#808080]",
                  "font-mono text-xs",
                  "focus:outline-none focus:border-[#000080]"
                )}
              />
              <button
                onClick={handleSendMessage}
                className={cn(
                  "px-3 py-1",
                  "bg-[#c0c0c0]",
                  "border-t-2 border-l-2 border-white",
                  "border-b-2 border-r-2 border-[#808080]",
                  "font-mono text-xs",
                  "hover:bg-[#dfdfdf]",
                  "active:border-t-0 active:border-l-0",
                  "active:border-b-2 active:border-r-2 active:border-[#808080]",
                  "flex items-center gap-1"
                )}
              >
                <Send size={12} />
                Send
              </button>
            </div>

            {/* Status bar */}
            <div
              className={cn(
                "flex items-center justify-between px-2 py-0.5",
                "bg-[#c0c0c0] border-t border-[#808080]",
                "text-[10px] font-mono text-[#808080]"
              )}
            >
              <span>Connected</span>
              <span>Y2K v1.0</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

ChatWindow.displayName = "ChatWindow";

export { ChatWindow };
