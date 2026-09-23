import React from 'react';

export default function PostSkeleton() {
    return (
        <div className="bg-fb-surface border border-fb rounded-2xl p-4 md:p-5 shadow-sm animate-pulse mb-4 space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-fb-secondary shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-fb-secondary rounded-md w-36"></div>
                    <div className="h-2.5 bg-fb-secondary rounded-md w-24"></div>
                </div>
            </div>

            {/* Text Lines */}
            <div className="space-y-2 pt-1">
                <div className="h-3 bg-fb-secondary rounded-md w-full"></div>
                <div className="h-3 bg-fb-secondary rounded-md w-5/6"></div>
                <div className="h-3 bg-fb-secondary rounded-md w-2/3"></div>
            </div>

            {/* Media Box Skeleton */}
            <div className="w-full h-56 md:h-72 bg-fb-secondary rounded-xl"></div>

            {/* Interaction Bar Skeleton */}
            <div className="pt-2 border-t border-fb flex justify-around">
                <div className="h-8 bg-fb-secondary rounded-lg w-24"></div>
                <div className="h-8 bg-fb-secondary rounded-lg w-24"></div>
                <div className="h-8 bg-fb-secondary rounded-lg w-24"></div>
            </div>
        </div>
    );
}
