import { useEffect, useState } from "react";
import { api } from "./lib/axios";
import { useNavigate } from "react-router-dom";
import type { UserDictionaryEntry } from "./models/UserDictionaryEntry";
import type { ReviewForecast } from "./models/ReviewForecast";
import NavBar from "./NavBar";


interface LessonViewProps {
  lessons: UserDictionaryEntry[];
}


function LessonView(props: LessonViewProps) {
  const navigate = useNavigate();

  let lessonCount = props.lessons.length;

  return (
    <div>
      <button 
        onClick={() => navigate("/lessons")}
        className="rounded-border background-color-light mb-4 button-hover-color p-3 m-3"
        >
          {`Lessons (${lessonCount}): Start lessons`}
      </button>
    </div>
  );
}

interface ReviewsViewProps {
  reviews: UserDictionaryEntry[];
}


function ReviewsView(props: ReviewsViewProps) {
  const navigate = useNavigate();

  let reviewCount = props.reviews.length;

  return (
    <div>
      <button 
        onClick={() => navigate("/reviews")}
        className="rounded-border background-color-light mb-4 button-hover-color p-3 m-3"
        >
          {`Reviews (${reviewCount}): Start reviews`}
      </button>
    </div>
  );
}

interface RecentMistakesViewProps {
  mistakes: UserDictionaryEntry[];
}

function RecentMistakesView({ mistakes }: RecentMistakesViewProps) {
  return (
    <div>
      <h3 className="">Recent Mistakes</h3>
      {mistakes.length === 0 ? (
        <div>No recent mistakes 🎉</div>
      ) : (
        <ul>
          {mistakes.map((ude) => (
            <li key={ude.entry.id}>{ude.entry.literal}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ReviewForecastViewProps {
  forecast: ReviewForecast;
}


function ReviewForecastView({ forecast }: ReviewForecastViewProps) {
  const isEmpty = Object.keys(forecast).length === 0;

  return (
    <div>
      <h3>Review Forecast</h3>
      {isEmpty ? (
        <div>No reviews due in the next 24 hours!</div>
      ) : (
        <ul>
          {Object.entries(forecast)
            .sort(([a], [b]) => Number(a) - Number(b)) // keep hours in order
            .map(([hour, data]) => (
              <li key={hour}>
                {hour}:00 → +{data.count} (total {data.cumulative})
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}



// for testing whether API calls work.
function Section({ title, data }: { title: string; data: any }) {
  return (
    <div>
      <h2>{title}</h2>
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

interface DashboardProps {
  lessons: UserDictionaryEntry[];
  reviews: UserDictionaryEntry[];
  mistakes: UserDictionaryEntry[];
  forecast: any;
}

export default function Dashboard(props: DashboardProps) {
  return (
    <div className="dashboard flex flex-col min-h-screen max-w-screen">
      <NavBar />

      <div className="site-content-container bg-amber-200 flex-1">
        <div className="lessons-reviews-recent-mistakes bg-emerald-400">
          <div className="lessons-reviews bg-teal-400">
            <div className="lessons bg-blue-200">
              <LessonView lessons={props.lessons} />
            </div>
            <div className="reviews bg-emerald-500">
              <ReviewsView reviews={props.reviews}/>
            </div>
          </div>
          <div className="recent-mistakes">
            <RecentMistakesView mistakes={props.mistakes}/>
          </div>
        </div>
        <div className="review-forecast bg-teal-300">
          <ReviewForecastView forecast={props.forecast}/>
        </div>
      </div>
      <div className="site-footer-container bg-emerald-200 min-h-6 max-h-12 text-[clamp(0.5rem,1vw,0.75rem)]">
        Placeholder dashboard footer
      </div>
    </div>
  );
}