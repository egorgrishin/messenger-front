import { FileModel, InputFile } from 'interfaces/file.ts';
import { Fancybox } from '@fancyapps/ui';
import { userSlideType } from '@fancyapps/ui/types/Carousel/types';

export function startFancybox(slides: userSlideType[], startIndex: number): void {
  Fancybox.show(slides, {
    startIndex: startIndex,
    on: {
      reveal: (fancybox: Fancybox) => {
        [
          '[data-panzoom-action]',
          '[data-fancybox-toggle-slideshow]',
          '[data-fancybox-toggle-fullscreen]',
          '[data-fancybox-toggle-thumbs]',
        ].forEach((data: string) => {
          fancybox.container?.querySelector(data)?.remove();
        });
      },
    },
  });
}

export class Types {
  static readonly IMAGE = 1;
  static readonly VIDEO = 2;
  static readonly DOC = 3;
  static readonly MAX_IN_MESSAGE = 10;

  public static isImage(inputFile: InputFile): boolean {
    return inputFile.model
      ? this.isImageByModel(inputFile.model)
      : inputFile.original.type.startsWith('image');
  };

  public static isImageByModel(file: FileModel): boolean {
    return file.type === Types.IMAGE;
  };

  public static isVideo(inputFile: InputFile): boolean {
    return inputFile.model
      ? this.isVideoByModel(inputFile.model)
      : inputFile.original.type.startsWith('video');
  };

  public static isVideoByModel(file: FileModel): boolean {
    return file.type === Types.VIDEO;
  };

  public static isDoc(inputFile: InputFile): boolean {
    return !this.isImage(inputFile) && !this.isVideo(inputFile);
  };

  public static isDocByModel(file: FileModel): boolean {
    return !this.isImageByModel(file) && !this.isVideoByModel(file);
  };

  public static isMedia(file: InputFile): boolean {
    return this.isImage(file) || this.isVideo(file);
  };

  public static isMediaByModel(file: FileModel): boolean {
    return this.isImageByModel(file) || this.isVideoByModel(file);
  };

  public static getMediaFiles(files: FileModel[]): FileModel[] {
    return files.filter(file => this.isMediaByModel(file));
  }

  public static getDocsFiles(files: FileModel[]): FileModel[] {
    return files.filter(file => this.isDocByModel(file));
  }
}