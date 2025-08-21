export interface ReviewForecastHour {
  count: number;
  cumulative: number;
}

export type ReviewForecast = Record<string, ReviewForecastHour>;