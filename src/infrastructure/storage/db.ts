class Db {
	read<T>(key: string): Promise<T | undefined> {
		return chrome.storage.local
			.get(key)
			.then((res) => res[key] as T | undefined);
	}

	write<T>(key: string, value: T): Promise<void> {
		return chrome.storage.local.set({ [key]: value });
	}

	delete(key: string): Promise<void> {
		return chrome.storage.local.remove(key);
	}
}

export const db = new Db();
