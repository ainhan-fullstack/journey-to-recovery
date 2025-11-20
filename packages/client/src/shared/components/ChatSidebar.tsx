import { Plus, MessageSquare } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

type Props = {
  isOpen: boolean;
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

const ChatSidebar = ({
  isOpen,
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
}: Props) => {
  return (
    <div
      className={`
        bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
        ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full opacity-0 overflow-hidden"
        }
        h-full absolute md:relative z-20 md:translate-x-0
      `}
    >
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-start gap-2 px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4 text-gray-500" />
          <span className="truncate">New chat</span>
        </button>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-gray-500">
        Recent
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`
              w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-200 rounded-r-full mr-2 text-sm transition-colors
              ${
                activeId === conv.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700"
              }
            `}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate">{conv.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
