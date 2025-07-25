import {useContext, useState} from "react";
import {postInstagramExploreReelsScraper, postInstagramScraper} from "../../api/Instagram.ts";
import Posts from "./keyword/posts/Posts.tsx";
import Reels from "./keyword/reels/Reels.tsx";
import UserLinkReels from "./userLink/UserLinkReels.tsx";
import Hashtags from "./keyword/hashtags/Hashtags.tsx";
import {useSnackbar} from "notistack";
import {LoadingContext} from "../../utils/contexts/LoadingContext.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDay, faSearch, faUser} from "@fortawesome/free-solid-svg-icons";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";

function Filters() {

    const [postsUsersResult, setPostsUsersResult] = useState([]);
    const [reelsUsersResult, setReelsUsersResult] = useState([]);
    const [userLinkReelsResult, setUserLinkReelsResult] = useState([]);
    const [hashtagsResult, setHashtagsResult] = useState([]);
    const [searchByLink, setSearchByLink] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        resultsType: "",
        onlyPostsNewerThan: "",
        directUrl: "",
        reelsCount: 10,
        resultsLimit: 2,
        searchLimit: 5
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

        if (searchByLink) {
            await getSearchByLink()
            return
        }

        await getSearchByKeyword();

    };

    const getSearchByKeyword = async () => {
        const searchType = filters.resultsType === "hashtags" ? "hashtag" : "user";
        const resultsType = filters.resultsType === "hashtags" ? "posts" : filters.resultsType;

        postInstagramScraper({
            search: filters.search,
            resultsType: resultsType,
            searchType: searchType,
            onlyPostsNewerThan: filters.onlyPostsNewerThan,
            directUrls: searchByLink ? [filters.directUrl] : [],
            resultsLimit: filters.resultsLimit,
            searchLimit: filters.searchLimit
        }).then(result => {
            if (filters.resultsType === "hashtags") {
                setHashtagsResult(result);
            }

            if (filters.resultsType === "posts") {
                setPostsUsersResult(result);
            }

            if (filters.resultsType === "stories") {
                setReelsUsersResult(result);
            }
        }).catch((error) => {
            enqueueSnackbar(error.message, {variant: 'error'});
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const getSearchByLink = async () => {
        postInstagramExploreReelsScraper({
            userLink: filters.directUrl,
            reelsCount: filters.reelsCount
        }).then(results => {
            setUserLinkReelsResult(results)
        }).catch(error => {
            enqueueSnackbar(error.message, {variant: 'error'});
        }).finally(() => {
            setIsLoading(false);
        });
    }


    return (
        <div className={'flex flex-col w-full gap-6'}>
            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto flex flex-col gap-6 py-4"
            >
                {/* Switch */}
                <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${searchByLink ? 'text-blue-600' : 'text-gray-400'}`}>
                        By Account
                    </span>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                        ${searchByLink ? 'bg-blue-600' : 'bg-gray-400'}`}
                        aria-label="Switch search type"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform absolute
                            ${searchByLink ? 'left-0' : 'translate-x-1'}`}/>
                    </button>
                    <span
                        className={`text-sm font-medium ${!searchByLink ? 'text-blue-600' : 'text-gray-400'}`}>
                        By Keyword
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {searchByLink && (
                        <>
                            <div className="flex flex-col w-full">
                                <label htmlFor="directUrl"
                                       className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                    User Account link
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faUser}/>
                                    </div>
                                    <input
                                        type="text"
                                        id="directUrl"
                                        name="directUrl"
                                        value={filters.directUrl}
                                        onChange={handleChange}
                                        disabled={!searchByLink}
                                        className={`block w-full p-3 ps-10 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500
                                    ${searchByLink ?
                                            'text-gray-900 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white' :
                                            'bg-gray-200 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                                        }`}
                                        placeholder="https://www.instagram.com/user/"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="directUrl"
                                       className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                    Count of Reels to scrape
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faInstagram}/>
                                    </div>
                                    <input
                                        min={1}
                                        max={100}
                                        type="number"
                                        id="reelsCount"
                                        name="reelsCount"
                                        value={filters.reelsCount}
                                        onChange={handleChange}
                                        disabled={!searchByLink}
                                        className={`block w-full p-3 ps-10 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500
                                    ${searchByLink ?
                                            'text-gray-900 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white' :
                                            'bg-gray-200 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                                        }`}
                                        placeholder=""
                                        required
                                    />
                                </div>
                            </div>
                            <div/>
                            <div className="flex flex-col w-full justify-end items-end">
                                <div className="relative">
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className={
                                            'ml-auto w-full md:w-auto bg-blue-700 text-white rounded-lg hover:bg-blue-800 ' +
                                            'focus:ring-4 focus:ring-blue-300 font-medium text-base ' +
                                            'dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition ' +
                                            (isLoading ? 'cursor-default' : 'cursor-pointer')
                                        }
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {!searchByLink && (
                        <>
                            <div className="flex flex-col w-full">
                                <label htmlFor="search"
                                       className="text-sm font-medium text-gray-900 dark:text-white">
                                    Search
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        id="search"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleChange}
                                        disabled={searchByLink}
                                        className={`block w-full p-3 ps-10 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500
                                    ${!searchByLink ?
                                            'text-gray-900 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white' :
                                            'bg-gray-200 border-gray-200 text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
                                        }`}
                                        placeholder="Search by keyword..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="search"
                                       className="text-sm font-medium text-gray-900 dark:text-white">
                                    What do you want to scrape?
                                </label>
                                <div className="relative">
                                    <select
                                        id="resultsType"
                                        name="resultsType"
                                        value={filters.resultsType}
                                        onChange={handleChange}
                                        className="p-3  text-sm rounded-lg
                                    focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700
                                    dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                     dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Choose an option</option>
                                        <option value="posts">Posts</option>
                                        <option value="stories">Reels</option>
                                        <option value="hashtags">Hashtags</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <label htmlFor="onlyPostsNewerThan"
                                       className="text-sm font-medium text-gray-900 dark:text-white">
                                    Only Posts Newer Than
                                </label>
                                <div className="relative">
                                    <div
                                        className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarDay}/>
                                    </div>
                                    <input
                                        type="date"
                                        id="onlyPostsNewerThan"
                                        name="onlyPostsNewerThan"
                                        value={filters.onlyPostsNewerThan}
                                        onChange={handleChange}
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="onlyPostsNewerThan"
                                       className="text-sm font-medium text-gray-900 dark:text-white">
                                    Results Limit
                                </label>
                                <div className="relative">
                                    <input
                                        min={1}
                                        max={50}
                                        type="number"
                                        id="resultsLimit"
                                        name="resultsLimit"
                                        value={filters.resultsLimit}
                                        onChange={handleChange}
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="onlyPostsNewerThan"
                                       className="text-sm font-medium text-gray-900 dark:text-white">
                                    Search Limit
                                </label>
                                <div className="relative">
                                    <input
                                        min={1}
                                        max={250}
                                        type="number"
                                        id="searchLimit"
                                        name="searchLimit"
                                        value={filters.searchLimit}
                                        onChange={handleChange}
                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="flex flex-col w-full justify-end items-end">
                                <div className="relative">
                                    <button
                                        disabled={isLoading}
                                        type="submit"
                                        className={
                                            'ml-auto w-full md:w-auto bg-blue-700 text-white rounded-lg hover:bg-blue-800 ' +
                                            'focus:ring-4 focus:ring-blue-300 font-medium text-base ' +
                                            'dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition ' +
                                            (isLoading ? 'cursor-default' : 'cursor-pointer')
                                        }
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </form>

            <>
                {!searchByLink && (
                    <>
                        <div>
                            {filters.resultsType === "posts" && (
                                <>
                                    <Posts results={postsUsersResult}/>
                                </>
                            )}


                            {filters.resultsType === "stories" && (
                                <>
                                    <Reels results={reelsUsersResult}/>
                                </>
                            )}

                            {filters.resultsType === "hashtags" && (
                                <>
                                    <Hashtags hashtags={hashtagsResult}/>
                                </>
                            )}
                        </div>
                    </>
                )}

                {searchByLink && (
                    <UserLinkReels data={userLinkReelsResult}/>
                )}
            </>
        </div>
    );
}

export default Filters;
