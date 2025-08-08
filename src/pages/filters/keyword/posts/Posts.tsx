import {useState} from "react";
import InstagramCard from "../../../../components/shared/InstagramCard.tsx";
import InstagramProfile from "../../../../components/shared/InstagramProfile.tsx";

interface InstagramPost {
    id: string;
    type: string;
    shortCode: string;
    caption: string;
    hashtags: string[];
    mentions: string[];
    url: string;
    commentsCount: number;
    dimensionsHeight: number;
    dimensionsWidth: number;
    displayUrl: string;
    images: any[];
    alt?: string;
    likesCount: number;
    timestamp: string;
    childPosts: any[];
    ownerUsername: string;
    ownerId: string;
    isCommentsDisabled: boolean;
    videoUrl?: string;
    videoViewCount?: number;
    productType?: string;
}

interface InstagramProfile {
    id: string;
    username: string;
    fullName: string;
    biography: string;
    url: string;
    profilePicUrl: string;
    profilePicUrlHD: string;
    followersCount: number;
    followsCount: number;
    verified: boolean;
    isBusinessAccount: boolean;
    businessCategoryName?: string;
    postsCount: number;
    latestPosts: InstagramPost[];
    private: boolean;
    facebookPage?: {
        name: string;
        image_uri: string;
        likes: number;
        verification: string;
        ig_followers: number;
    };
}

interface Props {
    results: InstagramProfile[];
}


function getPostViralIndex(post: InstagramPost, followersCount: number): number {
    const safeFollowers = Math.max(1, followersCount);
    return ((post.likesCount || 0) + 3 * (post.commentsCount || 0)) / safeFollowers;
}

function getProfileViralIndex(profile: InstagramProfile): number {
    if (!profile.latestPosts || profile.latestPosts.length === 0) return 0;
    return profile.latestPosts
        .map(post => getPostViralIndex(post, profile.followersCount))
        .reduce((acc, curr) => acc + curr, 0);
}

function Posts({results}: Props) {

    const [playingId, setPlayingId] = useState<string | null>(null);

    const profilesSorted = [...results].sort((a, b) =>
        getProfileViralIndex(b) - getProfileViralIndex(a)
    );

    if (!results || !results.length) {
        return <></>;
    }

    return (
        <div className="flex flex-col gap-10 w-full">
            {profilesSorted.map(profile => {
                const postsSorted = [...(profile.latestPosts || [])]
                    .sort((a, b) =>
                        getPostViralIndex(b, profile.followersCount) - getPostViralIndex(a, profile.followersCount)
                    );
                if (!postsSorted.length) {
                    return <></>;
                }


                return (
                    <div className="bg-white dark:bg-[#2d2d2d] shadow-lg rounded-2xl p-6">
                        <InstagramProfile
                            followers={profile.followersCount} following={profile.followsCount}
                            fullName={profile.fullName} profilePic={profile.profilePicUrl}
                            username={profile.username}
                            postsLength={profile.postsCount} biography={profile.biography}/>
                        <section className="mx-auto px-4 py-10">
                            <div className="flex flex-wrap gap-8 justify-center">
                                {postsSorted.map((post, i) => {
                                    const postViralIndex = getPostViralIndex(post, profile.followersCount);
                                    return (
                                        <InstagramCard key={post.id} i={i} playingId={playingId}
                                                       setPlayingId={setPlayingId}
                                                       thumb={post.displayUrl} postUrl={post.url}
                                                       videoUrl={post.videoUrl || ""}
                                                       id={post.id} virality={parseInt(postViralIndex.toFixed(3))}
                                                       caption={post.caption}
                                                       isVideo={post.type === "Video"}
                                                       play_count={post.videoViewCount ?? 0}
                                                       comment_count={post.commentsCount}
                                                       like_count={post.likesCount}/>
                                    )
                                })}
                            </div>
                        </section>
                    </div>
                );
            })}
        </div>
    );
};

export default Posts;
