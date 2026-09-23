import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getApiErrorMessage } from '../../api/axios';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

export default function NestedReplies({ postId, commentId, isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    const [replyText, setReplyText] = useState('');

    // Fetch replies
    const { data, isLoading } = useQuery({
        queryKey: ['replies', commentId],
        queryFn: () => api.get(`/posts/${postId}/comments/${commentId}/replies`),
        enabled: isOpen,
    });

    const replies = data?.data?.data?.replies || [];

    // Create reply mutation
    const createReplyMutation = useMutation({
        mutationFn: (text) => api.post(`/posts/${postId}/comments/${commentId}/replies`, {
            content: text,
        }),
        onSuccess: () => {
            setReplyText('');
            queryClient.invalidateQueries({ queryKey: ['replies', commentId] });
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success('Reply added!');
        },
        onError: (err) => {
            toast.error(getApiErrorMessage(err) || 'Failed to post reply');
        }
    });

    function handleSubmitReply(e) {
        e.preventDefault();
        if (!replyText.trim()) return;
        createReplyMutation.mutate(replyText.trim());
    }

    if (!isOpen) return null;

    return (
        <div className="pl-6 md:pl-10 mt-2 space-y-2 border-l-2 border-fb/60 ml-3">
            {/* Loading state */}
            {isLoading && (
                <div className="flex items-center gap-2 py-1 text-xs text-fb-secondary">
                    <span className="loading loading-spinner loading-xs"></span>
                    <span>Loading replies...</span>
                </div>
            )}

            {/* List of Replies */}
            {replies.map((reply) => {
                const author = reply?.commentCreator;
                const formattedTime = reply?.createdAt
                    ? new Date(reply.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : '';

                return (
                    <div key={reply._id || reply.id} className="flex gap-2 items-start text-xs group">
                        <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-fb shrink-0 mt-1">
                            <img
                                src={author?.photo || defaultAvatar}
                                alt={author?.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = defaultAvatar; }}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="bg-fb-secondary px-3 py-1.5 rounded-2xl inline-block max-w-full">
                                <h6 className="font-semibold text-fb-primary text-[11px]">
                                    {author?.name || 'User'}
                                </h6>
                                <p className="text-fb-primary text-xs leading-relaxed break-words whitespace-pre-wrap">
                                    {reply.content}
                                </p>
                            </div>
                            <span className="text-[10px] text-fb-secondary pl-2 mt-0.5 block">
                                {formattedTime}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Inline Reply Input */}
            <form onSubmit={handleSubmitReply} className="flex items-center gap-2 pt-1">
                <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-fb shrink-0">
                    <img
                        src={user?.photo || defaultAvatar}
                        alt={user?.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                <div className="flex-1 relative flex items-center">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        disabled={createReplyMutation.isPending}
                        className="w-full bg-fb-secondary text-fb-primary placeholder:text-fb-secondary text-xs px-3 py-1.5 rounded-full outline-none pr-8 focus:ring-1 focus:ring-fb-blue"
                    />

                    <button
                        type="submit"
                        disabled={!replyText.trim() || createReplyMutation.isPending}
                        className="absolute right-2 text-fb-blue hover:text-blue-700 disabled:opacity-30 cursor-pointer text-xs"
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
}
