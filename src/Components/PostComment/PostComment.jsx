import React, { useState } from 'react';
import NestedReplies from './NestedReplies';
import api, { getApiErrorMessage } from '../../api/axios';
import toast from 'react-hot-toast';

export default function PostComment({
    commentId,
    postId,
    commentBy,
    createAt,
    userCommentImage,
    comment,
    repliesCount = 0,
}) {
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
    const [showReplies, setShowReplies] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const formattedTime = createAt
        ? new Date(createAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '';

    async function handleToggleLike() {
        if (!postId || !commentId) return;
        try {
            await api.put(`/posts/${postId}/comments/${commentId}/like`);
            setIsLiked((prev) => !prev);
            setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        }
    }

    return (
        <div className="py-1 px-0.5 group">
            <div className="flex items-start gap-2.5">
                {/* Author Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-fb shrink-0 mt-1">
                    <img
                        className="w-full h-full object-cover"
                        src={userCommentImage || defaultAvatar}
                        alt={commentBy || "Commenter"}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                {/* Comment Body */}
                <div className="flex-1 min-w-0">
                    <div className="bg-fb-secondary px-3.5 py-2 rounded-2xl inline-block max-w-[92%] relative">
                        <h6 className="font-semibold text-xs text-fb-primary hover:underline cursor-pointer">
                            {commentBy || 'User'}
                        </h6>
                        <p className="text-xs md:text-sm text-fb-primary mt-0.5 leading-relaxed break-words whitespace-pre-wrap">
                            {comment}
                        </p>

                        {/* Floating Like Icon badge if comment has likes */}
                        {likesCount > 0 && (
                            <div className="absolute -bottom-2 right-2 bg-fb-surface border border-fb shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-1 text-[10px]">
                                <span className="text-xs">👍</span>
                                <span className="font-semibold text-fb-secondary">{likesCount}</span>
                            </div>
                        )}
                    </div>

                    {/* Sub-actions Row */}
                    <div className="flex items-center gap-3 text-[11px] text-fb-secondary pl-3 mt-1 font-semibold">
                        <button
                            onClick={handleToggleLike}
                            className={`hover:underline cursor-pointer ${isLiked ? 'text-fb-blue' : ''}`}
                        >
                            Like
                        </button>

                        <button
                            onClick={() => setShowReplies((prev) => !prev)}
                            className="hover:underline cursor-pointer"
                        >
                            Reply
                        </button>

                        <span className="font-normal opacity-70">{formattedTime}</span>
                    </div>

                    {/* View replies button if replies count > 0 */}
                    {repliesCount > 0 && !showReplies && (
                        <button
                            onClick={() => setShowReplies(true)}
                            className="text-xs font-semibold text-fb-secondary hover:underline pl-3 mt-1 flex items-center gap-1.5 cursor-pointer"
                        >
                            <i className="fa-solid fa-turn-down text-[10px] rotate-270"></i>
                            <span>View {repliesCount} {repliesCount === 1 ? 'reply' : 'replies'}</span>
                        </button>
                    )}

                    {/* Nested Replies Thread */}
                    {postId && commentId && (
                        <NestedReplies
                            postId={postId}
                            commentId={commentId}
                            isOpen={showReplies}
                            onClose={() => setShowReplies(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
