const ANCHOR_GAP = 8;

export type SelectionAnchor = { top: number; left: number };

export type ScreenSelection = {
	range: Range;
	anchor: SelectionAnchor;
};

function hasSelectionText(range: Range): boolean {
	return range.toString().replace(/\s/g, '').length > 0;
}

/** Last line fragment — avoids union bbox from `getBoundingClientRect()`. */
function getLastLineRect(range: Range): DOMRect | null {
	const rects = range.getClientRects();
	for (let i = rects.length - 1; i >= 0; i--) {
		const rect = rects[i];
		if (rect.width > 0 && rect.height > 0) return rect;
	}
	return null;
}

export function getActiveSelectionRange(): Range | null {
	const sel = window.getSelection();
	if (!sel || sel.isCollapsed || !sel.rangeCount) return null;

	const range = sel.getRangeAt(0);
	if (!hasSelectionText(range)) return null;

	return range;
}

export function getScreenSelection(): ScreenSelection | null {
	const range = getActiveSelectionRange();
	if (!range) return null;

	const lastLine = getLastLineRect(range);
	if (!lastLine) return null;

	// Per-line client rect for Y; collapsed range end for X (union bbox is wrong on multiline).
	const endRange = range.cloneRange();
	endRange.collapse(false);
	const endRect = endRange.getBoundingClientRect();
	const left = endRect.width > 0 ? endRect.right : endRect.left;

	return { range, anchor: { top: lastLine.bottom + ANCHOR_GAP, left } };
}

export function clearSelection(): void {
	window.getSelection()?.removeAllRanges();
}
