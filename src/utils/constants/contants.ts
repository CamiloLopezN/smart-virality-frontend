export const formatNumber = (num: number | undefined) => {
    if (!num && num !== 0) return "0";
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
};

export function median(nums: number[]) {
    if (!nums.length) return 1;
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateVirality(likeCounts: number, commentsCount: number, playCount: number, medianViews: number): number {
    const likes = likeCounts ?? 0;
    const comments = commentsCount ?? 0;
    const views = playCount ?? 0;
    if (!medianViews || medianViews === 0) return 0;
    return (likes * 1.2 + comments * 2 + views * 0.3) / medianViews;
}