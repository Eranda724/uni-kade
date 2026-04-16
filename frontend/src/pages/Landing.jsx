import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: '🍱',
    title: 'Diverse & sparkling food',
    desc: 'Fresh ingredients, great taste — from your campus canteen.',
    bg: '#fff3e0',
  },
  {
    icon: '🛵',
    title: 'Free shipping on all orders',
    desc: 'Fast delivery on the primary order across campus.',
    bg: '#e8f5e9',
  },
  {
    icon: '🏪',
    title: '+20 Restaurants',
    desc: 'Find your favorite food and have it delivered in record time.',
    bg: '#fce4ec',
  },
]

const steps = [
  {
    n: '1',
    title: 'Create your account',
    desc: 'Register as a seller and set up your campus shop in minutes.',
  },
  {
    n: '2',
    title: 'Add your products',
    desc: 'List food items, stationery or equipment with photos and prices.',
  },
  {
    n: '3',
    title: 'Start receiving orders',
    desc: 'Students order via the app — you get real-time notifications.',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: 'var(--bg-card)' }}>
      {/* NAVBAR */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 48px',
          borderBottom: '1px solid var(--border-light)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-card)',
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 20,
            fontWeight: 800,
            color: 'var(--secondary)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🍴
          </div>
          UNI<span style={{ color: 'var(--primary)' }}>-KADE</span>
        </div>
        <div
          style={{ display: 'flex', gap: 32, fontSize: 14, color: '#6B7280' }}
        >
          {['Home', 'Features', 'How it works', 'Contact'].map((l) => (
            <a
              key={l}
              style={{
                textDecoration: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          Get Started →
        </button>
      </nav>

      {/* HERO */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 48px',
          background: 'var(--bg-hover)',
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--primary)',
              }}
            />
            Now at your university campus
          </div>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'var(--text)',
              marginBottom: 16,
            }}
          >
            Diverse &amp; <span style={{ color: 'var(--primary)' }}>sparkling</span>
            <br />
            food, delivered
            <br />
            on campus
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 440,
            }}
          >
            We use the best local ingredients to create fresh and delicious food
            and drinks — order from your campus canteen in seconds.
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              Get Started
            </button>
            <button
              style={{
                background: 'transparent',
                color: 'var(--secondary)',
                border: '2px solid var(--secondary)',
                padding: '13px 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Poppins',
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Hero card — mirrors onboarding screen 1 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 20,
              padding: '40px 32px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              maxWidth: 280,
              width: '100%',
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 16 }}>🥗</div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 8,
              }}
            >
              Diverse &amp; sparkling food.
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Fresh ingredients, great taste, delivered on campus
            </p>
            {/* Dots like onboarding */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                justifyContent: 'center',
                marginTop: 16,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--primary)',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--border)',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--border)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — mirrors onboarding 1, 2, 3 */}
      <section style={{ padding: '80px 48px' }}>
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          Why UNI-KADE?
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 48,
          }}
        >
          Everything you need on campus
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: 'var(--bg-hover)',
                borderRadius: 20,
                padding: '36px 28px',
                textAlign: 'center',
                border: '1.5px solid var(--border-light)',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: f.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  margin: '0 auto 20px',
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
        }}
      >
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          Simple Process
        </p>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 48,
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {steps.map((s) => (
            <div key={s.n} style={{ textAlign: 'center', color: '#fff' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                {s.n}
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                {s.title}
              </h4>
              <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '80px 48px',
          textAlign: 'center',
          background: '#fff9f0',
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: 'var(--text)',
            marginBottom: 14,
          }}
        >
          Ready to start selling on campus?
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 36 }}>
          Join UNI-KADE and reach hundreds of students at your university today.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '16px 40px',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          Get Started →
        </button>
      </section>
    </div>
  )
}
