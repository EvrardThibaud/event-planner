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
