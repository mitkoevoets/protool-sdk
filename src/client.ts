import { ProjectsEndpoint } from "./endpoints/projects";
import { UsersEndpoint } from "./endpoints/users";
import { HttpClient } from "./http";
import type { ApiClientConfig } from "./types";

export class ApiClient {
  public readonly users: UsersEndpoint;
  public readonly projects: ProjectsEndpoint;
  private readonly http: HttpClient;

  constructor(config: ApiClientConfig) {
    this.http = new HttpClient(config);
    this.users = new UsersEndpoint(this.http);
    this.projects = new ProjectsEndpoint(this.http);
  }
}
