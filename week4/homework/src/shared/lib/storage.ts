const USER_ID_KEY = 'userId';

export const storage = {
    getUserId(): number| null {
        const raw = window.localStorage.getItem(USER_ID_KEY);
        const parsed = Number(raw);
        if(Number.isNaN(parsed)) {
            return null;
        }

        return parsed;
    },
    setUserId(id: number): void {
        window.localStorage.setItem(USER_ID_KEY, String(id));
    },
    removeUserId(): void {
        window.localStorage.removeItem(USER_ID_KEY);
    }
}