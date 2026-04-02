import { useEffect, useState } from 'react'

function LoginPage() {
  const [mode, setMode] = useState('login')
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    account: '',
    email: '',
    verificationCode: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (countdown === 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [countdown])

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const isLogin = mode === 'login'
  const canSendCode = !isLogin && formData.email.trim() && countdown === 0
  const canRegister = !isLogin && formData.verificationCode.trim()

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setCountdown(0)
  }

  const handleSendCode = () => {
    if (!canSendCode) {
      return
    }

    setCountdown(60)
  }

  return (
    <main className="login-page">
      <section className="login-banner">
        <p className="login-banner__tag">School Shop</p>
        <h1>校园商城后台</h1>
        <p className="login-banner__text">
          支持用户名或邮箱登录，也可以使用邮箱完成账号注册。
        </p>
      </section>

      <section className="login-card" aria-label={isLogin ? '登录表单' : '注册表单'}>
        <div className="login-card__tabs">
          <button
            className={`login-card__tab ${isLogin ? 'is-active' : ''}`}
            type="button"
            onClick={() => handleModeChange('login')}
          >
            登录
          </button>
          <button
            className={`login-card__tab ${!isLogin ? 'is-active' : ''}`}
            type="button"
            onClick={() => handleModeChange('register')}
          >
            注册
          </button>
        </div>

        <div className="login-card__header">
          <h2>{isLogin ? '欢迎登录' : '创建账号'}</h2>
          <p>
            {isLogin
              ? '请输入用户名或邮箱和密码进入系统'
              : '请先通过邮箱验证码校验，再完成账号注册'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__field">
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
            <label className="login-form__field">
              <span>邮箱验证码</span>
              <div className="login-form__inline">
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="请输入邮箱验证码"
                  value={formData.verificationCode}
                  onChange={handleChange}
                />
                <button
                  className="login-form__action"
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
            <label className="login-form__field">
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

          <label className="login-form__field">
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
            <label className="login-form__field">
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
            <div className="login-form__meta">
              <label className="login-form__checkbox">
                <input type="checkbox" name="remember" />
                <span>记住我</span>
              </label>
              <a href="/">忘记密码？</a>
            </div>
          ) : (
            <p className="login-form__hint">
              请输入邮箱并发送验证码，校验通过后才可完成注册。
            </p>
          )}

          <button
            className="login-form__submit"
            type="submit"
            disabled={!isLogin && !canRegister}
          >
            {isLogin ? '登录' : '注册'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
