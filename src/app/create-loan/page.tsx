"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';
import { useWeb3 } from '@/hooks/useWeb3';
import { web3Manager } from '@/services/web3Manager';
import { ArrowLeft, HandCoins, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateLoanPage() {
  const { t } = useTranslation();
  const { switchToMarket } = useWeb3();
  
  // Form State
  const [formData, setFormData] = useState({
    amount: '', // Formatted display value
    apr: '',
    collateral: '' // Formatted display value
  });
  
  // Raw numeric values for calculations
  const [rawValues, setRawValues] = useState({
    amount: 0,
    collateral: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleFixNetwork = async () => {
    try {
      await switchToMarket('amoy');
    } catch (e: any) {
      setError('Falha ao configurar rede: ' + e.message);
    }
  };

  // Constants
  const ADMIN_FEE_PERCENT = 0.03; // 3%

  // Helpers
  const formatCurrency = (val: string) => {
    const numericStr = val.replace(/\D/g, '');
    if (!numericStr) return '';
    const number = parseInt(numericStr, 10);
    return new Intl.NumberFormat('en-US').format(number);
  };

  const parseRaw = (val: string) => {
    return parseInt(val.replace(/\D/g, ''), 10) || 0;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseRaw(e.target.value);
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, amount: formatted });
    setRawValues({ ...rawValues, amount: rawValue });
  };

  const handleCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseRaw(e.target.value);
    const formatted = formatCurrency(e.target.value);
    setFormData({ ...formData, collateral: formatted });
    setRawValues({ ...rawValues, collateral: rawValue });
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculateAdminFee = () => {
    const amount = rawValues.amount;
    return (amount * ADMIN_FEE_PERCENT).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const hash = await web3Manager.deployLoan(
        rawValues.amount.toString(),
        formData.apr,
        30, 
        rawValues.collateral.toString()
      );
      
      setTxHash(hash);
      setIsSuccess(true);
      
      // Sinaliza ao dashboard para recarregar os logs do contrato
      window.dispatchEvent(new CustomEvent('solvens:loanCreated'));
    } catch (err: any) {
      setError(err.message || 'Falha ao criar empréstimo na rede.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 2rem' }}>
          <div className="glass animate-fade-in" style={{ 
            maxWidth: '500px', 
            width: '100%', 
            padding: '48px', 
            textAlign: 'center',
            border: '1px solid var(--primary)',
            background: 'radial-gradient(circle at top right, rgba(56, 251, 219, 0.05), transparent)'
          }}>
            <div style={{ color: 'var(--primary)', marginBottom: '24px' }}>
              <CheckCircle2 size={80} style={{ margin: '0 auto' }} />
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px', fontFamily: 'Outfit' }}>
              {t('createLoan.successMsg')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              {t('docsContent.loans.p3')}
            </p>
            {txHash && (
              <div style={{ 
                padding: '12px', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px', 
                marginBottom: '32px',
                fontSize: '12px',
                wordBreak: 'break-all',
                color: 'var(--primary)',
                fontFamily: 'monospace'
              }}>
                TX: {txHash}
              </div>
            )}
            <Link href="/">
              <button style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--primary)',
                color: '#000',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                {t('common.dashboard')}
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div className="container" style={{ padding: '48px 2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Back Link */}
        <div style={{ width: '100%', maxWidth: '640px', marginBottom: '32px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ArrowLeft size={16} />
            {t('common.dashboard')}
          </Link>
        </div>

        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(56, 251, 219, 0.1)', color: 'var(--primary)', marginBottom: '16px' }}>
            <HandCoins size={32} />
          </div>
          <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'Outfit' }}>
            {t('createLoan.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            {t('createLoan.subtitle')}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass" style={{ 
          width: '100%', 
          maxWidth: '640px', 
          padding: '40px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('createLoan.amountLabel')}
            </label>
            <input 
              required
              type="text"
              placeholder="0"
              value={formData.amount}
              onChange={handleAmountChange}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('createLoan.annualInterestRateLabel')}
            </label>
            <input 
              required
              type="number"
              placeholder="12"
              value={formData.apr}
              onChange={(e) => setFormData({...formData, apr: e.target.value})}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('createLoan.collateralLabel')}
            </label>
            <input 
              required
              type="text"
              placeholder="0"
              value={formData.collateral}
              onChange={handleCollateralChange}
              style={inputStyle}
            />
          </div>

          {/* Proposal Analysis */}
          {(rawValues.amount > 0) && (
            <div className="glass" style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h4 
                    title={t('createLoan.qualityTooltip')}
                    style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'help' }}
                  >
                    Análise da Proposta
                    <Info size={14} style={{ opacity: 0.5 }} />
                  </h4>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                    {(() => {
                      const colPercentDecimal = (rawValues.collateral / rawValues.amount);
                      const aprDecimal = (parseFloat(formData.apr) || 0) / 100;
                      const qScore = aprDecimal * colPercentDecimal;
                      
                      let color = '#ff4d4d'; // Red
                      let label = 'Baixa Qualidade / Risco Alto';
                      
                      // New thresholds for multiplicative Q (Interest * Collateral %)
                      // High Quality: > 0.05 (ex: 12.5% * 40%)
                      // Moderate: 0.02 - 0.05
                      // Low: < 0.02
                      if (qScore >= 0.05) {
                        color = 'var(--success)';
                        label = 'Alta Qualidade / Conservador';
                      } else if (qScore >= 0.02) {
                        color = 'var(--warning)';
                        label = 'Qualidade Média / Moderado';
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span style={{ color }}>Q = {qScore.toFixed(3)}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                              Score de Qualidade
                            </span>
                          </div>
                          <span style={{ fontSize: '13px', color, fontWeight: 600 }}>{label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Cobertura de Colateral
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {((rawValues.collateral / rawValues.amount) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min((rawValues.collateral / rawValues.amount) * 100, 100)}%`, 
                  height: '100%', 
                  backgroundColor: (() => {
                    const colPercentDecimal = (rawValues.collateral / rawValues.amount);
                    const aprDecimal = (parseFloat(formData.apr) || 0) / 100;
                    const qScore = aprDecimal * colPercentDecimal;
                    if (qScore >= 0.05) return 'var(--primary)';
                    if (qScore >= 0.02) return 'var(--warning)';
                    return '#ff4d4d';
                  })(),
                  boxShadow: '0 0 10px currentColor',
                  transition: 'all 0.4s ease'
                }} />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div style={{ 
            marginTop: '0px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid var(--card-border)', 
            borderRadius: '12px', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{t('createLoan.adminFeeLabel')}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>
                {isMounted ? calculateAdminFee() : '0.00'} USDT
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', color: 'var(--primary)', opacity: 0.8 }}>
              <Info size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                {t('docsContent.loans.p4')}
              </p>
            </div>
          </div>

          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: 'rgba(255, 82, 82, 0.1)', 
              border: '1px solid rgba(255, 82, 82, 0.2)', 
              borderRadius: '12px',
              color: '#ff5252',
              fontSize: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} />
                {error}
              </div>
                <button
                  onClick={handleFixNetwork}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#ff5252',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '4px',
                    boxShadow: '0 4px 12px rgba(255, 82, 82, 0.3)'
                  }}
                >
                  Corrigir Configuração de Rede (MetaMask)
                </button>
            </div>
          )}

          <button 
            disabled={isSubmitting}
            style={{
              marginTop: '12px',
              padding: '16px',
              backgroundColor: 'var(--primary)',
              color: '#000',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              cursor: isSubmitting ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              border: 'none',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.filter = 'brightness(1)')}
          >
            {isSubmitting ? t('common.connecting') : t('createLoan.submitBtn')}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--card-border)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'var(--text-primary)',
  fontSize: '16px',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
};
