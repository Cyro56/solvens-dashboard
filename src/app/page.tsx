"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { StatsHeader } from '@/components/StatsHeader';
import { MarketTable } from '@/components/MarketTable';
import { Info, Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className="container" style={{ padding: '48px 2rem', flex: 1 }}>
        {/* Welcome Section */}
        <section style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ 
              backgroundColor: 'rgba(56, 251, 219, 0.1)', 
              color: 'var(--primary)', 
              fontSize: '12px', 
              fontWeight: 600, 
              padding: '4px 12px', 
              borderRadius: '12px',
              border: '1px solid rgba(56, 251, 219, 0.2)'
            }}>
              {t('dashboard.v1')}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {t('dashboard.protocolDesc')}
            </span>
          </div>
          
          <h1 style={{ fontSize: '48px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.1 }}>
            {t('dashboard.heroTitleLine1')} <br />
            <span style={{ 
              backgroundImage: 'linear-gradient(90deg, var(--primary), #b6509e)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              {t('dashboard.heroTitleLine2')}
            </span>
          </h1>
          
          <p style={{ maxWidth: '600px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '16px', marginBottom: '32px' }}>
            {t('dashboard.heroSubtitle')}
          </p>

          <Link href="/create-loan">
            <button style={{
              padding: '14px 28px',
              backgroundColor: 'var(--primary)',
              color: '#000',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(56, 251, 219, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Plus size={20} />
              {t('common.requestLoan')}
            </button>
          </Link>
        </section>

        {/* Protocol Stats */}
        <StatsHeader />

        {/* Markets Section */}
        <section id="markets" style={{ marginBottom: '64px' }}>
          <MarketTable />
        </section>
        
        {/* Help Banner */}
        <div className="glass" style={{ 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          marginBottom: '64px',
          border: '1px solid rgba(182, 80, 158, 0.2)',
          backgroundImage: 'radial-gradient(circle at top right, rgba(182, 80, 158, 0.05), transparent)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(182, 80, 158, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <Info size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>{t('dashboard.helpBannerTitle')}</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {t('dashboard.helpBannerDesc')}
            </p>
          </div>
          <Link href="/docs">
            <button style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {t('dashboard.readDocsBtn')}
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        padding: '32px 0', 
        borderTop: '1px solid var(--card-border)', 
        backgroundColor: 'rgba(0,0,0,0.2)' 
      }}>
        <div className="container flex-between">
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © 2026 Solvens Protocol. {t('dashboard.footerTagline')}
          </div>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <a href="#">{t('common.terms')}</a>
            <a href="#">{t('common.privacy')}</a>
            <a href="#">{t('sidebar.security')}</a>
            <a href="#">Github</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
