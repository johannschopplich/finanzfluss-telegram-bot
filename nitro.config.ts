import process from 'node:process'
import 'dotenv/config'
import './validation'

export default defineNitroConfig({
  srcDir: 'server',

  runtimeConfig: {
    site: {
      url: 'https://ff-telegram-bot.pages.dev',
    },

    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      botInfo: JSON.parse(
        process.env.NITRO_PREPARE === 'true'
          ? '{}'
          : process.env.TELEGRAM_BOT_INFO,
      ),
    },

    webhookToken: process.env.WEBHOOK_SECRET,
  },

  experimental: {
    tasks: !process.env.NITRO_PRESET,
  },
})
