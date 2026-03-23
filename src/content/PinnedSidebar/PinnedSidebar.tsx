import { memo } from 'react';
import { type PinnedMessage } from '@/infrastructure/storage';
import styles from './PinnedSidebar.module.scss';
import PinnedSidebarItem from './PinnedSidebarItem';

interface Props {
	pins: PinnedMessage[];
	onUnpin: (hash: string) => void;
}

function PinnedSidebar({ pins, onUnpin }: Props) {
	return (
		<div
			className={`${styles['ads-pinned-sidebar']}${pins.length > 0 ? ` ${styles['ads-pinned-sidebar--visible']}` : ''}`}
		>
			{pins.map((pin) => (
				<PinnedSidebarItem key={pin.hash} pin={pin} onUnpin={onUnpin} />
			))}
		</div>
	);
}

export default memo(PinnedSidebar);
