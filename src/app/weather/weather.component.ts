import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  weatherData: any;
  forecastData: any;
  dailyForecast: any[] = [];
  hourlyForecast: any[] = [];
  city: string = 'Sofia';
  apiKey: string = '8848756ae5d98bd84ed59a63d38945bd';

  constructor(private http: HttpClient) {}

  getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
    this.http.get(url).subscribe(data => {
      this.weatherData = data;
      this.getForecast();
    }, err => {
      alert('Грешка при търсене на текущата прогноза.');
    });
  }

  getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&units=metric&appid=${this.apiKey}`;
    this.http.get(url).subscribe(data => {
      this.forecastData = data;
      this.extractDailyForecast();
      this.extractHourlyForecast();
    }, err => {
      alert('Грешка при зареждане на прогнозата.');
    });
  }

  extractDailyForecast() {
    const dailyMap: { [date: string]: any[] } = {};

    this.forecastData.list.forEach((entry: any) => {
      const date = entry.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = [];
      }
      dailyMap[date].push(entry);
    });

    this.dailyForecast = Object.keys(dailyMap).slice(1, 6).map(date => {
      const entries = dailyMap[date];
      const avgTemp = entries.reduce((sum, val) => sum + val.main.temp, 0) / entries.length;
      return {
        date,
        temp: avgTemp.toFixed(1),
        description: entries[0].weather[0].description,
        icon: entries[0].weather[0].icon
      };
    });
  }

  extractHourlyForecast() {
    this.hourlyForecast = this.forecastData.list.slice(0, 6).map((entry: any) => {
      return {
        time: entry.dt_txt.split(' ')[1].slice(0, 5),
        temp: entry.main.temp.toFixed(1),
        description: entry.weather[0].description,
        icon: entry.weather[0].icon
      };
    });
  }
}