import type { HttpClient } from "../http";
import type {
  CityLookupItem,
  CountryLookupItem,
  LookupParams,
  LookupResponse,
  ProvinceLookupItem,
  RegionLookupItem,
  RequestOptions
} from "../types";

export class LookupEndpoint {
  constructor(private readonly http: HttpClient) {}

  cities(params: LookupParams, options?: RequestOptions): Promise<LookupResponse<CityLookupItem>> {
    return this.http.request<LookupResponse<CityLookupItem>>({
      method: "GET",
      path: "/api/cities",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }

  provinces(params: LookupParams, options?: RequestOptions): Promise<LookupResponse<ProvinceLookupItem>> {
    return this.http.request<LookupResponse<ProvinceLookupItem>>({
      method: "GET",
      path: "/api/provinces",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }

  regions(params: LookupParams, options?: RequestOptions): Promise<LookupResponse<RegionLookupItem>> {
    return this.http.request<LookupResponse<RegionLookupItem>>({
      method: "GET",
      path: "/api/regions",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }

  countries(params: LookupParams, options?: RequestOptions): Promise<LookupResponse<CountryLookupItem>> {
    return this.http.request<LookupResponse<CountryLookupItem>>({
      method: "GET",
      path: "/api/countries",
      options: {
        ...options,
        query: {
          ...(options?.query ?? {}),
          ...params
        }
      }
    });
  }
}
