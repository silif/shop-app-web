import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '@/utils';
import styles from './Layout.module.css';

interface NavItem {
  path: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/product/list', label: '闲置商品' },
  { path: '/product/mine', label: '我的闲置' },
  { path: '/product/create', label: '发布闲置' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(getToken());

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/profile" style={{ marginLeft: 'auto' }} className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}>
                个人中心
              </Link>
              <Link to="/chat/list" className={`${styles.navLink} ${location.pathname === '/chat/list' ? styles.active : ''}`}>
                我的聊天
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                退出登录
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              登录
            </Link>
          )}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}