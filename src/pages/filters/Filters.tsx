import React, {useContext, useRef, useState} from "react";
import UserLinkReels, {type Profile} from "./userLink/UserLinkReels.tsx";
import {useSnackbar} from "notistack";
import {LoadingContext} from "../../utils/contexts/LoadingContext.ts";
import {faSearch, faUser, faWarning} from "@fortawesome/free-solid-svg-icons";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";
import {
    postInstagramPostsByKeyword,
    postInstagramPostsByUsername,
    postInstagramProfileByUsername
} from "../../api/locallyInstagram.ts";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import Keyword from "./keyword/Keyword.tsx";
import LinearProgress from "../../components/ui/LinearProgress.tsx";

function Filters() {

    const [keywordResult, setKeywordResult] = useState([]);

    const [userLinkReelsResult, setUserLinkReelsResult] = useState([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const isCancelledRef = useRef(true);

    const [searchByLink, setSearchByLink] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
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
        isCancelledRef.current = false;
        setIsLoading(true);
        try {
            if (searchByLink) {
                await getProfileByUsername();
                await getSearchByLink();
            } else {
                await getPostsByKeyword();
            }
        } catch (error) {
            enqueueSnackbar("An error occurred while fetching data.", {variant: 'error'});
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProfileByUsername = async () => {
        try {
            if (isCancelledRef.current) return;
            const results = await postInstagramProfileByUsername(filters.directUrl);
            if (!isCancelledRef.current) setProfile(results);
        } catch (error) {
            if (!isCancelledRef.current) enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const getSearchByLink = async () => {
        try {
            if (isCancelledRef.current) return;
            const results = await postInstagramPostsByUsername(filters.directUrl, filters.reelsCount);
            if (!isCancelledRef.current) setUserLinkReelsResult(results);
        } catch (error) {
            if (!isCancelledRef.current) enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const getPostsByKeyword = async () => {
        try {
            if (isCancelledRef.current) return;
            const results = await postInstagramPostsByKeyword(filters.search.toLowerCase(), filters.resultsLimit);
            if (!isCancelledRef.current) setKeywordResult(results);
        } catch (error) {
            if (!isCancelledRef.current) enqueueSnackbar(error.status + ': ' + error.detail, {variant: 'error'});
        }
    }

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault()
        isCancelledRef.current = true;
        enqueueSnackbar("Search cancelled.", {variant: 'info'});
        setIsLoading(false);
    };

    return (
        <div className={'flex flex-col w-full gap-6 bg-[#1f2b3e] p-4 rounded-lg'}>
            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto flex flex-col gap-6 py-4"
            >
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
                            <div className={'flex items-center justify-end gap-3'}>
                                {!isCancelledRef.current && isLoading && (
                                    <Button variant={"danger"}
                                            isDisabled={isCancelledRef.current}
                                            label={"Cancel"} onClick={handleCancel} icon={faWarning}/>
                                )}

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
                            <div className={'flex items-center justify-end gap-3'}>

                                {!isCancelledRef.current && isLoading && (
                                    <Button variant={"danger"}
                                            isDisabled={isCancelledRef.current}
                                            label={"Cancel"} onClick={handleCancel} icon={faWarning}/>
                                )}
                                <Button variant={"secondary"}
                                        isDisabled={filters.search === '' || filters.resultsLimit <= 0}
                                        label={"Search"} type={"submit"} icon={faSearch}/>
                            </div>
                        </>
                    )}
                </div>
            </form>
            <>
                {isLoading && (
                    <LinearProgress indeterminate/>
                )}
                    {!searchByLink && (
                        <Keyword userLinkReelsResult={keywordResult}/>
                    )}

                    {searchByLink && (
                        <UserLinkReels profile={profile} userLinkReelsResult={userLinkReelsResult}/>
                    )}
            </>
        </div>
    );
}

export default Filters;
