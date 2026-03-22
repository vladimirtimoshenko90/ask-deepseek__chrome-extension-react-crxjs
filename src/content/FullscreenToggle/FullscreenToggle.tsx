import { memo, useEffect, useState } from 'react';

import { Switch } from '@mantine/core';
import { storage } from '@/infrastructure/storage';
import styles from './FullscreenToggle.module.scss';
import { useClassToggle } from '@/infrastructure/hooks/useClassToggle';

function FullscreenToggle() {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		storage.getWideMode().then(setEnabled);
	}, []);

	useClassToggle(document.body, 'ads-fullscreen-mode', enabled);

	const handleChange = async (value: boolean) => {
		setEnabled(value);
		await storage.setWideMode(value);
	};

	return (
		<div className={styles['ads-fullscreen-toggle']}>
			<Switch
				checked={enabled}
				onChange={(e) => handleChange(e.currentTarget.checked)}
				label="Full Screen"
				size="sm"
			/>
		</div>
	);
}

export default memo(FullscreenToggle);
