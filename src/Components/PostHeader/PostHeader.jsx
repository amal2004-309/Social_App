import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { getApiErrorMessage } from '../../api/axios';

export default function PostHeader({ userName, createAt, userImage, postUserId, postId, privacy = 'public' }) {
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    const { userId } = useContext(AuthContext);
    const isPostMine = postUserId && userId && String(postUserId) === String(userId);

    const queryClient = useQueryClient();

    function handleDeletePost() {
        return api.delete(`/posts/${postId}`);
    }

    const { isPending, mutate: handleMutationDelete } = useMutation({
        mutationFn: handleDeletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            toast.success('Post removed from feed');
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error) || 'Failed to delete post');
        },
    });

    async function handleBookmark() {
        try {
            await api.put(`/posts/${postId}/bookmark`);
            toast.success('Post saved to your bookmarks!');
        } catch (err) {
            toast.error(getApiErrorMessage(err));
        }
    }

    function handleCopyLink() {
        const url = `${window.location.origin}/postDetails/${postId}`;
        navigator.clipboard.writeText(url);
        toast.success('Post link copied to clipboard!');
    }

    const formattedDate = createAt ? new Date(createAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '';

    return (
        <div className="flex items-center justify-between mb-3 select-none">
            {/* Author Info */}
            <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-fb shrink-0 cursor-pointer">
                    <img
                        className="w-full h-full object-cover"
                        src={userImage || defaultAvatar}
                        alt={userName || "Author"}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                <div>
                    <h4 className="font-semibold text-sm text-fb-primary hover:underline cursor-pointer leading-tight">
                        {userName || 'User'}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-fb-secondary mt-0.5">
                        <span>{formattedDate}</span>
                        <span>&middot;</span>
                        <span title="Public" className="flex items-center">
                            <i className="fa-solid fa-earth-americas text-[10px]"></i>
                        </span>
                    </div>
                </div>
            </div>

            {/* Post Options Menu */}
            <div className="relative">
                <details className="dropdown dropdown-end">
                    <summary className="w-8 h-8 rounded-full flex items-center justify-center text-fb-secondary hover:bg-fb-secondary hover:text-fb-primary transition cursor-pointer list-none">
                        <i className="fa-solid fa-ellipsis text-base"></i>
                    </summary>

                    <ul className="menu dropdown-content bg-fb-surface border border-fb rounded-2xl z-30 w-52 p-2 shadow-2xl mt-1 space-y-1">
                        <li>
                            <button
                                onClick={handleBookmark}
                                className="flex items-center gap-2.5 py-2 text-xs font-medium text-fb-primary hover:bg-fb-secondary rounded-xl"
                            >
                                <i className="fa-regular fa-bookmark text-sm"></i>
                                Save post to bookmarks
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-2.5 py-2 text-xs font-medium text-fb-primary hover:bg-fb-secondary rounded-xl"
                            >
                                <i className="fa-solid fa-link text-sm"></i>
                                Copy post link
                            </button>
                        </li>

                        {isPostMine && (
                            <>
                                <div className="border-t border-fb my-1"></div>
                                <li>
                                    <button
                                        onClick={() => handleMutationDelete()}
                                        disabled={isPending}
                                        className="flex items-center gap-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-500/10 rounded-xl"
                                    >
                                        <i className="fa-regular fa-trash-can text-sm"></i>
                                        {isPending ? 'Deleting...' : 'Move to Trash'}
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </details>
            </div>
        </div>
    );
}
