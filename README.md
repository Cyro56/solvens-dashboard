# Solvens Dashboard 🌊

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-Credit-gray?style=for-the-badge&logo=solidity)](https://soliditylang.org/)

**Solvens** é uma infraestrutura de crédito descentralizada e anônima, projetada para operar em cenários de subcolateralização. Ao contrário dos protocolos DeFi tradicionais, o Solvens utiliza a física do dinheiro e a teoria dos jogos para garantir que o capital flua para onde o risco é corretamente precificado.

## 🚀 O Protocolo: Callers vs Sellers

A mecânica central do Solvens divide os participantes em dois grupos com incentivos opostos:

*   **Callers (SIm)**: Fornecem o capital principal. Eles acreditam na solvência do tomador e buscam os juros da dívida. Assumem o maior risco e, por isso, possuem as maiores estimativas de retorno.
*   **Sellers (NÃO)**: Atuam como garantidores e especuladores de risco. Eles apostam no calote (default). Se o tomador não paga, o Seller ganha o prêmio (parte do colateral 'Airbag').

## 🛠️ Tecnologias Utilizadas

O painel foi construído com foco em alta performance e estética premium (Inspirado em AAVE):

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Lógica**: [TypeScript](https://www.typescriptlang.org/)
*   **Estilização**: CSS Moderno com suporte a Variáveis Globais e Glassmorphism
*   **Ícones**: [Lucide React](https://lucide.dev/)
*   **Compilação**: Turbopack para desenvolvimento ultra-rápido

## 💎 Funcionalidades do Dashboard

*   **Market Overview**: Visualização em tempo real do tamanho do mercado, total de empréstimos e colateral disponível.
*   **Loan Contract List**: Tabela técnica com endereços de contratos Solidity, endereços de tomadores e tokens de dívida.
*   **Filtragem Avançada**: Filtros por status de contrato (ACTIVE, PENDING, CANCELLED).
*   **Paginação**: Navegação fluida entre centenas de contratos de crédito.
*   **UI/UX Premium**: Modo escuro profundo, logo customizado ("Mola de Tensão") e animações suaves.

## 🏁 Como Rodar o Projeto

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/Cyro56/solvens-dashboard.git
    cd solvens-dashboard
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Inicie o ambiente de desenvolvimento**:
    ```bash
    npm run dev
    ```

4.  **Acesse no navegador**:
    [http://localhost:3000](http://localhost:3000)

## 📌 Estrutura do Código

```text
src/
├── app/            # Rotas e layout global
├── components/     # Componentes da interface (Header, Table, Stats)
├── assets/         # Logos e recursos estáticos
└── styles/         # Variáveis de design e temas
```

---

*Desenvolvido com foco na física do dinheiro e na transparência do código.*
**Code is Credit.**
