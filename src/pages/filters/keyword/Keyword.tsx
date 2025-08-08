import React, {useContext, useEffect, useState} from "react";
import InstagramCard from "../../../components/shared/InstagramCard.tsx";
import {calculatePostVirality, calculateVirality, median} from "../../../utils/constants/contants.ts";
import Button from "../../../components/ui/Button.tsx";
import {faChartSimple, faImage, faVideo} from "@fortawesome/free-solid-svg-icons";
import GenericModal from "../../../components/ui/GenericModal.tsx";
import UserLinkReels, {type Profile} from "../userLink/UserLinkReels.tsx";
import {postInstagramPostsByUsername, postInstagramProfileByUsername} from "../../../api/locallyInstagram.ts";
import {useSnackbar} from "notistack";
import {LoadingContext} from "../../../utils/contexts/LoadingContext.ts";
import LinearProgress from "../../../components/ui/LinearProgress.tsx";

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
    user?: {
        "pk": string,
        "username": string,
        "full_name": string,
        "profile_pic_url": string,
        "profile_pic_url_hd": string,
        "is_private": boolean
    }
}


interface UserLinkReelsProps {
    userLinkReelsResult: Post[];
}

function Keyword({userLinkReelsResult}: UserLinkReelsProps) {

    const [userSelected, setUserSelected] = useState<any>(null);
    const [userSelectedPosts, setUserSelectedPosts] = useState([]);
    const [userSelectedProfile, setUserSelectedProfile] = useState<Profile | null>(null);

    const {enqueueSnackbar} = useSnackbar()

    const {isLoading, setIsLoading} = useContext(LoadingContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
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


    const getUserPosts = async (user: any) => {
        setUserSelected(user)
        setIsModalOpen(true);
        setIsLoading(true);
        try {
            await getProfileByUsername(user.username);
            await getSearchByLink(user.username);
        } catch (error) {
            enqueueSnackbar("An error occurred while fetching data.", {variant: 'error'});
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!clipsWithVirality.length && !postsWithVirality.length) {
        return null
    }

    const getProfileByUsername = async (username: string) => {
        try {
            const results = await postInstagramProfileByUsername(username);
            setUserSelectedProfile(results);
        } catch (error) {
            enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const getSearchByLink = async (username: string) => {
        try {
            const results = await postInstagramPostsByUsername(username, 10);
            setUserSelectedPosts(results);
        } catch (error) {
            enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const resetUserSelected = () => {
        setIsModalOpen(false);
        setUserSelected(null);
        setUserSelectedPosts([]);
        setUserSelectedProfile(null);
        setIsLoading(false);
    }

    return (
        <div className="bg-[#0F1C2E] shadow-lg rounded-2xl p-6">
            <section className="mx-auto flex flex-col gap-5">
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
                            <div className={'flex flex-col gap-4'} key={i}>
                                {post.user && (
                                    <div>
                                        <Button onClick={() => getUserPosts(post.user!)} label={"Analyze"}
                                                variant={"primary"}
                                                icon={faChartSimple}/>
                                    </div>
                                )}
                                <InstagramCard
                                    key={post.id}
                                    id={post.id}
                                    play_count={post.play_count}
                                    like_count={post.like_count}
                                    caption={post.caption_text}
                                    virality={post.virality}
                                    comment_count={post.comment_count}
                                    i={i}
                                    user={post.user}
                                    postUrl={`https://www.instagram.com/reel/${post.code}/`}
                                    thumb={post.thumbnail_url || ""}
                                    videoUrl={post.video_url || ""}
                                    playingId={playingId}
                                    setPlayingId={setPlayingId}
                                />
                            </div>
                        ))
                        : postsWithVirality.map((post, i) => {
                            let thumb = post.thumbnail_url || "";
                            if (!thumb && post.product_type === "carousel_container" && post.resources?.length) {
                                thumb = post.resources[0]?.thumbnail_url || "";
                            }
                            return (
                                <div className={'flex flex-col gap-4'} key={i}>
                                    {post.user && (
                                        <div>
                                            <Button onClick={() => getUserPosts(post.user)} label={"Analyze"}
                                                    variant={"primary"}
                                                    icon={faChartSimple}/>
                                        </div>
                                    )}
                                    <InstagramCard
                                        key={post.id}
                                        id={post.id}
                                        play_count={post.play_count}
                                        like_count={post.like_count}
                                        caption={post.caption_text}
                                        virality={post.virality}
                                        comment_count={post.comment_count}
                                        i={i}
                                        user={post.user}
                                        postUrl={`https://www.instagram.com/p/${post.code}/`}
                                        thumb={thumb}
                                        videoUrl={post.video_url || ""}
                                        playingId={playingId}
                                        setPlayingId={setPlayingId}
                                        isVideo={false}
                                    />
                                </div>
                            );
                        })}
                </div>
            </section>
            {userSelected && (
                <GenericModal isOpen={isModalOpen} onClose={() => resetUserSelected()} title={userSelected.username}
                              isModalBlocked={false}>
                    <div className={'flex flex-col gap-4'} key={userSelected.username}>
                        {isLoading && (
                            <LinearProgress indeterminate/>
                        )}
                        <UserLinkReels profile={userSelectedProfile} userLinkReelsResult={userSelectedPosts}/>
                    </div>
                </GenericModal>
            )}
        </div>
    );
}

export default Keyword;
