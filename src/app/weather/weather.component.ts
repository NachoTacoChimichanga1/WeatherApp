import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather.service';
import { Weather, ForecastEntryRaw, DailyForecast, HourlyForecast } from './models/weather.model';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  public city: string = 'Sofia';
  public weatherData: Weather | null = null;
  public forecastData: ForecastEntryRaw[] = [];
  public dailyForecast: DailyForecast[] = [];
  public hourlyForecast: HourlyForecast[] = [];
  public today: Date = new Date();

  constructor(private weatherService: WeatherService) {}

  public getWeather(): void {
    this.weatherService.getCurrentWeather(this.city).subscribe({
      next: (data: Weather) => {
        this.weatherData = data;
        this.today = new Date();
        this.loadForecasts();
      },
      error: () => alert('Грешка при търсене на текущата прогноза.')
    });
  }

  private loadForecasts(): void {
    this.weatherService.getForecast(this.city).subscribe({
      next: (data: ForecastEntryRaw[]) => {
        this.forecastData = data;
        this.dailyForecast = this.extractDailyMinMaxForecast(data);
        this.hourlyForecast = this.extractHourlyForecast(data);
      },
      error: () => alert('Грешка при зареждане на прогноза.')
    });
  }

  private extractDailyMinMaxForecast(data: ForecastEntryRaw[]): DailyForecast[] {
    const dailyMap = new Map<string, { minTemp: number; maxTemp: number; description: string; icon: string }>();

    data.forEach(entry => {
      const date = entry.dt_txt.split(' ')[0];
      const temp = entry.main.temp;
      const desc = entry.weather[0].description;
      const icon = entry.weather[0].icon;

      if (!dailyMap.has(date)) {
        dailyMap.set(date, { minTemp: temp, maxTemp: temp, description: desc, icon });
      } else {
        const dayData = dailyMap.get(date)!;
        if (temp < dayData.minTemp) dayData.minTemp = temp;
        if (temp > dayData.maxTemp) {
          dayData.maxTemp = temp;
          dayData.description = desc;
          dayData.icon = icon;
        }
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];

    return Array.from(dailyMap.entries())
      .filter(([date]) => date > todayStr)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 5)
      .map(([date, data]) => ({
        date,
        minTemp: data.minTemp,
        maxTemp: data.maxTemp,
        description: data.description,
        icon: data.icon
      }));
  }

  private extractHourlyForecast(data: ForecastEntryRaw[]): HourlyForecast[] {
    return data.slice(0, 6).map(entry => ({
      time: entry.dt_txt.split(' ')[1].substring(0, 5),
      temp: entry.main.temp,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon
    }));
  }
}
