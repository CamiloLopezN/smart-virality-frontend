export async function getProxiedImage(instagramImageUrl: string): Promise<string> {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) throw new Error('VITE_API_URL is not defined');

    const params = new URLSearchParams({ url: instagramImageUrl });
    const response = await fetch(`${apiUrl}/new-viral/proxy-image?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}