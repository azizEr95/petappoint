
export function dateFormatter(datum:Date, mode: 'time' | 'date'): string {
    switch (mode) {
        case "date":
            //format TT/MM/YYYY
            return `${datum.getDay()}.${datum.getMonth()}.${datum.getFullYear()}`;
        case "time":
            //format HH/MM
            return `${datum.getHours()}:${datum.getMinutes()}`;
        default:
            throw new Error("Format not given");
    }
}