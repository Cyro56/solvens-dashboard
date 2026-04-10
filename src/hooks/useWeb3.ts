import { useState, useEffect } from 'react';
import { web3Manager, POLYGON_MAINNET, POLYGON_AMOY, HARDHAT_LOCALHOST, Web3State } from '@/services/web3Manager';
import { notificationService } from '@/services/notificationService';

export const useWeb3 = () => {
  const [state, setState] = useState<Web3State>(web3Manager.getState());

  useEffect(() => {
    // Subscribe to Web3Manager global updates
    const unsubscribe = web3Manager.subscribe((newState) => {
      setState(newState);
    });

    return () => unsubscribe();
  }, []);

  const connect = async () => {
    try {
      await web3Manager.connect();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao conectar';
      notificationService.error(message);
    }
  };

  const switchToMarket = async (type: 'local' | 'amoy' | 'real') => {
    let targetConfig;
    if (type === 'local') targetConfig = HARDHAT_LOCALHOST;
    else if (type === 'amoy') targetConfig = POLYGON_AMOY;
    else targetConfig = POLYGON_MAINNET;

    try {
      await web3Manager.switchNetwork(targetConfig);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao trocar rede';
      notificationService.error(message);
    }
  };

  const toggleMarket = async () => {
    const targetType = state.isTestnet ? 'real' : 'amoy';
    await switchToMarket(targetType);
  };

  const mintUSDC = async () => {
    try {
      await web3Manager.mintUSDC();
      notificationService.success('1,000 USDC (Amoy) adicionados com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao solicitar faucet';
      notificationService.error(message);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notificationService.success('Endereço copiado para a área de transferência!');
    } catch (error) {
      notificationService.error('Falha ao copiar endereço');
    }
  };

  const shortenAddress = (address: string) => {
    return web3Manager.shortenAddress(address);
  };

  return {
    ...state,
    connect,
    toggleMarket,
    switchToMarket,
    mintUSDC,
    shortenAddress,
    copyToClipboard
  };
};
