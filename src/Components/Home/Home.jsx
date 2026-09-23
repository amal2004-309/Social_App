import React from 'react';
import Post from '../Post/Post';
import PostCreation from './../PostCreation/PostCreation';
import StoriesBar from '../Stories/StoriesBar';
import LeftSidebar from '../Sidebar/LeftSidebar';
import RightSidebar from '../Sidebar/RightSidebar';
import PostSkeleton from '../Common/PostSkeleton';
import api from '../../api/axios';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
    function getAllPosts() {
        return api.get('/posts');
    }

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });

    const posts = data?.data?.data?.posts || [];

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-fb-bg flex justify-center">
            <div className="w-full max-w-[1440px] flex justify-between">
                {/* 1. Left Sidebar (Desktop) */}
                <div className="hidden lg:block w-[280px] xl:w-[320px] sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
                    <LeftSidebar />
                </div>

                {/* 2. Main Center Feed */}
                <main className="flex-1 max-w-[640px] w-full px-2 sm:px-4 py-4 min-w-0">
                    {/* Stories Carousel */}
                    <StoriesBar />

                    {/* Post Creation Box */}
                    <PostCreation />

                    {/* Feed Loading Skeletons */}
                    {isLoading && (
                        <div className="space-y-4">
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="bg-fb-surface border border-fb rounded-2xl p-8 text-center my-6 space-y-3 shadow-xs">
                            <div className="text-4xl text-amber-500">⚠️</div>
                            <h3 className="text-base font-bold text-fb-primary">Unable to load feed</h3>
                            <p className="text-xs text-fb-secondary max-w-sm mx-auto">
                                {error?.message || 'Check your internet connection or try refreshing.'}
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="btn btn-sm bg-fb-blue text-white hover:bg-blue-600 border-none rounded-xl"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && posts.length === 0 && (
                        <div className="bg-fb-surface border border-fb rounded-2xl p-10 text-center my-6 space-y-3 shadow-xs">
                            <div className="w-14 h-14 bg-fb-secondary rounded-full flex items-center justify-center mx-auto text-fb-blue text-2xl">
                                <i className="fa-solid fa-newspaper"></i>
                            </div>
                            <h3 className="text-base font-bold text-fb-primary">No posts yet</h3>
                            <p className="text-xs text-fb-secondary max-w-sm mx-auto">
                                Your feed is currently quiet. Follow more users or share what is on your mind!
                            </p>
                        </div>
                    )}

                    {/* Feed Stream */}
                    {!isLoading && posts.map((post) => (
                        <Post
                            key={post._id || post.id}
                            post={post}
                            isPostDetails={false}
                            queryKey={["posts"]}
                        />
                    ))}
                </main>

                {/* 3. Right Sidebar (Desktop XL) */}
                <div className="hidden xl:block w-[280px] xl:w-[320px] sticky top-14 h-[calc(100vh-3.5rem)] shrink-0">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
}
