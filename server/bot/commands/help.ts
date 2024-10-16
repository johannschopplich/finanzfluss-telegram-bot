import { Composer } from 'grammy'

export const composer = new Composer()

composer.command('help', async (ctx) => {
  await ctx.reply(
    `
<b>Verfügbare Kommandos:</b>
/start: Starte den Bot.
/suche: Durchsuche Finanzfluss.
/advent: 🎄 Adventskalender.
/help: Zeige diese Hilfe an.
`.trim(),
    { parse_mode: 'HTML' },
  )
})

export default composer
