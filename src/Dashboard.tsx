import { useEffect, useState } from "react";
import { api } from "./lib/axios";
import { useNavigate } from "react-router-dom";
import type { DictionaryEntry } from "./models/DictionaryEntry";
import type { ReviewForecast } from "./models/ReviewForecast";


interface LessonViewProps {
  lessons: DictionaryEntry[];
}


function LessonView(props: LessonViewProps) {
  const navigate = useNavigate();

  let lessonCount = props.lessons.length;

  return (
    <div>
      <button onClick={() => navigate("/lessons")}>{`Lessons (${lessonCount}): Start lessons`}</button>
    </div>
  );
}

interface ReviewsViewProps {
  reviews: DictionaryEntry[];
}


function ReviewsView(props: ReviewsViewProps) {
  const navigate = useNavigate();

  let reviewCount = props.reviews.length;

  return (
    <div>
      <button onClick={() => navigate("/reviews")}>{`Reviews (${reviewCount}): Start reviews`}</button>
    </div>
  );
}

interface RecentMistakesViewProps {
  mistakes: DictionaryEntry[];
}

function RecentMistakesView({ mistakes }: RecentMistakesViewProps) {
  return (
    <div>
      <h3>Recent Mistakes</h3>
      {mistakes.length === 0 ? (
        <div>No recent mistakes 🎉</div>
      ) : (
        <ul>
          {mistakes.map((m) => (
            <li key={m.id}>{m.literal}</li>
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
  lessons: DictionaryEntry[];
  reviews: DictionaryEntry[];
  mistakes: DictionaryEntry[];
  forecast: any;
}

export default function Dashboard(props: DashboardProps) {
  return (
    <div>
      <LessonView lessons={props.lessons} />
      <ReviewsView reviews={props.reviews}/>
      <RecentMistakesView mistakes={props.mistakes}/>
      <ReviewForecastView forecast={props.forecast}/>
    </div>
  );
}