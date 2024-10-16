import { Composer, InlineKeyboard } from 'grammy'

const composer = new Composer()

composer.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .url('Finanzfluss.de', 'https://www.finanzfluss.de')
    .url('YouTube', 'https://www.youtube.com/@Finanzfluss')

  await ctx.reply(
    `
<b>Hallo!</b> Das ist ein inoffizieller Bot für Finanzfluss.

Verfügbare Kommandos:
/start: Starte den Bot.
/suche: Durchsuche Finanzfluss.
/advent: 🎄 Adventskalender.
/help: Zeige eine Hilfe an.
`.trim(),
    {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    },
  )
})

export default composer
