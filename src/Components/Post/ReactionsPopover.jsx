import React from 'react';

export const FACEBOOK_REACTIONS = [
    { id: 'like', label: 'Like', emoji: '👍', color: '#1877f2', iconClass: 'fa-solid fa-thumbs-up' },
    { id: 'love', label: 'Love', emoji: '❤️', color: '#f33e5b', iconClass: 'fa-solid fa-heart' },
    { id: 'care', label: 'Care', emoji: '🥰', color: '#f7b125', iconClass: 'fa-solid fa-face-smile-beam' },
    { id: 'haha', label: 'Haha', emoji: '😆', color: '#f7b125', iconClass: 'fa-solid fa-face-laugh-squint' },
    { id: 'wow', label: 'Wow', emoji: '😮', color: '#f7b125', iconClass: 'fa-solid fa-face-surprise' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: '#f7b125', iconClass: 'fa-solid fa-face-sad-tear' },
    { id: 'angry', label: 'Angry', emoji: '😡', color: '#e9710f', iconClass: 'fa-solid fa-face-angry' },
];

export default function ReactionsPopover({ onSelectReaction, onClose }) {
    return (
        <div
            className="absolute bottom-11 left-0 z-30 flex items-center gap-1.5 bg-fb-surface border border-fb px-2.5 py-1.5 rounded-full shadow-2xl animate-reaction-pop backdrop-blur-md"
            onMouseLeave={onClose}
        >
            {FACEBOOK_REACTIONS.map((reaction) => (
                <button
                    key={reaction.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectReaction(reaction);
                    }}
                    className="relative group p-1 transition-transform duration-150 hover:scale-135 focus:outline-none cursor-pointer"
                    title={reaction.label}
                >
                    {/* Tooltip */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none whitespace-nowrap shadow-md">
                        {reaction.label}
                    </span>

                    {/* Emoji */}
                    <span className="text-2xl select-none block transition-transform group-hover:-translate-y-1">
                        {reaction.emoji}
                    </span>
                </button>
            ))}
        </div>
    );
}
