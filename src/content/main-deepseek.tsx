import App from './App';
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

(() => {
	const el_root = document.createElement('div');
	document.body.append(el_root);

	createRoot(el_root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
})();
