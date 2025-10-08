import { Link, useNavigate } from "react-router-dom";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import type { ReviewForecast } from "../models/ReviewForecast";
import NavBar from "./NavBar";
import { entryTypeColors } from "../models/EntryTypeColors";
import { useForecast, useLessons, useMistakes, useReviews } from "../hooks/useAppData";

interface LessonViewProps {
  lessons: UserDictionaryEntry[];
}

function LessonView(props: LessonViewProps) {
  const navigate = useNavigate();
  const lessonCount = props.lessons.length;

  return (
    <div>
      {lessonCount === 0 ? (
        <div className="p-2 m-2">No lessons for now! 🎉</div>
      ) : (
        <button
          onClick={() => navigate("/lessons")}
          className="rounded-border background-color-light mb-4 button-hover-color p-3 m-3"
        >
          {`Lessons (${lessonCount}): Start lessons`}
        </button>
      )}
    </div>
  );
}

interface ReviewsViewProps {
  reviews: UserDictionaryEntry[];
}


function ReviewsView(props: ReviewsViewProps) {
  const navigate = useNavigate();
  const reviewCount = props.reviews.length;

  return (
    <div>
      {reviewCount === 0 ? (
        <div className="p-2 m-2">No reviews for now! 🎉</div>
      ) : (
        <button
          onClick={() => navigate("/reviews")}
          className="rounded-border background-color-light mb-4 button-hover-color p-3 m-3"
        >
          {`Reviews (${reviewCount}): Start reviews`}
        </button>
      )}
    </div>
  );
}

interface RecentMistakesViewProps {
  mistakes: UserDictionaryEntry[];
}


function RecentMistakesView({ mistakes }: RecentMistakesViewProps) {
  const uniqueMistakes = Array.from(new Map(
    mistakes.map(m => [m.entry.id, m])
  ).values());

  return (
    <div className="p-5">
      <h3 className="mb-2 font-semibold">Recent Mistakes</h3>
      {uniqueMistakes.length === 0 ? (
        <div>No recent mistakes 🎉</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {uniqueMistakes.map((ude) => {
            const type = ude.entry.entry_type; // RADICAL / KANJI / VOCAB
            const color = entryTypeColors[type];

            return (
              <Link
                key={ude.entry.id}
                to={`/dictionary/${ude.entry.id}`}
                title={ude.entry.meaning} // tooltip with full meaning
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 py-2 rounded shadow text-white font-bold hover:opacity-80 transition ${color}`}
              >
                {ude.entry.literal}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


interface ReviewForecastViewProps {
  forecast: ReviewForecast;
}


function ReviewForecastView({ forecast }: ReviewForecastViewProps) {
  const isEmpty = Object.keys(forecast).length === 0;

  // Build local "YYYY-MM-DD" for today (no UTC round-trip)
  const getLocalYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const todayStr = getLocalYmd(new Date());

  // Force English weekday names
  const weekdayEn = new Intl.DateTimeFormat("en-US", { weekday: "long" });

  // Parse "YYYY-MM-DD" into a *local* Date (avoid UTC parsing)
  const parseYmdLocal = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, m - 1, d); // local time
  };

  return (
    <div className="p-5">
      <h3>Review Forecast</h3>
      {isEmpty ? (
        <div>No reviews due in the next 7 days 🎉</div>
      ) : (
        <div>
          {Object.entries(forecast)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, hours]) => {
              const entries = Object.entries(hours);
              const dailyTotal = entries.reduce((sum, [, data]) => sum + data.count, 0);
              const nonZeroHours = entries.filter(([, data]) => data.count > 0);

              // Label: Today for today; otherwise English weekday
              const label =
                date === todayStr ? "Today" : weekdayEn.format(parseYmdLocal(date));

              return (
                <details key={date} className="mb-4" open={date === todayStr}>
                  <summary className="cursor-pointer font-semibold">
                    {label} ({dailyTotal} review{dailyTotal !== 1 ? "s" : ""})
                  </summary>

                  {/* Show hourly breakdown only when there are reviews; empty section otherwise */}
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


export default function Dashboard() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const { data: mistakes, isLoading: mistakesLoading } = useMistakes();
  const { data: forecast, isLoading: forecastLoading } = useForecast(timezone);

  return (
    <div className="dashboard flex flex-col min-h-screen max-w-screen">
      <NavBar />

      <div className="site-content-container bg-amber-200 flex-1">
        <div className="lessons-reviews-recent-mistakes bg-emerald-400">
          <div className="lessons-reviews bg-teal-400">
            <div className="lessons bg-blue-200">
              {lessonsLoading ? (
                <div>Loading lessons…</div>
              ) : (
                <LessonView lessons={lessons ?? []} />
              )}
            </div>
            <div className="reviews bg-emerald-500">
              {reviewsLoading ? (
                <div>Loading reviews…</div>
              ) : (
                <ReviewsView reviews={reviews ?? []} />
              )}
            </div>
          </div>
          <div className="recent-mistakes">
            {mistakesLoading ? (
              <div>Loading mistakes…</div>
            ) : (
              <RecentMistakesView mistakes={mistakes ?? []} />
            )}
          </div>
        </div>
        <div className="review-forecast bg-teal-300">
          {forecastLoading ? (
            <div>Loading forecast…</div>
          ) : (
            <ReviewForecastView forecast={forecast ?? {}} />
          )}
        </div>
      </div>
      <div className="site-footer-container bg-emerald-200 min-h-6 max-h-12 text-[clamp(0.5rem,1vw,0.75rem)]">
        Placeholder dashboard footer
      </div>
    </div>
  );
}