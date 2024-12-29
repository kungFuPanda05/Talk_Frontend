export const formatDate = (date) => {
    if (!date) return "N/A"
    const inputDate = new Date(date); // Convert input to a Date object
    const today = new Date(); // Get today's date

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    if (
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getDate() === today.getDate()
    ) {
        return formatTime(inputDate); // Return time in AM/PM format
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
        inputDate.getFullYear() === yesterday.getFullYear() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getDate() === yesterday.getDate()
    ) {
        return 'Yesterday';
    }

    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = inputDate.getFullYear();
    return `${day}/${month}/${year}`;
};