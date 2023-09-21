var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-token-modal/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SITE_ENV = void 0;
    ;
    ;
    var SITE_ENV;
    (function (SITE_ENV) {
        SITE_ENV["DEV"] = "dev";
        SITE_ENV["TESTNET"] = "testnet";
        SITE_ENV["MAINNET"] = "mainnet";
    })(SITE_ENV = exports.SITE_ENV || (exports.SITE_ENV = {}));
});
define("@scom/scom-token-modal/utils.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChainId = exports.getRpcWallet = exports.setRpcWalletId = exports.viewOnExplorerByAddress = exports.getNetworkInfo = exports.formatNumber = void 0;
    const formatNumber = (value, decimals) => {
        // let val = value;
        // const minValue = '0.0000001';
        // if (typeof value === 'string') {
        //   val = new BigNumber(value).toNumber();
        // } else if (typeof value === 'object') {
        //   val = value.toNumber();
        // }
        // if (val != 0 && new BigNumber(val).lt(minValue)) {
        //   return `<${minValue}`;
        // }
        const minValue = '0.0000001';
        const newValue = typeof value === 'object' ? value.toString() : value;
        return components_1.FormatUtils.formatNumber(newValue, { decimalFigures: decimals || 4, minValue });
    };
    exports.formatNumber = formatNumber;
    // export const formatNumberWithSeparators = (value: number, precision?: number) => {
    //   if (!value) value = 0;
    //   if (precision) {
    //     let outputStr = '';
    //     if (value >= 1) {
    //       outputStr = value.toLocaleString('en-US', { maximumFractionDigits: precision });
    //     }
    //     else {
    //       outputStr = value.toLocaleString('en-US', { maximumSignificantDigits: precision });
    //     }
    //     if (outputStr.length > 18) {
    //       outputStr = outputStr.substr(0, 18) + '...'
    //     }
    //     return outputStr;
    //   }
    //   else {
    //     return value.toLocaleString('en-US');
    //   }
    // }
    const getNetworkInfo = (chainId) => {
        return eth_wallet_1.Wallet.getClientInstance().getNetworkInfo(chainId);
    };
    exports.getNetworkInfo = getNetworkInfo;
    const viewOnExplorerByAddress = (chainId, address) => {
        let network = (0, exports.getNetworkInfo)(chainId);
        if (network && network.blockExplorerUrls[0]) {
            const url = `${network.blockExplorerUrls[0]}${address}`;
            window.open(url);
        }
    };
    exports.viewOnExplorerByAddress = viewOnExplorerByAddress;
    const state = {
        rpcWalletId: "",
    };
    const setRpcWalletId = (value) => {
        state.rpcWalletId = value;
    };
    exports.setRpcWalletId = setRpcWalletId;
    const getRpcWallet = () => {
        return eth_wallet_1.Wallet.getRpcWalletInstance(state.rpcWalletId);
    };
    exports.getRpcWallet = getRpcWallet;
    function getChainId() {
        const rpcWallet = (0, exports.getRpcWallet)();
        return rpcWallet === null || rpcWallet === void 0 ? void 0 : rpcWallet.chainId;
    }
    exports.getChainId = getChainId;
    ;
});
define("@scom/scom-token-modal/importToken.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-token-modal/utils.ts", "@scom/scom-token-list"], function (require, exports, components_2, eth_wallet_2, utils_1, scom_token_list_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportToken = void 0;
    ;
    let ImportToken = class ImportToken extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this._state = {
                address: '',
                name: ''
            };
            this.$eventBus = components_2.application.EventBus;
        }
        ;
        set token(value) {
            this._token = value;
            this.updateState();
        }
        get token() {
            return this._token;
        }
        updateState() {
            this._state.address = this.token.address || '';
            this._state.name = this.token.name || '';
        }
        closeModal() {
            this.importModal.visible = false;
        }
        showModal() {
            this.importModal.visible = true;
        }
        async onImportToken(source, event) {
            event.stopPropagation();
            const tokenObj = this.token;
            const chainId = (0, utils_1.getChainId)();
            (0, scom_token_list_1.addUserTokens)(chainId, tokenObj);
            const rpcWallet = (0, utils_1.getRpcWallet)();
            scom_token_list_1.tokenStore.updateTokenMapData(chainId);
            await scom_token_list_1.tokenStore.updateAllTokenBalances(rpcWallet);
            this.$eventBus.dispatch("EmitNewToken" /* EventId.EmitNewToken */, tokenObj);
            if (typeof this.onUpdate === 'function') {
                this.onUpdate(tokenObj);
            }
            this.closeModal();
        }
        onHandleCheck(source, event) {
            this.importBtn.enabled = source.checked;
        }
        viewContract() {
            const chainId = eth_wallet_2.Wallet.getClientInstance().chainId;
            (0, utils_1.viewOnExplorerByAddress)(chainId, this._state.address);
        }
        async init() {
            super.init();
            this.importModal.onClose = () => {
                this.tokenAgreeCheckBox.checked = false;
                this.importBtn.enabled = false;
            };
        }
        render() {
            return (this.$render("i-modal", { id: "importModal", class: "bg-modal", title: "Select Token", closeIcon: { name: 'times' } },
                this.$render("i-panel", { class: "pnl-token-import" },
                    this.$render("i-panel", null,
                        this.$render("i-icon", { name: "question", class: "cicrle", fill: "#e83e8c", width: 15, height: 15, margin: { right: 3 } }),
                        this.$render("i-label", { caption: this._state.name })),
                    this.$render("i-hstack", { margin: { top: 5, bottom: 5 } },
                        this.$render("i-label", { caption: this._state.address, font: { color: '#1890ff' }, class: "pointer", onClick: () => this.viewContract() })),
                    this.$render("i-panel", { class: "btn-source-panel" },
                        this.$render("i-icon", { name: "exclamation-triangle", margin: { right: 3 }, fill: "#fff", width: 15, height: 15 }),
                        this.$render("i-label", { caption: "Unknow Source" }))),
                this.$render("i-panel", { class: "pnl-token-import" },
                    this.$render("i-hstack", { horizontalAlignment: "center", margin: { bottom: 5 } },
                        this.$render("i-icon", { name: "exclamation-triangle", margin: { right: 3 }, fill: "#e83e8c", width: 30, height: 30 })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { font: { bold: true }, caption: "Trade at your own risk!" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { caption: "Anyone can create a token, including creating fake versions of existing token that claims tp represent projects" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { width: 300, font: { bold: true }, caption: "If you purchased this token, you may not be to able sell it back" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center" },
                        this.$render("i-checkbox", { id: "tokenAgreeCheckBox", width: "200", margin: { top: 30 }, height: 30, class: "token-agree-input", background: { color: 'transparent' }, caption: "I understand", onChanged: this.onHandleCheck.bind(this) }))),
                this.$render("i-button", { id: "importBtn", class: "btn-import", width: "100%", caption: "Import", height: 40, enabled: false, onClick: this.onImportToken.bind(this) })));
        }
    };
    __decorate([
        (0, components_2.observable)()
    ], ImportToken.prototype, "_state", void 0);
    ImportToken = __decorate([
        (0, components_2.customElements)('import-token')
    ], ImportToken);
    exports.ImportToken = ImportToken;
});
define("@scom/scom-token-modal/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tokenListStyle = exports.tokenStyle = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.tokenStyle = components_3.Styles.style({
        $nest: {
            '&:hover': {
                background: Theme.action.hover
            },
            '&.is-selected': {
                background: Theme.action.active,
                $nest: {
                    '.token-symbol': {
                        fontWeight: 600
                    }
                }
            }
        }
    });
    exports.tokenListStyle = components_3.Styles.style({
        maxHeight: '50vh',
        overflow: 'auto',
        $nest: {
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar': {
                width: '5px',
                height: '5px'
            },
            '&::-webkit-scrollbar-thumb': {
                background: Theme.colors.primary.main,
                borderRadius: '5px'
            }
        }
    });
    exports.default = components_3.Styles.style({
        $nest: {
            '.full-width': {
                width: '100%',
                $nest: {
                    '.modal': {
                        padding: 0
                    }
                }
            },
            '.box-shadow > div': {
                boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)'
            },
            '.is-ellipsis': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
            '.sort-panel': {
                marginBlock: '0.5rem',
                $nest: {
                    'i-icon': {
                        width: '10px',
                        height: '14px',
                        display: 'flex',
                        fill: Theme.text.primary,
                        position: 'absolute',
                        right: '0',
                        cursor: 'pointer'
                    },
                    '.icon-sort-up': {
                        top: '2px',
                    },
                    '.icon-sort-down': {
                        bottom: '2px',
                    },
                    '.icon-sorted': {
                        fill: Theme.colors.primary.main,
                    }
                }
            },
            '.search-input': {
                $nest: {
                    'input': {
                        padding: '1rem 1.5rem 1rem 2.25rem'
                    }
                }
            },
            '.centered': {
                transform: 'translateY(-50%)'
            },
            '.pointer': {
                cursor: 'pointer'
            },
            '.common-token:hover': {
                border: `1px solid ${Theme.colors.primary.main}`
            },
            '.btn-import': {
                background: 'transparent linear-gradient(255deg,#e75b66,#b52082) 0% 0% no-repeat padding-box',
                borderRadius: '5px',
                color: '#fff',
                fontSize: '1rem',
                padding: '0.25rem 1.25rem'
            },
            '#btnToken': {
                justifyContent: 'space-between'
            }
        }
    });
});
define("@scom/scom-token-modal", ["require", "exports", "@ijstech/components", "@scom/scom-token-list", "@scom/scom-token-modal/utils.ts", "@scom/scom-token-modal/index.css.ts"], function (require, exports, components_4, scom_token_list_2, utils_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomTokenModal = class ScomTokenModal extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.hstackMap = new Map();
            this.currentToken = '';
            this._title = 'Select Token';
            this._isCommonShown = false;
            this._isSortBalanceShown = true;
            this._importable = false;
            this._tokenDataListProp = [];
            this._rpcWalletId = '';
            this.walletEvents = [];
            this.clientEvents = [];
            this.sortToken = (a, b, asc) => {
                var _a, _b, _c, _d;
                if (a.balance != b.balance) {
                    return asc ? (a.balance - b.balance) : (b.balance - a.balance);
                }
                if (((_a = a.symbol) === null || _a === void 0 ? void 0 : _a.toLowerCase()) < ((_b = b.symbol) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                    return -1;
                }
                if (((_c = a.symbol) === null || _c === void 0 ? void 0 : _c.toLowerCase()) > ((_d = b.symbol) === null || _d === void 0 ? void 0 : _d.toLowerCase())) {
                    return 1;
                }
                return 0;
            };
            this.$eventBus = components_4.application.EventBus;
            this.registerEvent();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get rpcWalletId() {
            return this._rpcWalletId;
        }
        set rpcWalletId(value) {
            this._rpcWalletId = value;
            (0, utils_2.setRpcWalletId)(value);
        }
        get token() {
            return this._token;
        }
        set token(value) {
            this._token = value;
            this.setActive(value);
            // if (this.onSelectToken) this.onSelectToken(this.token)
        }
        get tokenBalancesMapProp() {
            return this._tokenBalancesMapProp;
        }
        set tokenBalancesMapProp(value) {
            this._tokenBalancesMapProp = value;
        }
        get chainId() {
            return this._chainId || (0, utils_2.getChainId)();
        }
        set chainId(value) {
            this._chainId = value;
        }
        get isCommonShown() {
            return this._isCommonShown;
        }
        set isCommonShown(value) {
            this._isCommonShown = value;
            // this.renderCommonItems()
        }
        get isSortBalanceShown() {
            return this._isSortBalanceShown;
        }
        set isSortBalanceShown(value) {
            this._isSortBalanceShown = value;
            if (this.pnlSortBalance)
                this.pnlSortBalance.visible = value;
        }
        get importable() {
            return this._importable;
        }
        set importable(value) {
            this._importable = value;
        }
        get title() {
            return this._title;
        }
        set title(value) {
            this._title = value;
            let labelEl;
            if (typeof value === 'string') {
                labelEl = new components_4.Label(undefined, {
                    caption: value,
                    font: { color: Theme.colors.primary.main, size: '1rem', bold: true },
                });
            }
            else {
                labelEl = value;
            }
            if (!this.titleStack)
                this.titleStack = new components_4.HStack();
            this.titleStack.clearInnerHTML();
            this.titleStack.appendChild(labelEl);
        }
        onRefresh() {
            if ((0, scom_token_list_2.isWalletConnected)()) {
                this.tokenBalancesMap = scom_token_list_2.tokenStore.tokenBalances || {};
                if (this.token) {
                    const _tokenList = scom_token_list_2.tokenStore.getTokenList(this.chainId);
                    const token = _tokenList.find((t) => {
                        var _a, _b;
                        return (t.address && t.address == ((_a = this.token) === null || _a === void 0 ? void 0 : _a.address)) ||
                            t.symbol == ((_b = this.token) === null || _b === void 0 ? void 0 : _b.symbol);
                    });
                    if (!token)
                        this.token = undefined;
                    else
                        this.token = token;
                }
            }
            this.renderTokenList();
        }
        async updateDataByNewToken() {
            this.tokenBalancesMap = scom_token_list_2.tokenStore.tokenBalances || {};
            this.renderTokenList();
        }
        async onUpdateData(onPaid) {
            const rpcWallet = (0, utils_2.getRpcWallet)();
            if (rpcWallet)
                this.tokenBalancesMap = onPaid ? scom_token_list_2.tokenStore.tokenBalances : await scom_token_list_2.tokenStore.updateAllTokenBalances(rpcWallet);
            else
                this.tokenBalancesMap = {};
            this.onRefresh();
        }
        registerEvent() {
            // const clientWallet = Wallet.getClientInstance();
            // this.walletEvents.push(clientWallet.registerWalletEvent(this, Constants.ClientWalletEvent.AccountsChanged, async (payload: Record<string, any>) => {
            //   this.onUpdateData()
            // }));
            // this.clientEvents.push(this.$eventBus.register(this, EventId.chainChanged, async (chainId: number) => {
            //   this.onUpdateData();
            // }));
            // this.clientEvents.push(this.$eventBus.register(this, EventId.Paid, () => this.onUpdateData(true)))
            // this.clientEvents.push(this.$eventBus.register(this, EventId.EmitNewToken, this.updateDataByNewToken))
        }
        onHide() {
            const rpcWallet = (0, utils_2.getRpcWallet)();
            for (let event of this.walletEvents) {
                rpcWallet.unregisterWalletEvent(event);
            }
            this.walletEvents = [];
            for (let event of this.clientEvents) {
                event.unregister();
            }
            this.clientEvents = [];
        }
        get tokenDataListProp() {
            return this._tokenDataListProp;
        }
        set tokenDataListProp(value) {
            this._tokenDataListProp = value;
        }
        get tokenListByChainId() {
            var _a, _b;
            let list = [];
            const propList = this.tokenDataListProp.filter(f => !f.chainId || f.chainId === this.chainId);
            const nativeToken = scom_token_list_2.ChainNativeTokenByChainId[this.chainId];
            const tokens = scom_token_list_2.DefaultERC20Tokens[this.chainId];
            for (const token of propList) {
                const tokenAddress = (_a = token.address) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                if (!tokenAddress || tokenAddress === ((_b = nativeToken === null || nativeToken === void 0 ? void 0 : nativeToken.symbol) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                    if (nativeToken)
                        list.push(Object.assign(Object.assign({}, nativeToken), { chainId: this.chainId }));
                }
                else {
                    const tokenObj = tokens.find(v => { var _a; return ((_a = v.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === tokenAddress; });
                    if (tokenObj)
                        list.push(Object.assign(Object.assign({}, token), { chainId: this.chainId }));
                }
            }
            return list;
        }
        get tokenDataList() {
            let tokenList = this.tokenListByChainId.length ? this.tokenListByChainId : scom_token_list_2.tokenStore.getTokenList(this.chainId);
            if (this.tokenDataListProp && this.tokenDataListProp.length) {
                tokenList = this.tokenDataListProp;
            }
            this.tokenBalancesMap = scom_token_list_2.tokenStore.tokenBalances || {};
            const balancesMap = this.tokenBalancesMapProp && this.chainId !== (0, utils_2.getChainId)() ? this.tokenBalancesMapProp : this.tokenBalancesMap;
            // if (!this.tokenBalancesMap || !Object.keys(this.tokenBalancesMap).length) {
            //   this.tokenBalancesMap = tokenStore.tokenBalances || {};
            // }
            return tokenList.map((token) => {
                var _a;
                const tokenObject = Object.assign({}, token);
                const nativeToken = scom_token_list_2.ChainNativeTokenByChainId[this.chainId];
                if ((nativeToken === null || nativeToken === void 0 ? void 0 : nativeToken.symbol) && token.symbol === nativeToken.symbol) {
                    Object.assign(tokenObject, { isNative: true });
                }
                if (!(0, scom_token_list_2.isWalletConnected)()) {
                    Object.assign(tokenObject, {
                        balance: 0,
                    });
                }
                else if (balancesMap) {
                    Object.assign(tokenObject, {
                        balance: balancesMap[((_a = token.address) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || token.symbol] || 0,
                    });
                }
                return tokenObject;
            }).sort(this.sortToken);
        }
        get commonTokenDataList() {
            const tokenList = this.tokenDataList;
            if (!tokenList)
                return [];
            return tokenList.filter((token) => token.isCommon || token.isNative);
        }
        get tokenDataListFiltered() {
            let tokenList = this.tokenDataList || [];
            if (tokenList.length) {
                if (this.filterValue) {
                    tokenList = tokenList.filter((token) => {
                        var _a;
                        return token.symbol.toUpperCase().includes(this.filterValue) ||
                            token.name.toUpperCase().includes(this.filterValue) ||
                            ((_a = token.address) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === this.filterValue;
                    });
                }
                if (this.sortValue !== undefined) {
                    tokenList = tokenList.sort((a, b) => {
                        return this.sortToken(a, b, this.sortValue);
                    });
                    const allBalanceZero = !tokenList.some((token) => token.balance && token.balance !== '0');
                    if (allBalanceZero && !this.sortValue) {
                        tokenList = tokenList.reverse();
                    }
                }
            }
            return tokenList;
        }
        sortBalance() {
            this.sortValue = !this.sortValue;
            if (this.sortValue) {
                this.iconSortUp.classList.add('icon-sorted');
                this.iconSortDown.classList.remove('icon-sorted');
            }
            else {
                this.iconSortUp.classList.remove('icon-sorted');
                this.iconSortDown.classList.add('icon-sorted');
            }
            this.renderTokenList();
        }
        onSearch(source) {
            const value = source.value.toUpperCase();
            if (this.filterValue === value)
                return;
            this.filterValue = source.value.toUpperCase();
            this.renderTokenList();
        }
        renderCommonItems() {
            if (!this.gridCommonToken)
                return;
            this.gridCommonToken.innerHTML = '';
            if (this.isCommonShown && this.commonTokenDataList) {
                this.pnlCommonToken.visible = true;
                this.commonTokenDataList.forEach((token) => {
                    const tokenIconPath = scom_token_list_2.assets.tokenPath(token, this.chainId);
                    this.gridCommonToken.appendChild(this.$render("i-hstack", { background: { color: Theme.background.default }, onClick: () => this.onSelect(token), tooltip: { content: token.name }, verticalAlignment: 'center', padding: { top: '0.35rem', bottom: '0.35rem', left: '0.5rem', right: '0.5rem' }, border: { radius: '1rem', width: '1px', style: 'solid', color: 'transparent' }, gap: "0.5rem", class: 'common-token pointer' },
                        this.$render("i-image", { width: 24, height: 24, url: tokenIconPath, fallbackUrl: scom_token_list_2.assets.fallbackUrl }),
                        this.$render("i-label", { caption: token.symbol })));
                });
            }
            else {
                this.pnlCommonToken.visible = false;
            }
        }
        renderToken(token) {
            const tokenIconPath = scom_token_list_2.assets.tokenPath(token, this.chainId);
            const isActive = this.token && token.address === this.token.address;
            if (isActive)
                this.currentToken = this.token.address;
            const tokenElm = (this.$render("i-hstack", { width: '100%', class: `pointer ${index_css_1.tokenStyle} ${isActive ? ' is-selected' : ''}`, verticalAlignment: 'center', padding: {
                    top: '0.5rem',
                    bottom: '0.5rem',
                    left: '0.75rem',
                    right: '0.75rem',
                }, border: { radius: 5 }, gap: '0.5rem', onClick: () => this.onSelect(token) },
                this.$render("i-vstack", { width: '100%' },
                    this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center' },
                        this.$render("i-hstack", { gap: '0.5rem' },
                            this.$render("i-image", { width: 24, height: 24, url: tokenIconPath, fallbackUrl: scom_token_list_2.assets.fallbackUrl }),
                            this.$render("i-panel", null,
                                this.$render("i-label", { class: "token-symbol", caption: token.symbol, font: { bold: true } }),
                                this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                                    this.$render("i-label", { caption: token.name }),
                                    token.address && !token.isNative ? (this.$render("i-icon", { name: 'copy', width: '14px', height: '14px', display: 'inline-flex', fill: Theme.text.primary, tooltip: {
                                            content: `${token.symbol} has been copied`,
                                            trigger: 'click',
                                        }, onClick: () => components_4.application.copyToClipboard(token.address || '') })) : ([]),
                                    token.address && (0, scom_token_list_2.hasMetaMask)() ? (this.$render("i-image", { display: 'flex', width: 16, height: 16, url: scom_token_list_2.assets.fullPath('img/metamask.png'), tooltip: { content: 'Add to MetaMask' }, onClick: (target, event) => this.addToMetamask(event, token) })) : ([])))),
                        this.$render("i-label", { margin: { left: 'auto' }, caption: (0, utils_2.formatNumber)(token.balance, 4) })),
                    token.isNew ? (this.$render("i-hstack", { horizontalAlignment: 'center' },
                        this.$render("i-button", { caption: 'Import', class: 'btn-import', margin: { top: 10 }, height: 34, onClick: (source, event) => this.showImportTokenModal(tokenElm, event, token) }))) : ([]))));
            this.hstackMap.set(token.address, tokenElm);
            return tokenElm;
        }
        clearTokenList() {
            this.gridTokenList.clearInnerHTML();
            this.gridTokenList.append(this.$render("i-label", { class: 'text-center', caption: 'No tokens found', margin: { top: '1rem', bottom: '1rem' } }));
        }
        renderTokenList() {
            if (!this.gridTokenList)
                return;
            this.renderCommonItems();
            this.gridTokenList.clearInnerHTML();
            this.hstackMap = new Map();
            if (this.tokenDataListFiltered.length) {
                const tokenItems = this.tokenDataListFiltered.map((token) => this.renderToken(token));
                this.gridTokenList.append(...tokenItems);
            }
        }
        addToMetamask(event, token) {
            event.stopPropagation();
            const tokenIconPath = scom_token_list_2.assets.tokenPath(token, this.chainId);
            const img = `${window.location.origin}${tokenIconPath.substring(1)}`;
            window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: token.address,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        image: img,
                    },
                },
            });
        }
        showModal() {
            var _a;
            if (!this.enabled)
                return;
            if (this.inputSearch)
                this.inputSearch.value = '';
            this.filterValue = '';
            this.sortValue = undefined;
            this.iconSortUp.classList.remove('icon-sorted');
            this.iconSortDown.classList.remove('icon-sorted');
            if (!((_a = this.gridTokenList) === null || _a === void 0 ? void 0 : _a.innerHTML))
                this.onRefresh();
            if (this.mdTokenSelection)
                this.mdTokenSelection.visible = true;
            this.gridTokenList.scrollTop = 0;
        }
        closeModal() {
            this.mdTokenSelection.visible = false;
        }
        setActive(token) {
            if (this.currentToken && this.hstackMap.has(this.currentToken)) {
                this.hstackMap.get(this.currentToken).classList.remove('is-selected');
            }
            if (token && this.hstackMap.has(token.address)) {
                this.hstackMap.get(token.address).classList.add('is-selected');
            }
            this.currentToken = (token === null || token === void 0 ? void 0 : token.address) || '';
        }
        async onSelect(token, isNew = false) {
            this._token = token;
            // The token has been not imported
            if (!isNew &&
                token.isNew &&
                !(0, scom_token_list_2.hasUserToken)(token.address || '', this.chainId)) {
                const rpcWallet = (0, utils_2.getRpcWallet)();
                (0, scom_token_list_2.setUserTokens)(token, this.chainId);
                scom_token_list_2.tokenStore.updateTokenMapData(this.chainId);
                await scom_token_list_2.tokenStore.updateAllTokenBalances(rpcWallet);
                this.$eventBus.dispatch("EmitNewToken" /* EventId.EmitNewToken */, token);
                isNew = true;
            }
            this.setActive(token);
            if (this.onSelectToken)
                this.onSelectToken(Object.assign(Object.assign({}, token), { isNew }));
            this.mdTokenSelection.visible = false;
        }
        async init() {
            this.classList.add(index_css_1.default);
            super.init();
            const rpcWalletId = this.getAttribute('rpcWalletId', true);
            if (rpcWalletId)
                this.rpcWalletId = rpcWalletId;
            this.onSelectToken = this.getAttribute('onSelectToken', true) || this.onSelectToken;
            const titleAttr = this.getAttribute('title', true);
            if (titleAttr)
                this.title = titleAttr;
            this.tokenBalancesMapProp = this.getAttribute('tokenBalancesMapProp', true);
            this.tokenDataListProp = this.getAttribute('tokenDataListProp', true, []);
            const token = this.getAttribute('token', true);
            if (token)
                this.token = token;
            this.chainId = this.getAttribute('chainId', true);
            this.isCommonShown = this.getAttribute('isCommonShown', true, false);
            this.isSortBalanceShown = this.getAttribute('isSortBalanceShown', true, true);
            this.importable = this.getAttribute('importable', true, false);
            // await this.onUpdateData()
        }
        showImportTokenModal(target, event, token) {
            event.stopPropagation();
            this.mdImportToken.token = token;
            this.mdImportToken.showModal();
            this.mdImportToken.onUpdate = this.onImportToken.bind(this);
        }
        onImportToken(target, token) {
            this.onSelect(token, true);
        }
        onCloseModal() {
            this.filterValue = '';
        }
        onOpenModal() {
            if (this._title)
                this.title = this._title;
            this.renderTokenList();
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-modal", { id: "mdTokenSelection", width: 440, border: { radius: 8 }, onClose: () => this.onCloseModal(), onOpen: () => this.onOpenModal() },
                    this.$render("i-panel", null,
                        this.$render("i-hstack", { horizontalAlignment: 'space-between', padding: { top: '0.25rem', bottom: '1rem' }, border: {
                                bottom: { width: '2px', style: 'solid', color: Theme.divider },
                            }, margin: { bottom: '1rem' } },
                            this.$render("i-hstack", { id: 'titleStack', gap: '4px' },
                                this.$render("i-label", { caption: 'Select Token', font: {
                                        color: Theme.colors.primary.main,
                                        size: '1rem',
                                        bold: true,
                                    } })),
                            this.$render("i-icon", { name: 'times', fill: Theme.colors.primary.main, width: 16, height: 16, onClick: this.closeModal.bind(this), class: 'pointer' })),
                        this.$render("i-panel", { margin: { bottom: '1rem' } },
                            this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.primary, position: 'absolute', left: 10, top: '50%', class: 'centered' }),
                            this.$render("i-input", { id: 'inputSearch', placeholder: 'Search name or paste address', width: '100%', height: 'auto', border: {
                                    radius: '0.5rem',
                                    width: '1px',
                                    style: 'solid',
                                    color: Theme.divider,
                                }, class: 'search-input', onKeyUp: this.onSearch.bind(this) })),
                        this.$render("i-panel", { id: 'pnlCommonToken', margin: { top: '0.5rem', bottom: '0.5rem' } },
                            this.$render("i-label", { caption: 'Common Token' }),
                            this.$render("i-grid-layout", { id: 'gridCommonToken', columnsPerRow: 4, gap: { row: '0.5rem', column: '1rem' }, verticalAlignment: 'center' })),
                        this.$render("i-hstack", { id: 'pnlSortBalance', horizontalAlignment: 'space-between', verticalAlignment: 'center', class: 'sort-panel', visible: this.isSortBalanceShown },
                            this.$render("i-label", { caption: 'Token', font: { color: Theme.colors.primary.main } }),
                            this.$render("i-panel", { margin: { left: 'auto' }, onClick: () => this.sortBalance() },
                                this.$render("i-label", { caption: 'Balance', margin: { right: '1rem' }, font: { color: Theme.colors.primary.main } }),
                                this.$render("i-icon", { id: 'iconSortUp', class: 'icon-sort-up', name: 'sort-up' }),
                                this.$render("i-icon", { id: 'iconSortDown', class: 'icon-sort-down', name: 'sort-down' }))),
                        this.$render("i-grid-layout", { id: 'gridTokenList', width: '100%', columnsPerRow: 1, templateRows: ['max-content'], gap: { row: '0.5rem' }, class: index_css_1.tokenListStyle }))),
                this.$render("import-token", { id: 'mdImportToken' })));
        }
    };
    __decorate([
        (0, components_4.observable)()
    ], ScomTokenModal.prototype, "sortValue", void 0);
    __decorate([
        (0, components_4.observable)()
    ], ScomTokenModal.prototype, "filterValue", void 0);
    ScomTokenModal = __decorate([
        components_4.customModule,
        (0, components_4.customElements)('i-scom-token-modal')
    ], ScomTokenModal);
    exports.default = ScomTokenModal;
});
