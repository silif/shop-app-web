import { useEffect, useState } from 'react';
import { userService } from '@/services';
import type { UserProfile } from '@/services/user/dto';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await userService.getMyProfile();
        if (!cancelled) {
          setProfile(response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '获取个人信息失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.profilePage}>
      <section className={styles.profileCard}>
        <h1>个人信息</h1>

        {loading && <p className={styles.tip}>加载中...</p>}
        {error && !loading && <p className={styles.error}>{error}</p>}

        {!loading && !error && profile && (
          <>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span>ID</span>
                <strong>{profile.id}</strong>
              </div>
              <div className={styles.infoItem}>
                <span>用户名</span>
                <strong>{profile.username}</strong>
              </div>
              <div className={styles.infoItem}>
                <span>邮箱</span>
                <strong>{profile.email}</strong>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
