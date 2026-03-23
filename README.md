# Ask DeepSeek — Chrome Extension

A Chrome extension that supercharges [chat.deepseek.com](https://chat.deepseek.com/) with productivity features: ask DeepSeek about anything you select on the web, pin important answers, collapse long messages, and expand the chat to full width.

---

## Features

### Ask DeepSeek from Any Page

Right-click any selected text → **"Ask DeepSeek"** — opens DeepSeek in a new tab with the selected text as a structured prompt (web search, fact-checking, code explanation, auto-detected language). Clicking the toolbar icon opens DeepSeek directly.

### Per-Message Toolbar

Every chat message gets two action buttons:

- **Collapse / Expand** — hides the message body; state persisted per conversation.
- **Pin / Unpin** — pins the message to the sidebar and highlights it in the chat; persisted per conversation.

### Pinned Messages Sidebar

Shows all pinned messages for the current conversation in a sidebar. Pins are scoped per chat — they never leak across conversations.

### Wide / Fullscreen Mode

A toggle that widens the chat layout for large screens. Setting is persisted and restored on every visit.

---

## Installation

### Development

```bash
npm ci
npm run dev
```

Then load the extension in Chrome:

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist` folder, or drag and drop the `dist` folder onto the page

### Production

```bash
npm run build
```

Load the extension using the same steps as in Development (first install only).

---

## Tech Stack

- **Language** — TypeScript 5.9
- **Framework** — React 19
- **UI** — Mantine 8, Tabler Icons, SCSS Modules
- **Build** — Vite 8 + `@crxjs/vite-plugin`, `vite-plugin-zip-pack`
- **Storage** — `chrome.storage.local`
- **Extension Platform** — Manifest V3, Service Worker, Content Scripts, Context Menus, Tabs API
