export interface CollectedAlbumPhoto {
  fileId: string;
  fileUniqueId?: string;
  caption?: string;
  messageId: number;
}

export interface CollectedAlbum {
  mediaGroupId: string;
  chatId: number;
  threadId?: number;
  userId: number;
  photos: CollectedAlbumPhoto[];
  firstCaption?: string;
}

type AlbumCallback = (album: CollectedAlbum) => Promise<void> | void;

export class AlbumCollector {
  private albums = new Map<
    string,
    {
      album: CollectedAlbum;
      timer: NodeJS.Timeout;
      callbacks: AlbumCallback[];
    }
  >();

  private debounceMs: number;

  constructor(debounceMs = 750) {
    this.debounceMs = debounceMs;
  }

  public addPhoto(params: {
    mediaGroupId: string;
    chatId: number;
    threadId?: number;
    userId: number;
    photo: CollectedAlbumPhoto;
    onComplete: AlbumCallback;
  }) {
    const { mediaGroupId, chatId, threadId, userId, photo, onComplete } = params;

    const existing = this.albums.get(mediaGroupId);

    if (existing) {
      clearTimeout(existing.timer);
      existing.album.photos.push(photo);
      if (photo.caption && !existing.album.firstCaption) {
        existing.album.firstCaption = photo.caption;
      }
      existing.callbacks.push(onComplete);

      existing.timer = setTimeout(() => {
        this.dispatch(mediaGroupId);
      }, this.debounceMs);
    } else {
      const album: CollectedAlbum = {
        mediaGroupId,
        chatId,
        threadId,
        userId,
        photos: [photo],
        firstCaption: photo.caption,
      };

      const timer = setTimeout(() => {
        this.dispatch(mediaGroupId);
      }, this.debounceMs);

      this.albums.set(mediaGroupId, {
        album,
        timer,
        callbacks: [onComplete],
      });
    }
  }

  private async dispatch(mediaGroupId: string) {
    const entry = this.albums.get(mediaGroupId);
    if (!entry) return;

    this.albums.delete(mediaGroupId);

    const primaryCallback = entry.callbacks[0];
    if (primaryCallback) {
      try {
        await primaryCallback(entry.album);
      } catch (err) {
        console.error(`Error processing album ${mediaGroupId}:`, err);
      }
    }
  }
}

export const albumCollector = new AlbumCollector(750);
