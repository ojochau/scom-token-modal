/// <amd-module name="@scom/scom-token-modal/utils.ts" />
declare module "@scom/scom-token-modal/utils.ts" {
    import { BigNumber } from "@ijstech/eth-wallet";
    export const formatNumber: (value: number | string | BigNumber, decimals?: number) => string;
    export const getNetworkInfo: (chainId: number) => any;
    export const viewOnExplorerByAddress: (chainId: number, address: string) => void;
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
        tokenBalancesMapProp?: Record<string, string>;
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
        private hstackMap;
        private currentToken;
        private _chainId;
        private _tokenBalancesMapProp;
        private _token;
        private _title;
        private _isCommonShown;
        private _isSortBalanceShown;
        private _importable;
        private _tokenDataListProp;
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
        get token(): ITokenObject | undefined;
        set token(value: ITokenObject | undefined);
        get tokenBalancesMapProp(): Record<string, string>;
        set tokenBalancesMapProp(value: Record<string, string>);
        get chainId(): number;
        set chainId(value: number | undefined);
        get isCommonShown(): boolean;
        set isCommonShown(value: boolean);
        get isSortBalanceShown(): boolean;
        set isSortBalanceShown(value: boolean);
        get importable(): boolean;
        set importable(value: boolean);
        get title(): any;
        set title(value: string | Control);
        onRefresh(): void;
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
