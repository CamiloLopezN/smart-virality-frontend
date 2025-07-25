import type {IInstagramExplore, ILocation} from "../utils/types/exploreTypes.ts";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) throw new Error('VITE_API_URL is not defined');
const ApifyKey = localStorage.getItem('apifyKey');

export async function getInstagramExplore(): Promise<IInstagramExplore> {
    const url = `${apiUrl}/new-viral/instagram-explore`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Apify-key': ApifyKey || '',
            },
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Explore:', error);
        throw error;
    }
}

export async function getInstagramLocations(id?: string, slug?: string): Promise<ILocation> {
    let url = '';
    if (id && slug) {
        const params = new URLSearchParams({id, slug});
        url = `${apiUrl}/new-viral/instagram-explore-locations?${params.toString()}`
    }
    if (!id && !slug) {
        url = `${apiUrl}/new-viral/instagram-explore-locations`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Apify-key': ApifyKey || '',
            },
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Explore:', error);
        throw error;
    }
}


export async function getInstagramExploreTopic(fit_id: string): Promise<any> {
    const params = new URLSearchParams({fit_id});
    const url = `${apiUrl}/new-viral/instagram-explore-topic?${params.toString()}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Apify-key': ApifyKey || '',
            }
        });

        if (!res.ok) {
            throw new Error(`API error: ${res.status} ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch Instagram Explore Topic:", error);
        throw error;
    }
}


export async function postInstagramScraper(filters: {
    search: string;
    resultsType: string;
    searchType: string;
    onlyPostsNewerThan: string;
    directUrls?: string[];
    resultsLimit: number;
    searchLimit: number;
}): Promise<any> {
    const url = `${apiUrl}/new-viral/instagram`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Apify-key': ApifyKey || '',
            },
            body: JSON.stringify(filters),
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Scraper:', error);
        throw error;
    }
}

export async function postInstagramExploreReelsScraper(filters: {
    userLink: string;
    reelsCount: number;
}): Promise<any> {
    const url = `${apiUrl}/new-viral/instagram-explore-reels`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Apify-key': ApifyKey || '',
            },
            body: JSON.stringify(filters),
        });
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Scraper:', error);
        throw error;
    }
}
