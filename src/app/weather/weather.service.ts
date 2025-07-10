import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Weather, ForecastEntryRaw } from './models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private apiKey = '8848756ae5d98bd84ed59a63d38945bd';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<Weather> {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=bg`;
    return this.http.get<Weather>(url);
  }

  getForecast(city: string): Observable<ForecastEntryRaw[]> {
    const url = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=bg`;
    return this.http.get<{ list: ForecastEntryRaw[] }>(url).pipe(map(response => response.list));
  }
}
