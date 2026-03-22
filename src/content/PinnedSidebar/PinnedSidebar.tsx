import { memo } from 'react';
import { type PinnedMessage } from '@/infrastructure/storage';
import styles from './PinnedSidebar.module.scss';
import PinnedSidebarItem from './PinnedSidebarItem';

interface Props {
	pins: PinnedMessage[];
	onUnpin: (hash: string) => void;
}

function PinnedSidebar({ pins, onUnpin }: Props) {
	if (pins.length === 0) return null;

	return (
		<div className={styles['ads-pinned-sidebar']}>
			{pins.map((pin) => (
				<PinnedSidebarItem key={pin.hash} pin={pin} onUnpin={onUnpin} />
			))}
		</div>
	);
}

export default memo(PinnedSidebar);
