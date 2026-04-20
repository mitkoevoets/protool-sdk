export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryPrimitive = string | number | boolean;
export type QueryValue =
  | QueryPrimitive
  | null
  | undefined
  | QueryValue[]
  | { [key: string]: QueryValue };

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  idempotencyKey?: string;
  query?: Record<string, QueryValue>;
}

export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryOnStatuses?: number[];
}

export interface ApiKeyAuth {
  type: "apiKey";
  apiKey: string;
  headerName?: string;
}

export interface BearerAuth {
  type: "bearer";
  token: string;
}

export type AuthStrategy = ApiKeyAuth | BearerAuth;

export interface ApiClientConfig {
  baseUrl: string;
  auth?: AuthStrategy;
  timeoutMs?: number;
  retry?: RetryConfig;
  fetch?: typeof fetch;
  defaultHeaders?: Record<string, string>;
}

export interface ApiErrorPayload {
  message?: string;
  code?: string;
  details?: unknown;
}

export interface RangeFilter {
  [key: string]: number | undefined;
  min?: number;
  max?: number;
}

export interface CompanyFilters {
  ID?: string;
  search?: string;
  sic4Digits?: string;
  importExportCode?: string;
  legalStatus?: string;
  statusCode?: string;
  subsidiaryCode?: string;
  countryCode?: string;
  provinceName?: string;
  cityName?: string;
  streetName?: string;
  regionName?: string;
  countryName?: string;
  postalCode?: string;
  postalCodeInteger?: RangeFilter;
  employeesHere?: RangeFilter;
  employeesTotal?: RangeFilter;
  annualSales?: RangeFilter;
  foundingYears?: RangeFilter;
  phoneNumber?: string;
  email?: string;
  worldwideHeadquarterID?: string;
  nationalId?: string;
  hasEmail?: boolean;
  hasMarketability?: boolean;
  hasPhone?: boolean;
  hasFax?: boolean;
  hasContactPerson?: boolean;
  hasWebsite?: boolean;
  hasNationalID?: boolean;
  hasBusinessName?: boolean;
  hasStreetAddress?: boolean;
  hasPostalCode?: boolean;
  hasCEOName?: boolean;
}

export interface CompanySearchParams extends CompanyFilters {
  page?: number;
  pageSize?: number;
}

export interface CompanyExportParams extends CompanyFilters {
  page?: number;
  pageSize?: number;
  export?: boolean;
  useScroll?: boolean;
  scrollId?: string;
}

export type CompanyRecord = Record<string, unknown>;

export interface CompanySearchResponse {
  data: CompanyRecord[] | { records: CompanyRecord[]; totalCount?: number };
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalCount?: number;
}

export interface CompanyExportStandardResponse {
  data: {
    records: CompanyRecord[];
    totalCount: number;
  };
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CompanyExportScrollResponse {
  data: CompanyRecord[];
  scrollId: string;
  hasMoreRecords: boolean;
  pageSize: number;
  totalRecords: number | null;
}

export interface LookupParams {
  search: string;
  countries?: string;
  limit?: number;
}

export interface CityLookupItem {
  cityName: string;
  countryCode: string;
}

export interface ProvinceLookupItem {
  provinceName: string;
  countryCode: string;
}

export interface RegionLookupItem {
  regionName: string;
  countryCode: string;
}

export interface CountryLookupItem {
  countryName: string;
  countryCode: string;
}

export interface LookupResponse<TItem> {
  data: TItem[];
  total?: number;
  limit?: number;
}
