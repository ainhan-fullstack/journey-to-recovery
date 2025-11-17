import { useRef, useState } from "react";
import popSound from "@/assets/sounds/pop.mp3";
import notificationSound from "@/assets/sounds/notification.mp3";
import ChatInput, { type ChatFormData } from "./ChatInput";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import api from "../utilities/axiosConfig";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  generatedText: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState("");
  const conversationId = useRef(crypto.randomUUID());

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsBotTyping(true);
      setError("");
      popAudio.play();

      const { data } = await api.post<ChatResponse>("/chat", {
        prompt,
        conversationId: conversationId.current,
      });
      setMessages((prev) => [
        ...prev,
        { content: data.generatedText, role: "bot" },
      ]);
      notificationAudio.play();
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-4.5rem)] w-full">
        <div className="flex flex-col h-full">
          <div className="flex flex-col flex-1 gap-3 mb-5 overflow-y-auto justify-end">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <ChatInput onSubmit={onSubmit} />
        </div>
    </div>
  );
};

export default ChatBot;
