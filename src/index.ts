import type { EventEmitter, SendTransactionOptions, WalletName } from '@solana/wallet-adapter-base';
import {
    BaseMessageSignerWalletAdapter,
    isIosAndRedirectable,
    isVersionedTransaction,
    scopePollingDetectionStrategy,
    WalletAccountError,
    WalletConnectionError,
    WalletDisconnectedError,
    WalletDisconnectionError,
    WalletError,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletPublicKeyError,
    WalletReadyState,
    WalletSendTransactionError,
    WalletSignMessageError,
    WalletSignTransactionError,
} from '@solana/wallet-adapter-base';
import type {
    Connection,
    SendOptions,
    Transaction,
    TransactionSignature,
    TransactionVersion,
    VersionedTransaction,
} from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';

interface TrashpackWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
    accountChanged(newPublicKey: PublicKey): unknown;
}

interface TrashpackWallet extends EventEmitter<TrashpackWalletEvents> {
    isTrashPack?: boolean;
    publicKey?: { toBytes(): Uint8Array } | string;
    isConnected: boolean;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T,
        options?: SendOptions
    ): Promise<{ signature: TransactionSignature }>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array; publicKey?: any }>;
    connect(): Promise<{ publicKey: any }>;
    disconnect(): Promise<void>;
}

interface TrashpackWindow extends Window {
    trashpack?: TrashpackWallet;
    solana?: TrashpackWallet;
}

declare const window: TrashpackWindow;

export interface TrashpackWalletAdapterConfig {}

export const TrashpackWalletName = 'TrashPack' as WalletName<'TrashPack'>;

export class TrashpackWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = TrashpackWalletName;
    url = 'https://trashpack.tech';
    icon = 'data:image/jpeg;base64,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';
    supportedTransactionVersions: ReadonlySet<TransactionVersion> = new Set(['legacy', 0]);

    private _connecting: boolean;
    private _wallet: TrashpackWallet | null;
    private _publicKey: PublicKey | null;
    private _readyState: WalletReadyState =
        typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.NotDetected;

    constructor(config: TrashpackWalletAdapterConfig = {}) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;

        console.log('TrashpackWalletAdapter constructor',config);

        if (this._readyState !== WalletReadyState.Unsupported) {
            if (isIosAndRedirectable()) {
                this._readyState = WalletReadyState.Loadable;
                this.emit('readyStateChange', this._readyState);
            } else {
                scopePollingDetectionStrategy(() => {
                    if (window.trashpack?.isTrashPack || window.solana?.isTrashPack) {
                        this._readyState = WalletReadyState.Installed;
                        this.emit('readyStateChange', this._readyState);
                        return true;
                    }
                    return false;
                });
            }
        }
    }

    get publicKey() {
        return this._publicKey;
    }

    get connecting() {
        return this._connecting;
    }

    get readyState() {
        return this._readyState;
    }

    async autoConnect(): Promise<void> {
        if (this.readyState === WalletReadyState.Installed) {
            await this.connect();
        }
    }

    async connect(): Promise<void> {
        try {
            if (this.connected || this.connecting) return;

            if (this.readyState === WalletReadyState.Loadable) {
                const url = encodeURIComponent(window.location.href);
                const ref = encodeURIComponent(window.location.origin);
                window.location.href = `https://trashpack.tech/connect?url=${url}&ref=${ref}`;
                return;
            }

            if (this.readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

            this._connecting = true;

            const wallet = window.trashpack || window.solana;
            if (!wallet?.isTrashPack) throw new WalletNotReadyError();

            if (!wallet.isConnected) {
                try {
                    const result = await wallet.connect();
                    if (!result?.publicKey) throw new WalletAccountError();
                } catch (error: any) {
                    throw new WalletConnectionError(error?.message, error);
                }
            }

            if (!wallet.publicKey) throw new WalletAccountError();

            let publicKey: PublicKey;
            try {
                if (typeof wallet.publicKey === 'string') {
                    publicKey = new PublicKey(wallet.publicKey);
                } else if (wallet.publicKey.toBytes) {
                    publicKey = new PublicKey(wallet.publicKey.toBytes());
                } else {
                    publicKey = new PublicKey(wallet.publicKey);
                }
            } catch (error: any) {
                throw new WalletPublicKeyError(error?.message, error);
            }

            wallet.on('disconnect', this._disconnected);
            wallet.on('accountChanged', this._accountChanged);

            this._wallet = wallet;
            this._publicKey = publicKey;

            this.emit('connect', publicKey);
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        const wallet = this._wallet;
        if (wallet) {
            wallet.off('disconnect', this._disconnected);
            wallet.off('accountChanged', this._accountChanged);

            this._wallet = null;
            this._publicKey = null;

            try {
                await wallet.disconnect();
            } catch (error: any) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }

        this.emit('disconnect');
    }

    async sendTransaction<T extends Transaction | VersionedTransaction>(
        transaction: T,
        connection: Connection,
        options: SendTransactionOptions = {}
    ): Promise<TransactionSignature> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                const { signers, ...sendOptions } = options;

                if (isVersionedTransaction(transaction)) {
                    signers?.length && transaction.sign(signers);
                } else {
                    transaction = (await this.prepareTransaction(transaction, connection, sendOptions)) as T;
                    signers?.length && (transaction as Transaction).partialSign(...signers);
                }

                sendOptions.preflightCommitment = sendOptions.preflightCommitment || connection.commitment;

                const result = await wallet.signAndSendTransaction(transaction, sendOptions);
                return result.signature;
            } catch (error: any) {
                if (error instanceof WalletError) throw error;
                throw new WalletSendTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return (await wallet.signTransaction(transaction)) || transaction;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                return (await wallet.signAllTransactions(transactions)) || transactions;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            const wallet = this._wallet;
            if (!wallet) throw new WalletNotConnectedError();

            try {
                const result = await wallet.signMessage(message);
                return result.signature;
            } catch (error: any) {
                throw new WalletSignMessageError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    private _disconnected = () => {
        const wallet = this._wallet;
        if (wallet) {
            wallet.off('disconnect', this._disconnected);
            wallet.off('accountChanged', this._accountChanged);

            this._wallet = null;
            this._publicKey = null;

            this.emit('error', new WalletDisconnectedError());
            this.emit('disconnect');
        }
    };

    private _accountChanged = (newPublicKey: PublicKey) => {
        const publicKey = this._publicKey;
        if (!publicKey) return;

        try {
            if (typeof newPublicKey === 'string') {
                newPublicKey = new PublicKey(newPublicKey);
            } else if (newPublicKey.toBytes) {
                newPublicKey = new PublicKey(newPublicKey.toBytes());
            } else {
                newPublicKey = new PublicKey(newPublicKey);
            }
        } catch (error: any) {
            this.emit('error', new WalletPublicKeyError(error?.message, error));
            return;
        }

        if (publicKey.equals(newPublicKey)) return;

        this._publicKey = newPublicKey;
        this.emit('connect', newPublicKey);
    };
}
