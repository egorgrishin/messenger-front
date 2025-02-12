import Notify from "composables/notify";
import { apiCreateFile } from "api/file";
import { AxiosCreateFile, File as OFile } from "interfaces/file";

async function createFile(file: File): Promise<OFile | null> {
  const userId = +(localStorage.getItem('userId') ?? 0);
  if (!userId) {
    Notify.send('[Incorrect userId]');
    return null;
  }

  const response: AxiosCreateFile = await apiCreateFile(userId, file);
  const isSuccess = response.status === 201;

  if (isSuccess) {
    return response.data.data;
  }

  Notify.send('Ошибка сохранения');
  return null;
}

export {
  createFile,
};
