import {
	CHAT_MESSAGE_INJECTION_SELECTOR,
	markChatMessageInjectionRoot,
	SIDEBAR_INJECTION_SELECTOR,
	markSidebarInjectionRoot,
} from '@/infrastructure/constants';
import { useCallback, useEffect, useState } from 'react';

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

	const [sidebarContainer, setSidebarContainer] =
		useState<HTMLElement | null>(null);

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

	const handleCollapse = useCallback(
		async (hash: string) => {
			await storage.addCollapsed(chatPath, hash);
			setChatInfo((prev) => ({
				...prev,
				collapsed: [...prev.collapsed, hash],
			}));
		},
		[chatPath],
	);

	const handleUncollapse = useCallback(
		async (hash: string) => {
			await storage.removeCollapsed(chatPath, hash);
			setChatInfo((prev) => ({
				...prev,
				collapsed: prev.collapsed.filter((h) => h !== hash),
			}));
		},
		[chatPath],
	);

	useMutationObserver(document.body, () => {
		// Check if the chat page is fully rendered and the message list is present
		const el_list = document.querySelector('div.ds-virtual-list-items');
		if (!el_list) {
			setContainers([]);
			return;
		}

		// Resolve injection points for each chat message toolbar
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
			containers.length === el_injectInto_list.length &&
			el_injectInto_list.every((el, i) => el === containers[i]);
		if (!unchanged) {
			setContainers(el_injectInto_list);
		}

		// Resolve injection point for the pinned sidebar
		const el_container: HTMLElement | null =
			document.querySelectorAll<HTMLElement>('.ds-scroll-area')[2]
				?.parentElement?.parentElement ?? null;
		if (el_container) {
			let el_injectInto = el_container.querySelector<HTMLElement>(
				SIDEBAR_INJECTION_SELECTOR,
			);

			if (!el_injectInto) {
				el_injectInto = document.createElement('div');
				markSidebarInjectionRoot(el_injectInto);
				el_container.appendChild(el_injectInto);
			}

			setSidebarContainer(el_injectInto);
		} else {
			setSidebarContainer(null);
		}
	});

	return (
		<>
			<FullscreenToggle />

			{sidebarContainer &&
				createPortal(
					<PinnedSidebar
						pins={chatInfo.pins}
						onUnpin={handleUnpin}
					/>,
					sidebarContainer,
				)}

			{containers.map((container, idx) =>
				createPortal(
					<ChatMessageToolbar
						chatInfo={chatInfo}
						onPin={handlePin}
						onUnpin={handleUnpin}
						onCollapse={handleCollapse}
						onUncollapse={handleUncollapse}
					/>,
					container,
					idx,
				),
			)}
		</>
	);
}

export default App;
