import { useEffect, useState } from "react";
import popSound from "@/assets/sounds/pop.mp3";
import notificationSound from "@/assets/sounds/notification.mp3";
import ChatInput, { type ChatFormData } from "./ChatInput";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import api from "../utilities/axiosConfig";
import { Menu } from "lucide-react";
import ChatSidebar from "./ChatSidebar";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  generatedText: string;
};

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    crypto.randomUUID()
  );

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get<Conversation[]>("/conversations");
      setConversations(data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setActiveConversationId(newId);
    setMessages([]);
    setError("");
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setActiveConversationId(id);
      setError("");
      const { data } = await api.get<Message[]>(`/conversations/${id}`);
      setMessages(data);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    } catch (err) {
      console.error("Failed to load chat", err);
      setError("Could not load this conversation.");
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await api.delete(`/conversations/${id}`);

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (id === activeConversationId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
      setError("Could not delete conversation");
    }
  };
  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      const newMsg: Message = { content: prompt, role: "user" };
      setMessages((prev) => [...prev, newMsg]);
      setIsBotTyping(true);
      setError("");
      popAudio.play();

      const { data } = await api.post<ChatResponse>("/chat", {
        prompt,
        conversationId: activeConversationId,
      });

      const botMsg: Message = { content: data.generatedText, role: "bot" };
      setMessages((prev) => [...prev, botMsg]);
      notificationAudio.play();

      fetchConversations();
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4.5rem)] w-full bg-white overflow-hidden">
      <ChatSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex items-center p-2 md:p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-4 font-medium text-gray-700">
            Gemini Rehabilitation Assistant
          </span>
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-hidden max-w-3xl w-full mx-auto">
          <div className="flex flex-col flex-1 gap-3 mb-5 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-xl">
                  Hello, how can I help with your recovery today?
                </p>
              </div>
            ) : (
              <ChatMessages messages={messages} />
            )}

            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>

          <div className="w-full">
            <ChatInput onSubmit={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
