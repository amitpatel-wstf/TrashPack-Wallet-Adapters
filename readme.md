# 🗑️ Trashpack Wallet Adapter

> Solana Wallet Adapter for the Trashpack browser extension — compatible with `@solana/wallet-adapter` ecosystem.

[![npm version](https://img.shields.io/npm/v/trashpack-wallet-adapter.svg)](https://www.npmjs.com/package/trashpack-wallet-adapter)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue.svg)](https://github.com/amitpatel-wstf/TrashPack-Wallet-Adapters)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

`trashpack-wallet-adapter` is a custom Solana wallet adapter that integrates your Trashpack crypto wallet browser extension into any Solana dApp using the `@solana/wallet-adapter` system.

This adapter detects the Trashpack wallet (injected into `window.trashpack` or `window.solana`), handles connection, transaction signing, message signing, and more — just like Phantom or Solflare.

## 📦 Installation

```bash
npm install trashpack-wallet-adapter
```

Or with Yarn:

```bash
yarn add trashpack-wallet-adapter
```

## 🔧 Usage

```typescript

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    CoinbaseWalletAdapter,
    LedgerWalletAdapter

} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
// trashpack
import { TrashpackWalletAdapter } from 'trashpack-wallet-adapter';
import '@solana/wallet-adapter-react-ui/styles.css';
https://github.com/amitpatel-wstf/TrashPack-Wallet-Adapters
export const WalletConnectionProvider = ({ children }: { children: React.ReactNode }) => {
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new LedgerWalletAdapter(),
            new TrashpackWalletAdapter()
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

```

## 🧠 Adapter Detection

The adapter detects your wallet automatically via:

```typescript
window.trashpack?.isTrashPack || window.solana?.isTrashPack
```

Ensure your browser extension exposes this object properly.

## 📋 API Reference

This adapter extends `BaseMessageSignerWalletAdapter`, so it supports all standard methods like:

- `connect()`
- `disconnect()`
- `signTransaction()`
- `signAllTransactions()`
- `signMessage()`
- `sendTransaction()`

It also emits events such as:

- `connect(publicKey)`
- `disconnect()`
- `readyStateChange(WalletReadyState)`
- `error(error)`

## 🧩 Supported Transaction Versions

```typescript
supportedTransactionVersions = new Set(['legacy', 0]);
```

## 🌐 Wallet Details

| Field | Value |
|-------|-------|
| name | "TrashPack" |
| url | https://trashpack.tech |
| icon | Custom base64 SVG |

## 🛠️ Development

To build the adapter:

```bash
npm install
npm run build
```

This compiles `src/index.ts` into `dist/`.

## 🔒 Requirements

- `@solana/web3.js`
- `@solana/wallet-adapter-base`

## 🧪 Test Your Wallet

To test that your Trashpack wallet is injected and working:

```javascript
if (window.trashpack?.isTrashPack || window.solana?.isTrashPack) {
    console.log('Trashpack wallet detected ✅');
}
```

## 📣 Note

This adapter does not provide the browser extension itself. It assumes that your extension is installed and properly injects the trashpack object into the window.

## 🤝 Contributing

Feel free to open issues or submit PRs for improvements and fixes.

## 📜 License

MIT License © [Your Name]

---

**GitHub Repository**: [https://github.com/amitpatel-wstf/TrashPack-Wallet-Adapters](https://github.com/amitpatel-wstf/TrashPack-Wallet-Adapters)
