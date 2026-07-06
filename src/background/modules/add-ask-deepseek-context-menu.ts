import { DEEPSEEK_URL_BASE } from '@/infrastructure/constants';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/sw-messages';

import { sendTabMessage, waitForTabComplete } from '../utility/tab.utils';

const CONTEXT_MENU_ASK_DEEPSEEK = 'ask-deepseek';

export function addAskDeepseekContextMenu(): void {
	chrome.runtime.onInstalled.addListener(() => {
		chrome.contextMenus.create({
			id: CONTEXT_MENU_ASK_DEEPSEEK,
			title: 'Ask DeepSeek',
			contexts: ['selection'],
		});
	});

	chrome.contextMenus.onClicked.addListener(async (info) => {
		if (info.menuItemId !== CONTEXT_MENU_ASK_DEEPSEEK) return;

		const tab = await chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
		const tabId = tab.id!;
		await waitForTabComplete(tabId);

		sendTabMessage(tabId, MSG_TYPE_ASK_DEEPSEEK, { text: info.selectionText! });
	});
}
