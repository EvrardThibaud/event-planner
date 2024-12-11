export function addTimeToDateTime(datetime, time) {
    const date = new Date(datetime);
    const [hoursToAdd, minutesToAdd] = time.split(':').map(Number);

    date.setMinutes(date.getMinutes() + minutesToAdd);
    date.setHours(date.getHours() + hoursToAdd);

    return date.toISOString().slice(0, 16); 
}

export function formatDateCommonLanguage(inputDate) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dateParts = inputDate.split('/'); // Split format: dd/mm/yyyy
    const day = parseInt(dateParts[0], 10);
    const month = months[parseInt(dateParts[1], 10) - 1];
    const year = dateParts[2];
    
    const suffix = 
        (day % 10 === 1 && day !== 11) ? 'st' : 
        (day % 10 === 2 && day !== 12) ? 'nd' : 
        (day % 10 === 3 && day !== 13) ? 'rd' : 'th';

    return `${month} ${day}${suffix}, ${year}`;
}

