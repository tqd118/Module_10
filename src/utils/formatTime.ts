interface TimeResult {
    count: number;
    unit: "minutes" | "hours" | "days";
}

export default function formatTime(dateString: string): TimeResult {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) return { count: diffMinutes, unit: "minutes" };
    if (diffHours < 24)   return { count: diffHours,   unit: "hours"   };
    return                       { count: diffDays,     unit: "days"    };
}