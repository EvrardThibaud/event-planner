export function addTimeToDateTime(datetime, time) {
    const date = new Date(datetime);
    const [hoursToAdd, minutesToAdd] = time.split(':').map(Number);

    date.setMinutes(date.getMinutes() + minutesToAdd);
    date.setHours(date.getHours() + hoursToAdd);

    return date.toISOString().slice(0, 16); 
}

export function getCurrentWeekDetails() {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Lundi
    const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6)); // Dimanche
    
    const weekNumber = Math.ceil((firstDayOfWeek.getTime() - new Date(firstDayOfWeek.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
        weekNumber: weekNumber,
        firstDay: `${daysOfWeek[firstDayOfWeek.getDay()]}, ${firstDayOfWeek.toLocaleDateString()}`,
        lastDay: `${daysOfWeek[lastDayOfWeek.getDay()]}, ${lastDayOfWeek.toLocaleDateString()}`
    };
}

export function getCurrentMonthName() {
    const now = new Date();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `${month} ${year}`;
}

export function getTodayDetails() {
    const now = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[now.getDay()];
    const formattedDate = now.toLocaleDateString();
    
    return {
        dayName: dayName,
        date: formattedDate,
        commonLanguage: formatDateCommonLanguage(formattedDate)
    };
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

