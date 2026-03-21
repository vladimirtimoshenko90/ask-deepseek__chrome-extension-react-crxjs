import App from './App.tsx';
import { MSG_TYPE_ASK_DEEPSEEK } from '@/infrastructure/messages.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

chrome.runtime.onMessage.addListener((message) => {
	if (message.type === MSG_TYPE_ASK_DEEPSEEK) {
		console.info('[AskDeepSeek] received text:', message.text);
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
