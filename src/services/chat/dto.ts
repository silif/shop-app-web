export interface ChatMessage {
  id: number;
  conversationId: string;
  senderId: number;
  senderUsername: string;
  isRead: boolean;
  content: string;
  createdAt: string;
}

export interface ChatItem {
  buyerId: number;
  buyerUsername: string;
  createdAt: string;
  id: number;
  lastMessage: string;
  lastMessageTime: string;
  productId: number;
  productName: string;
  sellerId: number;
  sellerUsername: string;
  unreadCount: number;
}

export interface ChatPageData {
  content: ChatItem[];
  pageSize: number;
  current: number;
  total: number;
}

export interface ChatMessagesData {
  messages: ChatMessage[];
  total: number;
}

export interface SendMessageParams {
  conversationId: string;
  content: string;
}

export interface CreateChatParams {
  productId: number;
}

export interface CreateChatResponse {
  id: string;
}

export interface ConversationProductInfo {
  productId: number;
  productName: string;
  productImageUrl?: string;
  productPrice?: number;
  productDescription?: string;
  conditionCode?: number;
  category?: string;
  sellerId: number;
  sellerUsername: string;
  buyerId: number;
  buyerUsername: string;
}
