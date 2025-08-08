import {useEffect, useState} from "react";
import InstagramCard from "../../../components/shared/InstagramCard.tsx";
import {calculatePostVirality, calculateVirality, median} from "../../../utils/constants/contants.ts";
import InstagramProfile from "../../../components/shared/InstagramProfile.tsx";
import Button from "../../../components/ui/Button.tsx";
import {faImage, faVideo} from "@fortawesome/free-solid-svg-icons";

interface Post {
    id: string;
    code: string;
    caption_text: string;
    like_count: number;
    comment_count: number;
    play_count: number;
    video_url: string | null;
    taken_at: string;
    product_type: string;
    thumbnail_url: string | null;
    resources: {
        pk: string;
        video_url: string | null;
        thumbnail_url: string | null;
        media_type: number;
    }[]
    virality?: number;
}

export interface Profile {
    pk: string;
    username: string;
    full_name: string;
    is_private: boolean;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    is_verified: boolean;
    media_count: number;
    follower_count: number;
    following_count: number;
    biography: string;
    bio_links: {
        link_id: string;
        url: string;
        lynx_url: string | null;
        link_type: string;
        title: string | null;
        is_pinned: boolean;
        open_external_url_with_in_app_browser: boolean;
    }[];
    external_url: string | null;
    is_business: boolean;
    category: string | null;
    category_name: string | null;
}

interface UserLinkReelsProps {
    userLinkReelsResult: Post[];
    profile: Profile | null;
}

function UserLinkReels({userLinkReelsResult, profile}: UserLinkReelsProps) {
    const [activeTab, setActiveTab] = useState<"clips" | "posts">("clips");
    const [playingId, setPlayingId] = useState<string | null>(null);

    const clips = userLinkReelsResult.filter((d) => d.product_type === "clips") as Post[];
    const posts = userLinkReelsResult.filter((d) => d.product_type === "feed" || d.product_type === "carousel_container") as Post[];

    const viewsArr = clips.map((p) => p.play_count ?? 0).filter(Boolean);
    const medianViews = median(viewsArr);
    const clipsWithVirality = clips
        .map((post) => ({
            ...post,
            virality: calculateVirality(post.like_count || 0, post.comment_count || 0, post.play_count || 0, medianViews),
        }))
        .sort((a, b) => b.virality - a.virality);

    const postLikesArr = posts.map((p) => p.like_count ?? 0).filter(Boolean);
    const medianLikes = median(postLikesArr);
    const postsWithVirality = posts
        .map((post) => ({
            ...post,
            virality: calculatePostVirality(post.like_count || 0, post.comment_count || 0, medianLikes),
        }))
        .sort((a, b) => b.virality - a.virality);

    useEffect(() => {
        if (clipsWithVirality.length > 0) {
            setActiveTab('clips');
            return
        }
        if (postsWithVirality.length > 0) {
            setActiveTab('posts');
            return
        }
    }, [userLinkReelsResult]);

    if (!profile) return null;

    return (
        <div className="bg-[#0F1C2E] shadow-lg rounded-2xl p-6">
            <section className="mx-auto flex flex-col gap-5">
                <InstagramProfile
                    isVerified={profile.is_verified}
                    profilePic={profile.profile_pic_url}
                    bio_links={profile.bio_links}
                    followers={profile.follower_count}
                    following={profile.following_count}
                    biography={profile.biography}
                    username={profile.username}
                    fullName={profile.full_name}
                    postsLength={profile.media_count}
                />

                <div className="flex gap-4 justify-end">
                    {clipsWithVirality.length > 0 && (
                        <Button label={"Reels"} onClick={() => setActiveTab('clips')} variant={"secondary"}
                                icon={faVideo} isDisabled={activeTab === "clips"}/>
                    )}
                    {postsWithVirality.length > 0 && (
                        <Button label={"Posts"} onClick={() => setActiveTab('posts')} variant={"secondary"}
                                icon={faImage} isDisabled={activeTab === "posts"}/>
                    )}
                </div>
                <div className="flex flex-wrap gap-8 justify-center">
                    {activeTab === "clips"
                        ? clipsWithVirality.map((post, i) => (
                            <InstagramCard
                                key={post.id}
                                id={post.id}
                                play_count={post.play_count}
                                like_count={post.like_count}
                                caption={post.caption_text}
                                virality={post.virality}
                                comment_count={post.comment_count}
                                i={i}
                                postUrl={`https://www.instagram.com/reel/${post.code}/`}
                                thumb={post.thumbnail_url || ""}
                                videoUrl={post.video_url || ""}
                                playingId={playingId}
                                setPlayingId={setPlayingId}
                            />
                        ))
                        : postsWithVirality.map((post, i) => {
                            let thumb = post.thumbnail_url || "";
                            if (!thumb && post.product_type === "carousel_container" && post.resources?.length) {
                                thumb = post.resources[0]?.thumbnail_url || "";
                            }
                            return (
                                <InstagramCard
                                    key={post.id}
                                    id={post.id}
                                    play_count={post.play_count}
                                    like_count={post.like_count}
                                    caption={post.caption_text}
                                    virality={post.virality}
                                    comment_count={post.comment_count}
                                    i={i}
                                    postUrl={`https://www.instagram.com/p/${post.code}/`}
                                    thumb={thumb}
                                    videoUrl={post.video_url || ""}
                                    playingId={playingId}
                                    setPlayingId={setPlayingId}
                                    isVideo={false}
                                />
                            );
                        })}
                </div>
            </section>
        </div>
    )
        ;
}

export default UserLinkReels;
