import Notify from "composables/notify";
import { apiCreateFile } from "api/file";
import { AxiosCreateFile, File as OFile } from "interfaces/file";

async function createFile(file: File): Promise<OFile> {
  const userId = +(localStorage.getItem('userId') ?? 0);
  if (!userId) {
    Notify.send('[Incorrect userId]');
    return Promise.reject(null);
  }

  const response: AxiosCreateFile = await apiCreateFile(userId, file);
  const isSuccess = response.status === 201;

  if (isSuccess) {
    return Promise.resolve(response.data.data);
  }

  Notify.send('Ошибка сохранения');
  return Promise.reject(null);
}

export {
  createFile,
};
