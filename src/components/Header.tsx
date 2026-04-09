"use client";

import React from 'react';
import { MolaLogo } from './MolaLogo';
import { Wallet, Bell, Settings, ShieldCheck, Droplets, Plus, Copy, Check, Book, Globe, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3 } from '@/hooks/useWeb3';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '@/i18n/translations';

export const Header: React.FC = () => {
  const { account, balance, usdcBalance, isTestnet, isConnecting, connect, toggleMarket, mintUSDC, shortenAddress, copyToClipboard } = useWeb3();
  const { t, language, setLanguage } = useTranslation();
  const pathname = usePathname();
  const [copied, setCopied] = React.useState(false);
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (account) {
      copyToClipboard(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      height: '72px',
      backgroundColor: 'var(--header-bg)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--card-border)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <MolaLogo size={80} />

          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center', marginRight: 10 }}>
            <Link href="/">
              <NavItem label={t('common.dashboard')} active={pathname === '/'} />
            </Link>
            <Link href="/#markets" scroll={true}>
              <NavItem label={t('common.markets')} active={pathname === '/#markets'} />
            </Link>
            <Link href="/create-loan">
              <NavItem label={t('common.requestLoan')} active={pathname === '/create-loan'} />
            </Link>
            <Link href="/docs">
              <NavItem label={t('common.documentation')} active={pathname.startsWith('/docs')} />
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Dual Market Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid var(--card-border)',
            marginRight: '12px'
          }}>
            <MarketToggle
              label={t('common.simulated')}
              active={isTestnet}
              onClick={() => !isTestnet && toggleMarket()}
              color="var(--warning)"
            />
            <MarketToggle
              label={t('common.real')}
              active={!isTestnet}
              onClick={() => isTestnet && toggleMarket()}
              color="var(--success)"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', alignItems: 'center' }}>
            {/* Language Switcher */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: showLangMenu ? 'rgba(56, 251, 219, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: showLangMenu ? 'var(--primary)' : 'var(--text-secondary)',
                  border: '1px solid var(--card-border)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!showLangMenu) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showLangMenu) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Globe size={20} />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  fontSize: '8px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}>
                  {language}
                </div>
              </button>

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

          <button
            onClick={account ? undefined : connect}
            style={{
              padding: '10px 14px',
              backgroundColor: account ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
              color: account ? 'var(--text-primary)' : '#000',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              border: account ? '1px solid var(--card-border)' : 'none',
              boxShadow: account ? 'none' : '0 0 15px rgba(56, 251, 219, 0.3)',
              cursor: isConnecting ? 'wait' : 'pointer'
            }}
            onMouseEnter={(e) => !account && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => !account && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {account ? (
              <>
                <ShieldCheck size={18} color="var(--primary)" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {usdcBalance} USDC
                    </span>
                    {isTestnet && (
                      <button
                        onClick={(e) => { e.stopPropagation(); mintUSDC(); }}
                        title={t('common.faucetUSDC')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          background: 'rgba(56, 251, 219, 0.1)',
                          borderRadius: '4px',
                          padding: '2px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>

                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 400 }}>
                      {balance} MATIC
                    </span>
                    {isTestnet && (
                      <a
                        href="https://faucet.polygon.technology/"
                        target="_blank"
                        rel="noreferrer"
                        title={t('common.faucetMATIC')}
                        style={{ color: 'var(--text-muted)', display: 'flex' }}
                      >
                        <Droplets size={12} />
                      </a>
                    )}
                  </div>

                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>

                  <div
                    onClick={handleCopy}
                    className="address-copy-container"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    title={t('common.copyAddress')}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>
                      {shortenAddress(account)}
                    </span>
                    {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} style={{ opacity: 0.5 }} />}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Wallet size={18} />
                {isConnecting ? t('common.connecting') : t('common.connectWallet')}
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const MarketToggle: React.FC<{ label: string; active: boolean; onClick: () => void; color: string }> = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: 600,
      transition: 'all 0.2s',
      backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
      color: active ? color : 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }}
  >
    <div style={{
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: active ? color : 'transparent'
    }} />
    {label}
  </button>
);

const NavItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <span style={{
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: 600,
    fontSize: '15px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    padding: '24px 0',
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    textShadow: active ? '0 0 15px rgba(56, 251, 219, 0.4)' : 'none',
  }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.borderBottomColor = 'rgba(56, 251, 219, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.borderBottomColor = 'transparent';
      }
    }}
  >
    {label}
    {active && (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '0',
        right: '0',
        height: '2px',
        backgroundColor: 'var(--primary)',
        boxShadow: '0 0 12px var(--primary), 0 0 4px var(--primary)',
        borderRadius: '2px'
      }} />
    )}
  </span>
);

const HeaderIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <button style={{
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--card-border)',
    transition: 'all 0.2s'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
  </button>
);

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
