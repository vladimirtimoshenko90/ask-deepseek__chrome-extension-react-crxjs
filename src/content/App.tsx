import {
	CHAT_MESSAGE_INJECTION_SELECTOR,
	markChatMessageInjectionRoot,
} from '@/infrastructure/constants';
import { useEffect, useState } from 'react';

import ChatMessage from './ChatMessage/ChatMessage';
import { createPortal } from 'react-dom';

function App() {
	const [containers, setContainers] = useState<HTMLElement[]>([]);

	useEffect(() => {
		const syncContainers = () => {
			const el_list = document.querySelector('div.ds-virtual-list-items');
			if (!el_list) {
				setContainers([]);
				return;
			}

			const el_message_list =
				el_list.querySelectorAll<HTMLElement>('div.ds-message');
			const el_injectInto_list = Array.from(el_message_list).map(
				(el_msg) => {
					let el_injectInto = el_msg.querySelector<HTMLElement>(
						CHAT_MESSAGE_INJECTION_SELECTOR,
					);

					if (!el_injectInto) {
						el_injectInto = document.createElement('div');
						markChatMessageInjectionRoot(el_injectInto);
						el_msg.firstElementChild!.prepend(el_injectInto);
					}

					return el_injectInto;
				},
			);

			setContainers(el_injectInto_list);
		};

		const observer = new MutationObserver(syncContainers);
		syncContainers();
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);

	return containers.map((container, idx) =>
		createPortal(<ChatMessage />, container, idx),
	);
}

export default App;
