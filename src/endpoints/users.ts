import type { HttpClient } from "../http";
import type { PaginationPage, RequestOptions } from "../types";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: string;
}

export interface CreateUserInput {
  email: string;
  name?: string;
}

export interface ListUsersQuery {
  cursor?: string;
  limit?: number;
}

export class UsersEndpoint {
  constructor(private readonly http: HttpClient) {}

  getById(userId: string, options?: RequestOptions): Promise<User> {
    return this.http.request<User>({
      method: "GET",
      path: `/users/${encodeURIComponent(userId)}`,
      options
    });
  }

  create(input: CreateUserInput, options?: RequestOptions): Promise<User> {
    return this.http.request<User, CreateUserInput>({
      method: "POST",
      path: "/users",
      body: input,
      options
    });
  }

  list(query: ListUsersQuery = {}, options?: RequestOptions): Promise<PaginationPage<User>> {
    return this.http.request<PaginationPage<User>>({
      method: "GET",
      path: "/users",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          cursor: query.cursor,
          limit: query.limit
        }
      }
    });
  }
}
