import { DEEPSEEK_URL_BASE } from '../infrastructure/constants';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/messages';

const CONTEXT_MENU_ASK_DEEPSEEK = 'ask-deepseek';

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

	const msg = { type: MSG_TYPE_ASK_DEEPSEEK, text: info.selectionText! };
	const send = (attempt = 0) => {
		chrome.tabs.sendMessage(tabId, msg).catch(() => {
			if (attempt < 10) {
				setTimeout(() => send(attempt + 1), 300);
			}
		});
	};
	send();
});

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
});
