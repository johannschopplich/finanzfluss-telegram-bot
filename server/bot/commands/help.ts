import type { FFContext } from '../types'
import { Composer } from 'grammy'

const composer = new Composer<FFContext>()

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
