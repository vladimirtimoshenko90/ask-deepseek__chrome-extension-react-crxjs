import App from './App.tsx';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/messages.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const prompt = `Проанализируй следующий текст и объясни его значение максимально кратко и по существу.\n\nИспользуй профессиональный, но доступный стиль.\n\nОтвет обязательно дай на том же языке, что и сам текст.\n\nВот текст: '{text}'`;

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === MSG_TYPE_ASK_DEEPSEEK) {
		const textarea =
			document.querySelector<HTMLTextAreaElement>('textarea');
		if (!textarea) return;

		const nativeSetter = Object.getOwnPropertyDescriptor(
			HTMLTextAreaElement.prototype,
			'value',
		)?.set;
		nativeSetter?.call(textarea, prompt.replace('{text}', message.text));
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
