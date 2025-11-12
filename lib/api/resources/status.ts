import type { QueryKey } from "@tanstack/react-query";
import { apiClient } from "../client";

export type ServiceStatus = {
  status: string;
};

export const serviceStatusQueryKey: QueryKey = ["service-status"];

export async function getServiceStatus() {
  const { data } = await apiClient.get<ServiceStatus>("/status");
  return data;
}