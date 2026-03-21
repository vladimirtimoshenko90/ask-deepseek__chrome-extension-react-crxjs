import App from './App.tsx';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/messages.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { prompt_ask_deepseek } from '@/infrastructure/prompts.ts';

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

const container = document.createElement('div');
container.id = 'crxjs-app';
document.body.appendChild(container);
createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
