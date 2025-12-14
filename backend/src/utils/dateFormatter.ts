
export function dateFormatter(datum:Date, mode: 'time' | 'date'): string {
    switch (mode) {
        case "date":
            //format TT/MM/YYYY
            return `${datum.getDay()}.${datum.getMonth()}.${datum.getFullYear()}`;
        case "time":
            //format HH/MM
            return `${String(datum.getHours()).padStart(2,"0")}:${String(datum.getMinutes()).padStart(2,"0")}`;
        default:
            throw new Error("Format not given");
    }
}