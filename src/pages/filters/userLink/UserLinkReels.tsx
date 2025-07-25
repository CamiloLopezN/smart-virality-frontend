import {useState} from "react";
import InstagramCard from "../../../components/ui/InstagramCard.tsx";
import {calculateVirality, median} from "../../../utils/constants/contants.ts";
import InstagramProfile from "../../../components/ui/InstagramProfile.tsx";

interface ProfileLink {
    title: string;
    lynx_url: string;
    url: string;
    link_type: string;
}

interface Profile {
    kind: "profile";
    input: string;
    id: string;
    is_private: boolean;
    username: string;
    full_name: string;
    biography: string;
    bio_links?: ProfileLink[];
    followers: number;
    following: number;
    profile_pic: string;
    error?: string;
}

interface VideoVersion {
    bandwidth: number | null;
    height: number;
    type: number;
    url: string;
    width: number;
}

interface Post {
    kind: "post";
    id: string;
    code: string;
    post_type: string;
    owner_id: string;
    taken_at: number;
    caption?: string;
    play_count?: number;
    comment_count?: number;
    like_count?: number;
    has_privately_liked?: boolean;
    thumbnail_url?: string;
    duration?: number;
    video_versions?: VideoVersion[];
    virality?: number;
}

interface UserLinkReelsProps {
    data: Array<Profile | Post>;
}

function UserLinkReels({data}: UserLinkReelsProps) {
    const profile = data.find((d) => d.kind === "profile") as Profile | undefined;
    const posts = data.filter((d) => d.kind === "post") as Post[];
    const [playingId, setPlayingId] = useState<string | null>(null);

    const viewsArr = posts.map((p) => p.play_count ?? 0).filter(Boolean);
    const medianViews = median(viewsArr);

    const postsWithVirality = posts
        .map((post) => ({
            ...post,
            virality: calculateVirality(post.like_count || 0, post.comment_count || 0, post.play_count || 0, medianViews),
        }))
        .sort((a, b) => b.virality - a.virality);

    if (!profile) {
        return (
            <></>
        );
    }

    return (
        <div className="bg-white dark:bg-[#2d2d2d] shadow-lg rounded-2xl p-6">

            {profile.error ? (
                <>
                    <div className="text-center py-2 flex flex-col gap-3">
                        <h2 className="text-xl font-bold text-red-500">Error</h2>
                        <p>{profile.error}</p>
                    </div>
                </>
            ) : (
                <>
                    <InstagramProfile profilePic={profile.profile_pic} bio_links={profile.bio_links}
                                      followers={profile.followers} following={profile.following}
                                      biography={profile.biography}
                                      username={profile.username} fullName={profile.full_name}
                                      postsLength={posts.length}/>
                    <section className="mx-auto px-4 py-10">
                        <div className="flex flex-wrap gap-8 justify-center">
                            {postsWithVirality.map((post, i) => {
                                const postUrl = `https://www.instagram.com/reel/${post.code}/`;
                                return (
                                    <InstagramCard id={post.id} play_count={post.play_count!}
                                                   like_count={post.like_count!}
                                                   caption={post.caption!} virality={post.virality}
                                                   comment_count={post.comment_count!} i={i} postUrl={postUrl}
                                                   thumb={post.thumbnail_url || ""}
                                                   videoUrl={post.video_versions?.[0]?.url || ""}
                                                   playingId={playingId} setPlayingId={setPlayingId}/>
                                );
                            })}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default UserLinkReels;
