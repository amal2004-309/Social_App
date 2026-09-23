import React, { useContext, useState } from "react";
import PostHeader from "../PostHeader/PostHeader";
import PostComment from "../PostComment/PostComment";
import CreateComment from "../CreateComment/CreateComment";
import ReactionsPopover, { FACEBOOK_REACTIONS } from "./ReactionsPopover";
import api, { getApiErrorMessage } from "../../api/axios";
import { AuthContext } from "../../Context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Post({ post, comments, isPostDetails = false, queryKey }) {
    if (!post) return null;

    const { userId } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Reaction states
    const hasLiked = Array.isArray(post.likes) && post.likes.includes(userId);
    const [userReaction, setUserReaction] = useState(() => (hasLiked ? FACEBOOK_REACTIONS[0] : null));
    const [showReactionsPopover, setShowReactionsPopover] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount ?? (post.likes?.length || 0));

    // Comments section toggle
    const [showComments, setShowComments] = useState(isPostDetails);

    async function handleToggleDefaultLike() {
        try {
            await api.put(`/posts/${post._id}/like`);
            if (userReaction) {
                setUserReaction(null);
                setLikesCount((prev) => Math.max(0, prev - 1));
            } else {
                setUserReaction(FACEBOOK_REACTIONS[0]); // Default to Like
                setLikesCount((prev) => prev + 1);
            }
            if (queryKey) queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        }
    }

    async function handleSelectCustomReaction(reaction) {
        setShowReactionsPopover(false);
        try {
            if (!userReaction) {
                setLikesCount((prev) => prev + 1);
            }
            setUserReaction(reaction);
            await api.put(`/posts/${post._id}/like`);
            if (queryKey) queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        }
    }

    async function handleShare() {
        try {
            await api.post(`/posts/${post._id}/share`, { body: "Shared post" });
            toast.success("Post shared to your feed!");
            if (queryKey) queryClient.invalidateQueries({ queryKey });
        } catch (err) {
            // Fallback: Copy link
            const url = `${window.location.origin}/postDetails/${post._id}`;
            navigator.clipboard.writeText(url);
            toast.success("Post link copied to clipboard!");
        }
    }

    // Rich text parser for #hashtags and @mentions
    function renderFormattedBody(text) {
        if (!text) return null;
        const parts = text.split(/(\s+)/);
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                return (
                    <span key={index} className="text-fb-blue font-medium hover:underline cursor-pointer">
                        {part}
                    </span>
                );
            }
            if (part.startsWith('@')) {
                return (
                    <span key={index} className="text-fb-blue font-semibold hover:underline cursor-pointer">
                        {part}
                    </span>
                );
            }
            return part;
        });
    }

    const commentsCount = post.commentsCount ?? (comments ? comments.length : 0);
    const sharesCount = post.sharesCount ?? 0;

    return (
        <article className="bg-fb-surface border border-fb rounded-2xl p-3 sm:p-4 shadow-xs mb-4 transition duration-150">
            {/* 1. Header */}
            <PostHeader
                userName={post?.user?.name}
                createAt={post?.createdAt}
                userImage={post?.user?.photo}
                postId={post?._id}
                postUserId={post?.user?._id || post?.user}
                privacy={post?.privacy}
            />

            {/* 2. Post Content Body */}
            <div className="my-2">
                {post?.body && (
                    <p className="text-sm md:text-[15px] text-fb-primary whitespace-pre-line leading-relaxed mb-3">
                        {renderFormattedBody(post.body)}
                    </p>
                )}

                {post?.image && (
                    <div className="rounded-xl overflow-hidden border border-fb/60 max-h-[520px] flex items-center justify-center bg-black/5 dark:bg-black/40">
                        <img
                            src={post.image}
                            alt="Post attachment"
                            loading="lazy"
                            className="w-full h-auto max-h-[520px] object-cover cursor-pointer hover:opacity-95 transition"
                        />
                    </div>
                )}
            </div>

            {/* 3. Post Stats (Reactions count & Comments/Shares count) */}
            <div className="flex items-center justify-between text-xs text-fb-secondary py-2 border-b border-fb">
                {/* Left: Reaction Icons Stack */}
                <div className="flex items-center gap-1.5 cursor-pointer hover:underline">
                    {likesCount > 0 && (
                        <div className="flex items-center -space-x-1">
                            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px] shadow-sm ring-1 ring-fb-surface">
                                👍
                            </span>
                            {likesCount > 1 && (
                                <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px] shadow-sm ring-1 ring-fb-surface">
                                    ❤️
                                </span>
                            )}
                        </div>
                    )}
                    <span className="font-medium text-[12px]">{likesCount}</span>
                </div>

                {/* Right: Comments & Shares count */}
                <div className="flex items-center gap-3 text-xs">
                    {commentsCount > 0 && (
                        <button
                            onClick={() => setShowComments((prev) => !prev)}
                            className="hover:underline cursor-pointer"
                        >
                            {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
                        </button>
                    )}
                    {sharesCount > 0 && (
                        <span>{sharesCount} {sharesCount === 1 ? 'share' : 'shares'}</span>
                    )}
                </div>
            </div>

            {/* 4. Action Buttons (Like / Comment / Share) */}
            <div className="flex items-center justify-around py-1 text-fb-secondary font-semibold text-xs md:text-sm relative">
                {/* Like Button with Popover on Hover */}
                <div
                    className="relative flex-1"
                    onMouseEnter={() => setShowReactionsPopover(true)}
                    onMouseLeave={() => setShowReactionsPopover(false)}
                >
                    {showReactionsPopover && (
                        <ReactionsPopover
                            onSelectReaction={handleSelectCustomReaction}
                            onClose={() => setShowReactionsPopover(false)}
                        />
                    )}

                    <button
                        onClick={handleToggleDefaultLike}
                        className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-fb-secondary transition cursor-pointer ${
                            userReaction ? 'font-bold' : ''
                        }`}
                        style={{ color: userReaction ? userReaction.color : undefined }}
                    >
                        {userReaction ? (
                            <>
                                <span className="text-base select-none">{userReaction.emoji}</span>
                                <span>{userReaction.label}</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-regular fa-thumbs-up text-base"></i>
                                <span>Like</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Comment Button */}
                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-fb-secondary transition cursor-pointer text-fb-secondary"
                >
                    <i className="fa-regular fa-comment text-base"></i>
                    <span>Comment</span>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-fb-secondary transition cursor-pointer text-fb-secondary"
                >
                    <i className="fa-solid fa-share text-base"></i>
                    <span>Share</span>
                </button>
            </div>

            {/* 5. Comments Section */}
            {showComments && (
                <div className="pt-2 border-t border-fb space-y-3">
                    {/* Inline Comment Input */}
                    <CreateComment id={post._id} queryKey={queryKey} />

                    {/* Detailed Comments list or Top Comment on feed */}
                    {isPostDetails ? (
                        <div className="space-y-2 pt-2">
                            {comments && comments.length > 0 ? (
                                comments.map((comment) => (
                                    <PostComment
                                        key={comment._id || comment.id}
                                        commentId={comment._id || comment.id}
                                        postId={post._id}
                                        commentBy={comment?.commentCreator?.name}
                                        createAt={comment?.createdAt}
                                        userCommentImage={comment?.commentCreator?.photo}
                                        comment={comment?.content}
                                        repliesCount={comment?.repliesCount || 0}
                                    />
                                ))
                            ) : (
                                <p className="text-xs text-fb-secondary text-center py-4">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>
                    ) : (
                        post?.topComment && (
                            <div className="pt-1">
                                <PostComment
                                    commentId={post?.topComment?._id}
                                    postId={post._id}
                                    commentBy={post?.topComment?.commentCreator?.name}
                                    createAt={post?.topComment?.createdAt}
                                    userCommentImage={post?.topComment?.commentCreator?.photo}
                                    comment={post?.topComment?.content}
                                />

                                {commentsCount > 1 && (
                                    <Link
                                        to={`/postDetails/${post._id}`}
                                        className="inline-block text-xs font-semibold text-fb-secondary hover:underline pl-3 mt-1"
                                    >
                                        View all {commentsCount} comments
                                    </Link>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </article>
    );
}
