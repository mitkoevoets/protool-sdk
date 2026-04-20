import { CompanyEndpoint } from "./endpoints/company";
import { LookupEndpoint } from "./endpoints/lookup";
import { HttpClient } from "./http";
import type { ApiClientConfig } from "./types";

export class ApiClient {
  public readonly company: CompanyEndpoint;
  public readonly lookup: LookupEndpoint;
  private readonly http: HttpClient;

  constructor(config: ApiClientConfig) {
    this.http = new HttpClient(config);
    this.company = new CompanyEndpoint(this.http);
    this.lookup = new LookupEndpoint(this.http);
  }
}
