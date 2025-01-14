export function addTimeToDateTime(datetime, time) {
  const date = new Date(datetime);
  const [hoursToAdd, minutesToAdd] = time.split(":").map(Number);

  date.setMinutes(date.getMinutes() + minutesToAdd);
  date.setHours(date.getHours() + hoursToAdd);

  return date.toISOString().slice(0, 16);
}

export function formatDateCommonLanguage(inputDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateParts = inputDate.split("/"); // Split format: dd/mm/yyyy
  const day = parseInt(dateParts[0], 10);
  const month = months[parseInt(dateParts[1], 10) - 1];
  const year = dateParts[2];

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${month} ${day}${suffix}, ${year}`;
}

export function formatDateTimeCommonLanguage(inputDateTime) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(inputDateTime);
  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}h${minutes} ${dayName} ${day} ${month} ${year}`;
}

export function calculTimeMin(sortingTime, sortingType) {
  let timeMin;
  if (sortingType === "daily") {
    timeMin = `${sortingTime}T00:00:00.000Z`;
  } else if (sortingType === "monthly") {
    const date = new Date(sortingTime);
    timeMin = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-01T00:00:00.000Z`;
  } else if (sortingType === "weekly") {
    const [year, week] = sortingTime.split("-W");
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay() + 1;
    const date = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd)
    );
    timeMin = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}T00:00:00.000Z`;
  }
  return timeMin;
}

export function calculTimeMax(sortingTime, sortingType) {
  let timeMax;

  if (sortingType === "daily") {
    timeMax = `${sortingTime}T23:59:59.999Z`;
  } else if (sortingType === "monthly") {
    const date = new Date(sortingTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);
    timeMax = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${lastDayOfMonth
      .getDate()
      .toString()
      .padStart(2, "0")}T23:59:59.999Z`;
  } else if (sortingType === "weekly") {
    const [year, week] = sortingTime.split("-W");
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay() + 1;
    const firstDayOfWeek = new Date(
      firstDayOfYear.setDate(firstDayOfYear.getDate() + daysToAdd)
    );

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    timeMax = `${lastDayOfWeek.getFullYear()}-${(lastDayOfWeek.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${lastDayOfWeek
      .getDate()
      .toString()
      .padStart(2, "0")}T23:59:59.999Z`;
  }

  return timeMax;
}

// receive a start and end datetime from the google api
// return datetime(s) in common language to display
export function formatEventDateTimes(startDateTime, endDateTime) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "pm" : "am";
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
    return [
      `${formatDate(startDate)} ⋅ ${formatTime(startDate)} – ${formatTime(
        endDate
      )}`,
    ];
  } else {
    return [formatDateTime(startDate), formatDateTime(endDate)];
  }
}

// receive a datetime from the google api
// return a datetime usable in an html input
export function formatToDatetimeLocal(inputDateTime) {
  const date = new Date(inputDateTime); // Convertir la chaîne en objet Date
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mois (1-based)
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Reconstituer le format compatible avec datetime-local
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// receive a sortingType
// return the sortingTime of today for html input
export function getSortingTime(sortingType) {
  const localDate = new Date();
  const year = localDate.getFullYear();

  switch (sortingType) {
    case "daily":
      return localDate.toISOString().slice(0, 10);

    case "weekly":
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = Math.floor(
        (localDate - firstDayOfYear) / 86400000
      );
      const weekNumber = Math.ceil(
        (pastDaysOfYear + firstDayOfYear.getDay()) / 7
      );
      return `${year}-W${String(weekNumber).padStart(2, "0")}`;

    case "monthly":
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
  }
}

// receive sortingTime and a sortingType
// return the time in common language for display
export function formatToTimeName(sortingTime, sortingType) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (sortingType === "weekly") {
    const [year, weekNumber] = sortingTime.split("-W");
    return `Week ${weekNumber}, ${year}`;
  } else if (sortingType === "daily") {
    const date = new Date(sortingTime);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${month} ${day}, ${year}`;
  } else if (sortingType === "monthly") {
    const [year, month] = sortingTime.split("-");
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  } else {
    return "Invalid sorting type";
  }
}

// receive sortingType sortingTime and step (+1 -1)
// return sortingTime for html input increase or decrease by one
export function stepSortingTime(sortingType, sortingTime, step) {
  if (sortingType === "daily") {
    const date = new Date(sortingTime);
    date.setDate(date.getDate() + step);
    return date.toISOString().slice(0, 10);
  } else if (sortingType === "weekly") {
    const [year, week] = sortingTime.split("-W").map(Number);

    function getISOFirstWeekStart(year) {
      const firstDayOfYear = new Date(year, 0, 1);
      const dayOfWeek = firstDayOfYear.getDay();
      const offset = (dayOfWeek <= 4 ? 1 : 8) - dayOfWeek;
      firstDayOfYear.setDate(firstDayOfYear.getDate() + offset);
      return firstDayOfYear;
    }
    const firstWeekStart = getISOFirstWeekStart(year);
    const currentWeekStart = new Date(firstWeekStart);
    currentWeekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7);
    currentWeekStart.setDate(currentWeekStart.getDate() + step * 7);
    const adjustedYear = currentWeekStart.getFullYear();
    const adjustedFirstWeekStart = getISOFirstWeekStart(adjustedYear);
    const adjustedWeek = Math.ceil(
      (currentWeekStart - adjustedFirstWeekStart) / (7 * 24 * 60 * 60 * 1000) +
        1
    );
    if (adjustedWeek === 0) {
      const previousYear = adjustedYear - 1;
      const previousYearFirstWeekStart = getISOFirstWeekStart(previousYear);
      const lastDayOfPreviousYear = new Date(previousYear, 11, 31);
      const lastWeek = Math.ceil(
        (lastDayOfPreviousYear - previousYearFirstWeekStart) /
          (7 * 24 * 60 * 60 * 1000) +
          1
      );
      return `${previousYear}-W${String(lastWeek).padStart(2, "0")}`;
    }

    if (adjustedWeek > 52) {
      const nextYear = adjustedYear + 1;
      const nextYearFirstWeekStart = getISOFirstWeekStart(nextYear);
      if (currentWeekStart >= nextYearFirstWeekStart) {
        return `${nextYear}-W01`;
      }
    }
    return `${adjustedYear}-W${String(adjustedWeek).padStart(2, "0")}`;
  } else if (sortingType === "monthly") {
    const [year, month] = sortingTime.split("-");
    const date = new Date(Number(year), Number(month) - 1 + step);
    const adjustedYear = date.getFullYear();
    const adjustedMonth = String(date.getMonth() + 1).padStart(2, "0");
    return `${adjustedYear}-${adjustedMonth}`;
  } else {
    throw new Error(
      "Invalid sortingType. Use 'daily', 'weekly', or 'monthly'."
    );
  }
}

// receive dateTime from event
// return the hour of this datetime
export function extractHour(dateTime) {
  return new Date(dateTime).getHours();
}

// return a array with the days of the week in common language
export function daysOfTheWeek() {
  return [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
}

// receive a dateTime form event
// return the day of thi datetime in common language
export function getDayOfWeek(dateTime) {
  const days = daysOfTheWeek();
  const date = new Date(dateTime);
  const dayIndex = (date.getDay() + 6) % 7;
  return days[dayIndex];
}

// receive a month in html input type
// return its firstDayIndex in the week and its number of days
export function getMonthInfo(month) {
  const [year, monthIndex] = month.split("-").map(Number);

  const firstDay = new Date(year, monthIndex - 1, 1);
  const firstDayIndex = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

  const lastDay = new Date(year, monthIndex, 0);
  const daysInMonth = lastDay.getDate();

  return {
    firstDayIndex,
    daysInMonth,
  };
}

// receive a dateTime from google api
// return the date number
export function getDayFromDateTime(dateTime) {
  const date = new Date(dateTime);
  return date.getDate();
}

// receive a day of the week in commun language and a week in html input
// return the date number
export function getDayNumberFromWeek(weekday, isoWeek) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const dayIndex = daysOfWeek.indexOf(weekday);
  if (dayIndex === -1) {
    throw new Error("Invalid weekday");
  }

  const [year, week] = isoWeek.split("-W").map(Number);

  const firstDayOfISOWeek = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = firstDayOfISOWeek.getUTCDay();

  const isoWeekStart = new Date(firstDayOfISOWeek);
  isoWeekStart.setUTCDate(
    isoWeekStart.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  );

  isoWeekStart.setUTCDate(
    isoWeekStart.getUTCDate() + (week - 1) * 7 + dayIndex
  );

  return isoWeekStart.getUTCDate();
}

// receive a day of the week in commun language and a week in html input
// return a datetime in html input format
export function getDateFromWeek(dayName, weekString) {
  // Vérifier le format de la semaine (yyyy-wxx)
  if (!/^\d{4}-w\d{2}$/i.test(weekString)) {
    throw new Error("Le format de la semaine doit être yyyy-wxx");
  }

  const dayMapping = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const normalizedDay = dayName.toLowerCase();
  if (!dayMapping[normalizedDay]) {
    throw new Error(
      "Le jour doit être un jour de la semaine valide en anglais"
    );
  }

  const year = parseInt(weekString.substring(0, 4));
  const week = parseInt(weekString.substring(6, 8));

  const januaryFirst = new Date(year, 0, 1);

  const dayOffset = januaryFirst.getDay() || 7;
  const firstWeekday = januaryFirst.getDate() - dayOffset + 1;

  const targetDate = new Date(
    year,
    0,
    firstWeekday + (week - 1) * 7 + (dayMapping[normalizedDay] - 1)
  );

  let finalYear = targetDate.getFullYear();

  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const date = String(targetDate.getDate()).padStart(2, "0");

  return `${finalYear}-${month}-${date}`;
}

export function isTodayMonthly(month, day) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  const currentYearMonth = localDate.toISOString().slice(0, 7); // yyyy-MM
  const currentDay = localDate.getUTCDate(); // Jour du mois (1-31)

  return currentYearMonth === month && currentDay === day;
}

export function isTodayWeekly(isoWeek, weekday) {
  const daysOfWeek = daysOfTheWeek();

  // Vérifier si le jour est valide
  const dayIndex = daysOfWeek.indexOf(weekday);
  if (dayIndex === -1) {
    throw new Error("Invalid weekday");
  }

  // Extraire l'année et la semaine
  const [year, week] = isoWeek.split("-W").map(Number);
  if (!year || !week || week < 1 || week > 53) {
    throw new Error("Invalid ISO week format");
  }

  // Trouver le premier jour de la semaine ISO (lundi de la semaine spécifiée)
  const firstDayOfISOWeek = new Date(Date.UTC(year, 0, 4)); // 4 janvier garantit qu'on est dans la première semaine ISO
  const dayOfWeek = firstDayOfISOWeek.getUTCDay();
  const isoWeekStart = new Date(firstDayOfISOWeek);
  isoWeekStart.setUTCDate(
    isoWeekStart.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  ); // Aller au lundi

  // Aller à la semaine voulue
  isoWeekStart.setUTCDate(isoWeekStart.getUTCDate() + (week - 1) * 7);

  // Aller au jour spécifié
  const targetDate = new Date(isoWeekStart);
  targetDate.setUTCDate(targetDate.getUTCDate() + dayIndex);

  // Comparer avec aujourd'hui
  const today = new Date();
  return (
    targetDate.getUTCFullYear() === today.getUTCFullYear() &&
    targetDate.getUTCMonth() === today.getUTCMonth() &&
    targetDate.getUTCDate() === today.getUTCDate()
  );
}
