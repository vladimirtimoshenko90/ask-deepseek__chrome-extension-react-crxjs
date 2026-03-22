import {
	CHAT_MESSAGE_INJECTION_SELECTOR,
	markChatMessageInjectionRoot,
} from '@/infrastructure/constants';
import { useEffect, useMemo, useRef, useState } from 'react';

import ChatMessageToolbar from './ChatMessageToolbar/ChatMessageToolbar';
import {
	type ChatInfo,
	type PinnedMessage,
	EMPTY_CHAT_INFO,
	storage,
} from '@/infrastructure/storage';
import { createPortal } from 'react-dom';
import PinnedSidebar from './PinnedSidebar/PinnedSidebar';

function App() {
	const chatPath = useMemo(() => window.location.pathname, []);
	const [chatInfo, setChatInfo] = useState<ChatInfo>(EMPTY_CHAT_INFO);

	const [containers, setContainers] = useState<HTMLElement[]>([]);
	const containersRef = useRef<HTMLElement[]>([]);

	useEffect(() => {
		storage
			.getChatInfo(chatPath)
			.then((info) => setChatInfo(info || EMPTY_CHAT_INFO));
	}, [chatPath]);

	const handlePin = async (pin: PinnedMessage) => {
		await storage.addPin(chatPath, pin);
		setChatInfo((prev) => ({ ...prev, pins: [...prev.pins, pin] }));
	};

	const handleUnpin = async (hash: string) => {
		await storage.removePin(chatPath, hash);
		setChatInfo((prev) => ({
			...prev,
			pins: prev.pins.filter((p) => p.hash !== hash),
		}));
	};

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

			const prev = containersRef.current;
			const unchanged =
				prev.length === el_injectInto_list.length &&
				el_injectInto_list.every((el, i) => el === prev[i]);
			if (!unchanged) {
				containersRef.current = el_injectInto_list;
				setContainers(el_injectInto_list);
			}
		};

		const observer = new MutationObserver(syncContainers);
		syncContainers();
		observer.observe(document.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<PinnedSidebar pins={chatInfo.pins} />

			{containers.map((container, idx) =>
				createPortal(
					<ChatMessageToolbar
						chatInfo={chatInfo}
						onPin={handlePin}
						onUnpin={handleUnpin}
					/>,
					container,
					idx,
				),
			)}
		</>
	);
}

export default App;
