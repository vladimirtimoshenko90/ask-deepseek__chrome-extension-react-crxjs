import { DEEPSEEK_URL_BASE } from '../infrastructure/constants';

const CONTEXT_MENU_ID = 'ask-deepseek';

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: CONTEXT_MENU_ID,
		title: 'Ask DeepSeek',
		contexts: ['selection'],
	});
});

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: DEEPSEEK_URL_BASE });
});
