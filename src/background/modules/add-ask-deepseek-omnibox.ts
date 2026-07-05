import { DEEPSEEK_URL_BASE } from '@/infrastructure/constants';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/sw-messages';

export function addAskDeepseekOmnibox(): void {
	chrome.omnibox.onInputEntered.addListener(async (text) => {
		const trimmed = text.trim();
		if (!trimmed) return;

		const [tab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		if (!tab?.id) return;
		const tabId = tab.id!;

		const isDeepSeek = tab.url?.startsWith('https://chat.deepseek.com');
		if (!isDeepSeek) {
			await chrome.tabs.update(tabId, { url: DEEPSEEK_URL_BASE });
			await new Promise<void>((resolve) => {
				const onUpdated = (updatedTabId: number, changeInfo: { status?: string }) => {
					if (updatedTabId !== tabId || changeInfo.status !== 'complete') return;
					chrome.tabs.onUpdated.removeListener(onUpdated);
					resolve();
				};
				chrome.tabs.onUpdated.addListener(onUpdated);
			});
		}

		const msg = { type: MSG_TYPE_ASK_DEEPSEEK, text: trimmed };
		const send = (attempt = 0) => {
			chrome.tabs.sendMessage(tabId, msg).catch(() => {
				if (attempt < 10) {
					setTimeout(() => send(attempt + 1), 300);
				}
			});
		};
		send();
	});
}
