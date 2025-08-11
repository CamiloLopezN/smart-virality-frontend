// src/utils/mappers/hiker.ts

// Profile (Hiker v1 user/by/username) -> UI Profile
export function mapHikerProfileToProfile(hiker: any) {
    return {
        pk: String(hiker?.pk ?? ""),
        username: hiker?.username ?? "",
        full_name: hiker?.full_name ?? "",
        is_private: Boolean(hiker?.is_private),
        profile_pic_url: hiker?.profile_pic_url ?? "",
        profile_pic_url_hd: hiker?.profile_pic_url_hd ?? hiker?.profile_pic_url ?? "",
        is_verified: Boolean(hiker?.is_verified),
        media_count: Number(hiker?.media_count ?? 0),
        follower_count: Number(hiker?.follower_count ?? 0),
        following_count: Number(hiker?.following_count ?? 0),
        biography: hiker?.biography ?? "",
        bio_links: [], // Hiker no trae bio_links -> vacío
        external_url: hiker?.external_url ?? null,
        is_business: Boolean(hiker?.is_business),
        category: hiker?.category ?? null,
        category_name: hiker?.category_name ?? null,
    };
}

// User medias (Hiker v2 user/medias) -> Post[]
export function mapHikerUserMediasToPosts(hikerJson: any) {
    const items = hikerJson?.response?.items ?? [];
    const toIso = (t: any) => (typeof t === "number" ? new Date(t * 1000).toISOString() : (t || ""));
    const firstUrl = (arr?: any[]) => (Array.isArray(arr) && arr.length ? arr[0]?.url ?? null : null);
    const firstThumb = (m: any) =>
        m?.image_versions2?.candidates?.[0]?.url ??
        m?.image_versions2?.additional_candidates?.first_frame?.url ?? null;

    const guessProductType = (m: any) => {
        if (m?.product_type) return m.product_type;
        if (m?.media_type === 2) return "clips";
        if (m?.media_type === 8) return "carousel_container";
        return "feed";
    };

    const mapCarouselResources = (m: any) =>
        (m?.carousel_media ?? []).map((p: any) => ({
            pk: String(p?.pk ?? ""),
            video_url: firstUrl(p?.video_versions),
            thumbnail_url: firstThumb(p),
            media_type: Number(p?.media_type ?? 1),
        }));

    return items.map((m: any) => {
        const product_type = guessProductType(m);
        return {
            id: String(m?.pk ?? m?.id ?? ""),
            code: m?.code ?? "",
            caption_text: m?.caption?.text ?? "",
            like_count: Number(m?.like_count ?? 0),
            comment_count: Number(m?.comment_count ?? 0),
            play_count: Number(m?.play_count ?? m?.ig_play_count ?? 0),
            video_url: firstUrl(m?.video_versions),
            taken_at: toIso(m?.taken_at),
            product_type,
            thumbnail_url: firstThumb(m),
            resources: product_type === "carousel_container" ? mapCarouselResources(m) : [],
            user: m?.user
                ? {
                    pk: String(m.user.pk ?? m.user.id ?? ""),
                    username: m.user.username ?? "",
                    full_name: m.user.full_name ?? "",
                    profile_pic_url: m.user.profile_pic_url ?? "",
                    profile_pic_url_hd: m.user.profile_pic_url_hd ?? m.user.profile_pic_url ?? "",
                    is_private: Boolean(m.user.is_private),
                }
                : undefined,
        };
    });
}
