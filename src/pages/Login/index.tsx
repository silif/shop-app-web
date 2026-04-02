import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import type { AuthMode, LoginFormData } from '@/types';
import styles from './Login.module.css';

const INITIAL_FORM_DATA: LoginFormData = {
  account: '',
  email: '',
  verificationCode: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const CODE_COUNTDOWN = 60;

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    if (countdown === 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
  }, []);

  const isLogin = mode === 'login';
  const canSendCode = !isLogin && formData.email.trim() && countdown === 0;
  const canRegister = !isLogin && formData.verificationCode.trim();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }, []);

  const handleModeChange = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setCountdown(0);
  }, []);

  const handleSendCode = useCallback(() => {
    if (!canSendCode) {
      return;
    }
    setCountdown(CODE_COUNTDOWN);
  }, [canSendCode]);

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginBanner}>
        <p className={styles.bannerTag}>School Shop</p>
        <h1>校园商城后台</h1>
        <p className={styles.bannerText}>
          支持用户名或邮箱登录，也可以使用邮箱完成账号注册。
        </p>
      </section>

      <section className={styles.loginCard} aria-label={isLogin ? '登录表单' : '注册表单'}>
        <div className={styles.cardTabs}>
          <button
            className={`${styles.cardTab} ${isLogin ? styles.isActive : ''}`}
            type="button"
            onClick={() => handleModeChange('login')}
          >
            登录
          </button>
          <button
            className={`${styles.cardTab} ${!isLogin ? styles.isActive : ''}`}
            type="button"
            onClick={() => handleModeChange('register')}
          >
            注册
          </button>
        </div>

        <div className={styles.cardHeader}>
          <h2>{isLogin ? '欢迎登录' : '创建账号'}</h2>
          <p>
            {isLogin
              ? '请输入用户名或邮箱和密码进入系统'
              : '请先通过邮箱验证码校验，再完成账号注册'}
          </p>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.formField}>
            <span>{isLogin ? '用户名或邮箱' : '邮箱'}</span>
            <input
              type={isLogin ? 'text' : 'email'}
              name={isLogin ? 'account' : 'email'}
              placeholder={isLogin ? '请输入用户名或邮箱' : '请输入邮箱'}
              value={isLogin ? formData.account : formData.email}
              onChange={handleChange}
            />
          </label>

          {!isLogin && (
            <label className={styles.formField}>
              <span>邮箱验证码</span>
              <div className={styles.formInline}>
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="请输入邮箱验证码"
                  value={formData.verificationCode}
                  onChange={handleChange}
                />
                <button
                  className={styles.formAction}
                  type="button"
                  onClick={handleSendCode}
                  disabled={!canSendCode}
                >
                  {countdown > 0 ? `${countdown}s 后重试` : '发送验证码'}
                </button>
              </div>
            </label>
          )}

          {!isLogin && (
            <label className={styles.formField}>
              <span>用户名</span>
              <input
                type="text"
                name="username"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleChange}
              />
            </label>
          )}

          <label className={styles.formField}>
            <span>密码</span>
            <input
              type="password"
              name="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          {!isLogin && (
            <label className={styles.formField}>
              <span>确认密码</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
          )}

          {isLogin ? (
            <div className={styles.formMeta}>
              <label className={styles.formCheckbox}>
                <input type="checkbox" name="remember" />
                <span>记住我</span>
              </label>
              <a href="/">忘记密码？</a>
            </div>
          ) : (
            <p className={styles.formHint}>
              请输入邮箱并发送验证码，校验通过后才可完成注册。
            </p>
          )}

          <button
            className={styles.formSubmit}
            type="submit"
            disabled={!isLogin && !canRegister}
          >
            {isLogin ? '登录' : '注册'}
          </button>
        </form>
      </section>
    </main>
  );
}