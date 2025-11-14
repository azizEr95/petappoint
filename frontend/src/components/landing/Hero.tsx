import { SearchField } from '../SearchField'
import heroBg from '../../assets/hero-bg.png'

export default function Hero() {
  return (
    <section className="hero-clean">
      <div className="container">
        <div className="hero-content">
          <h1>Tierarzttermine einfach online buchen</h1>
          <p className="hero-subtitle-clean">
            Finden Sie den passenden Tierarzt in Ihrer Nähe und vereinbaren Sie
            direkt einen Termin
          </p>
          <SearchField searchNameBeginn="" searchOrtBeginn="" />
        </div>
      </div>

      <style>{`
        .hero-clean {
          position: relative;
          min-height: 600px;
          overflow: hidden;
          background-image: url(${heroBg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .hero-clean::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(26, 93, 58, 0.85) 0%,
            rgba(125, 216, 159, 0.6) 100%
          );
          z-index: 1;
        }

        .hero-clean .container {
          position: relative;
          z-index: 2;
          min-height: 600px;
          display: flex;
          align-items: center;
        }

        .hero-content {
          max-width: 700px;
          padding: 4rem 0;
          margin: 0 auto;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          color: white;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          font-weight: 700;
        }

        .hero-subtitle-clean {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-clean {
            min-height: 500px;
          }

          .hero-clean .container {
            min-height: 500px;
          }

          .hero-content {
            padding: 2rem 0;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-subtitle-clean {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
