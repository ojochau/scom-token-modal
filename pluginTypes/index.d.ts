/// <reference path="@ijstech/eth-wallet/index.d.ts" />
/// <amd-module name="@scom/scom-token-modal/interface.ts" />
declare module "@scom/scom-token-modal/interface.ts" {
    import { ITokenObject } from "@scom/scom-token-list";
    export interface INetwork {
        chainId: number;
        name: string;
        img?: string;
        rpc?: string;
        symbol?: string;
        env?: string;
        explorerName?: string;
        explorerTxUrl?: string;
        explorerAddressUrl?: string;
        isDisabled?: boolean;
    }
    export const enum EventId {
        ConnectWallet = "connectWallet",
        IsWalletConnected = "isWalletConnected",
        chainChanged = "chainChanged",
        IsWalletDisconnected = "IsWalletDisconnected",
        EmitNewToken = "EmitNewToken",
        Paid = "Paid"
    }
    export type TokenMapType = {
        [token: string]: ITokenObject;
    };
    export enum SITE_ENV {
        DEV = "dev",
        TESTNET = "testnet",
        MAINNET = "mainnet"
    }
}
/// <amd-module name="@scom/scom-token-modal/utils.ts" />
declare module "@scom/scom-token-modal/utils.ts" {
    export const formatNumber: (value: any, decimals?: number) => string;
    export const formatNumberWithSeparators: (value: number, precision?: number) => string;
    export const getNetworkInfo: (chainId: number) => any;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
    export const setRpcWalletId: (value: string) => void;
    export const getRpcWallet: () => import("@ijstech/eth-wallet").IRpcWallet;
    export function getChainId(): number;
}
/// <amd-module name="@scom/scom-token-modal/importToken.tsx" />
declare module "@scom/scom-token-modal/importToken.tsx" {
    import { Control, ControlElement, Module, Container } from '@ijstech/components';
    import { ITokenObject } from '@scom/scom-token-list';
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['import-token']: ControlElement;
            }
        }
    }
    export class ImportToken extends Module {
        private importModal;
        private importBtn;
        private tokenAgreeCheckBox;
        private _token;
        private $eventBus;
        onUpdate: any;
        private _state;
        constructor(parent?: Container, options?: any);
        set token(value: ITokenObject);
        get token(): ITokenObject;
        updateState(): void;
        closeModal(): void;
        showModal(): void;
        onImportToken(source: Control, event: Event): Promise<void>;
        onHandleCheck(source: Control, event: Event): void;
        viewContract(): void;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-token-modal/index.css.ts" />
declare module "@scom/scom-token-modal/index.css.ts" {
    export const tokenStyle: string;
    export const tokenListStyle: string;
    const _default: string;
    export default _default;
}
/// <amd-module name="@scom/scom-token-modal" />
declare module "@scom/scom-token-modal" {
    import { Module, Control, ControlElement, Container } from '@ijstech/components';
    import { ITokenObject } from '@scom/scom-token-list';
    interface ScomTokenModalElement extends ControlElement {
        title?: string;
        chainId?: number;
        token?: ITokenObject;
        tokenDataListProp?: ITokenObject[];
        importable?: boolean;
        isSortBalanceShown?: boolean;
        isCommonShown?: boolean;
        rpcWalletId?: string;
        targetChainId?: number;
        targetTokenBalancesMap?: Record<string, string>;
        onSelectToken?: (token: ITokenObject) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-token-modal']: ScomTokenModalElement;
            }
        }
    }
    export default class ScomTokenModal extends Module {
        private tokenBalancesMap;
        private hstackMap;
        private currentToken;
        private $eventBus;
        private _targetChainId;
        private _targetTokenBalancesMap;
        private _token;
        private _title;
        private _isCommonShown;
        private _isSortBalanceShown;
        private _importable;
        private _tokenDataListProp;
        private _rpcWalletId;
        private walletEvents;
        private clientEvents;
        private mdTokenSelection;
        private gridTokenList;
        private gridCommonToken;
        private pnlCommonToken;
        private pnlSortBalance;
        private mdImportToken;
        private titleStack;
        private sortValue;
        private iconSortUp;
        private iconSortDown;
        private inputSearch;
        private filterValue;
        onSelectToken: (token: ITokenObject) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomTokenModalElement, parent?: Container): Promise<ScomTokenModal>;
        get rpcWalletId(): string;
        set rpcWalletId(value: string);
        get token(): ITokenObject | undefined;
        set token(value: ITokenObject | undefined);
        get targetChainId(): number;
        set targetChainId(value: number);
        get targetTokenBalancesMap(): Record<string, string>;
        set targetTokenBalancesMap(value: Record<string, string>);
        get chainId(): number;
        get isCommonShown(): boolean;
        set isCommonShown(value: boolean);
        get isSortBalanceShown(): boolean;
        set isSortBalanceShown(value: boolean);
        get importable(): boolean;
        set importable(value: boolean);
        get title(): any;
        set title(value: string | Control);
        onRefresh(): void;
        private updateDataByNewToken;
        private onUpdateData;
        private registerEvent;
        onHide(): void;
        get tokenDataListProp(): Array<ITokenObject>;
        set tokenDataListProp(value: Array<ITokenObject>);
        private get tokenListByChainId();
        private get tokenDataList();
        private get commonTokenDataList();
        private get tokenDataListFiltered();
        private sortToken;
        private sortBalance;
        private onSearch;
        private renderCommonItems;
        private renderToken;
        private clearTokenList;
        private renderTokenList;
        private addToMetamask;
        showModal(): void;
        closeModal(): void;
        private setActive;
        private onSelect;
        init(): Promise<void>;
        showImportTokenModal(target: Control, event: Event, token: ITokenObject): void;
        onImportToken(target: Control, token: ITokenObject): void;
        onCloseModal(): void;
        onOpenModal(): void;
        render(): any;
    }
}
