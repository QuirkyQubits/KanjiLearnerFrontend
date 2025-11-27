import { Link, useNavigate } from "react-router-dom";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import NavBar from "./NavBar";
import { entryTypeColors } from "../models/EntryTypeColors";
import { useForecast, useItemSpread, useLessons, useMistakes, useReviews } from "../hooks/useAppData";
import ItemSpreadView from "./ItemSpreadView";
import ReviewForecastView from "./ReviewForecastView";

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
          className="border rounded bg-fuchsia-200 mb-4 hover:bg-fuchsia-400 p-3 m-3 text-black"
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
          className="border rounded bg-sky-200 mb-4 hover:bg-sky-300 p-3 m-3 text-black"
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
    <div className="px-2 py-1">
      <h3 className="mb-2 font-semibold pb-3">Recent Mistakes</h3>
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


export default function Dashboard() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: lessons, isLoading: lessonsLoading } = useLessons();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  const { data: mistakes, isLoading: mistakesLoading } = useMistakes();
  const { data: forecast, isLoading: forecastLoading } = useForecast(timezone);
  const { data: itemSpread, isLoading: itemSpreadLoading } = useItemSpread();

  return (
    <div className="dashboard flex flex-col min-h-screen max-w-screen">
      <NavBar />

      <div className="site-content-container bg-background-light flex-1 px-10">
        <div className="lessons-reviews-recent-mistakes-itemspread bg-background-light">
          <div className="lessons-reviews bg-background-light">
            <div className="lessons bg-background-dark rounded-lg shadow p-4 m-2">
              {lessonsLoading ? (
                <div>Loading lessons…</div>
              ) : (
                <LessonView lessons={lessons ?? []} />
              )}
            </div>
            <div className="reviews bg-background-dark rounded-lg shadow p-4 m-2">
              {reviewsLoading ? (
                <div>Loading reviews…</div>
              ) : (
                <ReviewsView reviews={reviews ?? []} />
              )}
            </div>
          </div>
          <div className="recent-mistakes bg-background-dark rounded-lg shadow p-4 m-2 text-text">
            {mistakesLoading ? (
              <div>Loading mistakes…</div>
            ) : (
              <RecentMistakesView mistakes={mistakes ?? []} />
            )}
          </div>
          <div className="item-spread bg-background-dark rounded-lg shadow p-4 m-2 text-text">
            {itemSpreadLoading ? (
              <div>Loading item spread...</div>
            ) : (
              <ItemSpreadView
                itemSpread={
                  itemSpread ?? {
                    apprentice: { radicals: 0, kanji: 0, vocab: 0 },
                    guru: { radicals: 0, kanji: 0, vocab: 0 },
                    master: { radicals: 0, kanji: 0, vocab: 0 },
                    enlightened: { radicals: 0, kanji: 0, vocab: 0 },
                    burned: { radicals: 0, kanji: 0, vocab: 0 },
                  }
                }
              />
            )}
          </div>
        </div>
        <div className="review-forecast bg-background-dark rounded-lg shadow p-4 m-2 text-text">
          {forecastLoading ? (
            <div>Loading forecast…</div>
          ) : (
            <ReviewForecastView forecast={forecast ?? {}} title="Review Forecast" />
          )}
        </div>
      </div>
      <div className="site-footer-container bg-background min-h-6 max-h-12 text-[clamp(0.5rem,1vw,0.75rem)] text-text text-center p-4">
        ©KanjiLearner 2025
      </div>
    </div>
  );
}