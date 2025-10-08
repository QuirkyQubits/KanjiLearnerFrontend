import { useQuery } from "@tanstack/react-query";
import { UserDictionaryEntry } from "../models/UserDictionaryEntry";
import { api } from "../lib/axios";

export function useLessons() {
  return useQuery<UserDictionaryEntry[]>({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await api.get("/lessons");
      return res.data.map((d: any) => new UserDictionaryEntry(d));
    },
  });
}

export function useReviews() {
  return useQuery<UserDictionaryEntry[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await api.get("/reviews");
      return res.data.map((d: any) => new UserDictionaryEntry(d));
    },
  });
}

export function useMistakes() {
  return useQuery<UserDictionaryEntry[]>({
    queryKey: ["mistakes"],
    queryFn: async () => {
      const res = await api.get("/mistakes");
      return res.data.map((d: any) => new UserDictionaryEntry(d));
    },
  });
}

export function useForecast(timezone: string) {
  return useQuery({
    queryKey: ["review-forecast", timezone],
    queryFn: async () => {
      const res = await api.get("/review_forecast", { params: { tz: timezone } });
      return res.data;
    },
  });
}