import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for Помогайка DFZ...");

  // 1. Seed Rules
  const rules = [
    {
      title: "Оскорбления и неуважительное общение",
      description: "Запрещены любые оскорбления, унижение участников, переход на личности и токсичное поведение. Мы поддерживаем дружественную учебную атмосферу.",
      category: "DISCIPLINE",
      penalty: "WARN",
      order: 1,
      active: true,
    },
    {
      title: "Нецензурная брань и мат",
      description: "Использование нецензурных слов, завуалированного мата и непристойных выражений строго запрещено во всех темах группы.",
      category: "DISCIPLINE",
      penalty: "WARN",
      order: 2,
      active: true,
    },
    {
      title: "Разжигание вражды и дискриминация",
      description: "Категорически запрещены любые высказывания, разжигающие межнациональную, религиозную или социальную рознь.",
      category: "SAFETY",
      penalty: "BAN",
      order: 3,
      active: true,
    },
    {
      title: "Реклама и спам",
      description: "Запрещено размещение несогласованной рекламы сторонних каналов, платных услуг решения ДЗ, ботов и подозрительных ссылок.",
      category: "ADVERTISING",
      penalty: "MUTE",
      order: 4,
      active: true,
    },
    {
      title: "Оффтоп и флуд не по теме класса",
      description: "Отправляйте задания в соответствующую тему вашего класса (1–11 классы). Массовый флуд и сообщения не по теме затрудняют поиск помощи.",
      category: "ACADEMIC",
      penalty: "WARN",
      order: 5,
      active: true,
    },
    {
      title: "Правило 3 предупреждений (3 Warns -> Ban)",
      description: "Участник, накопивший 3 активных предупреждения от модераторов или автоматической системы, блокируется в сообществе навсегда.",
      category: "DISCIPLINE",
      penalty: "BAN",
      order: 6,
      active: true,
    },
  ];

  for (const rule of rules) {
    const existing = await prisma.rule.findFirst({ where: { title: rule.title } });
    if (!existing) {
      await prisma.rule.create({ data: rule });
    }
  }
  console.log(`✅ Rules seeded (${rules.length} rules)`);

  // 2. Seed Admins
  const admins = [
    {
      telegramUserId: BigInt(6564196947),
      username: "realDFZ",
      name: "𝙟𝙪𝙨𝙩 𝙥𝙧𝙤𝙜𝙧𝙖𝙢𝙢𝙞𝙣𝙜",
      role: "OWNER",
    },
    {
      telegramUserId: BigInt(8806627868),
      username: "LoveIcelattee",
      name: "::A☕+⁰¹⁷",
      role: "ADMIN",
    },
    {
      telegramUserId: BigInt(8990437531),
      username: "pomogaykaTeamBot",
      name: "Помогайка AI",
      role: "MODERATOR",
    },
  ];

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { telegramUserId: admin.telegramUserId },
      update: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
      create: admin,
    });
  }
  console.log(`✅ Admins seeded (${admins.length} admins)`);

  // 3. Seed Telegram Chat & Default Class Topics
  const chatId = BigInt("-1002489987868");
  const chat = await prisma.telegramChat.upsert({
    where: { telegramChatId: chatId },
    update: {
      title: "Помогайка DFZ",
      type: "supergroup",
      isForum: true,
    },
    create: {
      telegramChatId: chatId,
      title: "Помогайка DFZ",
      type: "supergroup",
      isForum: true,
    },
  });

  // Seed default grade topics for 1..11 classes
  for (let grade = 1; grade <= 11; grade++) {
    // Thread IDs can be updated later via Admin Panel or dynamically on first message
    const threadId = 1000 + grade; // placeholder threadId until mapped in admin
    await prisma.telegramTopic.upsert({
      where: {
        chatId_threadId: {
          chatId: chat.id,
          threadId,
        },
      },
      update: {
        name: `${grade} класс Помогайка`,
        grade,
        aiMode: "PHOTOS_AND_HELP",
      },
      create: {
        chatId: chat.id,
        threadId,
        name: `${grade} класс Помогайка`,
        grade,
        aiMode: "PHOTOS_AND_HELP",
        humanFirst: false,
        humanFirstDelay: 60,
        enabled: true,
      },
    });
  }
  console.log(`✅ Telegram chat and default topics seeded for 1-11 classes`);

  // 4. Seed Settings
  const settings = [
    { key: "retention_days", value: { days: 30 } },
    { key: "ai_default_model", value: { model: "gemini-2.5-flash" } },
    { key: "human_first_global", value: { enabled: false, defaultDelaySec: 60 } },
    {
      key: "community_info",
      value: {
        title: "Помогайка DFZ",
        tagline: "Домашка стала проще",
        telegramLink: "https://t.me/pomogaykaTeam",
        inviteLink: "https://t.me/+wHeu-wYGZwJlM2Qy",
        botUsername: "pomogaykaTeamBot",
        owner: "@realDFZ",
        team: "DFZ",
      },
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ System settings seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
