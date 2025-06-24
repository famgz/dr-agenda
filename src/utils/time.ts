export function generateTimeArray(
  startHour: number,
  endHour: number,
  intervalMinutes: number,
) {
  if (startHour < 0 || startHour > 24 || endHour < 0 || endHour > 24) {
    throw new Error('Hours must be between 0 and 23');
  }
  if (endHour < startHour) {
    throw new Error('End hour cannot be before start hour (no day crossing)');
  }
  if (intervalMinutes <= 0 || intervalMinutes > 60) {
    throw new Error('Interval must be between 1 and 60 minutes');
  }
  const times = [];
  let currentMinutes = startHour * 60;
  const endMinutes = endHour * 60;
  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const label = [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
    ].join(':');
    const value = [label, '00'].join(':');
    times.push({
      value, // HH:MM:SS
      label, // HH:MM
    });
    currentMinutes += intervalMinutes;
  }
  return times;
}
