// Requirement 8: Convert 3-hour forecast data into daily averages 
export function processForecast(data) {
  const dailyTemps = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0]; // Gets YYYY-MM-DD 
    if (!dailyTemps[date]) dailyTemps[date] = [];
    dailyTemps[date].push(item.main.temp);
  });

  return Object.keys(dailyTemps).map(date => {
    const temps = dailyTemps[date];
    const avgTemp = temps.reduce((a, b) => a + b) / temps.length; // Arithmetic Mean 
    return { date, temp: Math.round(avgTemp) };
  });
}

// Requirement 6: Logic for Weather Warnings and Recommendations 
export function getInsight(processedData, currentTemp) {
  if (currentTemp > 35) return "Heat warning: Temperature is above 35°C!";
  if (currentTemp < 5) return "Cold warning: Temperature is below 5°C!"; 
  
  // Suggest the day with the most pleasant temperature (closest to 20°C)
  const bestDay = processedData.reduce((prev, curr) => 
    Math.abs(curr.temp - 20) < Math.abs(prev.temp - 20) ? curr : prev
  );
  return `Best day to go out: ${bestDay.date} (${bestDay.temp}°C)`; 
}