var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-token-modal/utils.ts", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet"], function (require, exports, components_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.hasMetaMask = exports.viewOnExplorerByAddress = exports.getNetworkInfo = exports.formatNumber = void 0;
    const formatNumber = (value, decimals) => {
        const minValue = '0.0000001';
        const newValue = typeof value === 'object' ? value.toFixed() : value;
        return components_1.FormatUtils.formatNumber(newValue, { decimalFigures: decimals || 4, minValue });
    };
    exports.formatNumber = formatNumber;
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
    const hasMetaMask = function () {
        const wallet = eth_wallet_1.Wallet.getClientInstance();
        return wallet?.clientSideProvider?.name === 'metamask';
    };
    exports.hasMetaMask = hasMetaMask;
});
define("@scom/scom-token-modal/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-token-modal/translations.json.ts'/> 
    exports.default = {
        "en": {
            "add_to_metamask": "Add to MetaMask",
            "anyone_can_create_a_token_including_creating_fake_versions_of_existing_token_that_claims_tp_represent_projects": "Anyone can create a token, including creating fake versions of existing token that claims tp represent projects",
            "balance": "Balance",
            "common_token": "Common Token",
            "has_been_copied": "{{token}} has been copied",
            "i_understand": "I understand",
            "if_you_purchased_this_token_you_may_not_be_to_able_sell_it_back": "If you purchased this token, you may not be to able sell it back",
            "import": "Import",
            "no_token_found": "No Token Found",
            "search_name_or_paste_address": "Search name or paste address",
            "select_token": "Select Token",
            "token": "Token",
            "trade_at_your_own_risk": "Trade at your own risk!",
            "unknown_source": "Unknown Source"
        },
        "zh-hant": {
            "add_to_metamask": "添加到 MetaMask",
            "anyone_can_create_a_token_including_creating_fake_versions_of_existing_token_that_claims_tp_represent_projects": "任何人都可以創建代幣，包括創建現有代幣的假版本，聲稱代表項目",
            "balance": "餘額",
            "common_token": "常見代幣",
            "has_been_copied": "{{token}} 已被複製",
            "i_understand": "我明白",
            "if_you_purchased_this_token_you_may_not_be_to_able_sell_it_back": "如果您購買了此代幣，您可能無法將其賣回",
            "import": "導入",
            "no_token_found": "未找到代幣",
            "search_name_or_paste_address": "搜索名稱或粘貼地址",
            "select_token": "選擇代幣",
            "token": "代幣",
            "trade_at_your_own_risk": "自行承擔交易風險！",
            "unknown_source": "未知來源"
        },
        "vi": {
            "add_to_metamask": "Thêm vào MetaMask",
            "anyone_can_create_a_token_including_creating_fake_versions_of_existing_token_that_claims_tp_represent_projects": "Bất kỳ ai cũng có thể tạo token, bao gồm việc tạo các phiên bản giả của token hiện có và tuyên bố đại diện cho các dự án",
            "balance": "Số dư",
            "common_token": "Token phổ biến",
            "has_been_copied": "{{token}} đã được sao chép",
            "i_understand": "Tôi hiểu",
            "if_you_purchased_this_token_you_may_not_be_to_able_sell_it_back": "Nếu bạn đã mua token này, có thể bạn sẽ không thể bán lại nó",
            "import": "Nhập",
            "no_token_found": "Không tìm thấy Token",
            "search_name_or_paste_address": "Tìm kiếm tên hoặc địa chỉ",
            "select_token": "Chọn Token",
            "token": "Token",
            "trade_at_your_own_risk": "Giao dịch rủi ro của bạn!",
            "unknown_source": "Nguồn không xác định"
        }
    };
});
define("@scom/scom-token-modal/importToken.tsx", ["require", "exports", "@ijstech/components", "@ijstech/eth-wallet", "@scom/scom-token-modal/utils.ts", "@scom/scom-token-modal/translations.json.ts"], function (require, exports, components_2, eth_wallet_2, utils_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImportToken = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    ;
    let ImportToken = class ImportToken extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this._state = {
                address: '',
                name: ''
            };
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
            // const chainId = getChainId();
            // addUserTokens(chainId, tokenObj);
            // const rpcWallet = getRpcWallet();
            // tokenStore.updateTokenMapData(chainId);
            // await tokenStore.updateAllTokenBalances(rpcWallet);
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
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.importModal.onClose = () => {
                this.tokenAgreeCheckBox.checked = false;
                this.importBtn.enabled = false;
            };
        }
        render() {
            return (this.$render("i-modal", { id: "importModal", class: "bg-modal", title: "$select_token", closeIcon: { name: 'times' } },
                this.$render("i-panel", { class: "pnl-token-import" },
                    this.$render("i-panel", null,
                        this.$render("i-icon", { name: "question", class: "cicrle", fill: "#e83e8c", width: 15, height: 15, margin: { right: 3 } }),
                        this.$render("i-label", { caption: this._state.name })),
                    this.$render("i-hstack", { margin: { top: 5, bottom: 5 } },
                        this.$render("i-label", { caption: this._state.address, font: { color: '#1890ff' }, class: "pointer", onClick: () => this.viewContract() })),
                    this.$render("i-panel", { class: "btn-source-panel" },
                        this.$render("i-icon", { name: "exclamation-triangle", margin: { right: 3 }, fill: "#fff", width: 15, height: 15 }),
                        this.$render("i-label", { caption: "Unknown Source" }))),
                this.$render("i-panel", { class: "pnl-token-import" },
                    this.$render("i-hstack", { horizontalAlignment: "center", margin: { bottom: 5 } },
                        this.$render("i-icon", { name: "exclamation-triangle", margin: { right: 3 }, fill: "#e83e8c", width: 30, height: 30 })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { font: { bold: true }, caption: "$trade_at_your_own_risk" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { caption: "$anyone_can_create_a_token_including_creating_fake_versions_of_existing_token_that_claims_tp_represent_projects" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center", margin: { bottom: 5 } },
                        this.$render("i-label", { width: 300, font: { bold: true }, caption: "$if_you_purchased_this_token_you_may_not_be_to_able_sell_it_back" })),
                    this.$render("i-hstack", { horizontalAlignment: "center", class: "text-center" },
                        this.$render("i-checkbox", { id: "tokenAgreeCheckBox", width: "200", margin: { top: 30 }, height: 30, class: "token-agree-input", background: { color: 'transparent' }, caption: "$i_understand", onChanged: this.onHandleCheck.bind(this) }))),
                this.$render("i-button", { id: "importBtn", width: "100%", caption: "$import", height: 40, border: { radius: 5 }, background: { color: Theme.background.gradient }, font: { color: Theme.colors.primary.contrastText, size: '1rem' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem' }, enabled: false, onClick: this.onImportToken.bind(this) })));
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
                background: Theme.action.hoverBackground
            }
        }
    });
    exports.tokenListStyle = components_3.Styles.style({
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
            '.centered': {
                transform: 'translateY(-50%)'
            },
            '.pointer': {
                cursor: 'pointer'
            },
            '.common-token:hover': {
                border: `1px solid ${Theme.colors.primary.main}`
            }
        }
    });
});
define("@scom/scom-token-modal", ["require", "exports", "@ijstech/components", "@scom/scom-token-list", "@scom/scom-token-modal/utils.ts", "@scom/scom-token-modal/index.css.ts", "@ijstech/eth-wallet", "@scom/scom-token-modal/translations.json.ts"], function (require, exports, components_4, scom_token_list_1, utils_2, index_css_1, eth_wallet_3, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomTokenModal = class ScomTokenModal extends components_4.Module {
        constructor(parent, options) {
            super(parent, options);
            this.hstackMap = new Map();
            this.currentToken = '';
            this._title = '$select_token';
            this._isCommonShown = false;
            this._isSortBalanceShown = true;
            this._importable = false;
            this._tokenDataListProp = [];
            this.sortToken = (a, b, asc) => {
                if (a.balance != b.balance) {
                    return asc ? (a.balance - b.balance) : (b.balance - a.balance);
                }
                if (a.symbol?.toLowerCase() < b.symbol?.toLowerCase()) {
                    return -1;
                }
                if (a.symbol?.toLowerCase() > b.symbol?.toLowerCase()) {
                    return 1;
                }
                return 0;
            };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get token() {
            return this._token;
        }
        set token(value) {
            this._token = value;
            this.setActive(value);
        }
        get chainId() {
            return this._chainId;
        }
        set chainId(value) {
            this._chainId = value;
        }
        get isCommonShown() {
            return this._isCommonShown;
        }
        set isCommonShown(value) {
            this._isCommonShown = value;
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
            if (eth_wallet_3.Wallet.getClientInstance().isConnected) {
                if (this.token) {
                    const _tokenList = scom_token_list_1.tokenStore.getTokenList(this.chainId);
                    const token = _tokenList.find((t) => (t.address && t.address == this.token?.address) ||
                        t.symbol == this.token?.symbol);
                    if (!token)
                        this.token = undefined;
                    else
                        this.token = token;
                }
            }
            this.renderTokenList();
        }
        get tokenDataListProp() {
            return this._tokenDataListProp;
        }
        set tokenDataListProp(value) {
            this._tokenDataListProp = value;
        }
        get tokenListByChainId() {
            let list = [];
            const propList = this.tokenDataListProp.filter(f => !f.chainId || f.chainId === this.chainId);
            const nativeToken = scom_token_list_1.ChainNativeTokenByChainId[this.chainId];
            const tokens = scom_token_list_1.DefaultERC20Tokens[this.chainId];
            for (const token of propList) {
                const tokenAddress = token.address?.toLowerCase();
                if (!tokenAddress || tokenAddress === nativeToken?.symbol?.toLowerCase()) {
                    if (nativeToken)
                        list.push({ ...nativeToken, chainId: this.chainId });
                }
                else {
                    const tokenObj = tokens.find(v => v.address?.toLowerCase() === tokenAddress);
                    if (tokenObj)
                        list.push({ ...token, chainId: this.chainId });
                }
            }
            return list;
        }
        get tokenDataList() {
            let tokenList = this.tokenListByChainId.length ? this.tokenListByChainId : scom_token_list_1.tokenStore.getTokenList(this.chainId);
            if (this.tokenDataListProp && this.tokenDataListProp.length) {
                tokenList = this.tokenDataListProp;
            }
            const tokenBalancesMap = scom_token_list_1.tokenStore.getTokenBalancesByChainId(this.chainId);
            return tokenList.map((token) => {
                const tokenObject = { ...token };
                const nativeToken = scom_token_list_1.ChainNativeTokenByChainId[this.chainId];
                if (nativeToken?.symbol && token.symbol === nativeToken.symbol) {
                    Object.assign(tokenObject, { isNative: true });
                }
                if (!eth_wallet_3.Wallet.getClientInstance().isConnected) {
                    Object.assign(tokenObject, {
                        balance: 0,
                    });
                }
                else if (tokenBalancesMap) {
                    Object.assign(tokenObject, {
                        balance: tokenBalancesMap[token.address?.toLowerCase() || token.symbol] || 0,
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
                        return token.symbol.toUpperCase().includes(this.filterValue) ||
                            token.name.toUpperCase().includes(this.filterValue) ||
                            token.address?.toUpperCase() === this.filterValue;
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
                this.iconSortUp.fill = Theme.colors.primary.main;
                this.iconSortDown.fill = Theme.text.primary;
            }
            else {
                this.iconSortUp.fill = Theme.text.primary;
                this.iconSortDown.fill = Theme.colors.primary.main;
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
                    const tokenIconPath = token.logoURI || scom_token_list_1.assets.tokenPath(token, this.chainId);
                    this.gridCommonToken.appendChild(this.$render("i-hstack", { background: { color: Theme.background.default }, onClick: () => this.onSelect(token), tooltip: { content: token.name }, verticalAlignment: 'center', padding: { top: '0.35rem', bottom: '0.35rem', left: '0.5rem', right: '0.5rem' }, border: { radius: '1rem', width: '1px', style: 'solid', color: 'transparent' }, cursor: 'pointer', gap: "0.5rem", class: 'common-token' },
                        this.$render("i-image", { width: 24, height: 24, url: tokenIconPath, fallbackUrl: scom_token_list_1.assets.fallbackUrl }),
                        this.$render("i-label", { caption: token.symbol })));
                });
            }
            else {
                this.pnlCommonToken.visible = false;
            }
        }
        renderToken(token) {
            const tokenIconPath = scom_token_list_1.assets.tokenPath(token, this.chainId);
            const isActive = this.token && token.address === this.token.address;
            if (isActive)
                this.currentToken = this.token.address;
            const tokenElm = (this.$render("i-hstack", { width: '100%', class: `pointer ${index_css_1.tokenStyle}`, background: { color: isActive ? Theme.action.active : '' }, verticalAlignment: 'center', padding: {
                    top: '0.5rem',
                    bottom: '0.5rem',
                    left: '0.75rem',
                    right: '0.75rem',
                }, border: { radius: 5 }, gap: '0.5rem', onClick: () => this.onSelect(token) },
                this.$render("i-vstack", { width: '100%' },
                    this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center' },
                        this.$render("i-hstack", { gap: '0.5rem' },
                            this.$render("i-image", { width: 24, height: 24, url: tokenIconPath, fallbackUrl: scom_token_list_1.assets.fallbackUrl }),
                            this.$render("i-panel", null,
                                this.$render("i-label", { caption: token.symbol, font: { weight: 600 } }),
                                this.$render("i-hstack", { verticalAlignment: 'center', gap: '0.5rem' },
                                    this.$render("i-label", { caption: token.name }),
                                    token.address && !token.isNative ? (this.$render("i-icon", { name: 'copy', width: '14px', height: '14px', display: 'inline-flex', fill: Theme.text.primary, tooltip: {
                                            content: this.i18n.get('$has_been_copied', { token: token.symbol }),
                                            trigger: 'click',
                                        }, onClick: () => components_4.application.copyToClipboard(token.address || '') })) : ([]),
                                    token.address && (0, utils_2.hasMetaMask)() ? (this.$render("i-image", { display: 'flex', width: 16, height: 16, url: scom_token_list_1.assets.fullPath('img/metamask.png'), tooltip: { content: '$add_to_metamask' }, onClick: (target, event) => this.addToMetamask(event, token) })) : ([])))),
                        this.$render("i-label", { margin: { left: 'auto' }, caption: (0, utils_2.formatNumber)(token.balance, 4) })),
                    token.isNew ? (this.$render("i-hstack", { horizontalAlignment: 'center' },
                        this.$render("i-button", { caption: '$import', margin: { top: 10 }, height: 34, border: { radius: 5 }, background: { color: Theme.background.gradient }, font: { color: Theme.colors.primary.contrastText, size: '1rem' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem' }, onClick: (source, event) => this.showImportTokenModal(tokenElm, event, token) }))) : ([]))));
            this.hstackMap.set(token.address, tokenElm);
            return tokenElm;
        }
        // private clearTokenList() {
        //   this.gridTokenList.clearInnerHTML()
        //   this.gridTokenList.append(
        //     <i-label
        //       class='text-center'
        //       caption='No tokens found'
        //       margin={{ top: '1rem', bottom: '1rem' }}
        //     />
        //   )
        // }
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
            const tokenIconPath = scom_token_list_1.assets.tokenPath(token, this.chainId);
            const img = `${window.location.origin}/${tokenIconPath.substring(1)}`;
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
            if (!this.enabled)
                return;
            if (!this.gridTokenList?.innerHTML)
                this.onRefresh();
            if (this.mdTokenSelection) {
                this.mdTokenSelection.maxWidth = this.maxWidth ?? '440px';
                if (this.minWidth)
                    this.mdTokenSelection.minWidth = this.minWidth;
                if (this.background?.color) {
                    this.mdTokenSelection.background.color = this.background.color;
                }
                this.mdTokenSelection.visible = true;
            }
            if (this.gridTokenList) {
                this.gridTokenList.maxHeight = this.maxHeight ?? '50vh';
                this.gridTokenList.scrollTop = 0;
            }
        }
        closeModal() {
            this.mdTokenSelection.visible = false;
        }
        setActive(token) {
            if (this.currentToken && this.hstackMap.has(this.currentToken)) {
                this.hstackMap.get(this.currentToken).background.color = '';
            }
            if (token && this.hstackMap.has(token.address)) {
                this.hstackMap.get(token.address).background.color = Theme.action.active;
            }
            this.currentToken = token?.address || '';
        }
        async onSelect(token, isNew = false) {
            this._token = token;
            // The token has been not imported
            // if (
            //   !isNew &&
            //   token.isNew &&
            //   !hasUserToken(token.address || '', this.chainId)
            // ) {
            //   const rpcWallet = getRpcWallet();
            //   setUserTokens(token, this.chainId)
            //   tokenStore.updateTokenMapData(this.chainId);
            //   await tokenStore.updateAllTokenBalances(rpcWallet);
            //   isNew = true
            // }
            this.setActive(token);
            if (this.onSelectToken)
                this.onSelectToken({ ...token, isNew });
            this.mdTokenSelection.visible = false;
        }
        async init() {
            this.i18n.init({ ...translations_json_2.default });
            this.classList.add(index_css_1.default);
            super.init();
            this.onSelectToken = this.getAttribute('onSelectToken', true) || this.onSelectToken;
            const titleAttr = this.getAttribute('title', true);
            if (titleAttr)
                this.title = titleAttr;
            this.tokenDataListProp = this.getAttribute('tokenDataListProp', true, []);
            const token = this.getAttribute('token', true);
            if (token)
                this.token = token;
            this.chainId = this.getAttribute('chainId', true);
            this.isCommonShown = this.getAttribute('isCommonShown', true, false);
            this.isSortBalanceShown = this.getAttribute('isSortBalanceShown', true, true);
            this.importable = this.getAttribute('importable', true, false);
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
            if (this.inputSearch)
                this.inputSearch.value = '';
            this.filterValue = '';
            this.sortValue = undefined;
            this.iconSortUp.fill = Theme.text.primary;
            this.iconSortDown.fill = Theme.text.primary;
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
                                this.$render("i-label", { caption: '$select_token', font: {
                                        color: Theme.colors.primary.main,
                                        size: '1rem',
                                        bold: true,
                                    } })),
                            this.$render("i-icon", { name: 'times', fill: Theme.colors.primary.main, width: 16, height: 16, onClick: this.closeModal.bind(this), class: 'pointer' })),
                        this.$render("i-panel", { margin: { bottom: '1rem' } },
                            this.$render("i-icon", { width: 16, height: 16, name: 'search', fill: Theme.text.primary, position: 'absolute', left: 10, top: '50%', class: 'centered' }),
                            this.$render("i-input", { id: 'inputSearch', placeholder: '$search_name_or_paste_address', width: '100%', height: 'auto', border: {
                                    radius: '0.5rem',
                                    width: '1px',
                                    style: 'solid',
                                    color: Theme.divider,
                                }, background: { color: Theme.input.background }, padding: { top: '1rem', right: '1rem', bottom: '1rem', left: '2.25rem' }, onKeyUp: this.onSearch.bind(this) })),
                        this.$render("i-panel", { id: 'pnlCommonToken', margin: { top: '0.5rem', bottom: '0.5rem' } },
                            this.$render("i-label", { caption: '$common_token' }),
                            this.$render("i-grid-layout", { id: 'gridCommonToken', columnsPerRow: 4, gap: { row: '0.5rem', column: '1rem' }, verticalAlignment: 'center' })),
                        this.$render("i-hstack", { id: 'pnlSortBalance', horizontalAlignment: 'space-between', verticalAlignment: 'center', margin: { top: '0.5rem', bottom: '0.5rem' }, visible: this.isSortBalanceShown },
                            this.$render("i-label", { caption: '$token', font: { color: Theme.colors.primary.main } }),
                            this.$render("i-panel", { margin: { left: 'auto' }, onClick: () => this.sortBalance() },
                                this.$render("i-label", { caption: '$balance', margin: { right: '1rem' }, font: { color: Theme.colors.primary.main } }),
                                this.$render("i-icon", { id: 'iconSortUp', name: 'sort-up', width: 10, height: 14, display: 'flex', fill: Theme.text.primary, position: 'absolute', right: "0px", top: '2px', class: "pointer" }),
                                this.$render("i-icon", { id: 'iconSortDown', name: 'sort-down', width: 10, height: 14, display: 'flex', fill: Theme.text.primary, position: 'absolute', right: "0px", bottom: '2px', class: "pointer" }))),
                        this.$render("i-grid-layout", { id: 'gridTokenList', width: '100%', columnsPerRow: 1, templateRows: ['max-content'], gap: { row: '0.5rem' }, maxHeight: '50vh', overflow: { y: 'auto' }, class: index_css_1.tokenListStyle }))),
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
