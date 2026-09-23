import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "../../api/axios";
import { AuthContext } from "../../Context/AuthContext";

export default function CreateComment({ id, queryKey }) {
    const [comment, setComment] = useState('');
    const [isLoading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    async function sendComment() {
        if (!comment.trim() || isLoading) return;

        setLoading(true);
        try {
            await api.post(`/posts/${id}/comments`, {
                content: comment.trim()
            });

            setComment("");
            setLoading(false);

            if (queryKey) {
                queryClient.invalidateQueries({ queryKey });
            }
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
            queryClient.invalidateQueries({ queryKey: ["post", id] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        } catch (error) {
            toast.error(getApiErrorMessage(error) || "Failed to post comment");
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
        }
    }

    return (
        <div className="flex items-start gap-2.5 pt-3 border-t border-fb">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-fb shrink-0 mt-0.5">
                <img
                    src={user?.photo || defaultAvatar}
                    alt={user?.name || "Me"}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
            </div>

            {/* Input pill */}
            <div className="flex-1 relative flex items-center bg-fb-secondary rounded-2xl px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-fb-blue transition">
                <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="w-full bg-transparent text-fb-primary placeholder:text-fb-secondary text-xs md:text-sm outline-none pr-10"
                    type="text"
                    placeholder="Write a comment... (Press Enter)"
                />

                {/* Submit button */}
                <button
                    onClick={sendComment}
                    disabled={isLoading || !comment.trim()}
                    className="absolute right-3 text-fb-blue hover:text-blue-600 disabled:opacity-30 transition cursor-pointer text-sm"
                    title="Send comment"
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <i className="fa-solid fa-paper-plane"></i>
                    )}
                </button>
            </div>
        </div>
    );
}
