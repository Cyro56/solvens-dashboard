"use client";

import React from 'react';
import { DocsLayout } from '@/components/DocsLayout';
import { DocsCard } from '@/components/DocsCard';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Zap,
  Shield,
  Cpu,
  Coins,
  BookOpen,
  Anchor,
  ArrowRight,
  Layers,
  Lock,
  ShieldCheck,
  HelpCircle,
  HandCoins
} from 'lucide-react';

import { DocSection } from '@/components/DocsSidebar';

const DiagramStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
    @keyframes flow {
      0% { stroke-dashoffset: 20; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 0.5; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    .diagram-node:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 10px 30px rgba(56, 251, 219, 0.15);
      border-color: var(--primary) !important;
    }
  `}} />
);

const DiagramNode = ({ icon, label, sublabel, color = 'var(--primary)', glow = false }: { icon: React.ReactNode, label: string, sublabel?: string, color?: string, glow?: boolean }) => (
  <div
    className="diagram-node"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '24px',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${glow ? color : 'var(--card-border)'}`,
      boxShadow: glow ? `0 0 30px ${color}11` : 'none',
      width: '200px',
      position: 'relative',
      zIndex: 1,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}
  >
    <div style={{
      width: '52px',
      height: '52px',
      borderRadius: '14px',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${color}33`,
      color: color,
      boxShadow: `0 0 15px ${color}22 inset`
    }}>
      {icon}
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>{label}</div>
      {sublabel && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.7 }}>{sublabel}</div>}
    </div>
  </div>
);

const FlowConnector = ({ label, color = 'var(--card-border)' }: { label?: string, color?: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    position: 'relative',
    height: '60px'
  }}>
    <div style={{ position: 'relative', width: '100%', height: '20px' }}>
      <svg width="100%" height="20" style={{ overflow: 'visible' }}>
        <path
          d="M 0 10 L 200 10"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 12"
          style={{ animation: 'flow 1.5s linear infinite' }}
        />
        <circle r="3" fill={color} style={{ animation: 'flow 1.5s linear infinite' }}>
          <animateMotion path="M 0 10 L 200 10" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
    {label && (
      <div style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        backgroundColor: 'rgba(10, 15, 20, 0.8)',
        padding: '2px 8px',
        borderRadius: '4px',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {label}
      </div>
    )}
  </div>
);

export default function DocsPage() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = React.useState<DocSection>('overview');

  const renderDocContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Featured Banner */}
            <section style={{
              backgroundColor: 'rgba(56, 251, 219, 0.05)',
              border: '1px solid rgba(56, 251, 219, 0.2)',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#151a21',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  <Zap size={32} color="var(--primary)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {t('docs.featuredTitle')}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                    {t('docs.featuredDesc')}
                  </p>
                </div>
              </div>

            </section>

            {/* Documentation Content */}
            <section>
              <h1 style={{
                fontSize: '40px',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                fontFamily: 'Outfit'
              }}>
                {t('docsContent.overview.title')}
              </h1>
              <p style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '24px', fontWeight: 500 }}>
                {t('docsContent.overview.subtitle')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {t('docsContent.overview.p1')}
                </p>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {t('docsContent.overview.p2')}
                </p>
              </div>
            </section>

            {/* Protocol Architecture Diagram */}
            <DiagramStyles />
            <section style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, rgba(56, 251, 219, 0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} />

              <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
                {t('docsContent.overview.diagramTitle')}
              </h2>

              <div style={{
                padding: '60px 40px',
                borderRadius: '32px',
                border: '1px solid var(--card-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflowX: 'auto',
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto'
              }}>
                {/* Horizontal Flow Container */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', width: '100%', minWidth: '900px', position: 'relative' }}>

                  {/* Left Column: Tranches */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <DiagramNode
                      icon={<ShieldCheck size={26} />}
                      label="Sellers"
                      sublabel={t('docsContent.overview.sellersSublabel')}
                      color="#38fbdb"
                      glow
                    />
                    <DiagramNode
                      icon={<Zap size={26} />}
                      label="Callers"
                      sublabel={t('docsContent.overview.callersSublabel')}
                      color="#fbcfe8"
                      glow
                    />
                  </div>

                  <FlowConnector label={t('docsContent.overview.investorsLabel')} color="rgba(56, 251, 219, 0.3)" />

                  {/* Hub: Solvens Market */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '-20px',
                      right: '-20px',
                      bottom: '-20px',
                      borderRadius: '50%',
                      border: '1px solid rgba(56, 251, 219, 0.1)',
                      animation: 'pulse 3s ease-in-out infinite'
                    }} />
                    <div style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      border: '2px solid var(--primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      boxShadow: '0 0 50px rgba(56, 251, 219, 0.15), 0 0 20px rgba(56, 251, 219, 0.1) inset',
                      position: 'relative',
                      zIndex: 2,
                      animation: 'float 6s ease-in-out infinite'
                    }}>
                      <BookOpen size={40} color="var(--primary)" />
                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 800, marginTop: '8px', letterSpacing: '0.1em' }}>SOLVENS</div>
                    </div>
                  </div>

                  <FlowConnector label={t('docsContent.overview.borrowerLabel')} color="rgba(255, 255, 255, 0.15)" />

                  {/* Right Column: Borrower */}
                  <DiagramNode
                    icon={<HandCoins size={26} />}
                    label={t('docsContent.overview.borrowerLabel')}
                    sublabel="USDC Liquidity"
                    color="var(--text-primary)"
                  />
                </div>
              </div>
            </section>

            {/* In-depth Analysis Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '16px' }}>{t('docsContent.overview.p3').split(':')[0]}</h3>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {t('docsContent.overview.p3').split(':')[1]}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '18px' }}>{t('docsContent.overview.p4').split(':')[0]}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {t('docsContent.overview.p4').split(':')[1]}
                  </p>
                </div>
                <div className="glass" style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '18px' }}>{t('docsContent.overview.p5').split(':')[0]}</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {t('docsContent.overview.p5').split(':')[1]}
                  </p>
                </div>
              </div>
            </section>
          </div>
        );

      case 'solvens101':
      case 'loans':
      case 'markets':
      case 'callersSellers':
      case 'collateral':
      case 'audits':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}>
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                {activeSection === 'solvens101' && <HelpCircle size={24} color="var(--primary)" />}
                {activeSection === 'loans' && <HandCoins size={24} color="var(--primary)" />}
                {activeSection === 'markets' && <Layers size={24} color="var(--primary)" />}
                {activeSection === 'callersSellers' && <Zap size={24} color="var(--primary)" />}
                {activeSection === 'collateral' && <Lock size={24} color="var(--primary)" />}
                {activeSection === 'audits' && <ShieldCheck size={24} color="var(--primary)" />}

                <h1 style={{
                  fontSize: '36px',
                  color: 'var(--text-primary)',
                  fontFamily: 'Outfit',
                  margin: 0
                }}>
                  {t(`docsContent.${activeSection}.title`)}
                </h1>
              </div>
              <p style={{ fontSize: '18px', color: 'var(--primary)', marginBottom: '32px', fontWeight: 500 }}>
                {t(`docsContent.${activeSection}.subtitle`)}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {t(`docsContent.${activeSection}.p1`)}
                </p>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                  {t(`docsContent.${activeSection}.p2`)}
                </p>
                {t(`docsContent.${activeSection}.p3`) && t(`docsContent.${activeSection}.p3`) !== `docsContent.${activeSection}.p3` && (
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--primary)',
                    lineHeight: '1.6',
                    padding: '16px',
                    backgroundColor: 'rgba(56, 251, 219, 0.05)',
                    borderLeft: '4px solid var(--primary)',
                    marginTop: '12px',
                    fontStyle: 'italic'
                  }}>
                    {t(`docsContent.${activeSection}.p3`)}
                  </p>
                )}
                {t(`docsContent.${activeSection}.p4`) && t(`docsContent.${activeSection}.p4`) !== `docsContent.${activeSection}.p4` && (
                  <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    {t(`docsContent.${activeSection}.p4`)}
                  </p>
                )}
              </div>
            </section>

            <section style={{ marginTop: '40px', borderTop: '1px solid var(--card-border)', paddingTop: '40px' }}>
              <button
                onClick={() => setActiveSection('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← {t('docs.nextStepsTitle')}
              </button>
            </section>
          </div>
        );

      default:
        return <div>Section not found.</div>;
    }
  };

  return (
    <DocsLayout activeSection={activeSection} onSelect={setActiveSection}>
      {renderDocContent()}

    </DocsLayout>
  );
}

