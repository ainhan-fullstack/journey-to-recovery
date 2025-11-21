import { useState } from "react";
import { Plus, MessageSquare, MoreVertical, Trash } from "lucide-react";

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
  onDeleteConversation: (id: string) => void;
};

const ChatSidebar = ({
  isOpen,
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
}: Props) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteConversation(id);
    setOpenMenuId(null);
  };

  return (
    <>
      {openMenuId && (
        <div
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => setOpenMenuId(null)}
        />
      )}

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

        <div className="flex-1 overflow-y-auto pb-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`
                  group relative flex items-center rounded-r-full mr-2 transition-colors
                  ${
                    activeId === conv.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }
                `}
            >
              <button
                onClick={() => onSelectConversation(conv.id)}
                className="flex-1 text-left px-4 py-2 flex items-center gap-3 min-w-0"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm font-medium">
                  {conv.title}
                </span>
              </button>

              <button
                onClick={(e) => toggleMenu(e, conv.id)}
                className={`
                        p-2 rounded-full hover:bg-gray-300 transition-opacity mr-1
                        ${
                          openMenuId === conv.id || activeId === conv.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }
                    `}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {openMenuId === conv.id && (
                <div className="absolute right-0 top-8 z-40 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  <button
                    onClick={(e) => handleDelete(e, conv.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
