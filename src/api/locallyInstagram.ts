function getApiUrl(): string {
    const url = import.meta.env.VITE_API_LOCALLY_URL as string | undefined;
    if (!url) {
        // Solo se usa en endpoints locales. Si nunca llamas esos endpoints, esto no molesta.
        throw new Error('VITE_API_LOCALLY_URL is not defined');
    }
    return url;
}

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

export async function postInstagramProfileByUsername(username: string, apiKey: string): Promise<any> {
    if (!apiKey) throw new Error('Hiker API key missing. Set localStorage.hikerApiKey or VITE_HIKER_API_KEY');

    const url = `https://api.hikerapi.com/v1/user/by/username?username=${encodeURIComponent(username)}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-access-key': apiKey,
            },
        });
        if (!response.ok) await handleApiError(response);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch Hiker Profile by Username:', error);
        throw error;
    }
}

// Hashtag Top (v2)
export async function postInstagramPostsByKeyword(
    keyword: string,
    apiKey: string,
    pageId?: string
): Promise<any> {
    if (!apiKey) throw new Error('Hiker API key missing. Set localStorage.hikerApiKey or VITE_HIKER_API_KEY');

    const base = `https://api.hikerapi.com/v2/hashtag/medias/top`;
    const url = `${base}?name=${encodeURIComponent(keyword)}${pageId ? `&page_id=${encodeURIComponent(pageId)}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {accept: 'application/json', 'x-access-key': apiKey},
    });
    if (!response.ok) await handleApiError(response);
    return await response.json();
}

// User medias (v2)
export async function postInstagramMediasByUserId(
    userId: string,
    apiKey: string,
    pageId?: string
): Promise<any> {
    if (!apiKey) throw new Error('Hiker API key missing. Set localStorage.hikerApiKey or VITE_HIKER_API_KEY');

    const base = `https://api.hikerapi.com/v2/user/medias`;
    const url = `${base}?user_id=${encodeURIComponent(userId)}${pageId ? `&page_id=${encodeURIComponent(pageId)}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {accept: 'application/json', 'x-access-key': apiKey},
    });
    if (!response.ok) await handleApiError(response);
    return await response.json();
}

// ---------- Endpoints locales (usan getApiUrl() para no romper import) ----------
export async function postInstagramLogin(instagramUsername: string, instagramPassword: string, instagramPhone: string): Promise<any> {
    const url = `${getApiUrl()}/login`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({instagramUsername, instagramPassword, instagramPhone}),
        });
        if (!response.ok) await handleApiError(response);
        return await response.json();
    } catch (error) {
        console.error('Failed to login Instagram:', error);
        throw error;
    }
}

export async function postSendInstagramChallengeCode(instagramUsername: string, code: string): Promise<any> {
    const url = `${getApiUrl()}/send-challenge-code`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({instagramUsername, code}),
        });
        if (!response.ok) await handleApiError(response);
        return await response.json();
    } catch (error) {
        console.error('Failed to send challenge code:', error);
        throw error;
    }
}
