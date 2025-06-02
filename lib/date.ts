// export const formatMyDate = (date:any) => {

//   if (!date) return "Invalid Date"; // Handle null or undefined values gracefully 
//   const parsedDate = new Date(date); // Convert to Date Object
//   if (isNaN(parsedDate)) return "Invalid date";  // Check if the date is invalid
 
//     const options = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     };

//     return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
    
//   }

  export const formatDuration = (duration:any) => {
    if (!duration) return null;

    var hour = Math.floor(duration / 3600);
    var min = Math.floor(duration % 3600 / 60);
    var sec = Math.floor(duration % 3600 % 60);

    const durationString = `${hour}:${min}:${sec}`;
    return durationString; 
    
  }

export function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}
// lib/utils.ts - Función para formatear fechas
export function formatMyDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
}