import { request } from "@/axios.config";
import { AxiosCreateFile } from "interfaces/file";

export async function apiCreateFile(uuid: string, userId: number, file: File): Promise<AxiosCreateFile> {
  const formData = new FormData();
  formData.append('uuid', uuid);
  formData.append('userId', String(userId));
  formData.append('file', file);

  return await request
    .post('/api/v1/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response: AxiosCreateFile) => response)
    .catch((error: any) => error.response);
}
