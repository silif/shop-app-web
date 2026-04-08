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
  id: number;
  name: string;
  description?: string;
  price: number;
  statusCode: number;
  statusLabel: string;
  conditionCode: number;
  conditionLabel: string;
  purchasedAt?: string;
  mainImageUrl: string;
  imageUrls: string[];
  category?: string;
  stock: number;
  ownerId: number;
  ownerUsername: string;
  createdAt: string;
}
