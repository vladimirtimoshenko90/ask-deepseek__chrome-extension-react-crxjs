import { DEEPSEEK_URL_BASE } from '@/infrastructure/constants';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/sw-messages';

export function addAskDeepseekOmnibox(): void {
	chrome.omnibox.onInputEntered.addListener(async (text) => {
		const tab = await chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
		const tabId = tab.id!;

		await new Promise<void>((resolve) => {
			const onUpdated = (
				updatedTabId: number,
				changeInfo: { status?: string },
			) => {
				if (updatedTabId !== tabId || changeInfo.status !== 'complete')
					return;
				chrome.tabs.onUpdated.removeListener(onUpdated);
				resolve();
			};
			chrome.tabs.onUpdated.addListener(onUpdated);
		});

		const trimmed = text.trim();
		if (!trimmed) return;

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
