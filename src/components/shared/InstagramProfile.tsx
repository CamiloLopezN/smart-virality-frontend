import {formatNumber} from "../../utils/constants/contants.ts";
import {useContext, useEffect, useState} from "react";
import {CacheImagesContext} from "../../utils/contexts/CacheImagesContext.ts";
import {getProxiedImage} from "../../api/Proxy.ts";

interface IInstagramProfileProps {
    profilePic?: string;
    username?: string;
    followers: number;
    following: number;
    biography?: string;
    fullName?: string;
    postsLength?: number;
    isVerified?: boolean;
    bio_links?: {
        url: string;
    }[]
}

function InstagramProfile({
                              profilePic,
                              fullName,
                              following,
                              followers,
                              username,
                              biography,
                              postsLength,
                              isVerified
                          }: IInstagramProfileProps) {

    const {cacheImagesURL, setCacheImagesURL} = useContext(CacheImagesContext);
    const [proxiedProfilePicture, setProxiedProfilePicture] = useState<string>();
    const [, setProfilePictureLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        setProfilePictureLoading(true);
        if (profilePic) {
            const isExisting = cacheImagesURL.find(item => item.url.includes(profilePic));

            if (isExisting) {
                setProxiedProfilePicture(isExisting.proxyUrl)
                setProfilePictureLoading(true);
                return
            }

            getProxiedImage(profilePic)
                .then(url => {
                    if (mounted) {
                        setCacheImagesURL(prev => {
                            if (prev.some(item => item.url === profilePic)) return prev;
                            return [...prev, {url: profilePic, proxyUrl: url}];
                        })
                        setProxiedProfilePicture(url);
                        setProfilePictureLoading(false);
                    }
                })
                .catch(() => {
                    if (mounted) {
                        setProxiedProfilePicture("");
                        setProfilePictureLoading(false);
                    }
                });
        }
        return () => {
            mounted = false;
        };
    }, [profilePic]);

    return (
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="relative flex-shrink-0">
                <img
                    src={proxiedProfilePicture}
                    className="w-40 h-40 rounded-full border-4  border-[#0F1C2E] shadow-lg object-cover"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-2xl font-bold text-[#FFFFFF]">{username}</span>

                    {isVerified &&
                        <span
                            className="bg-[#cee8ff] text-xs px-2 py-1 rounded
                            text-[#0F1C2E] font-semibold">Verified</span>
                    }
                </div>
                <div className="flex gap-8 text-base text-[#acc2ef]">
                    <span>
                        <b className="font-bold">{formatNumber(postsLength)}</b> publicaciones
                    </span>
                    <span>
                        <b className="font-bold">{formatNumber(followers)}</b> seguidores
                    </span>
                    <span>
                        <b className="font-bold">{formatNumber(following)}</b> seguidos
                    </span>
                </div>
                <div className="text-base leading-tight text-[#acc2ef]">
                    <b>{fullName}</b>
                    <div className="whitespace-pre-line">{biography}</div>
                    {/*{bio_links?.map((link, i) => (*/}
                    {/*    <a*/}
                    {/*        key={i}*/}
                    {/*        href={link.url}*/}
                    {/*        target="_blank"*/}
                    {/*        rel="noopener noreferrer"*/}
                    {/*        className="inline-block mt-1 text-blue-400 hover:underline break-all"*/}
                    {/*    >*/}
                    {/*        {link.url.replace(/^https?:\/\//, "")}*/}
                    {/*    </a>*/}
                    {/*))}*/}
                </div>
            </div>
        </div>
    );
}

export default InstagramProfile;