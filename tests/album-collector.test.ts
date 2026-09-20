import { describe, it, expect, vi } from "vitest";
import { AlbumCollector } from "../src/bot/album-collector";

describe("Album Collector", () => {
  it("should buffer multiple photos from the same media_group_id and dispatch together", async () => {
    const collector = new AlbumCollector(100);
    const callback = vi.fn();

    const mediaGroupId = "group-12345";
    const chatId = 100;
    const userId = 200;

    collector.addPhoto({
      mediaGroupId,
      chatId,
      userId,
      photo: { fileId: "file-1", messageId: 101, caption: "реши 5-10" },
      onComplete: callback,
    });

    collector.addPhoto({
      mediaGroupId,
      chatId,
      userId,
      photo: { fileId: "file-2", messageId: 102 },
      onComplete: callback,
    });

    collector.addPhoto({
      mediaGroupId,
      chatId,
      userId,
      photo: { fileId: "file-3", messageId: 103 },
      onComplete: callback,
    });

    expect(callback).not.toHaveBeenCalled();

    // Wait for debounce timeout
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(callback).toHaveBeenCalledTimes(1);
    const dispatchedAlbum = callback.mock.calls[0][0];

    expect(dispatchedAlbum.mediaGroupId).toBe(mediaGroupId);
    expect(dispatchedAlbum.photos.length).toBe(3);
    expect(dispatchedAlbum.firstCaption).toBe("реши 5-10");
    expect(dispatchedAlbum.photos.map((p: any) => p.fileId)).toEqual(["file-1", "file-2", "file-3"]);
  });
});
