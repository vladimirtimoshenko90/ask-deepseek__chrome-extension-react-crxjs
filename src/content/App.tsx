import {
	CHAT_MESSAGE_INJECTION_SELECTOR,
	markChatMessageInjectionRoot,
} from '@/infrastructure/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

import ChatMessageToolbar from './ChatMessageToolbar/ChatMessageToolbar';
import {
	type ChatInfo,
	type PinnedMessage,
	EMPTY_CHAT_INFO,
	storage,
} from '@/infrastructure/storage';
import { createPortal } from 'react-dom';
import PinnedSidebar from './PinnedSidebar/PinnedSidebar';
import { useMutationObserver } from '@/infrastructure/hooks/useMutationObserver';
import { usePathname } from '@/infrastructure/hooks/usePathname';
import FullscreenToggle from './FullscreenToggle/FullscreenToggle';

function App() {
	const chatPath = usePathname();
	const [chatInfo, setChatInfo] = useState<ChatInfo>(EMPTY_CHAT_INFO);

	const [containers, setContainers] = useState<HTMLElement[]>([]);
	const containersRef = useRef<HTMLElement[]>([]);

	useEffect(() => {
		storage
			.getChatInfo(chatPath)
			.then((info) => setChatInfo(info || EMPTY_CHAT_INFO));
	}, [chatPath]);

	const handlePin = useCallback(
		async (pin: PinnedMessage) => {
			await storage.addPin(chatPath, pin);
			setChatInfo((prev) => ({ ...prev, pins: [...prev.pins, pin] }));
		},
		[chatPath],
	);

	const handleUnpin = useCallback(
		async (hash: string) => {
			await storage.removePin(chatPath, hash);
			setChatInfo((prev) => ({
				...prev,
				pins: prev.pins.filter((p) => p.hash !== hash),
			}));
		},
		[chatPath],
	);

	useMutationObserver(document.body, () => {
		const el_list = document.querySelector('div.ds-virtual-list-items');
		if (!el_list) {
			containersRef.current = [];
			setContainers([]);
			return;
		}

		const el_message_list =
			el_list.querySelectorAll<HTMLElement>('div.ds-message');

		const el_injectInto_list = Array.from(el_message_list).map((el_msg) => {
			let el_injectInto = el_msg.querySelector<HTMLElement>(
				CHAT_MESSAGE_INJECTION_SELECTOR,
			);

			if (!el_injectInto) {
				el_injectInto = document.createElement('div');
				markChatMessageInjectionRoot(el_injectInto);
				el_msg.firstElementChild!.prepend(el_injectInto);
			}

			return el_injectInto;
		});

		const unchanged =
			containersRef.current.length === el_injectInto_list.length &&
			el_injectInto_list.every(
				(el, i) => el === containersRef.current[i],
			);
		if (!unchanged) {
			containersRef.current = el_injectInto_list;
			setContainers(el_injectInto_list);
		}
	});

	return (
		<>
			<FullscreenToggle />

			<PinnedSidebar pins={chatInfo.pins} onUnpin={handleUnpin} />

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
