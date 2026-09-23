import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../../api/axios';
import toast from 'react-hot-toast';

export default function RightSidebar() {
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
    const queryClient = useQueryClient();
    const [followedUsers, setFollowedUsers] = useState(new Set());

    // 1. Fetch Follow Suggestions from API
    const { data, isLoading } = useQuery({
        queryKey: ['suggestions'],
        queryFn: () => api.get('/users/suggestions?limit=4'),
        staleTime: 60000,
    });

    const suggestions = data?.data?.data?.suggestions || [];

    // 2. Follow / Unfollow mutation
    const followMutation = useMutation({
        mutationFn: (targetUserId) => api.put(`/users/${targetUserId}/follow`),
        onSuccess: (_, targetUserId) => {
            setFollowedUsers((prev) => {
                const next = new Set(prev);
                if (next.has(targetUserId)) {
                    next.delete(targetUserId);
                    toast.success('Unfollowed user');
                } else {
                    next.add(targetUserId);
                    toast.success('Followed user!');
                }
                return next;
            });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
        onError: (err) => {
            toast.error(getApiErrorMessage(err) || 'Failed to update follow status');
        }
    });

    // Mock active contacts
    const activeContacts = [
        { id: 1, name: 'Mostafa Kamel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop' },
        { id: 2, name: 'Dina El-Shenawy', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop' },
        { id: 3, name: 'Hassan Mahmoud', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop' },
        { id: 4, name: 'Mariam Adel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop' },
    ];

    return (
        <aside className="w-full h-full py-4 px-2 space-y-6 overflow-y-auto select-none">
            {/* Suggested People Section */}
            <div>
                <div className="flex items-center justify-between px-2 mb-3">
                    <h3 className="font-semibold text-sm text-fb-secondary uppercase tracking-wider">
                        Suggested For You
                    </h3>
                </div>

                {isLoading ? (
                    <div className="space-y-3 px-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 animate-pulse">
                                <div className="w-9 h-9 rounded-full bg-fb-secondary"></div>
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 bg-fb-secondary rounded w-24"></div>
                                    <div className="h-2.5 bg-fb-secondary rounded w-16"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {suggestions.map((user) => {
                            const isFollowed = followedUsers.has(user._id);
                            return (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-fb-surface transition"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-fb shrink-0">
                                            <img
                                                src={user.photo || defaultAvatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = defaultAvatar; }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-xs text-fb-primary truncate">
                                                {user.name}
                                            </h4>
                                            <p className="text-[11px] text-fb-secondary truncate">
                                                {user.followersCount || 0} followers
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => followMutation.mutate(user._id)}
                                        disabled={followMutation.isPending}
                                        className={`btn btn-xs rounded-lg px-2.5 transition cursor-pointer font-medium ${
                                            isFollowed
                                                ? 'bg-fb-secondary text-fb-primary hover:bg-red-500 hover:text-white border-none'
                                                : 'bg-fb-blue text-white hover:bg-blue-600 border-none'
                                        }`}
                                    >
                                        {isFollowed ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="border-t border-fb"></div>

            {/* Contacts / Online List */}
            <div>
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-semibold text-sm text-fb-secondary uppercase tracking-wider">
                        Contacts
                    </h3>
                    <div className="flex items-center gap-2 text-fb-secondary text-xs">
                        <i className="fa-solid fa-magnifying-glass hover:text-fb-primary cursor-pointer"></i>
                        <i className="fa-solid fa-ellipsis hover:text-fb-primary cursor-pointer"></i>
                    </div>
                </div>

                <div className="space-y-1">
                    {activeContacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-fb-surface transition cursor-pointer"
                        >
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-fb">
                                    <img
                                        src={contact.avatar}
                                        alt={contact.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Green active status dot */}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-fb-surface"></div>
                            </div>

                            <span className="text-xs font-medium text-fb-primary truncate">
                                {contact.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
