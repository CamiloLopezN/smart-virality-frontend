const apiUrl = import.meta.env.VITE_API_LOCALLY_URL;
if (!apiUrl) throw new Error('VITE_API_LOCALLY_URL is not defined');

async function handleApiError(response: Response) {
    let errorData: any = {};
    try {
        errorData = await response.json();
    } catch {
        errorData = {detail: response.statusText || "Unknown error"};
    }
    throw {
        ...errorData,
        status: response.status,
        statusText: response.statusText,
        raw: errorData,
    };
}

function getInstagramCredentials() {
    return JSON.parse(localStorage.getItem('instagramAccount') || '{}');
}

export async function postInstagramLogin(instagramUsername: string, instagramPassword: string): Promise<any> {
    const url = `${apiUrl}/login`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', "Content-Type": "application/json"},
            body: JSON.stringify({instagramUsername, instagramPassword}),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to login Instagram:', error);
        throw error;
    }
}

export async function postSendInstagramChallengeCode(instagramUsername: string, code: string): Promise<any> {
    const url = `${apiUrl}/send-challenge-code`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', "Content-Type": "application/json"},
            body: JSON.stringify({instagramUsername, code}),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to send challenge code:', error);
        throw error;
    }
}

export async function postInstagramPostsByKeyword(keyword: string, maxPosts: number): Promise<any> {
    const url = `${apiUrl}/search/keyword/${encodeURIComponent(keyword)}/?max_posts=${maxPosts}`;
    const {instagramUsername, instagramPassword} = getInstagramCredentials();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', "Content-Type": "application/json"},
            body: JSON.stringify({instagramUsername, instagramPassword}),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Explore:', error);
        throw error;
    }
}

export async function postInstagramPostsByUsername(username: string, maxPosts: number): Promise<any> {
    const url = `${apiUrl}/posts/${encodeURIComponent(username)}/?max_posts=${maxPosts}`;
    const {instagramUsername, instagramPassword} = getInstagramCredentials();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', "Content-Type": "application/json"},
            body: JSON.stringify({instagramUsername, instagramPassword}),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Posts by Username:', error);
        throw error;
    }
}

export async function postInstagramProfileByUsername(username: string): Promise<any> {
    const url = `${apiUrl}/profile/${encodeURIComponent(username)}`;
    const {instagramUsername, instagramPassword} = getInstagramCredentials();

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', "Content-Type": "application/json"},
            body: JSON.stringify({instagramUsername, instagramPassword}),
        });
        if (!response.ok) {
            await handleApiError(response);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Instagram Profile:', error);
        throw error;
    }
}
