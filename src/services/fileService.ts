import Notify from "composables/notify";
import { apiCreateFile } from "api/file";
import { AxiosCreateFile, FileModel } from "interfaces/file";

async function createFile(uuid: string, file: File): Promise<FileModel> {
  const userId = +(localStorage.getItem('userId') || 0);
  if (!userId) {
    Notify.send('Не получилось сохранить файл');
    return Promise.reject(uuid);
  }

  const response: AxiosCreateFile = await apiCreateFile(uuid, userId, file);
  const isSuccess = response.status === 201;

  if (isSuccess) {
    return Promise.resolve(response.data.data);
  }

  Notify.send('Не получилось сохранить файл');
  return Promise.reject(uuid);
}

export {
  createFile,
};
