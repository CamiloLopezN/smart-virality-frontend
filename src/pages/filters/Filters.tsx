import {useContext, useState} from "react";
import Posts from "./keyword/posts/Posts.tsx";
import Reels from "./keyword/reels/Reels.tsx";
import UserLinkReels, {type Profile} from "./userLink/UserLinkReels.tsx";
import Hashtags from "./keyword/hashtags/Hashtags.tsx";
import {useSnackbar} from "notistack";
import {LoadingContext} from "../../utils/contexts/LoadingContext.ts";
import {faSearch, faUser} from "@fortawesome/free-solid-svg-icons";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {
    getInstagramPostsByKeyword,
    getInstagramPostsByUsername,
    getInstagramProfileByUsername
} from "../../api/locallyInstagram.ts";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import Keyword from "./keyword/Keyword.tsx";

function Filters() {

    const [postsUsersResult, setPostsUsersResult] = useState([]);
    const [reelsUsersResult, setReelsUsersResult] = useState([]);
    const [userLinkReelsResult, setUserLinkReelsResult] = useState([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [hashtagsResult, setHashtagsResult] = useState([]);
    const [searchByLink, setSearchByLink] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        resultsType: "",
        onlyPostsNewerThan: "",
        directUrl: "",
        reelsCount: 10,
        resultsLimit: 2,
    });

    const {enqueueSnackbar} = useSnackbar()
    const {isLoading, setIsLoading} = useContext(LoadingContext)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleToggle = () => {
        setSearchByLink((prev) => !prev);
        setFilters((prev) => ({
            ...prev,
            search: "",
            directUrl: ""
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (searchByLink) {
                await getProfileByUsername();
                await getSearchByLink();
            } else {
                await getPostsByKeyword();
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const getSearchByLink = async () => {
        try {
            const results = await getInstagramPostsByUsername(
                filters.directUrl,
                filters.reelsCount
            );
            setUserLinkReelsResult(results);
        } catch (error: any) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    }

    const getProfileByUsername = async () => {
        try {
            const results = await getInstagramProfileByUsername(filters.directUrl);
            setProfile(results);
        } catch (error: any) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    }

    const getPostsByKeyword = async () => {
        try {
            const results = await getInstagramPostsByKeyword(filters.search, filters.resultsLimit);
            if (filters.resultsType === "posts") {
                setPostsUsersResult(results);
            }
            if (filters.resultsType === "stories") {
                setReelsUsersResult(results);
            }
            if (filters.resultsType === "hashtags") {
                setHashtagsResult(results);
            }
        } catch (error: any) {
            enqueueSnackbar(error.message, {variant: 'error'});
        }
    }
    return (
        <div className={'flex flex-col w-full gap-6 bg-[#1f2b3e] p-4 rounded-lg'}>
            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto flex flex-col gap-6 py-4"
            >
                {/* Switch */}
                <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${searchByLink ? 'text-[#acc2ef]' : 'text-[#e0e0e0]'}`}>
                        By Account
                    </span>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                        ${searchByLink ? 'bg-[#acc2ef]' : 'bg-gray-400'}`}
                        aria-label="Switch search type"
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform absolute
                            ${searchByLink ? 'left-1' : 'translate-x-6'}`}/>
                    </button>
                    <span
                        className={`text-sm font-medium ${!searchByLink ? 'text-[#acc2ef]' : 'text-[#e0e0e0]'}`}>
                        By Keyword
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {searchByLink && (
                        <>
                            <Input isRequired={true} type={'text'} label={"Username"} onChange={handleChange}
                                   id="directUrl"
                                   value={filters.directUrl} icon={faUser} placeholder={"Enter instagram username..."}/>

                            <Input isRequired={true} type={'number'} label={"Count of Reels to scrape"}
                                   onChange={handleChange}
                                   id="reelsCount"
                                   value={filters.reelsCount} icon={faInstagram}
                                   placeholder={"Enter number of reels to scrape..."}/>
                            <div/>
                            <div className={'flex items-center justify-end'}>
                                <Button variant={"secondary"}
                                        isDisabled={filters.directUrl === '' || filters.reelsCount <= 0}
                                        label={"Search"} type={"submit"} icon={faSearch}/>
                            </div>
                        </>
                    )}

                    {!searchByLink && (
                        <>
                            <Input isRequired={true} type={'text'} label={"Search"} onChange={handleChange}
                                   id="search" isDisabled={searchByLink}
                                   value={filters.search} icon={faSearch} placeholder={"Search by keyword..."}/>

                            <Input isRequired={true} type={'number'} label={"Results Limit"} onChange={handleChange}
                                   id="resultsLimit"
                                   value={filters.resultsLimit} icon={faInstagram} placeholder={"Results Limit."}/>
                            <div/>
                            <div className={'flex items-center justify-end'}>
                                <Button variant={"secondary"}
                                        isDisabled={filters.search === '' || filters.resultsLimit <= 0}
                                        label={"Search"} type={"submit"} icon={faSearch}/>
                            </div>
                        </>
                    )}
                </div>
            </form>
            <>
                {!searchByLink && (
                    <Keyword />
                )}

                {searchByLink && (
                    <UserLinkReels profile={profile} userLinkReelsResult={userLinkReelsResult}/>
                )}
            </>
        </div>
    );
}

export default Filters;
