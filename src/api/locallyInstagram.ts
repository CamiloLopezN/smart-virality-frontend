
const apiUrl = import.meta.env.VITE_API_LOCALLY_URL;
if (!apiUrl) throw new Error('VITE_API_LOCALLY_URL is not defined');

export async function getInstagramPostsByKeyword(keyword: string, maxPosts: number): Promise<any> {
    const url = `${apiUrl}/search/keyword/${encodeURIComponent(keyword)}/?max_posts=${maxPosts}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
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


export async function getInstagramPostsByUsername(username: string, maxPosts: number): Promise<any> {
    const url = `${apiUrl}/posts/${encodeURIComponent(username)}/?max_posts=${maxPosts}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
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

export async function getInstagramProfileByUsername(username: string): Promise<any> {
    const url = `${apiUrl}/profile/${encodeURIComponent(username)}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
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

