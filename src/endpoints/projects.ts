import type { HttpClient } from "../http";
import type { RequestOptions } from "../types";

export interface Project {
  id: string;
  name: string;
  status: "active" | "archived";
  createdAt?: string;
}

export interface CreateProjectInput {
  name: string;
}

export class ProjectsEndpoint {
  constructor(private readonly http: HttpClient) {}

  getById(projectId: string, options?: RequestOptions): Promise<Project> {
    return this.http.request<Project>({
      method: "GET",
      path: `/projects/${encodeURIComponent(projectId)}`,
      options
    });
  }

  create(input: CreateProjectInput, options?: RequestOptions): Promise<Project> {
    return this.http.request<Project, CreateProjectInput>({
      method: "POST",
      path: "/projects",
      body: input,
      options
    });
  }

  archive(projectId: string, options?: RequestOptions): Promise<Project> {
    return this.http.request<Project>({
      method: "DELETE",
      path: `/projects/${encodeURIComponent(projectId)}`,
      options: {
        ...options,
        idempotencyKey: options?.idempotencyKey ?? `archive-${projectId}`
      }
    });
  }
}
