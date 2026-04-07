"use client";

import React from 'react';
import { MolaLogo } from './MolaLogo';
import { Wallet, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <MolaLogo size={80} />

          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <NavItem label="Painel" active />
            <NavItem label="Mercados" />
            <NavItem label="Governança" />
            <NavItem label="Solvência" />
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 20 }}>
          <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}>
            <HeaderIcon icon={<Bell size={20} />} />
            <HeaderIcon icon={<Settings size={20} />} />
          </div>

          <button style={{
            padding: '10px 20px',
            backgroundColor: 'var(--primary)',
            color: '#000',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 15px rgba(56, 251, 219, 0.3)'
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Wallet size={18} />
            Conectar Carteira
          </button>
        </div>
      </div>
    </header>
  );
};

const NavItem: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <a href="#" style={{
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: 500,
    fontSize: '15px',
    transition: 'color 0.2s',
    borderBottom: active ? '2px solid var(--primary)' : 'none',
    padding: '24px 0'
  }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.color = 'var(--text-primary)')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.color = 'var(--text-secondary)')}
  >
    {label}
  </a>
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
    {icon}
  </button>
);
