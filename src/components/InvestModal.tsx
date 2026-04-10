"use client";

import React, { useState, useMemo } from 'react';
import { X, TrendingUp, Activity, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { notificationService } from '@/services/notificationService';
import { web3Manager, VaultState } from '@/services/web3Manager';
import Web3 from 'web3';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: {
    tokenName: string;
    callerAPR: string;
    sellerPrize: string;
    contractAddress?: string;
  };
}

export const InvestModal: React.FC<InvestModalProps> = ({ isOpen, onClose, loan }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>('');
  const [position, setPosition] = useState<'CALLER' | 'SELLER'>('CALLER');
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultState, setVaultState] = useState<VaultState | null>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Sincroniza o estado do contrato (Logs + Params) ao abrir o modal
  React.useEffect(() => {
    async function loadState() {
      if (isOpen && loan.contractAddress) {
        setIsLoadingState(true);
        try {
          const vs = await web3Manager.getVaultState(loan.contractAddress);
          setVaultState(vs);
        } catch (e) {
          console.error("Erro ao sincronizar estado do cofre:", e);
        } finally {
          setIsLoadingState(false);
        }
      }
    }
    loadState();
  }, [isOpen, loan.contractAddress]);

  const expectedReturn = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0 || !vaultState) return '0.00';

    // Determina a unidade de decimais baseada na rede via web3Manager
    const chainId = (web3Manager.getState().chainId || '').toLowerCase();
    const isLocalOrAmoy = chainId === '0x7a69' || 
                          chainId === '0x13882' ||
                          chainId === '31337' ||
                          chainId === '80002';
    const unit = isLocalOrAmoy ? 'ether' : 'mwei';

    // Converte valores do contrato para números amigáveis
    const D = parseFloat(Web3.utils.fromWei(vaultState.targetAmount, unit));
    const K = parseFloat(Web3.utils.fromWei(vaultState.collateralAmount, unit));
    const C = parseFloat(Web3.utils.fromWei(vaultState.totalCallerInv, unit));
    const S = parseFloat(Web3.utils.fromWei(vaultState.totalSellerInv, unit));
    const APR = vaultState.apr / 10000; // basis points (ex: 1200 = 0.12)

    if (position === 'CALLER') {
      // Regra Caller (SIM): Lucro vindo dos juros pagos pelo tomador
      const totalCallerProfit = D * APR;
      const newTotalCaller = C + numAmount;
      const userShare = numAmount / (newTotalCaller || 1);
      return (userShare * totalCallerProfit).toFixed(2);
    } else {
      // Regra Seller (NO): (Colateral + |Caller - Dívida|) - Dívida
      // Mostramos o lucro líquido proporcional ao investimento do usuário
      const totalSellerProfit = (K + Math.abs(C - D)) - D;
      const newTotalSeller = S + numAmount;
      const userShare = numAmount / (newTotalSeller || 1);
      return (userShare * totalSellerProfit).toFixed(2);
    }
  }, [amount, position, vaultState]);

  const totalAmount = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) return '0.00';
    return (numAmount + parseFloat(expectedReturn)).toFixed(2);
  }, [amount, expectedReturn]);

  const sellerYieldDisplay = useMemo(() => {
    if (!vaultState) return loan.sellerPrize;
    
    const chainId = (web3Manager.getState().chainId || '').toLowerCase();
    const isLocalOrAmoy = chainId === '0x7a69' || chainId === '0x13882' || chainId === '31337' || chainId === '80002';
    const unit = isLocalOrAmoy ? 'ether' : 'mwei';

    const D = parseFloat(Web3.utils.fromWei(vaultState.targetAmount, unit));
    const K = parseFloat(Web3.utils.fromWei(vaultState.collateralAmount, unit));
    const C = parseFloat(Web3.utils.fromWei(vaultState.totalCallerInv, unit));
    
    const yieldVal = (((K + Math.abs(C - D)) - D) / (D || 1)) * 100;
    return yieldVal.toFixed(2) + '%';
  }, [vaultState, loan.sellerPrize]);

  const handleInvest = () => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (!amount || numAmount <= 0) {
      notificationService.error('Please enter a valid amount');
      return;
    }
    // Simulate investment
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setAmount('');
      notificationService.success(t('investModal.successMsg'));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div 
        className="glass" 
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Loading Overlay */}
        {isLoadingState && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px'
          }}>
            <Loader2 className="animate-spin" color="var(--primary)" size={32} />
          </div>
        )}

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(56, 251, 219, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <CheckCircle2 size={48} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>{t('investModal.successMsg')}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Processing your transaction on Polygon...</p>
          </div>
        ) : (
          <>
            <button 
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                zIndex: 11,
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>{t('investModal.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
              {loan.tokenName} • {loan.callerAPR} APR
            </p>

            {/* Position Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                {t('investModal.positionLabel')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <PositionCard 
                  active={position === 'CALLER'} 
                  onClick={() => setPosition('CALLER')}
                  label="Caller (YES)"
                  apr={loan.callerAPR}
                  icon={<TrendingUp size={18} />}
                  color="var(--primary)"
                />
                <PositionCard 
                  active={position === 'SELLER'} 
                  onClick={() => setPosition('SELLER')}
                  label="Seller (NO)"
                  apr={sellerYieldDisplay}
                  icon={<Activity size={18} />}
                  color="var(--secondary)"
                />
              </div>
            </div>

            {/* Amount Input */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                {t('investModal.amountLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={amount}
                  onChange={(e) => {
                    // Currency mask: only numbers and one dot/comma
                    let val = e.target.value.replace(/[^0-9.,]/g, '');
                    // Normalize decimal separator to dot
                    val = val.replace(',', '.');
                    // Prevent multiple dots
                    const parts = val.split('.');
                    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                    
                    setAmount(val);
                  }}
                  onBlur={() => {
                    // Format on blur: add commas/thousands separators if valid
                    if (amount && !isNaN(parseFloat(amount))) {
                      const num = parseFloat(amount);
                      setAmount(num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 6 }));
                    }
                  }}
                  onFocus={() => {
                    // Remove separators on focus to make editing easier
                    if (amount) {
                      setAmount(amount.replace(/,/g, ''));
                    }
                  }}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocusCapture={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onBlurCapture={(e) => (e.currentTarget.style.borderColor = 'var(--card-border)')}
                />
                <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>USDC</div>
              </div>
            </div>

            {/* Expected Return Card */}
            <div style={{ 
              padding: '20px', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '32px'
            }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {t('investModal.expectedReturn')}
                  <Info size={14} style={{ opacity: 0.5 }} />
                </span>
                <span style={{ fontSize: '18px', color: position === 'CALLER' ? 'var(--primary)' : 'var(--secondary)', fontWeight: 700 }}>
                  + ${parseFloat(expectedReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('investModal.totalAfterReturn')}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>
                  ${parseFloat(totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button 
              onClick={handleInvest}
              disabled={!amount || parseFloat(amount.replace(/,/g, '')) <= 0}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--primary)',
                color: '#000',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '16px',
                boxShadow: '0 0 20px rgba(56, 251, 219, 0.2)',
                transition: 'all 0.2s',
                opacity: (!amount || parseFloat(amount.replace(/,/g, '')) <= 0) ? 0.5 : 1,
                cursor: (!amount || parseFloat(amount.replace(/,/g, '')) <= 0) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                const parseVal = parseFloat(amount.replace(/,/g, ''));
                if (amount && parseVal > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                const parseVal = parseFloat(amount.replace(/,/g, ''));
                if (amount && parseVal > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }
              }}
            >
              {t('investModal.confirmBtn')}
            </button>
          </>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}} />
      </div>
    </div>
  );
};

const PositionCard: React.FC<{ active: boolean; onClick: () => void; label: string; apr: string; icon: React.ReactNode; color: string }> = ({ active, onClick, label, apr, icon, color }) => (
  <div 
    onClick={onClick}
    style={{
      padding: '16px',
      borderRadius: '12px',
      border: `1px solid ${active ? color : 'var(--card-border)'}`,
      backgroundColor: active ? `${color}0a` : 'rgba(255, 255, 255, 0.02)',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: active ? color : 'var(--text-muted)' }}>
      <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
      {icon}
    </div>
    <div style={{ fontSize: '18px', fontWeight: 700, color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{apr}</div>
  </div>
);
