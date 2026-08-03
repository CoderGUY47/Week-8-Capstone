"use client";

import { useState, useCallback } from "react";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineMarkUnreadChatAlt } from "react-icons/md";
import { VscPinned, VscUnpin } from "react-icons/vsc";
import { CgTrashEmpty } from "react-icons/cg";
import { UIMessage } from "ai";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isPinned?: boolean;
  isCollapsed?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function ConversationItem({
  id,
  title,
  isActive,
  isPinned = false,
  isCollapsed = false,
  onSelect,
  onDelete,
  onRename,
  onTogglePin,
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isHovered, setIsHovered] = useState(false);

  const handleRenameSubmit = useCallback(() => {
    if (editValue.trim()) {
      onRename(id, editValue.trim());
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  }, [editValue, id, onRename, title]);

  // Icon-only compact mode when sidebar is collapsed
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        title={title}
        className={cn(
          "w-9 h-9 rounded-sm flex items-center justify-center transition-colors cursor-pointer border outline-none shrink-0",
          isActive
            ? "bg-[#1a1e28] text-white border-white/15 font-semibold"
            : "text-white hover:text-white hover:bg-[#161a22] border-transparent hover:border-white/10"
        )}
      >
        {isPinned ? (
          <VscPinned className="w-4 h-4 text-white" />
        ) : (
          <MdOutlineMarkUnreadChatAlt className="w-4 h-4 text-white" />
        )}
      </button>
    );
  }

  return (
    <div
      onClick={() => !isEditing && onSelect(id)}
      className={cn(
        "group relative flex items-center justify-between gap-2 w-full px-2.5 py-1.5 rounded-sm text-[13px] transition-colors cursor-pointer select-none border min-w-0 text-white",
        isActive
          ? "bg-[#1a1e28] text-white font-semibold border-white/15"
          : "text-white hover:bg-[#161a22] hover:text-white border-transparent hover:border-white/10 font-medium"
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1 pr-1 border-0 text-white">
        <span className="flex items-center shrink-0 text-white">
          {isPinned ? (
            <VscPinned className="w-3.5 h-3.5 text-white" />
          ) : (
            <MdOutlineMarkUnreadChatAlt className="w-3.5 h-3.5 text-white" />
          )}
        </span>

        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
              if (e.key === "Escape") {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent border-0 border-b border-white/20 outline-none text-[13px] text-white p-0 font-medium"
          />
        ) : (
          <span className="truncate flex-1 text-white">
            {title}
          </span>
        )}
      </div>

      {/* Action buttons — opacity transition instead of conditional mount to prevent shaking */}
      {!isEditing && (
        <div
          className={cn(
            "flex items-center gap-0.5 shrink-0 transition-opacity duration-150",
            isPinned
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          )}
        >
          {onTogglePin && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(id);
              }}
              title={isPinned ? "Unpin" : "Pin to top"}
              className={cn(
                "p-1 rounded-[4px] text-slate-400 hover:text-black/85 hover:bg-slate-200/60 border border-transparent hover:border-black/10 bg-transparent cursor-pointer transition-colors outline-none",
                isPinned && "text-black/85"
              )}
            >
              {isPinned ? (
                <VscUnpin className="w-3.5 h-3.5" />
              ) : (
                <VscPinned className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            title="Rename"
            className="p-1 rounded-[4px] text-slate-400 hover:text-black/85 hover:bg-slate-200/60 border border-transparent hover:border-black/10 bg-transparent cursor-pointer transition-colors outline-none"
          >
            <FiEdit3 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            title="Delete"
            className="p-1 rounded-[4px] text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 bg-transparent cursor-pointer transition-colors outline-none"
          >
            <CgTrashEmpty className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Active state indicator dot */}
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-black/85 shrink-0 group-hover:hidden" />
      )}
    </div>
  );
}

export interface Conversation {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  pinned?: boolean;
}
