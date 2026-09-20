import { prisma } from "../lib/prisma";

export interface ResolvedContext {
  grade: number;
  lastPhotoFileIds: string[];
  previousConversation?: {
    id: string;
    subject?: string;
    lastTaskNumbers?: string;
    lastSteps?: string;
    lastAnswer?: string;
  };
  topicConfig?: {
    aiMode: string;
    humanFirst: boolean;
    humanFirstDelay: number;
  };
}

export class ContextManager {
  /**
   * Saves incoming message and its media (if any) to DB
   */
  async recordMessage(params: {
    chatId: number;
    threadId?: number;
    userId: number;
    telegramMessageId: number;
    text?: string;
    replyToId?: number;
    mediaGroupId?: string;
    isBot?: boolean;
    mediaFiles?: Array<{ fileId: string; fileUniqueId?: string; mimeType?: string }>;
  }) {
    try {
      // Ensure user exists
      const user = await prisma.user.upsert({
        where: { telegramId: BigInt(params.userId) },
        update: {},
        create: {
          telegramId: BigInt(params.userId),
          role: "USER",
        },
      });

      // Ensure chat exists
      const chat = await prisma.telegramChat.upsert({
        where: { telegramChatId: BigInt(params.chatId) },
        update: {},
        create: {
          telegramChatId: BigInt(params.chatId),
          title: "Telegram Chat",
          type: "supergroup",
          isForum: true,
        },
      });

      // Create message
      const msg = await prisma.message.create({
        data: {
          chatId: chat.id,
          threadId: params.threadId || null,
          userId: user.id,
          telegramMessageId: params.telegramMessageId,
          text: params.text || null,
          replyToId: params.replyToId || null,
          mediaGroupId: params.mediaGroupId || null,
          hasMedia: (params.mediaFiles && params.mediaFiles.length > 0) || false,
          isBot: params.isBot || false,
        },
      });

      // Create media records if any
      if (params.mediaFiles && params.mediaFiles.length > 0) {
        for (const file of params.mediaFiles) {
          await prisma.media.create({
            data: {
              messageId: msg.id,
              fileId: file.fileId,
              fileUniqueId: file.fileUniqueId,
              mimeType: file.mimeType || "image/jpeg",
            },
          });
        }
      }

      return msg;
    } catch (err) {
      console.error("Failed to record message in context manager:", err);
      return null;
    }
  }

  /**
   * Retrieves active context for a user in a specific chat & thread
   */
  async resolveContext(params: {
    chatId: number;
    threadId?: number;
    userId: number;
    replyToMessageId?: number;
  }): Promise<ResolvedContext> {
    const defaultGrade = 8;
    let grade = defaultGrade;
    let topicConfig = {
      aiMode: "PHOTOS_AND_HELP",
      humanFirst: false,
      humanFirstDelay: 60,
    };

    // 1. Check Topic grade and config if threadId is present
    if (params.threadId) {
      const topic = await prisma.telegramTopic.findFirst({
        where: {
          chat: { telegramChatId: BigInt(params.chatId) },
          threadId: params.threadId,
        },
      });

      if (topic) {
        if (topic.grade) grade = topic.grade;
        topicConfig = {
          aiMode: topic.aiMode,
          humanFirst: topic.humanFirst,
          humanFirstDelay: topic.humanFirstDelay,
        };
      }
    }

    // 2. Find last photos for this user in this thread (within last 3 hours)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const lastPhotoMessages = await prisma.message.findMany({
      where: {
        chat: { telegramChatId: BigInt(params.chatId) },
        threadId: params.threadId || null,
        user: { telegramId: BigInt(params.userId) },
        hasMedia: true,
        createdAt: { gte: threeHoursAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { media: true },
    });

    const lastPhotoFileIds: string[] = [];
    if (lastPhotoMessages.length > 0) {
      // If there's a media_group_id, take all photos from that group
      const latestMsg = lastPhotoMessages[0];
      if (latestMsg.mediaGroupId) {
        const groupMessages = await prisma.message.findMany({
          where: { mediaGroupId: latestMsg.mediaGroupId },
          include: { media: true },
        });
        for (const gMsg of groupMessages) {
          for (const m of gMsg.media) {
            lastPhotoFileIds.push(m.fileId);
          }
        }
      } else {
        for (const m of latestMsg.media) {
          lastPhotoFileIds.push(m.fileId);
        }
      }
    }

    // 3. Find latest AI conversation / solution in this thread
    const lastConv = await prisma.aIConversation.findFirst({
      where: {
        chatId: String(params.chatId),
        threadId: params.threadId || null,
        user: { telegramId: BigInt(params.userId) },
      },
      orderBy: { createdAt: "desc" },
      include: {
        solutions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    let previousConversation;
    if (lastConv) {
      const sol = lastConv.solutions[0];
      previousConversation = {
        id: lastConv.id,
        subject: lastConv.subject || sol?.subject,
        lastTaskNumbers: sol?.taskNumbers,
        lastSteps: sol?.stepByStep,
        lastAnswer: sol?.finalAnswer,
      };
    }

    return {
      grade,
      lastPhotoFileIds,
      previousConversation,
      topicConfig,
    };
  }
}

export const contextManager = new ContextManager();
