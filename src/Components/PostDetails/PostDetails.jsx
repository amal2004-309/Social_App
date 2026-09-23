import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Post from "../Post/Post";
import PostSkeleton from "../Common/PostSkeleton";
import api from "../../api/axios";

export default function PostDetails() {
    const { id } = useParams();

    function getSinglePost() {
        return api.get(`/posts/${id}`);
    }

    function getPostComments() {
        return api.get(`/posts/${id}/comments?page=1&limit=50`);
    }

    const { data: postData, isError: isPostError, isLoading: isPostLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: getSinglePost,
    });

    const { data: commentsData } = useQuery({
        queryKey: ['comments', id],
        queryFn: getPostComments,
    });

    if (isPostLoading) {
        return (
            <div className="max-w-2xl mx-auto p-4 md:p-6 my-4">
                <div className="h-6 w-32 bg-fb-secondary rounded-md mb-4 animate-pulse"></div>
                <PostSkeleton />
            </div>
        );
    }

    if (isPostError) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4 text-center px-4">
                <div className="text-4xl text-amber-500">⚠️</div>
                <h2 className="text-xl font-bold text-fb-primary">Post Unavailable</h2>
                <p className="text-xs text-fb-secondary">This post might have been removed or the link is invalid.</p>
                <Link to="/" className="btn btn-sm bg-fb-blue text-white hover:bg-blue-600 border-none rounded-xl">
                    Back to Feed
                </Link>
            </div>
        );
    }

    const post = postData?.data?.data?.post;
    const comments = commentsData?.data?.data?.comments || [];

    return (
        <div className="max-w-2xl mx-auto p-2 sm:p-4 my-4">
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-fb-blue hover:underline mb-3"
            >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to Feed</span>
            </Link>

            <Post
                post={post}
                isPostDetails={true}
                comments={comments}
                queryKey={['comments', id]}
            />
        </div>
    );
}
