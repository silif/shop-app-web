import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Spin } from 'antd';
import { chatService, UserProfile, userService } from '@/services';
import type { ChatMessage } from '@/services/chat/dto';
import styles from './Chat.module.css';

const POLL_INTERVAL_MS = 3000;

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 获取用户信息
  const [profile, setProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userService.getMyProfile();
      setProfile(response);
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!chatId) {
      return undefined;
    }

    let cancelled = false;

    const fetchData = async (showLoading: boolean) => {
      if (showLoading) {
        setLoading(true);
      }
      try {
        const messagesRes = await chatService.getMessages(chatId);
        console.log(messagesRes);
        if (!cancelled && messagesRes) {
          setMessages(messagesRes);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('获取聊天信息失败', err);
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    };

    void fetchData(true);

    const timer = window.setInterval(() => {
      void fetchData(false);
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatId || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage({
        conversationId: chatId,
        content: inputValue.trim(),
      });
      setInputValue('');
      const messagesRes = await chatService.getMessages(chatId);
      if (messagesRes) {
        setMessages(messagesRes);
      }
    } catch (err) {
      console.error('发送消息失败', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.productPanel}>
          <h2>商品详情</h2>
          <p className={styles.noProduct}>请从商品详情页进入聊天</p>
        </div>

        <div className={styles.chatPanel}>
          <div className={styles.header}>
            <h2>聊天</h2>
            <button className={styles.backBtn} onClick={() => navigate('/chat/list')}>
              返回列表
            </button>
          </div>

          <div className={styles.messages}>
            {messages.length === 0 ? (
              <p className={styles.empty}>暂无消息，开始聊天吧</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={profile?.id === msg.senderId ? styles.self.concat(' ', styles.message) : styles.other.concat(' ', styles.message)}
                >
                  <div className={styles.content}>{msg.content}</div>
                  <div className={styles.time}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={sending}
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!inputValue.trim() || sending}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}