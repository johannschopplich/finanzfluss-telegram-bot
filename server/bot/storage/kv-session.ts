import type { StorageAdapter } from 'grammy/web'
import type { Storage, StorageValue } from 'unstorage'

export class KVStorageAdapter<T> implements StorageAdapter<T> {
  private storage: Storage<StorageValue>

  constructor(
    /** @default 'kv' */
    base = 'kv',
  ) {
    this.storage = useStorage(base)
  }

  async read(key: string): Promise<T | undefined> {
    const session = await this.storage.getItem<string>(key)
    return session === null ? undefined : JSON.parse(session)
  }

  async write(key: string, data: T) {
    await this.storage.setItem(key, JSON.stringify(data))
  }

  async delete(key: string) {
    await this.storage.removeItem(key)
  }

  async has(key: string) {
    return await this.storage.hasItem(key)
  }
}
