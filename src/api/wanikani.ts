import { api } from "../lib/axios";

export async function fetchWaniKaniForecast(days: number, tz: string) {
  const res = await api.get("/wanikani/forecast/", {
    params: { days, tz },
  });
  return res.data;
}