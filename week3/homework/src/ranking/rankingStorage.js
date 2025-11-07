export const RANKING_KEY = "match-game:ranking";

export function loadRanking() {
    try {
        const raw = localStorage.getItem(RANKING_KEY);
        const arr = raw ? JSON.parse(raw) : []; 
        return Array.isArray(arr) ? arr : [];
    }
    catch {
        return [];
    }
};

export function appendRanking(entry) {
    const next = [...loadRanking(), entry].sort((a,b) => a.clearTime - b.clearTime);
    localStorage.setItem(RANKING_KEY, JSON.stringify(next));
    return next;
}

export function clearRanking() {
    localStorage.removeItem(RANKING_KEY);
}