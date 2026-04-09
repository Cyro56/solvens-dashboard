import React from 'react';
import { MolaLogo } from './MolaLogo';
import { Globe, Shield, Book, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';
import { DocsSidebar, DocSection } from './DocsSidebar';

interface DocsLayoutProps {
  children: React.ReactNode;
  activeSection: DocSection;
  onSelect: (section: DocSection) => void;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children, activeSection, onSelect }) => {
  const { t, language, setLanguage } = useTranslation();
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Top Navigation */}
      <header style={{
        height: '80px',
        borderBottom: '1px solid var(--card-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(11, 14, 17, 0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Link href="/">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}>
                <MolaLogo size={62} />
                <span style={{ 
                  fontFamily: 'Outfit', 
                  fontSize: '22px', 
                  marginRight: '20px',
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em'
                }}>
                  {t('common.documentation')}
                </span>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <Link href="/" style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: 'var(--primary)',
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 251, 219, 0.3)',
                backgroundColor: 'rgba(56, 251, 219, 0.05)',
                transition: 'all 0.2s',
                letterSpacing: '0.02em'
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 251, 219, 0.1)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 251, 219, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(56, 251, 219, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t('common.goToApp')}
              </Link>
              
              <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--card-border)' }} />
              
              <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                <Shield size={22} style={{ cursor: 'pointer', transition: 'all 0.2s' }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                
                {/* Language Switcher */}
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      cursor: 'pointer', 
                      transition: 'all 0.2s',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => !showLangMenu && (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    <Globe size={22} />
                    <span style={{ textTransform: 'uppercase' }}>{language}</span>
                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                  </div>
                  
                  {showLangMenu && (
                    <div className="glass animate-fade-in" style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '12px',
                      padding: '8px',
                      width: '140px',
                      zIndex: 200,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                    }}>
                      <LanguageOption label="English" code="en" active={language === 'en'} onClick={() => { setLanguage('en'); setShowLangMenu(false); }} />
                      <LanguageOption label="Português" code="pt" active={language === 'pt'} onClick={() => { setLanguage('pt'); setShowLangMenu(false); }} />
                      <LanguageOption label="Español" code="es" active={language === 'es'} onClick={() => { setLanguage('es'); setShowLangMenu(false); }} />
                      <LanguageOption label="Français" code="fr" active={language === 'fr'} onClick={() => { setLanguage('fr'); setShowLangMenu(false); }} />
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="container" style={{ display: 'flex', maxWidth: '1440px' }}>
        <DocsSidebar activeSection={activeSection} onSelect={onSelect} />
        <main style={{
          flex: 1,
          padding: '40px 40px',
          minWidth: 0 // Prevent flex children from overflowing
        }}>
          {children}

          {/* Footer */}
          <footer style={{
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            paddingBottom: '40px'
          }}>
            <p>© 2026 Solvens Protocol. {t('common.allRightsReserved')}</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>{t('common.privacy')}</span>
              <span>{t('common.terms')}</span>
              <span>{t('common.blog')}</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

const LanguageOption: React.FC<{ label: string; code: string; active: boolean; onClick: () => void }> = ({ label, code, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      width: '100%',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      textAlign: 'left',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      backgroundColor: active ? 'rgba(56, 251, 219, 0.05)' : 'transparent',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    {label}
    {active && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
  </button>
);
