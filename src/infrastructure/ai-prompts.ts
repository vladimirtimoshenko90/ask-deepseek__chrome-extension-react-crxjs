export const prompt_ask_deepseek = `Search the internet for the latest information related to the text below.
Compare it with my existing knowledge and provide a single final answer that gets to the point.

— If the text is about programming (code, technologies, libraries):
explain it in detail, as if for someone who wants to understand it properly. Use code examples if appropriate.

— If the text is about a news story or a factual claim:
make sure to verify it through internet search before answering.

The answer should be neither too short nor too long — you decide what length fits the topic.

CRITICAL: Look at the text inside the quotes at the end. Answer in exactly that language. If the quoted text is in English, answer in English. If it is in Russian, answer in Russian. Do not use any other language.

CRITICAL: Do not use Chinese unless the text inside the quotes is in Chinese.

Text: '{text}'`;
