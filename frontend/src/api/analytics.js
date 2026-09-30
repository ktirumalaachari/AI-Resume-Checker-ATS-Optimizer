import { apiClient } from "./client";
// import { mockInsights, mockAllVersions, mockHistory } from "@/mock/analytics";
// import { mockDelay } from "@/mock/_helpers";

export const analyticsApi = {
  insights: () => apiClient.get("/insights").then((r) => r.data),
  // insights: async () => {
  //   await mockDelay();
  //   return mockInsights;
  // },

  versions: () => apiClient.get("/versions").then((r) => r.data),
  // versions: async () => {
  //   await mockDelay();
  //   return mockAllVersions;
  // },

  history: () => apiClient.get("/history").then((r) => r.data),
  // history: async () => {
  //   await mockDelay();
  //   return mockHistory;
  // },
};
