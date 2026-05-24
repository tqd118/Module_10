export default function formatTime(dateString: string) {
    const target = new Date(dateString).getTime();
    const now = new Date().getTime();

    const diffMs = now - target;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
        return `${diffMinutes} min`;
    }

    if (diffHours < 24) {
        return `${diffHours} hours`;
    }

    return `${diffDays} day`;
}
