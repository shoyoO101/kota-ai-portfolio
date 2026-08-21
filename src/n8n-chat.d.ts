declare module "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js" {
  export interface ChatOptions {
    webhookUrl: string;
    [key: string]: unknown;
  }
  export function createChat(options: ChatOptions): void;
}
