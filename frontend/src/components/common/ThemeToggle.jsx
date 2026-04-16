import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: 40,
        height: 40,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text)',
        position: 'relative',
        overflow: 'hidden'
      }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div style={{
        transform: theme === 'dark' ? 'translateY(0)' : 'translateY(40px)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'absolute'
      }}>
        🌙
      </div>
      <div style={{
        transform: theme === 'dark' ? 'translateY(-40px)' : 'translateY(0)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'absolute'
      }}>
        ☀️
      </div>
    </button>
  )
}
