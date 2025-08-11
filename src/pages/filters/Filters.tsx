import React, {useContext, useRef, useState} from "react";
import UserLinkReels, {type Profile} from "./userLink/UserLinkReels.tsx";
import {useSnackbar} from "notistack";
import {LoadingContext} from "../../utils/contexts/LoadingContext.ts";
import {faArrowLeft, faArrowRight, faSearch, faUser, faWarning} from "@fortawesome/free-solid-svg-icons";
import {
    postInstagramMediasByUserId,
    postInstagramPostsByKeyword,
    postInstagramProfileByUsername
} from "../../api/locallyInstagram.ts";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import Keyword from "./keyword/Keyword.tsx";
import LinearProgress from "../../components/ui/LinearProgress.tsx";
import {mapHikerProfileToProfile, mapHikerUserMediasToPosts} from "../../utils/mappers/hiker.ts";

// ---- mapper hashtag -> Post[] (tu versión) ----
function mapHikerHashtagTopToPosts(hikerJson: any) {
    const sections = hikerJson?.response?.sections ?? [];
    const medias: any[] = [];

    for (const sec of sections) {
        const lc = sec?.layout_content ?? {};
        const clipItems = lc?.one_by_two_item?.clips?.items ?? [];
        for (const it of clipItems) if (it?.media) medias.push(it.media);
        const gridItems = lc?.medias ?? [];
        for (const it of gridItems) if (it?.media) medias.push(it.media);
    }

    const toIso = (t: any) => (typeof t === "number" ? new Date(t * 1000).toISOString() : (t || ""));
    const firstUrl = (arr?: any[]) => (Array.isArray(arr) && arr.length ? arr[0]?.url ?? null : null);
    const firstThumb = (m: any) =>
        m?.image_versions2?.candidates?.[0]?.url ??
        m?.image_versions2?.additional_candidates?.first_frame?.url ?? null;

    const guessProductType = (m: any) => {
        if (m?.product_type) return m.product_type;
        if (m?.media_type === 2) return "clips";
        if (m?.media_type === 8) return "carousel_container";
        return "feed";
    };

    const mapCarouselResources = (m: any) =>
        (m?.carousel_media ?? []).map((p: any) => ({
            pk: String(p?.pk ?? ""),
            video_url: firstUrl(p?.video_versions),
            thumbnail_url: firstThumb(p),
            media_type: Number(p?.media_type ?? 1),
        }));

    return medias.map((m) => {
        const product_type = guessProductType(m);
        return {
            id: String(m?.pk ?? m?.id ?? ""),
            code: m?.code ?? "",
            caption_text: m?.caption?.text ?? "",
            like_count: Number(m?.like_count ?? 0),
            comment_count: Number(m?.comment_count ?? 0),
            play_count: Number(m?.play_count ?? m?.ig_play_count ?? 0),
            video_url: firstUrl(m?.video_versions),
            taken_at: toIso(m?.taken_at),
            product_type,
            thumbnail_url: firstThumb(m),
            resources: product_type === "carousel_container" ? mapCarouselResources(m) : [],
            user: m?.user
                ? {
                    pk: String(m.user.pk ?? m.user.id ?? ""),
                    username: m.user.username ?? "",
                    full_name: m.user.full_name ?? "",
                    profile_pic_url: m.user.profile_pic_url ?? "",
                    profile_pic_url_hd: m.user.profile_pic_url_hd ?? m.user.profile_pic_url ?? "",
                    is_private: Boolean(m.user.is_private),
                }
                : undefined,
        };
    });
}

function Filters() {
    const [keywordResult, setKeywordResult] = useState<any[]>([]);
    const [userLinkReelsResult, setUserLinkReelsResult] = useState<any[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const isCancelledRef = useRef(true);

    const [searchByLink, setSearchByLink] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        directUrl: "",
    });

    const {enqueueSnackbar} = useSnackbar();
    const {isLoading, setIsLoading} = useContext(LoadingContext);

    // --- Paginación y caché ---
    // Keyword
    const [kwCursor, setKwCursor] = useState<string | null>(null);
    const [kwNext, setKwNext] = useState<string | null>(null);
    const [kwPrevStack, setKwPrevStack] = useState<string[]>([]);
    const kwCache = useRef<Map<string, { posts: any[]; next: string | null }>>(new Map()); // key = pageId||''

    // User medias
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [userCursor, setUserCursor] = useState<string | null>(null);
    const [userNext, setUserNext] = useState<string | null>(null);
    const [userPrevStack, setUserPrevStack] = useState<string[]>([]);
    const userCache = useRef<Map<string, { posts: any[]; next: string | null }>>(new Map()); // key = `${userId}|${pageId||''}`

    const resetKeywordPaging = () => {
        setKwCursor(null);
        setKwNext(null);
        setKwPrevStack([]);
        kwCache.current.clear();
    };
    const resetUserPaging = () => {
        setUserCursor(null);
        setUserNext(null);
        setUserPrevStack([]);
        setCurrentUserId(null);
        userCache.current.clear();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFilters((prev) => ({...prev, [name]: value}));
    };

    const handleToggle = () => {
        setSearchByLink((prev) => !prev);
        setFilters((prev) => ({...prev, search: "", directUrl: ""}));
        // reset data y paginación
        setKeywordResult([]);
        setUserLinkReelsResult([]);
        setProfile(null);
        resetKeywordPaging();
        resetUserPaging();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        isCancelledRef.current = false;
        setIsLoading(true);
        try {
            if (searchByLink) {
                // By Account
                setUserLinkReelsResult([]);
                resetUserPaging();
                const prof = await getProfileByUsername();
                if (prof?.pk) {
                    setCurrentUserId(String(prof.pk));
                    await getMediasPage(String(prof.pk), null); // primera página
                }
            } else {
                // By Keyword
                setKeywordResult([]);
                resetKeywordPaging();
                await getKeywordPage(null); // primera página
            }
        } catch (error) {
            enqueueSnackbar("An error occurred while fetching data.", {variant: 'error'});
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ---------- Calls ----------
    const getProfileByUsername = async () => {
        try {
            if (isCancelledRef.current) return null;
            const apiKey = (localStorage.getItem('hikerApiKey') || '').trim();
            const hikerProfile = await postInstagramProfileByUsername(filters.directUrl, apiKey);
            const mapped = mapHikerProfileToProfile(hikerProfile);
            setProfile(mapped);
            return mapped;
        } catch (error: any) {
            enqueueSnackbar(`${error.status || ''} ${error.detail || error.message}`, {variant: 'error'});
            return null;
        }
    };

    const getMediasPage = async (userId: string, pageId: string | null) => {
        // 1) cache key
        const key = `${userId}|${pageId || ''}`;
        // 2) cache hit?
        const cached = userCache.current.get(key);
        if (cached) {
            setUserLinkReelsResult(cached.posts);
            setUserNext(cached.next);
            setUserCursor(pageId || null);
            return; // no pidas de nuevo
        }

        // 3) fetch si no hay cache
        try {
            if (isCancelledRef.current) return;
            const apiKey = (localStorage.getItem('hikerApiKey') || '').trim();
            const hikerJson = await postInstagramMediasByUserId(userId, apiKey, pageId || undefined);
            const posts = mapHikerUserMediasToPosts(hikerJson);
            const next = hikerJson?.next_page_id ?? null;

            // guarda cache
            userCache.current.set(key, {posts, next});

            // setea estado (esto dispara recalculo de virality en UserLinkReels)
            setUserLinkReelsResult(posts);
            setUserNext(next);
            setUserCursor(pageId || null);
        } catch (error: any) {
            enqueueSnackbar(`${error.status || ''} ${error.detail || error.message}`, {variant: 'error'});
        }
    };

    const getKeywordPage = async (pageId: string | null) => {
        const key = pageId || '';
        const cached = kwCache.current.get(key);
        if (cached) {
            setKeywordResult(cached.posts);
            setKwNext(cached.next);
            setKwCursor(pageId || null);
            return;
        }

        try {
            if (isCancelledRef.current) return;
            const apiKey = (localStorage.getItem('hikerApiKey') || '').trim();
            const hikerJson = await postInstagramPostsByKeyword(filters.search.toLowerCase(), apiKey, pageId || undefined);
            const posts = mapHikerHashtagTopToPosts(hikerJson);
            const next = hikerJson?.next_page_id ?? null;

            kwCache.current.set(key, {posts, next});

            setKeywordResult(posts);
            setKwNext(next);
            setKwCursor(pageId || null);
        } catch (error: any) {
            enqueueSnackbar(`HikerAPI: ${error.message || "Error"}`, {variant: "error"});
        }
    };

    // ---------- Botones Prev/Next ----------
    const onKeywordNext = async () => {
        if (!kwNext) return;
        setIsLoading(true);
        setKwPrevStack((s) => [...s, kwCursor || '']); // guarda cursor actual
        await getKeywordPage(kwNext);
        setIsLoading(false);
    };
    const onKeywordPrev = async () => {
        if (kwPrevStack.length === 0) return;
        setIsLoading(true);
        const prev = kwPrevStack[kwPrevStack.length - 1] || null;
        setKwPrevStack((s) => s.slice(0, -1));
        await getKeywordPage(prev);
        setIsLoading(false);
    };

    const onUserNext = async () => {
        if (!currentUserId || !userNext) return;
        setIsLoading(true);
        setUserPrevStack((s) => [...s, userCursor || '']);
        await getMediasPage(currentUserId, userNext);
        setIsLoading(false);
    };
    const onUserPrev = async () => {
        if (!currentUserId || userPrevStack.length === 0) return;
        setIsLoading(true);
        const prev = userPrevStack[userPrevStack.length - 1] || null;
        setUserPrevStack((s) => s.slice(0, -1));
        await getMediasPage(currentUserId, prev);
        setIsLoading(false);
    };

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        isCancelledRef.current = true;
        enqueueSnackbar("Search cancelled.", {variant: 'info'});
        setIsLoading(false);
    };

    const pagingControls = (mode: 'keyword' | 'user') => (
        <div className="flex justify-center gap-4 mt-4">
            {mode === 'keyword' ? (
                <>
                    <Button variant="secondary" label="Previous" isDisabled={kwPrevStack.length === 0}
                            icon={faArrowLeft}
                            onClick={onKeywordPrev}/>
                    <Button variant="secondary" label="Next" isDisabled={!kwNext} onClick={onKeywordNext}
                            icon={faArrowRight}/>
                </>
            ) : (
                <>
                    <Button variant="secondary" label="Previous" isDisabled={userPrevStack.length === 0}
                            onClick={onUserPrev} icon={faArrowLeft}/>
                    <Button variant="secondary" label="Next" isDisabled={!userNext} onClick={onUserNext}
                            icon={faArrowRight}/>
                </>
            )}
        </div>
    );

    return (
        <div className={'flex flex-col w-full gap-6 bg-[#1f2b3e] p-4 rounded-lg'}>
            <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col gap-6 py-4">
                <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${searchByLink ? 'text-[#acc2ef]' : 'text-[#e0e0e0]'}`}>
                        By Account
                    </span>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full 
                        transition-colors focus:outline-none bg-[#acc2ef] cursor-pointer`}
                        aria-label="Switch search type"
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform absolute
                            ${searchByLink ? 'left-1' : 'translate-x-6'}`}/>
                    </button>
                    <span className={`text-sm font-medium ${!searchByLink ? 'text-[#acc2ef]' : 'text-[#e0e0e0]'}`}>
                        By Keyword
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {searchByLink ? (
                        <>
                            <Input isRequired type="text" label={"Username"} onChange={handleChange}
                                   id="directUrl" value={filters.directUrl} icon={faUser}
                                   placeholder={"Enter instagram username..."}/>
                            <div className="flex items-center justify-end gap-3">
                                {!isCancelledRef.current && isLoading && (
                                    <Button variant="danger" isDisabled={isCancelledRef.current}
                                            label="Cancel" onClick={handleCancel} icon={faWarning}/>
                                )}
                                <Button variant="secondary"
                                        isDisabled={filters.directUrl === ''}
                                        label="Search" type="submit" icon={faSearch}/>
                            </div>
                        </>
                    ) : (
                        <>
                            <Input isRequired type="text" label={"Search"} onChange={handleChange}
                                   id="search" isDisabled={searchByLink} value={filters.search}
                                   icon={faSearch} placeholder={"Search by keyword..."}/>
                            <div className="flex items-center justify-end gap-3">
                                {!isCancelledRef.current && isLoading && (
                                    <Button variant="danger" isDisabled={isCancelledRef.current}
                                            label="Cancel" onClick={handleCancel} icon={faWarning}/>
                                )}
                                <Button variant="secondary"
                                        isDisabled={filters.search === ''}
                                        label="Search" type="submit" icon={faSearch}/>
                            </div>
                        </>
                    )}
                </div>
            </form>

            <>
                {isLoading && <LinearProgress indeterminate/>}

                {!searchByLink && (
                    <>
                        {pagingControls('keyword')}
                        <Keyword userLinkReelsResult={keywordResult}/>
                    </>
                )}

                {searchByLink && (
                    <>
                        {pagingControls('user')}
                        <UserLinkReels profile={profile} userLinkReelsResult={userLinkReelsResult}/>
                    </>
                )}
            </>
        </div>
    );
}

export default Filters;
