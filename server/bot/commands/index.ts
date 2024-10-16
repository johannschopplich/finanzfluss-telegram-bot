import { Composer } from 'grammy'
import advent, { adventMenu } from './advent'
import help from './help'
import id from './id'
import search from './search'
import start from './start'

const commands = new Composer()
const menus = [adventMenu]

commands.use(advent, help, id, search, start)

export { commands, menus }
