# 🗑️ Trashpack Wallet Adapter

> Solana Wallet Adapter for the Trashpack browser extension — compatible with `@solana/wallet-adapter` ecosystem.

---

## 🚀 Overview

`trashpack-wallet-adapter` is a custom Solana wallet adapter that integrates your Trashpack crypto wallet browser extension into any Solana dApp using the `@solana/wallet-adapter` system.

This adapter detects the Trashpack wallet (injected into `window.trashpack` or `window.solana`), handles connection, transaction signing, message signing, and more — just like Phantom or Solflare.

---

## 📦 Installation

```bash
npm install trashpack-wallet-adapter
Or with Yarn:

bash
Copy
Edit
yarn add trashpack-wallet-adapter
🔧 Usage
ts
Copy
Edit
import { TrashpackWalletAdapter } from 'trashpack-wallet-adapter';

const adapter = new TrashpackWalletAdapter();

await adapter.connect();
const publicKey = adapter.publicKey;

const signature = await adapter.sendTransaction(transaction, connection);
🧠 Adapter Detection
The adapter detects your wallet automatically via:

ts
Copy
Edit
window.trashpack?.isTrashPack || window.solana?.isTrashPack
Ensure your browser extension exposes this object properly.

📋 API Reference
This adapter extends:

ts
Copy
Edit
BaseMessageSignerWalletAdapter
So it supports all standard methods like:

connect()

disconnect()

signTransaction()

signAllTransactions()

signMessage()

sendTransaction()

It also emits events such as:

connect(publicKey)

disconnect()

readyStateChange(WalletReadyState)

error(error)

🧩 Supported Transaction Versions
ts
Copy
Edit
supportedTransactionVersions = new Set(['legacy', 0]);
🌐 Wallet Details
Field	Value
name	"TrashPack"
url	https://trashpack.tech
icon	Custom base64 SVG

🛠️ Development
To build the adapter:

bash
Copy
Edit
npm install
npm run build
This compiles src/index.ts into dist/.

🔒 Requirements
@solana/web3.js

@solana/wallet-adapter-base

📜 License
MIT License © [Your Name]

🤝 Contributing
Feel free to open issues or submit PRs for improvements and fixes.

🧪 Test Your Wallet
To test that your Trashpack wallet is injected and working:

js
Copy
Edit
if (window.trashpack?.isTrashPack || window.solana?.isTrashPack) {
    console.log('Trashpack wallet detected ✅');
}
📣 Note
This adapter does not provide the browser extension itself. It assumes that your extension is installed and properly injects the trashpack object into the window.

yaml
Copy
Edit

---

You can save this directly into a file named `README.md` at the root of your project. Let me know if you want a matching `LICENSE` file or `CONTRIBUTING.md` too.








Ask ChatGPT
