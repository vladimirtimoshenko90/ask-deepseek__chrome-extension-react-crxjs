import ChatMessage from './ChatMessage/ChatMessage';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/messages.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { prompt_ask_deepseek } from '@/infrastructure/prompts.ts';

// --- Background message listener: receive text from background & submit AI query ---

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === MSG_TYPE_ASK_DEEPSEEK) {
		const textarea =
			document.querySelector<HTMLTextAreaElement>('textarea');
		if (!textarea) return;

		const nativeSetter = Object.getOwnPropertyDescriptor(
			HTMLTextAreaElement.prototype,
			'value',
		)?.set;
		nativeSetter?.call(
			textarea,
			prompt_ask_deepseek.replace('{text}', message.text),
		);
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
		textarea.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
		);
	}
});

// --- Chat messages injection ---

function injectChatMessage(el_msg: Element) {
	if (el_msg.querySelector('[data-chat-message]')) return;

	const el_injectInto = document.createElement('div');
	el_injectInto.setAttribute('data-chat-message', 'true');
	el_msg.firstElementChild!.prepend(el_injectInto);

	createRoot(el_injectInto).render(
		<StrictMode>
			<ChatMessage />
		</StrictMode>,
	);
}

function observeVirtualList() {
	const list = document.querySelector('div.ds-virtual-list-items');
	if (!list) {
		setTimeout(observeVirtualList, 300);
		return;
	}

	list.querySelectorAll('div.ds-message').forEach(injectChatMessage);

	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue;
				if (node.matches('div.ds-message')) injectChatMessage(node);
				node.querySelectorAll('div.ds-message').forEach(
					injectChatMessage,
				);
			}
		}
	}).observe(list, { childList: true, subtree: true });
}

observeVirtualList();
