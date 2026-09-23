import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { toast } from 'react-hot-toast';
import api, { getApiErrorMessage } from "../../api/axios";
import { AuthContext } from "../../Context/AuthContext";

export default function PostCreation() {
    const [isOpen, setIsOpen] = useState(false);
    const [postText, setPostText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const { user } = useContext(AuthContext);
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

    const imageInputRef = useRef(null);
    const queryClient = useQueryClient();

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleRemoveImage() {
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    }

    function handleCreatePost() {
        const formData = new FormData();
        if (postText.trim()) {
            formData.append("body", postText.trim());
        }
        if (imageInputRef.current?.files?.[0]) {
            formData.append("image", imageInputRef.current.files[0]);
        }
        return api.post('/posts', formData);
    }

    const { isPending, mutate } = useMutation({
        mutationFn: handleCreatePost,
        onSuccess: () => {
            handleRemoveImage();
            setPostText("");
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success('Post shared to your feed!');
        },
        onError: (err) => {
            toast.error(getApiErrorMessage(err) || 'Failed to create post');
        }
    });

    return (
        <div className="bg-fb-surface border border-fb rounded-2xl p-3 sm:p-4 shadow-xs mb-4">
            {/* 1. Trigger Row */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-fb shrink-0">
                    <img
                        src={user?.photo || defaultAvatar}
                        alt={user?.name || "Me"}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="flex-1 bg-fb-secondary hover:bg-fb-surface-hover text-fb-secondary text-sm md:text-[15px] text-left px-4 py-2.5 rounded-full transition cursor-pointer"
                >
                    {user?.name ? `What's on your mind, ${user.name.split(' ')[0]}?` : "What's on your mind?"}
                </button>
            </div>

            {/* 2. Action Icons Row */}
            <div className="grid grid-cols-3 gap-1 pt-3 mt-3 border-t border-fb text-fb-secondary font-medium text-xs sm:text-sm">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-fb-secondary transition cursor-pointer"
                >
                    <i className="fa-solid fa-video text-red-500 text-lg"></i>
                    <span className="hidden sm:inline">Live video</span>
                </button>

                <button
                    onClick={() => {
                        setIsOpen(true);
                        setTimeout(() => imageInputRef.current?.click(), 100);
                    }}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-fb-secondary transition cursor-pointer"
                >
                    <i className="fa-solid fa-images text-emerald-500 text-lg"></i>
                    <span className="hidden sm:inline">Photo/video</span>
                </button>

                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-fb-secondary transition cursor-pointer"
                >
                    <i className="fa-regular fa-face-laugh-beam text-amber-500 text-lg"></i>
                    <span className="hidden sm:inline">Feeling/activity</span>
                </button>
            </div>

            {/* 3. Facebook Post Creation Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
                    <div className="bg-fb-surface border border-fb rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="relative py-3.5 px-4 border-b border-fb text-center">
                            <h3 className="font-bold text-base md:text-lg text-fb-primary">Create post</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-fb-secondary hover:bg-fb-surface-hover text-fb-secondary hover:text-fb-primary flex items-center justify-center transition cursor-pointer text-base"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 overflow-y-auto space-y-4">
                            {/* Author Badge & Privacy Selector */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-fb">
                                    <img
                                        src={user?.photo || defaultAvatar}
                                        alt={user?.name || "Author"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = defaultAvatar; }}
                                    />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-sm text-fb-primary">{user?.name || "User"}</h4>
                                    <div className="inline-flex items-center gap-1.5 bg-fb-secondary text-[11px] font-semibold text-fb-primary px-2 py-0.5 rounded-md mt-0.5">
                                        <i className="fa-solid fa-earth-americas text-[10px]"></i>
                                        <span>Public</span>
                                        <i className="fa-solid fa-caret-down text-[9px]"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Text Area */}
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                placeholder={user?.name ? `What's on your mind, ${user.name.split(' ')[0]}?` : "What's on your mind?"}
                                rows={postText.length > 80 ? 4 : 3}
                                className={`w-full bg-transparent text-fb-primary placeholder:text-fb-secondary outline-none resize-none leading-relaxed transition-all ${
                                    postText.length < 50 ? 'text-lg md:text-xl' : 'text-sm md:text-base'
                                }`}
                            />

                            {/* Image Preview & Upload Dropzone */}
                            {imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden border border-fb bg-black/10">
                                    <img
                                        src={imagePreview}
                                        alt="Upload preview"
                                        className="w-full max-h-72 object-cover"
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer"
                                    >
                                        <i className="fa-solid fa-xmark text-sm"></i>
                                    </button>
                                </div>
                            ) : null}

                            {/* "Add to your post" widget box */}
                            <div className="flex items-center justify-between p-3 border border-fb rounded-xl bg-fb-surface">
                                <span className="text-xs font-semibold text-fb-primary">Add to your post</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => imageInputRef.current?.click()}
                                        className="w-9 h-9 rounded-full hover:bg-fb-secondary flex items-center justify-center text-emerald-500 transition cursor-pointer"
                                        title="Photo/video"
                                    >
                                        <i className="fa-solid fa-images text-lg"></i>
                                    </button>
                                    <button
                                        className="w-9 h-9 rounded-full hover:bg-fb-secondary flex items-center justify-center text-blue-500 transition cursor-pointer"
                                        title="Tag people"
                                    >
                                        <i className="fa-solid fa-user-tag text-lg"></i>
                                    </button>
                                    <button
                                        className="w-9 h-9 rounded-full hover:bg-fb-secondary flex items-center justify-center text-amber-500 transition cursor-pointer"
                                        title="Feeling/activity"
                                    >
                                        <i className="fa-regular fa-face-smile text-lg"></i>
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    hidden
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={() => mutate()}
                                disabled={(!postText.trim() && !imagePreview) || isPending}
                                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-fb-blue text-white hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-sm"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Posting...
                                    </span>
                                ) : (
                                    'Post'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}