import adventGame from './advent-game'

type Conversation = [(...args: any[]) => Promise<void>, string]

const conversations: Conversation[] = [[adventGame, 'adventGame']]

export { conversations }
