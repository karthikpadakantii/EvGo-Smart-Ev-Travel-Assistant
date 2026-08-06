import axiosClient from './axiosClient';
import type { JourneyRequest, JourneyResponse } from '@/types/journey';

// Maps to com.evgo.journeyservice.controller.JourneyController
// NOTE: there is no list/history endpoint here — see utils/localHistory.ts
// and HistoryPage for the client-side workaround.

export const planJourney = (payload: JourneyRequest) =>
  axiosClient.post<JourneyResponse>('/journeys/plan', payload).then((r) => r.data);

export const getJourneyById = (journeyId: number) =>
  axiosClient.get<JourneyResponse>(`/journeys/${journeyId}`).then((r) => r.data);
