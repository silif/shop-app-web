import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '@/services';
import { resolveImageUrl } from '@/config';
import type { ChatItem } from '@/services/chat/dto';
import styles from './ChatList.module.css';

export default function ChatListPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchChats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await chatService.list();
        if (!cancelled) {
          setChats(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '获取聊天列表失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchChats();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <h1>我的聊天</h1>

        {loading && <p className={styles.tip}>加载中...</p>}
        {error && !loading && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <>
            {chats.length === 0 ? (
              <p className={styles.tip}>暂无聊天记录</p>
            ) : (
              <div className={styles.list}>
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={styles.item}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <div className={styles.productImage}>
                      {chat.productImageUrl ? (
                        <img src={resolveImageUrl(chat.productImageUrl)} alt={chat.productName} />
                      ) : (
                        <div className={styles.imagePlaceholder}>暂无图片</div>
                      )}
                    </div>
                    <div className={styles.info}>
                      <div className={styles.productName}>{chat.productName}</div>
                      <div className={styles.lastMessage}>
                        {chat.lastMessage || '暂无消息'}
                      </div>
                    </div>
                    <div className={styles.meta}>
                      <div className={styles.otherUser}>{chat.otherUserName}</div>
                      {chat.unreadCount > 0 && (
                        <span className={styles.badge}>{chat.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}