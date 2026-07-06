import { DEEPSEEK_URL_BASE } from '@/infrastructure/constants';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/sw-messages';

import { sendTabMessage, waitForTabComplete } from '../utility/tab.utils';

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
			await waitForTabComplete(tabId);
		}

		sendTabMessage(tabId, MSG_TYPE_ASK_DEEPSEEK, { text: trimmed });
	});
}
