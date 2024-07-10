export function getTimestampFromDate(date: Date) {
    return date.getTime() / 1000;
}

export function getCurrentTimeStamp() {
    return new Date().getTime() / 1000;
}

export function getFormattedTimestamp(timestamp: number, options?: Intl.DateTimeFormatOptions) {
    const date = new Date(timestamp * 1000);

    const defaultOptions: Intl.DateTimeFormatOptions = options || {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true, // Use 12-hour format with AM/PM
    };

    const formatter = new Intl.DateTimeFormat("en-US", options || defaultOptions);
    const formattedDateTime = formatter.format(date);
    return formattedDateTime;
}

export function getDaysDifferenceFromTimestamp(d1: number, d2?: number) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const date1 = new Date(d1 * 1000);
    const date2 = d2 ? new Date(d2 * 1000) : new Date();

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    const diff = Math.floor((utc1 - utc2) / MS_PER_DAY);
    return diff;
}

export function addDaysToDate(date: Date, days: number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
}

export function useSleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
