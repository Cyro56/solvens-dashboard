"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { StatsHeader } from '@/components/StatsHeader';
import { MarketTable } from '@/components/MarketTable';
import { Info } from 'lucide-react';

export default function Home() {
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
              v1.0.0
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Protocolo de Crédito Descentralizado
            </span>
          </div>
          
          <h1 style={{ fontSize: '48px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.1 }}>
            O Futuro do Crédito é <br />
            <span style={{ 
              backgroundImage: 'linear-gradient(90deg, var(--primary), #b6509e)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Matematicamente Garantido.
            </span>
          </h1>
          
          <p style={{ maxWidth: '600px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '16px' }}>
            Solvens transforma o risco de crédito em um ativo negociável. 
            Forneça capital como <strong>Caller</strong> ou especule contra a inadimplência como <strong>Seller</strong>.
          </p>
        </section>

        {/* Protocol Stats */}
        <StatsHeader />

        {/* Markets Section */}
        <section style={{ marginBottom: '64px' }}>
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
            <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', marginBottom: '4px' }}>Como funciona o Solvens?</h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Callers buscam juros fixos, enquanto Sellers apostam no calote para ganhar prêmios acelerados. 
              O colateral depositado pelo tomador serve como um &quot;Airbag&quot; para os Callers em caso de falha.
            </p>
          </div>
          <button style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Ler Documentação
          </button>
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
            © 2026 Solvens Protocol. Code is Credit.
          </div>
          <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Segurança</a>
            <a href="#">Github</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
