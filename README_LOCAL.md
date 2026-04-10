# 🚀 Solvens: Guia de Ambiente Local

Este guia ensina como subir o protocolo Solvens do zero em sua máquina local para testes e desenvolvimento.

## 1. Subir o Nó do Blockchain (Hardhat)
Abra um terminal na pasta raiz do projeto e execute:
```bash
npx hardhat node
```
*Mantenha este terminal aberto. Ele é o seu "servidor" de blockchain.*

---

## 2. Fazer o Deploy dos Contratos
Em um **novo terminal**, execute o script de deploy automático:
```bash
node scripts/mega_deploy.js
```
Este script vai:
1. Gerar os endereços determinísticos da Factory e do Vault.
2. Resetar o estado do seu frontend para usar esses endereços.

---

## 3. Configurar o MetaMask
Para interagir com o site, o seu MetaMask precisa estar na rede certa:

- **Network Name:** Hardhat Local
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `31337`
- **Currency Symbol:** `POL` (ou MATIC)

> [!TIP]
> **O Botão Mágico:** Se o site der erro de "Factory não encontrada", use o botão vermelho **"Corrigir Configuração de Rede"** na tela ou o botão **FIX** no topo. O próprio Solvens vai configurar o seu MetaMask automaticamente.

---

## 4. Importar a Carteira de Teste (Dono)
O Hardhat sempre cria contas com 10.000 tokens de graça. Para ter poder de administrador, importe a **Account #0**:

- **Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

---

## 5. Fluxo de Teste Sugerido
1. Acesse `http://localhost:3000`.
2. Vá em **"Solicitar Empréstimo"**.
3. Preencha os valores (ex: 100 USDC, 12% APR, 20 USDC Colateral).
4. Clique em **"Enviar Solicitação"**.
5. Volte ao **Painel (Dashboard)** e veja seu empréstimo aparecer na tabela `Protocol Markets` em tempo real.

---

## 💡 Dicas de Manutenção
- **Piscada na tela:** Se a tela piscar, verifique se o seu MetaMask está na conta certa.
- **Valores Zeros:** Se os valores aparecerem como `0.000...`, certifique-se de que você fez o deploy *depois* de abrir o nó do Hardhat.
- **Limpar tudo:** Para resetar o banco de dados do blockchain, feche o terminal do `npx hardhat node` e abra de novo.
