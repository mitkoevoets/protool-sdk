import type { HttpClient } from "../http";
import type {
  CompanyExportParams,
  CompanyExportScrollResponse,
  CompanyExportStandardResponse,
  CompanySearchParams,
  CompanySearchResponse,
  RequestOptions
} from "../types";

export class CompanyEndpoint {
  constructor(private readonly http: HttpClient) {}

  search(params: CompanySearchParams = {}, options?: RequestOptions): Promise<CompanySearchResponse> {
    return this.http.request<CompanySearchResponse>({
      method: "GET",
      path: "/api/company/search",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }

  export(params: CompanyExportParams = {}, options?: RequestOptions): Promise<CompanyExportStandardResponse> {
    return this.http.request<CompanyExportStandardResponse>({
      method: "GET",
      path: "/api/company/export",
      options: {
        ...options,
        query: {
          export: true,
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }

  exportWithScroll(
    params: Omit<CompanyExportParams, "useScroll"> = {},
    options?: RequestOptions
  ): Promise<CompanyExportScrollResponse> {
    return this.http.request<CompanyExportScrollResponse>({
      method: "GET",
      path: "/api/company/export",
      options: {
        ...options,
        query: {
          export: true,
          useScroll: true,
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }
}
