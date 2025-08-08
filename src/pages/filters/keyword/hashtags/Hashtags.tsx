import React, {useEffect, useRef, useState} from "react";
import InstagramCard from "../../../../components/shared/InstagramCard.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {median} from "../../../../utils/constants/contants.ts";

type Post = {
    id: string;
    type: string;
    productType?: string;
    url: string;
    displayUrl: string;
    videoUrl?: string;
    caption?: string;
    commentsCount?: number;
    likesCount?: number;
    reshareCount?: number;
    videoPlayCount?: number;
    igPlayCount?: number;
    images?: string[];
    timestamp: string;
    [key: string]: any;
};

type Hashtag = {
    id: string;
    name: string;
    url: string;
    postsCount: number;
    posts: string;
    topPosts: Post[];
    latestPosts: Post[];
};

type Props = {
    hashtags: Hashtag[];
};


function viralityForReel(post: Post, medianViews: number): number {
    const likes = post.likesCount ?? 0;
    const comments = post.commentsCount ?? 0;
    const views = post.videoPlayCount ?? post.igPlayCount ?? 0;
    if (!medianViews || medianViews === 0) return 0;
    return (likes * 1.2 + comments * 2 + views * 0.3) / medianViews;
}

function viralityForImageOrSidecar(post: Post): number {
    const likes = post.likesCount ?? 0;
    const comments = post.commentsCount ?? 0;
    const shares = post.reshareCount ?? 0;
    if (post.type === "Sidecar" || post.productType?.includes("carousel")) {
        const images = post.images?.length ?? 1;
        return (likes * 2 + comments * 3 + shares * 5) * Math.log2(images + 1);
    }
    return likes * 2 + comments * 3 + shares * 5;
}

const Hashtags: React.FC<Props> = ({hashtags}) => {
    // Filtros internos: reels/posts por hashtag, y top/latest por hashtag
    const [activeTabs, setActiveTabs] = useState<{ [key: string]: "top" | "latest" }>({});
    const [internalTabs, setInternalTabs] = useState<{ [key: string]: "reels" | "posts" }>({});
    const [playingId, setPlayingId] = useState<string | null>(null);
    useRef<{ [postId: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!playingId) return;
            const videoCard = document.getElementById(`reel-card-${playingId}`);
            if (videoCard && !videoCard.contains(e.target as Node)) {
                setPlayingId(null);
            }
        };
        if (playingId) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [playingId]);

    const handleTabChange = (hashtagId: string, tab: "top" | "latest") => {
        setActiveTabs((prev) => ({...prev, [hashtagId]: tab}));
        setPlayingId(null);
    };

    const handleInternalTab = (hashtagId: string, tab: "reels" | "posts") => {
        setInternalTabs((prev) => ({...prev, [hashtagId]: tab}));
        setPlayingId(null);
    };

    const isVideoPost = (post: Post) =>
        post.videoUrl ||
        (post.type && post.type.toLowerCase().includes("video")) ||
        post.productType === "clips";

    return (
        <div className="space-y-8">
            {hashtags.map((hashtag) => {
                const activeTab = activeTabs[hashtag.id] || "top";
                const internalTab = internalTabs[hashtag.id] || "reels";
                const postsSource = activeTab === "top" ? hashtag.topPosts : hashtag.latestPosts;

                const reels = postsSource.filter(isVideoPost);
                const posts = postsSource.filter((p) => !isVideoPost(p));

                const viewsArr = reels.map((p) => p.videoPlayCount ?? p.igPlayCount ?? 0).filter(Boolean);
                const medianViews = median(viewsArr);

                const reelsSorted = reels
                    .map((post) => ({
                        ...post,
                        virality: viralityForReel(post, medianViews)
                    }))
                    .sort((a, b) => b.virality - a.virality);

                const postsSorted = posts
                    .map((post) => ({
                        ...post,
                        virality: viralityForImageOrSidecar(post)
                    }))
                    .sort((a, b) => b.virality - a.virality);

                const displayArr = internalTab === "reels" ? reelsSorted : postsSorted;

                return (
                    <div key={hashtag.id} className="bg-white dark:bg-[#2d2d2d] shadow-lg rounded-2xl p-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 items-center">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    #{decodeURIComponent(hashtag.name)}
                                </h2>
                                <p className="text-gray-600 text-sm mb-2">
                                    {hashtag.posts} posts &middot; {hashtag.postsCount.toLocaleString()} total
                                </p>
                            </div>
                            <a
                                href={hashtag.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                <FontAwesomeIcon icon={faInstagram} size={'2xl'} color={'white'}/>
                            </a>
                        </div>

                        {/* Tabs principales: Reels vs Posts */}
                        <div className="flex gap-2 mt-6">
                            <button
                                className={`px-5 py-2 rounded-2xl font-medium transition text-base ${
                                    internalTab === "reels"
                                        ? "bg-gradient-to-tr text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-pink-200"
                                }`}
                                onClick={() => handleInternalTab(hashtag.id, "reels")}
                            >
                                Reels
                            </button>
                            <button
                                className={`px-5 py-2 rounded-2xl font-medium transition text-base ${
                                    internalTab === "posts"
                                        ? "bg-gradient-to-tr  text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-200"
                                }`}
                                onClick={() => handleInternalTab(hashtag.id, "posts")}
                            >
                                Posts
                            </button>
                            <div className="flex-1"/>
                            <button
                                className={`px-4 py-2 rounded-xl font-medium transition ${
                                    activeTab === "top"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                                }`}
                                onClick={() => handleTabChange(hashtag.id, "top")}
                            >
                                Top
                            </button>
                            <button
                                className={`px-4 py-2 rounded-xl font-medium transition ${
                                    activeTab === "latest"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                                }`}
                                onClick={() => handleTabChange(hashtag.id, "latest")}
                            >
                                Latest
                            </button>
                        </div>

                        <section className="mx-auto px-4 py-10">
                            <div className="flex flex-wrap gap-8 justify-center">
                                {displayArr.length === 0 && (
                                    <div className="col-span-full text-gray-400 text-center">
                                        No {internalTab === "reels" ? "reels" : "posts"}.
                                    </div>
                                )}
                                {displayArr.map((post, i) => {
                                    const likes = post.likesCount;
                                    const comments = post.commentsCount;
                                    const views = post.videoPlayCount ?? post.igPlayCount;
                                    const isVideo = isVideoPost(post);
                                    return (
                                        <InstagramCard
                                    // @ts-ignore
                                            isVideo={isVideo}
                                            key={post.id}
                                            id={post.id}
                                            caption={post.caption!}
                                            virality={post.virality}
                                            comment_count={comments!}
                                            i={i}
                                            playingId={playingId}
                                            setPlayingId={setPlayingId}
                                            like_count={likes!}
                                            play_count={views!}
                                            thumb={post.displayUrl}
                                            postUrl={post.url}
                                            videoUrl={post.videoUrl!}
                                        />
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                );
            })}
        </div>
    );
};

export default Hashtags;
