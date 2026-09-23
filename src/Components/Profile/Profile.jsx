import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { AuthContext } from '../../Context/AuthContext';
import Post from '../Post/Post';
import PostCreation from '../PostCreation/PostCreation';
import PostSkeleton from '../Common/PostSkeleton';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { userId } = useContext(AuthContext);
    const defaultAvatar = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
    const [activeTab, setActiveTab] = useState('posts');

    // 1. Fetch current profile data
    const { data: profileData, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => api.get('/users/profile-data'),
    });

    const user = profileData?.data?.data?.user;
    const currentUserId = user?._id || userId;

    // 2. Fetch current user's posts
    const { data: postsData, isLoading: isPostsLoading } = useQuery({
        queryKey: ['user-posts', currentUserId],
        queryFn: () => api.get(`/users/${currentUserId}/posts`),
        enabled: !!currentUserId,
    });

    if (isProfileLoading) {
        return (
            <div className="min-h-screen bg-fb-bg flex flex-col justify-center items-center gap-3">
                <span className="loading loading-spinner loading-lg text-fb-blue"></span>
                <p className="text-xs text-fb-secondary">Loading profile...</p>
            </div>
        );
    }

    if (isProfileError) {
        return (
            <div className="min-h-[70vh] bg-fb-bg flex flex-col justify-center items-center gap-4 text-center px-4">
                <div className="text-error text-5xl">⚠️</div>
                <h2 className="text-xl font-bold text-fb-primary">Failed to load profile</h2>
                <button onClick={() => refetchProfile()} className="btn btn-sm bg-fb-blue text-white border-none rounded-xl">
                    Try Again
                </button>
            </div>
        );
    }

    const myPosts = postsData?.data?.data?.posts || [];

    return (
        <div className="min-h-screen bg-fb-bg pb-12 select-none">
            {/* Top Profile Header Card */}
            <div className="bg-fb-surface border-b border-fb shadow-xs">
                <div className="max-w-5xl mx-auto">
                    {/* Cover Banner */}
                    <div className="h-48 sm:h-72 md:h-88 rounded-b-2xl overflow-hidden relative bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900">
                        {user?.cover && (
                            <img
                                src={user.cover}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur-xs flex items-center gap-2 transition cursor-pointer">
                            <i className="fa-solid fa-camera"></i>
                            <span className="hidden sm:inline">Edit Cover Photo</span>
                        </button>
                    </div>

                    {/* Avatar & User Details Row */}
                    <div className="px-4 sm:px-8 pb-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 sm:-mt-20 md:-mt-24 mb-4">
                            {/* Avatar & Name */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                                <div className="relative w-36 sm:w-44 h-36 sm:h-44 rounded-full ring-4 ring-fb-surface overflow-hidden bg-fb-secondary shrink-0 shadow-lg">
                                    <img
                                        src={user?.photo || defaultAvatar}
                                        alt={user?.name || "Profile"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = defaultAvatar; }}
                                    />
                                    <button className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-fb-secondary hover:bg-fb-surface-hover text-fb-primary border-2 border-fb-surface flex items-center justify-center transition cursor-pointer shadow-md">
                                        <i className="fa-solid fa-camera text-sm"></i>
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-fb-primary leading-tight">
                                        {user?.name || "User"}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-fb-secondary font-medium">
                                        @{user?.username || "username"} &middot; {user?.followersCount || 0} followers &middot; {user?.followingCount || 0} following
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <button className="btn btn-sm bg-fb-blue hover:bg-blue-600 text-white border-none rounded-xl text-xs font-semibold px-4 cursor-pointer">
                                    <i className="fa-solid fa-plus text-xs"></i>
                                    Add to Story
                                </button>
                                <button className="btn btn-sm bg-fb-secondary hover:bg-fb-surface-hover text-fb-primary border-none rounded-xl text-xs font-semibold px-4 cursor-pointer">
                                    <i className="fa-solid fa-pen text-xs"></i>
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Navigation Tabs Bar */}
                        <div className="flex items-center gap-1 border-t border-fb pt-1 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold text-fb-secondary">
                            {[
                                { id: 'posts', label: 'Posts' },
                                { id: 'about', label: 'About' },
                                { id: 'friends', label: 'Friends' },
                                { id: 'photos', label: 'Photos' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 rounded-xl transition cursor-pointer relative ${
                                        activeTab === tab.id
                                            ? 'text-fb-blue'
                                            : 'hover:bg-fb-surface-hover text-fb-secondary'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-2 right-2 h-1 bg-fb-blue rounded-t-md"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content Body (2-Column Grid) */}
            <div className="max-w-5xl mx-auto px-2 sm:px-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Column (Intro / About Box) */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="bg-fb-surface border border-fb rounded-2xl p-4 shadow-xs space-y-3.5">
                            <h3 className="font-bold text-base text-fb-primary">Intro</h3>

                            <div className="space-y-2.5 text-xs text-fb-secondary">
                                {user?.email && (
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-regular fa-envelope text-sm w-4"></i>
                                        <span className="text-fb-primary font-medium">{user.email}</span>
                                    </div>
                                )}
                                {user?.gender && (
                                    <div className="flex items-center gap-2.5 capitalize">
                                        <i className="fa-solid fa-venus-mars text-sm w-4"></i>
                                        <span className="text-fb-primary font-medium">{user.gender}</span>
                                    </div>
                                )}
                                {user?.createdAt && (
                                    <div className="flex items-center gap-2.5">
                                        <i className="fa-regular fa-clock text-sm w-4"></i>
                                        <span className="text-fb-primary font-medium">
                                            Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button className="btn btn-sm bg-fb-secondary hover:bg-fb-surface-hover text-fb-primary border-none rounded-xl w-full text-xs font-semibold cursor-pointer">
                                Edit Details
                            </button>
                        </div>
                    </div>

                    {/* Right Column (Posts Stream) */}
                    <div className="md:col-span-7 space-y-4">
                        <PostCreation />

                        {/* User Posts List */}
                        {isPostsLoading ? (
                            <div className="space-y-4">
                                <PostSkeleton />
                                <PostSkeleton />
                            </div>
                        ) : myPosts.length === 0 ? (
                            <div className="bg-fb-surface border border-fb rounded-2xl p-8 text-center shadow-xs">
                                <p className="text-sm font-semibold text-fb-primary">No posts yet</p>
                                <p className="text-xs text-fb-secondary mt-1">Posts you create will show up here.</p>
                            </div>
                        ) : (
                            myPosts.map((post) => (
                                <Post
                                    key={post._id || post.id}
                                    post={post}
                                    isPostDetails={false}
                                    queryKey={['user-posts', currentUserId]}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
