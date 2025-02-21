import { AxiosResponse } from "axios";

export interface FileModel {
  uuid: string,
  type: number,
  url: string,
  videoPreviewUrl: string | null,
  filename: string,
}

export interface InputFile {
  uuid: string,
  model: FileModel | null,
  original: File,
}

export type AxiosCreateFile = AxiosResponse<{ data: FileModel }>;
