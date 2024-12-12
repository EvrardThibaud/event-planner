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

export function formatDateTimeCommonLanguage(inputDateTime) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    const date = new Date(inputDateTime);
    const dayName = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}h${minutes} ${dayName} ${day} ${month} ${year}`;
}

export function calculTimeMin(sortingTime,sortingType){
    let timeMin
    if (sortingType === 'daily') {
        timeMin = `${sortingTime}T00:00:00.000Z`;
    } else if (sortingType === 'monthly') {
        const date = new Date(sortingTime); 
        timeMin = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-01T00:00:00.000Z`;
    } else if (sortingType === 'weekly') {
      const [year, week] = sortingTime.split('-W');
      const firstDayOfYear = new Date(year, 0, 1);
      const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay() + 1; 
      const date = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd));
      timeMin = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T00:00:00.000Z`;
    }
    return timeMin
}

export function calculTimeMax(sortingTime, sortingType) {
    let timeMax;

    if (sortingType === 'daily') {
        timeMax = `${sortingTime}T23:59:59.999Z`;

    } else if (sortingType === 'monthly') {
        const date = new Date(sortingTime);
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0);
        timeMax = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}T23:59:59.999Z`;

    } else if (sortingType === 'weekly') {
        const [year, week] = sortingTime.split('-W');
        const firstDayOfYear = new Date(year, 0, 1);
        const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay() + 1; 
        const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd));

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        lastDayOfWeek.setHours(23, 59, 59, 999);
        
        timeMax = `${lastDayOfWeek.getFullYear()}-${(lastDayOfWeek.getMonth() + 1).toString().padStart(2, '0')}-${lastDayOfWeek.getDate().toString().padStart(2, '0')}T23:59:59.999Z`;
    }

    return timeMax;
}

// receive a start and end datetime from the google api
// return datetime(s) in common language to display
export function formatEventDateTimes(startDateTime, endDateTime) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];

    function formatTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const amPm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        return `${formattedHours}:${minutes}${amPm}`;
    }

    function formatDate(date) {
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${dayName}, ${month} ${day}`;
    }

    function formatDateTime(date) {
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}, ${formatTime(date)}`;
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
    ) {
        return [`${formatDate(startDate)}⋅${formatTime(startDate)} – ${formatTime(endDate)}`];
    } else {
        return [
            formatDateTime(startDate),
            formatDateTime(endDate)
        ];
    }
}

// receive a datetime from the google api
// return a datetime usable in an html input
export function formatToDatetimeLocal(inputDateTime) {
    const date = new Date(inputDateTime); // Convertir la chaîne en objet Date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois (1-based)
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    // Reconstituer le format compatible avec datetime-local
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

