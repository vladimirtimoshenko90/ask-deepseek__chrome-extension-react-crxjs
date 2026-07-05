import { EMPTY_CHAT_INFO, type ChatInfo, type PinnedMessage } from './entities/chat-info';

import type { ScreenSettings } from './entities/screen-settings';
import { db } from './db';

const CHAT_INFO_KEY = (chatPath: string) => `chat:${chatPath}`;
const SCREEN_SETTINGS_KEY = 'screen-settings';

class Storage {
	// --- ChatInfo ---

	async getChatInfo(chatPath: string): Promise<ChatInfo | undefined> {
		const info = await db.read<ChatInfo>(CHAT_INFO_KEY(chatPath));
		return !!info ? { ...EMPTY_CHAT_INFO, ...info } : info;
	}

	async removeChatInfo(chatPath: string): Promise<void> {
		await db.delete(CHAT_INFO_KEY(chatPath));
	}

	async addPin(chatPath: string, pin: PinnedMessage): Promise<void> {
		const info = await this.getChatInfo(chatPath);
		await db.write(CHAT_INFO_KEY(chatPath), {
			...info,
			pins: [...(info?.pins || []), pin],
		});
	}

	async removePin(chatPath: string, hash: string): Promise<void> {
		const info = await this.getChatInfo(chatPath);
		if (!info) return;
		await db.write(CHAT_INFO_KEY(chatPath), {
			...info,
			pins: info.pins.filter((p) => p.hash !== hash),
		});
	}

	async addCollapsed(chatPath: string, hash: string): Promise<void> {
		const info = await this.getChatInfo(chatPath);
		await db.write(CHAT_INFO_KEY(chatPath), {
			...info,
			collapsed: [...(info?.collapsed || []), hash],
		});
	}

	async removeCollapsed(chatPath: string, hash: string): Promise<void> {
		const info = await this.getChatInfo(chatPath);
		if (!info) return;
		await db.write(CHAT_INFO_KEY(chatPath), {
			...info,
			collapsed: info.collapsed.filter((h) => h !== hash),
		});
	}

	// --- ScreenSettings ---

	async getWideMode(): Promise<boolean> {
		const settings = await db.read<ScreenSettings>(SCREEN_SETTINGS_KEY);
		return settings?.wideMode ?? false;
	}

	async setWideMode(value: boolean): Promise<void> {
		const settings = await db.read<ScreenSettings>(SCREEN_SETTINGS_KEY);
		await db.write(SCREEN_SETTINGS_KEY, {
			...settings,
			wideMode: value,
		});
	}
}

export const storage = new Storage();
