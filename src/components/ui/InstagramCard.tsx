import {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {formatNumber} from "../../utils/constants/contants";
import {getProxiedImage} from "../../api/Proxy";
import {CacheImagesContext} from "../../utils/contexts/CacheImagesContext.ts";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

interface IInstagramCardProps {
    i: number;
    playingId: string | null;
    setPlayingId: (id: string | null) => void;
    thumb: string;
    postUrl: string;
    videoUrl: string;
    id: string;
    virality: number;
    caption: string;
    play_count: number;
    comment_count: number;
    like_count: number;
    isVideo?: boolean;
}

function InstagramCard({
                           i, playingId, thumb, setPlayingId, postUrl, videoUrl,
                           virality, id, like_count, play_count, comment_count, caption, isVideo = true
                       }: IInstagramCardProps) {

    const {cacheImagesURL, setCacheImagesURL} = useContext(CacheImagesContext);
    const [proxiedThumb, setProxiedThumb] = useState<string>("");
    const [thumbLoading, setThumbLoading] = useState<boolean>(true);
    const [proxiedVideoUrl, setProxiedVideoUrl] = useState<string>("");
    const [videoLoading, setVideoLoading] = useState<boolean>(!!isVideo);

    const getFirstLine = (text?: string) => (text ? text.split("\n")[0] : "");

    useEffect(() => {
        let mounted = true;
        setThumbLoading(true);
        setProxiedThumb("");
        if (thumb) {
            const isExisting = cacheImagesURL.find(item => item.url.includes(thumb));

            if (isExisting) {
                setProxiedThumb(isExisting.proxyUrl)
                setThumbLoading(false);
                return
            }

            getProxiedImage(thumb)
                .then(url => {
                    if (mounted) {
                        setCacheImagesURL(prev => {
                            if (prev.some(item => item.url === thumb)) return prev;
                            return [...prev, {url: thumb, proxyUrl: url}];
                        })
                        setProxiedThumb(url);
                        setThumbLoading(false);
                    }
                })
                .catch(() => {
                    if (mounted) {
                        setProxiedThumb(""); // Nunca usar la original
                        setThumbLoading(false);
                    }
                });
        }
        return () => {
            mounted = false;
        };
    }, [thumb]);

    useEffect(() => {
        let mounted = true;
        setVideoLoading(!!isVideo && playingId === id);
        setProxiedVideoUrl("");
        if (isVideo && videoUrl && playingId === id && !thumbLoading) {
            getProxiedImage(videoUrl)
                .then(url => {
                    if (mounted) {
                        setProxiedVideoUrl(url);
                        setVideoLoading(false);
                    }
                })
                .catch(() => {
                    if (mounted) {
                        setProxiedVideoUrl("");
                        setVideoLoading(false);
                    }
                });
        }
        if (playingId !== id) {
            setProxiedVideoUrl("");
            setVideoLoading(false);
        }
        return () => {
            mounted = false;
        };
    }, [videoUrl, isVideo, playingId, id, thumbLoading]);

    const handleCardClick = () => {
        console.log('entro al handleCardClick', {isVideo, thumbLoading, playingId, id});
        if (!isVideo) return;
        if (thumbLoading) return;
        if (playingId !== id) setPlayingId(id);
    };
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const videoCard = document.getElementById(`reel-card-${playingId}`);
            if (playingId && videoCard && !videoCard.contains(e.target as Node)) {
                setPlayingId(null);
            }
        };
        if (playingId) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [playingId]);

    return (
        <div
            key={id}
            id={`reel-card-${id}`}
            className={`relative group rounded-xl bg-neutral-900 shadow-md w-[360px] min-w-[360px] min-h-[640px] h-[640px]
                max-w-full max-h-[75vh] overflow-hidden${isVideo ? ' cursor-pointer' : ''}`}
            style={{
                backgroundImage: proxiedThumb ? `url(${proxiedThumb})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            onClick={handleCardClick}
        >

            {/* Virality badge */}
            <span
                className={
                    "absolute top-4 left-4 rounded px-2 py-0.5 text-xs font-bold z-10 shadow " +
                    (i === 0
                        ? "bg-green-400/90 text-black"
                        : "bg-yellow-400/90 text-black")
                }
                title="Índice de viralidad"
            >
                Viral: {virality?.toFixed(2)}
                {i === 0 && " 🏆"}
            </span>

            <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 right-2 z-10 rounded-full p-2 bg-gradient-to-t from-black/70 via-black/40"
                title="Abrir en Instagram"
                onClick={e => e.stopPropagation()}
            >
                <FontAwesomeIcon icon={faInstagram} size={'xl'} color={'white'}/>
            </a>
            {!thumbLoading && (!isVideo || (isVideo && playingId !== id)) && proxiedThumb && (
                <img
                    src={proxiedThumb}
                    alt="Thumbnail"
                    className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{opacity: playingId === id ? 0 : 1}}
                />
            )}
            {isVideo && playingId === id && !thumbLoading && !videoLoading && proxiedVideoUrl && (
                <video
                    src={proxiedVideoUrl}
                    poster={proxiedThumb}
                    controls
                    autoPlay
                    loop
                    muted
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onClick={e => e.stopPropagation()}
                    style={{background: "black"}}
                />
            )}

            {isVideo && playingId !== id && !thumbLoading && !videoLoading && (
                <>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className="items-center justify-center bg-[#2d2d2d] p-6 rounded-full flex h-[16px] w-[16px] ">
                            <FontAwesomeIcon icon={faPlay} color={'white'}/>
                        </span>
                    </div>
                </>
            )}

            {isVideo && playingId === id && !thumbLoading && videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/90 z-30">
                    <div role="status">
                        <svg aria-hidden="true"
                             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {playingId !== id && !thumbLoading && (
                <>
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none transition-opacity"/>
                    <div className="absolute left-4 bottom-4 flex flex-col gap-3 text-white z-10">
                        <span className="font-bold text-base line-clamp-2 drop-shadow">
                            {getFirstLine(caption)}
                        </span>
                        <div className="flex gap-3 text-sm mt-1 opacity-80">
                            {isVideo && (
                                <span>▶ {formatNumber(play_count)}</span>
                            )}
                            <span>💬 {formatNumber(comment_count)}</span>
                            <span>❤️ {formatNumber(like_count)}</span>
                        </div>
                    </div>
                </>
            )}
            {!proxiedThumb && !thumbLoading && (
                <div className="absolute top-0 left-0 w-full h-full bg-neutral-800"/>
            )}
            {isVideo && playingId === id && !proxiedVideoUrl && !videoLoading && (
                <div className="absolute top-0 left-0 w-full h-full bg-neutral-800"/>
            )}
        </div>
    );
}

export default InstagramCard;
