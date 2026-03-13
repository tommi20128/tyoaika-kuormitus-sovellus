// utils/timeUtils.ts

//Muutetaan minuutit tunneiksi ja minuuteiksi
export const minutesToHoursMinutes = (minutes: number) => {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
};

// Laskee tuntiero tavoitetuntien ja toteutuneiden tuntien välillä, ja muuntaa sen tunneiksi ja minuuteiksi.
export const formatHourDiff = (diffInHours: number) => {
  const totalMinutes = Math.round(diffInHours * 60);
  const absMinutes = Math.abs(totalMinutes);

  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  return {
    isPositive: diffInHours >= 0,
    hours,
    minutes,
  };
};