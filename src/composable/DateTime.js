export function addTimeToDateTime(datetime, time) {
    // Convertir le datetime et le temps en objets Date
    const date = new Date(datetime);
    const [hoursToAdd, minutesToAdd] = time.split(':').map(Number);

    // Ajouter les heures et minutes au datetime
    date.setMinutes(date.getMinutes() + minutesToAdd);
    date.setHours(date.getHours() + hoursToAdd);

    // Retourner le résultat sous forme d'ISO string tronquée
    return date.toISOString().slice(0, 16); // Conserve uniquement YYYY-MM-DDTHH:mm
}