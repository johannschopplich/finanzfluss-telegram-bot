import type { FFContext, SessionData } from './types'
import { conversations, createConversation } from '@grammyjs/conversations'
import { Bot, session } from 'grammy'
import { commands as ffCommands } from './commands'
import { conversations as ffConversations } from './conversations'
import { KVStorageAdapter } from './storage/kv-session'

export function createBot() {
  const { telegram } = useRuntimeConfig()
  const bot = new Bot<FFContext>(telegram.botToken, {
    botInfo: telegram.botInfo,
  })

  bot.use(
    session({
      storage: new KVStorageAdapter<SessionData>(),
      initial: () => ({ adventScore: 0, answeredDays: [] }),
    }),
  )
  bot.use(conversations())

  bot.use(ffCommands)
  bot.use(...ffConversations.map(([fn, name]) => createConversation(fn, name)))

  return bot
}
