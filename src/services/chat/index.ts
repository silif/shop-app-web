import http from "@/utils/request";
import type {
  ChatPageData,
  ChatMessagesData,
  SendMessageParams,
  CreateChatParams,
  CreateChatResponse,
  ConversationProductInfo,
  ChatMessage,
} from "./dto";

const BASE_URL = "/api/chat";

export const chatService = {
  list: () => {
    return http.get<ChatPageData>(`${BASE_URL}/conversations`);
  },

  getMessages: (chatId: string) => {
    return http.get<ChatMessage[]>(
      `${BASE_URL}/conversation/${chatId}/messages`,
    );
  },

  sendMessage: (params: SendMessageParams) => {
    return http.post<void>(`${BASE_URL}/message`, params);
  },

  createChat: (params: CreateChatParams) => {
    return http.post<CreateChatResponse>(`${BASE_URL}/conversation`, params);
  },

  markAsRead: (chatId: string) => {
    return http.post<void>(`${BASE_URL}/read/${chatId}`);
  },

  getConversationProduct: (chatId: string) => {
    return http.get<ConversationProductInfo>(
      `${BASE_URL}/conversation/${chatId}/product`,
    );
  },
};

export default chatService;
