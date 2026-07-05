import { IconPin } from '@tabler/icons-react';

import { type PinnedMessage } from '@/infrastructure/storage';
import { useScreenSelection } from '@/infrastructure/hooks/useScreenSelection';
import { clearSelection } from '@/infrastructure/utility/selection.utils';
import { hashText } from '@/infrastructure/utility/hash.utils';
import { sanitizeChatMessageHtml } from '@/infrastructure/utility/sanitize.utils';
import styles from './SelectionPinFloating.module.scss';

function isSelectionInsideChatMessage(range: Range): boolean {
	const node = range.commonAncestorContainer;
	const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
	return !!el?.closest('[data-virtual-list-item-key]');
}

interface Props {
	onPin: (pin: PinnedMessage) => void;
}

function SelectionPinFloating({ onPin }: Props) {
	const selection = useScreenSelection();

	if (!selection || !isSelectionInsideChatMessage(selection.range)) return null;

	const { range, anchor } = selection;

	async function handlePin(e: React.MouseEvent) {
		e.preventDefault();

		const el = document.createElement('div');
		el.appendChild(range.cloneContents());
		const html = sanitizeChatMessageHtml(el.innerHTML);
		const hash = await hashText(el.innerText.replace(/\s/g, ''));

		clearSelection();

		onPin({ hash, html });
	}

	return (
		<button
			className={styles['ads-selection-pin']}
			style={{ top: anchor.top, left: anchor.left }}
			onMouseDown={handlePin}
		>
			<IconPin size={20} />
		</button>
	);
}

export default SelectionPinFloating;
