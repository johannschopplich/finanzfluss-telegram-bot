import { Menu } from '@grammyjs/menu'
import { Composer } from 'grammy'

const composer = new Composer()

const adventContent: Record<string, string> = {
  1: 'Eine warme Tasse Kakao',
  2: 'Ein Lebkuchenrezept',
  3: 'Ein festlicher Witz',
  24: 'Frohe Weihnachten!',
}

const adventMenu = new Menu('advent-calendar', {
  onMenuOutdated: async (ctx) => {
    await ctx.answerCallbackQuery({
      text: 'Aktualisiert',
    })
    await ctx.editMessageReplyMarkup({ reply_markup: adventMenu })
  },
  fingerprint: (ctx) => {
    const { currentPage } = decodeContextPayload(ctx.match as string)
    return `page:${currentPage},date:${new Date().getDate()}`
  },
})
const ITEMS_PER_PAGE = 6

adventMenu.dynamic((ctx, range) => {
  const { currentPage } = decodeContextPayload(ctx.match as string)
  const startDay = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endDay = Math.min(startDay + ITEMS_PER_PAGE - 1, 24)

  for (let day = startDay; day <= endDay; day++) {
    const canOpen = canOpenDoor(day)
    range
      .text(
        {
          text: canOpen ? `🎁 ${day}` : `🔒 ${day}`,
          payload: encodeContextPayload(day, currentPage),
        },
        async (ctx) => {
          const { day: clickedDay } = decodeContextPayload(ctx.match as string)
          if (canOpen && clickedDay !== undefined) {
            await ctx.answerCallbackQuery({
              text: getAdventContent(clickedDay),
              show_alert: true,
            })
          } else {
            await ctx.answerCallbackQuery({
              text: 'Du kannst dieses Türchen noch nicht öffnen.',
              show_alert: true,
            })
          }
        },
      )
      .row()
  }

  if (currentPage > 1) {
    range.text(
      {
        text: '⬅️ Zurück',
        payload: encodeContextPayload(undefined, currentPage - 1),
      },
      (ctx) => ctx.menu.nav('advent-calendar'),
    )
  }

  if (endDay < 24) {
    range.text(
      {
        text: 'Weiter ➡️',
        payload: encodeContextPayload(undefined, currentPage + 1),
      },
      (ctx) => ctx.menu.nav('advent-calendar'),
    )
  }
})

adventMenu.text('× Schließen', (ctx) => ctx.deleteMessage())

composer.command('advent', async (ctx) => {
  const { day } = decodeContextPayload(ctx.match)

  if (day === undefined) {
    await ctx.reply(
      `
🎄 Der Adventskalender wartet auf dich!

Klicke auf eine Tür, um sie zu öffnen. Du kannst nur Türen bis zum aktuellen Datum im Dezember öffnen.
  `.trim(),
      {
        reply_markup: adventMenu,
      },
    )
    return
  }

  if (day < 1 || day > 24) {
    await ctx.reply('Bitte gib eine Zahl zwischen 1 und 24 an.')
    return
  }

  if (!canOpenDoor(day)) {
    await ctx.reply('Du kannst dieses Türchen noch nicht öffnen.')
    return
  }

  await ctx.reply(getAdventContent(day))
})

composer.command('advent_teilen', async (ctx) => {
  const shareText = '🎄 Teile den Adventskalender mit Leuten, die du magst:'
  const shareUrl = 'https://t.me/finanzfluss_bot?start=advent'
  await ctx.reply(shareText, {
    reply_markup: {
      inline_keyboard: [[{ text: 'Link teilen', url: shareUrl }]],
    },
  })
})

export default composer
export { adventMenu }

function decodeContextPayload(payload = '') {
  const [day, currentPage] = payload.split(':')
  const currentDate = new Date()
  const currentDay = currentDate.getDate()

  // Only calculate page in December
  const calculatedPage = canOpenCalendar(currentDate)
    ? getPageForDay(currentDay)
    : 1
  return {
    day: day === '' || day === '_' ? undefined : Number.parseInt(day),
    currentPage: currentPage ? Number.parseInt(currentPage) : calculatedPage,
  }
}

function encodeContextPayload(day: number | undefined, currentPage: number) {
  return `${day ?? '_'}:${currentPage}`
}

function getAdventContent(day: number) {
  return adventContent[day] || 'Überraschung!'
}

function getPageForDay(day: number) {
  return Math.ceil(day / ITEMS_PER_PAGE)
}

function canOpenCalendar(date = new Date()) {
  const currentMonth = date.getMonth()
  return currentMonth === 11
}

function canOpenDoor(day: number) {
  const currentDate = new Date()
  if (!canOpenCalendar(currentDate)) return false
  return day <= currentDate.getDate()
}
