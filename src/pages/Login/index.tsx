import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';
import { setToken } from '@/utils';
import type { AuthMode } from '@/types';
import type {
  LoginParams,
  RegisterParams,
  SendVerificationCodeParams,
} from '@/services/auth/dto';
import styles from './Login.module.css';

const INITIAL_LOGIN_FORM = {
  account: '',
  password: '',
  remember: false,
};

const INITIAL_REGISTER_FORM = {
  email: '',
  code: '',
  username: '',
  password: '',
  confirmPassword: '',
};

const CODE_COUNTDOWN = 60;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => EMAIL_REGEX.test(email);
const isValidPasswordLength = (password: string) =>
  password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM);

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

  const isLogin = mode === 'login';
  const canSendCode = !isLogin && Boolean(registerForm.email.trim()) && countdown === 0;

  const handleLoginChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  }, []);

  const handleRegisterChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError('');
  }, []);

  const handleModeChange = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setCountdown(0);
    setError('');
  }, []);

  const handleSendCode = useCallback(async () => {
    const email = registerForm.email.trim();

    if (!email) {
      setError('请输入邮箱后再发送验证码');
      return;
    }

    if (!isValidEmail(email)) {
      setError('邮箱格式不正确');
      return;
    }

    if (!canSendCode) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params: SendVerificationCodeParams = { email };
      await authService.sendVerificationCode(params);
      setCountdown(CODE_COUNTDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
    } finally {
      setLoading(false);
    }
  }, [canSendCode, registerForm.email]);

  const handleLoginSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const account = loginForm.account.trim();
      const password = loginForm.password;

      if (!account || !password) {
        setError('请输入用户名或邮箱和密码');
        return;
      }

      if (account.includes('@') && !isValidEmail(account)) {
        setError('邮箱格式不正确');
        return;
      }

      if (!isValidPasswordLength(password)) {
        setError(`密码长度需为 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 位`);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const params: LoginParams = {
          account,
          password,
          remember: loginForm.remember,
        };
        const response = await authService.login(params);
        if (response.token) {
          setToken(response.token);
        }
        console.log('登录成功:', response);
        navigate('/profile');
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录失败');
      } finally {
        setLoading(false);
      }
    },
    [loginForm, navigate]
  );

  const handleRegisterSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      const email = registerForm.email.trim();
      const username = registerForm.username.trim();
      const code = registerForm.code.trim();
      const password = registerForm.password;

      if (!email) {
        setError('请输入邮箱');
        return;
      }

      if (!isValidEmail(email)) {
        setError('邮箱格式不正确');
        return;
      }

      if (!code) {
        setError('请输入邮箱验证码');
        return;
      }

      if (!username) {
        setError('请输入用户名');
        return;
      }

      if (!isValidPasswordLength(password)) {
        setError(`密码长度需为 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 位`);
        return;
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const params: RegisterParams = {
          email,
          code,
          username,
          password,
        };
        const response = await authService.register(params);
        console.log('注册成功:', response);
        navigate('/profile');
      } catch (err) {
        setError(err instanceof Error ? err.message : '注册失败');
      } finally {
        setLoading(false);
      }
    },
    [registerForm, navigate]
  );

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

        {error && <div className={styles.errorMessage}>{error}</div>}

        {isLogin ? (
          <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
            <label className={styles.formField}>
              <span>用户名或邮箱</span>
              <input
                type="text"
                name="account"
                placeholder="请输入用户名或邮箱"
                value={loginForm.account}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </label>

            <label className={styles.formField}>
              <span>密码</span>
              <input
                type="password"
                name="password"
                placeholder="请输入密码"
                value={loginForm.password}
                onChange={handleLoginChange}
                disabled={loading}
              />
            </label>

            <div className={styles.formMeta}>
              <label className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={loginForm.remember}
                  onChange={handleLoginChange}
                  disabled={loading}
                />
                <span>记住我</span>
              </label>
              <a href="/">忘记密码？</a>
            </div>

            <button
              className={styles.formSubmit}
              type="submit"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        ) : (
          <form className={styles.loginForm} onSubmit={handleRegisterSubmit}>
            <label className={styles.formField}>
              <span>邮箱</span>
              <input
                type="email"
                name="email"
                placeholder="请输入邮箱"
                value={registerForm.email}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </label>

            <label className={styles.formField}>
              <span>邮箱验证码</span>
              <div className={styles.formInline}>
                <input
                  type="text"
                  name="code"
                  placeholder="请输入邮箱验证码"
                  value={registerForm.code}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <button
                  className={styles.formAction}
                  type="button"
                  onClick={handleSendCode}
                  disabled={!canSendCode || loading}
                >
                  {countdown > 0 ? `${countdown}s 后重试` : '发送验证码'}
                </button>
              </div>
            </label>

            <label className={styles.formField}>
              <span>用户名</span>
              <input
                type="text"
                name="username"
                placeholder="请输入用户名"
                value={registerForm.username}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </label>

            <label className={styles.formField}>
              <span>密码</span>
              <input
                type="password"
                name="password"
                placeholder="请输入密码"
                value={registerForm.password}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </label>

            <label className={styles.formField}>
              <span>确认密码</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="请再次输入密码"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                disabled={loading}
              />
            </label>

            <p className={styles.formHint}>
              请输入邮箱并发送验证码，校验通过后才可完成注册。
            </p>

            <button
              className={styles.formSubmit}
              type="submit"
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}