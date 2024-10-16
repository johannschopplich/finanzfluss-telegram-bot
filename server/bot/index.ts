import { Bot } from 'grammy'
import { commands, menus } from './commands'

export function createBot() {
  const { telegram } = useRuntimeConfig()
  const bot = new Bot(telegram.botToken, { botInfo: telegram.botInfo })

  bot.use(...menus)
  bot.use(commands)

  return bot
}
