import {useState} from "react";
import InstagramCard from "../../../../components/shared/InstagramCard.tsx";
import {calculateVirality, median} from "../../../../utils/constants/contants.ts";

interface IInstagramStory {
    id: string;
    searchTerm: string;
    searchSource: string;
    inputUrl: string;
    type: "Video" | "Image";
    shortCode: string;
    caption: string;
    hashtags: string[];
    mentions: string[];
    url: string;
    commentsCount: number;
    firstComment?: string;
    latestComments: Array<{
        id: string;
        text: string;
        ownerUsername: string;
        ownerProfilePicUrl: string;
        timestamp: string;
        repliesCount: number;
        replies: any[];
        likesCount: number;
        owner: {
            id: string;
            is_verified: boolean;
            profile_pic_url: string;
            username: string;
        };
    }>;
    dimensionsHeight: number;
    dimensionsWidth: number;
    displayUrl: string;
    images: string[];
    videoUrl?: string;
    alt?: string;
    likesCount: number;
    videoViewCount?: number;
    videoPlayCount?: number;
    timestamp: string;
    childPosts: any[];
    ownerFullName: string;
    ownerUsername: string;
    ownerId: string;
    productType?: string;
    videoDuration?: number;
    isSponsored?: boolean;
    taggedUsers?: Array<{
        full_name: string;
        id: string;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
    }>;
    musicInfo?: {
        artist_name: string;
        song_name: string;
        uses_original_audio: boolean;
        should_mute_audio: boolean;
        should_mute_audio_reason: string;
        audio_id: string;
    };
    coauthorProducers?: any[];
    isCommentsDisabled: boolean;
    facebookPage?: any;
}

interface Props {
    results: IInstagramStory[];
}


function Reels({results}: Props) {

    const [playingId, setPlayingId] = useState<string | null>(null);

    const viewsArr = results.map((p) => p.videoPlayCount ?? 0).filter(Boolean);
    const medianViews = median(viewsArr);

    const postsWithVirality = results
        .map((post) => ({
            ...post,
            virality: calculateVirality(post.likesCount || 0,
                post.commentsCount || 0, post.videoPlayCount || 0, medianViews),
        }))
        .sort((a, b) => b.virality - a.virality);


    if (!postsWithVirality?.length)
        return (
            <></>
        );

    return (
        <div className="bg-white dark:bg-[#2d2d2d] shadow-lg rounded-2xl p-6">

            <section className="mx-auto px-4 py-10">
                <div className="flex flex-wrap gap-8 justify-center">
                    {postsWithVirality.map((story, idx) => (
                        <InstagramCard key={story.id} i={idx} playingId={playingId} setPlayingId={setPlayingId}
                                       thumb={story.displayUrl} postUrl={story.url} videoUrl={story.videoUrl || ""}
                                       id={story.id} virality={story.virality}
                                       caption={story.caption} play_count={story.videoPlayCount || 0}
                                       comment_count={story.commentsCount} like_count={story.likesCount}/>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Reels;