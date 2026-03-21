import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
	'p',
	'br',
	'b',
	'i',
	'strong',
	'em',
	'u',
	's',
	'del',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'ul',
	'ol',
	'li',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
	'pre',
	'code',
	'blockquote',
	'div',
	'span',
	'a',
];

export function sanitizeChatMessageHtml(html: string): string {
	const template = document.createElement('template');
	template.innerHTML = html;
	template.content
		.querySelectorAll('[data-chat-message]')
		.forEach((el) => el.remove());

	return DOMPurify.sanitize(template.innerHTML, {
		ALLOWED_TAGS,
		ALLOWED_ATTR: [],
	});
}
