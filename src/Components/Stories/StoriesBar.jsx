import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

export default function StoriesBar() {
    const { user } = useContext(AuthContext);
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    const mockStories = [
        {
            id: 1,
            authorName: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
            bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop',
        },
        {
            id: 2,
            authorName: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
            bg: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&auto=format&fit=crop',
        },
        {
            id: 3,
            authorName: 'Nour El-Din',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
            bg: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop',
        },
        {
            id: 4,
            authorName: 'Karim Mostafa',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop',
            bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop',
        }
    ];

    return (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x mb-4">
            {/* Create Story Card */}
            <div className="relative shrink-0 w-28 md:w-32 h-44 md:h-48 bg-fb-surface border border-fb rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group snap-start flex flex-col">
                <div className="h-32 md:h-36 overflow-hidden bg-fb-secondary">
                    <img
                        src={user?.photo || defaultAvatar}
                        alt="Current user"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>
                {/* Floating plus badge */}
                <div className="absolute top-[114px] md:top-[130px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-fb-blue text-white flex items-center justify-center border-3 border-fb-surface shadow-sm">
                    <i className="fa-solid fa-plus text-sm"></i>
                </div>
                <div className="flex-1 flex items-end justify-center pb-2 px-1 text-center">
                    <span className="text-xs font-semibold text-fb-primary line-clamp-1">Create story</span>
                </div>
            </div>

            {/* Friend Stories */}
            {mockStories.map((story) => (
                <div
                    key={story.id}
                    className="relative shrink-0 w-28 md:w-32 h-44 md:h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group snap-start"
                >
                    {/* Background image */}
                    <img
                        src={story.bg}
                        alt={story.authorName}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>

                    {/* Author Avatar with active blue ring */}
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full ring-3 ring-fb-blue overflow-hidden shadow-md">
                        <img
                            src={story.avatar}
                            alt={story.authorName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Author Name */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <p className="text-white text-xs font-semibold drop-shadow-md line-clamp-2">
                            {story.authorName}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
