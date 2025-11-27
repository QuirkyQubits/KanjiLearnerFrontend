import type { ReviewForecast } from "../models/ReviewForecast";

interface ReviewForecastViewProps {
  forecast: ReviewForecast;
  title?: string; // allows Dashboard to say “Review Forecast” and WK page to say “WaniKani Forecast”
}

export default function ReviewForecastView({ forecast, title }: ReviewForecastViewProps) {
  const isEmpty = Object.keys(forecast).length === 0;

  // Compute local YYYY-MM-DD
  const getLocalYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = getLocalYmd(new Date());

  const weekdayEn = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  const parseYmdLocal = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  return (
    <div className="p-5">
      <h3 className="mb-6">{title ?? "Review Forecast"}</h3>

      {isEmpty ? (
        <div>No reviews due in this period 🎉</div>
      ) : (
        <div>
          {Object.entries(forecast)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, hours]) => {
              const entries = Object.entries(hours);
              const dailyTotal = entries.reduce((sum, [, data]) => sum + data.count, 0);
              const nonZeroHours = entries.filter(([, data]) => data.count > 0);

              const label =
                date === todayStr ? "Today" : weekdayEn.format(parseYmdLocal(date));

              return (
                <details key={date} className="mb-4" open={date === todayStr}>
                  <summary className="cursor-pointer font-semibold">
                    {label} ({dailyTotal} review{dailyTotal !== 1 ? "s" : ""})
                  </summary>

                  {nonZeroHours.length > 0 && (
                    <ul className="ml-6 mt-2 list-disc">
                      {nonZeroHours
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([hour, data]) => (
                          <li key={hour}>
                            {hour}:00 → +{data.count} (total {data.cumulative})
                          </li>
                        ))}
                    </ul>
                  )}
                </details>
              );
            })}
        </div>
      )}
    </div>
  );
}
