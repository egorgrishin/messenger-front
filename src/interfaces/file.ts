import { AxiosResponse } from "axios";

export interface File {
  uuid: string,
  type: number,
}

export type AxiosCreateFile = AxiosResponse<{ data: File }>;
