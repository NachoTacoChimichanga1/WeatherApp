export interface Weather {
  weather: { description: string; icon: string }[];
  main: { temp: number };
}

export interface ForecastEntryRaw {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

export interface DailyForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  description: string;
  icon: string;
}