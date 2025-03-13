import {
  customElements,
  Module,
  Control,
  ControlElement,
  Modal,
  Input,
  Icon,
  Panel,
  observable,
  application,
  Container,
  Styles,
  GridLayout,
  HStack,
  Label,
  customModule
} from '@ijstech/components'
import { } from '@ijstech/eth-contract'
import {
  ChainNativeTokenByChainId,
  tokenStore,
  assets,
  DefaultERC20Tokens,
  ITokenObject
} from '@scom/scom-token-list'
import { formatNumber, hasMetaMask } from './utils'
import { ImportToken } from './importToken'
import customStyle, { tokenListStyle, tokenStyle } from './index.css'
import { Wallet } from '@ijstech/eth-wallet'
import translations from './translations.json'
const Theme = Styles.Theme.ThemeVars

interface ScomTokenModalElement extends ControlElement {
  title?: string;
  chainId?: number;
  token?: ITokenObject;
  tokenDataListProp?: ITokenObject[];
  importable?: boolean;
  isSortBalanceShown?: boolean;
  isCommonShown?: boolean;
  onSelectToken?: (token: ITokenObject) => void
}

declare const window: any

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-token-modal']: ScomTokenModalElement
    }
  }
}

@customModule
@customElements('i-scom-token-modal')
export default class ScomTokenModal extends Module {
  private hstackMap: Map<string, HStack> = new Map()
  private currentToken: string = ''
  private _chainId: number;
  private _token: ITokenObject
  private _title: string | Control = '$select_token'
  private _isCommonShown: boolean = false
  private _isSortBalanceShown: boolean = true
  private _importable: boolean = false
  private _tokenDataListProp: ITokenObject[] = []

  private mdTokenSelection: Modal
  private gridTokenList: GridLayout
  private gridCommonToken: GridLayout
  private pnlCommonToken: Panel
  private pnlSortBalance: Panel
  private mdImportToken: ImportToken
  private titleStack: HStack
  @observable()
  private sortValue: boolean | undefined
  private iconSortUp: Icon
  private iconSortDown: Icon
  private inputSearch: Input
  @observable()
  private filterValue: string

  onSelectToken: (token: ITokenObject) => void

  constructor(parent?: Container, options?: any) {
    super(parent, options)
  }

  static async create(options?: ScomTokenModalElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get token() {
    return this._token
  }
  set token(value: ITokenObject | undefined) {
    this._token = value
    this.setActive(value)
  }

  get chainId(): number {
    return this._chainId
  }
  set chainId(value: number | undefined) {
    this._chainId = value;
  }

  get isCommonShown(): boolean {
    return this._isCommonShown
  }
  set isCommonShown(value: boolean) {
    this._isCommonShown = value
  }

  get isSortBalanceShown(): boolean {
    return this._isSortBalanceShown
  }
  set isSortBalanceShown(value: boolean) {
    this._isSortBalanceShown = value
    if (this.pnlSortBalance)
      this.pnlSortBalance.visible = value
  }

  get importable(): boolean {
    return this._importable
  }
  set importable(value: boolean) {
    this._importable = value
  }

  get title(): any {
    return this._title
  }
  set title(value: string | Control) {
    this._title = value
    let labelEl: Control
    if (typeof value === 'string') {
      labelEl = new Label(undefined, {
        caption: value,
        font: { color: Theme.colors.primary.main, size: '1rem', bold: true },
      })
    } else {
      labelEl = value
    }
    if (!this.titleStack) this.titleStack = new HStack()
    this.titleStack.clearInnerHTML()
    this.titleStack.appendChild(labelEl)
  }

  onRefresh() {
    if (Wallet.getClientInstance().isConnected) {
      if (this.token) {
        const _tokenList = tokenStore.getTokenList(this.chainId)
        const token = _tokenList.find(
          (t) =>
            (t.address && t.address == this.token?.address) ||
            t.symbol == this.token?.symbol
        )
        if (!token) this.token = undefined
        else this.token = token;
      }
    }
    this.renderTokenList();
  }

  get tokenDataListProp(): Array<ITokenObject> {
    return this._tokenDataListProp;
  }

  set tokenDataListProp(value: Array<ITokenObject>) {
    this._tokenDataListProp = value;
  }

  private get tokenListByChainId() {
    let list: ITokenObject[] = [];
    const propList = this.tokenDataListProp.filter(f => !f.chainId || f.chainId === this.chainId);
    const nativeToken = ChainNativeTokenByChainId[this.chainId];
    const tokens = DefaultERC20Tokens[this.chainId];
    for (const token of propList) {
      const tokenAddress = token.address?.toLowerCase();
      if (!tokenAddress || tokenAddress === nativeToken?.symbol?.toLowerCase()) {
        if (nativeToken) list.push({ ...nativeToken, chainId: this.chainId });
      } else {
        const tokenObj = tokens.find(v => v.address?.toLowerCase() === tokenAddress);
        if (tokenObj) list.push({ ...token, chainId: this.chainId });
      }
    }
    return list;
  }

  private get tokenDataList(): ITokenObject[] {
    let tokenList: ITokenObject[] = this.tokenListByChainId.length ? this.tokenListByChainId : tokenStore.getTokenList(this.chainId);
    if (this.tokenDataListProp && this.tokenDataListProp.length) {
      tokenList = this.tokenDataListProp;
    }
    const tokenBalancesMap = tokenStore.getTokenBalancesByChainId(this.chainId);
    return tokenList.map((token: ITokenObject) => {
      const tokenObject = { ...token };
      const nativeToken = ChainNativeTokenByChainId[this.chainId];
      if (nativeToken?.symbol && token.symbol === nativeToken.symbol) {
        Object.assign(tokenObject, { isNative: true })
      }
      if (!Wallet.getClientInstance().isConnected){
        Object.assign(tokenObject, {
          balance: 0,
        })
      }
      else if (tokenBalancesMap) {
        Object.assign(tokenObject, {
          balance: tokenBalancesMap[token.address?.toLowerCase() || token.symbol] || 0,
        })
      }
      return tokenObject;
    }).sort(this.sortToken);
  }

  private get commonTokenDataList(): ITokenObject[] {
    const tokenList: ITokenObject[] = this.tokenDataList;
    if (!tokenList) return [];
    return tokenList.filter((token: ITokenObject) => token.isCommon || token.isNative);
  }

  private get tokenDataListFiltered(): ITokenObject[] {
    let tokenList: ITokenObject[] = this.tokenDataList || [];
    if (tokenList.length) {
      if (this.filterValue) {
        tokenList = tokenList.filter((token: ITokenObject) => {
          return token.symbol.toUpperCase().includes(this.filterValue) ||
            token.name.toUpperCase().includes(this.filterValue) ||
            token.address?.toUpperCase() === this.filterValue;
        });
      }
      if (this.sortValue !== undefined) {
        tokenList = tokenList.sort((a: ITokenObject, b: ITokenObject) => {
          return this.sortToken(a, b, this.sortValue);
        });
        const allBalanceZero = !tokenList.some((token: ITokenObject) => token.balance && token.balance !== '0');
        if (allBalanceZero && !this.sortValue) {
          tokenList = tokenList.reverse();
        }
      }
    }
    return tokenList;
  }

  private sortToken = (a: any, b: any, asc?: boolean) => {
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
  }

  private sortBalance() {
    this.sortValue = !this.sortValue
    if (this.sortValue) {
      this.iconSortUp.fill = Theme.colors.primary.main;
      this.iconSortDown.fill = Theme.text.primary;
    } else {
      this.iconSortUp.fill = Theme.text.primary;
      this.iconSortDown.fill = Theme.colors.primary.main;
    }
    this.renderTokenList()
  }

  private onSearch(source: Control) {
    const value = (source as Input).value.toUpperCase()
    if (this.filterValue === value) return
    this.filterValue = (source as Input).value.toUpperCase()
    this.renderTokenList()
  }

  private renderCommonItems() {
    if (!this.gridCommonToken) return
    this.gridCommonToken.innerHTML = ''
    if (this.isCommonShown && this.commonTokenDataList) {
      this.pnlCommonToken.visible = true
      this.commonTokenDataList.forEach((token: ITokenObject) => {
        const tokenIconPath = token.logoURI || assets.tokenPath(token, this.chainId)
        this.gridCommonToken.appendChild(
          <i-hstack
            background={{ color: Theme.background.default }}
            onClick={() => this.onSelect(token)}
            tooltip={{ content: token.name }}
            verticalAlignment='center'
            padding={{ top: '0.35rem', bottom: '0.35rem', left: '0.5rem', right: '0.5rem' }}
            border={{ radius: '1rem', width: '1px', style: 'solid', color: 'transparent' }}
            cursor='pointer'
            gap="0.5rem"
            class='common-token'
          >
            <i-image
              width={24}
              height={24}
              url={tokenIconPath}
              fallbackUrl={assets.fallbackUrl}
            />
            <i-label caption={token.symbol}></i-label>
          </i-hstack>
        )
      })
    } else {
      this.pnlCommonToken.visible = false
    }
  }

  private renderToken(token: ITokenObject) {
    const tokenIconPath = assets.tokenPath(token, this.chainId)
    const isActive = this.token && token.address === this.token.address;
    if (isActive)
      this.currentToken = this.token.address
    const tokenElm = (
      <i-hstack
        width='100%'
        class={`pointer ${tokenStyle}`}
        background={{color: isActive ? Theme.action.active : ''}}
        verticalAlignment='center'
        padding={
          {
            top: '0.5rem',
            bottom: '0.5rem',
            left: '0.75rem',
            right: '0.75rem',
          }
        }
        border={{ radius: 5 }}
        gap='0.5rem'
        onClick={() => this.onSelect(token)}
      >
        <i-vstack width='100%'>
          <i-hstack gap='0.5rem' verticalAlignment='center'>
            <i-hstack gap='0.5rem'>
              <i-image
                width={24}
                height={24}
                url={tokenIconPath}
                fallbackUrl={assets.fallbackUrl}
              />
              <i-panel>
                <i-label caption={token.symbol} font={{ weight: 600 }} />
                <i-hstack
                  verticalAlignment='center'
                  gap='0.5rem'
                >
                  <i-label caption={token.name} />
                  {token.address && !token.isNative ? (
                    <i-icon
                      name='copy'
                      width='14px'
                      height='14px'
                      display='inline-flex'
                      fill={Theme.text.primary}
                      tooltip={{
                        content: this.i18n.get('$has_been_copied', { token: token.symbol }),
                        trigger: 'click',
                      }}
                      onClick={() => application.copyToClipboard(token.address || '')}
                    ></i-icon>
                  ) : (
                    []
                  )}
                  {token.address && hasMetaMask() ? (
                    <i-image
                      display='flex'
                      width={16}
                      height={16}
                      url={assets.fullPath('img/metamask.png')}
                      tooltip={{ content: '$add_to_metamask' }}
                      onClick={(target: Control, event: Event) => this.addToMetamask(event, token)}
                    ></i-image>
                  ) : (
                    []
                  )}
                </i-hstack>
              </i-panel>
            </i-hstack>
            <i-label
              margin={{ left: 'auto' }}
              caption={formatNumber(token.balance, 4)}
            />
          </i-hstack>
          {token.isNew ? (
            <i-hstack horizontalAlignment='center'>
              <i-button
                caption='$import'
                margin={{ top: 10 }}
                height={34}
                border={{radius: 5}}
                background={{color: Theme.background.gradient}}
                font={{color: Theme.colors.primary.contrastText, size: '1rem'}}
                padding={{top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem'}}
                onClick={(source: Control, event: Event) =>
                  this.showImportTokenModal(tokenElm, event, token)
                }
              ></i-button>
            </i-hstack>
          ) : (
            []
          )}
        </i-vstack>
      </i-hstack>
    )
    this.hstackMap.set(token.address, tokenElm)
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

  private renderTokenList() {
    if (!this.gridTokenList) return
    this.renderCommonItems()
    this.gridTokenList.clearInnerHTML()
    this.hstackMap = new Map()
    if (this.tokenDataListFiltered.length) {
      const tokenItems = this.tokenDataListFiltered.map((token: ITokenObject) =>
        this.renderToken(token)
      )
      this.gridTokenList.append(...tokenItems)
    } 
  }

  private addToMetamask(event: Event, token: ITokenObject) {
    event.stopPropagation()
    const tokenIconPath = assets.tokenPath(token, this.chainId)
    const img = `${window.location.origin}/${tokenIconPath.substring(1)}`
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
    })
  }

  showModal() {
    if (!this.enabled) return
    if (!this.gridTokenList?.innerHTML) this.onRefresh()
    if (this.mdTokenSelection) {
      this.mdTokenSelection.maxWidth = this.maxWidth ?? '440px';
      if (this.minWidth) this.mdTokenSelection.minWidth = this.minWidth;
      if (this.background?.color) {
        this.mdTokenSelection.background.color = this.background.color;
      }
      this.mdTokenSelection.visible = true
    }
    if (this.gridTokenList) {
      this.gridTokenList.maxHeight = this.maxHeight ?? '50vh';
      this.gridTokenList.scrollTop = 0
    }
  }

  closeModal() {
    this.mdTokenSelection.visible = false
  }

  private setActive(token: ITokenObject | undefined) {
    if (this.currentToken && this.hstackMap.has(this.currentToken)) {
      this.hstackMap.get(this.currentToken).background.color = ''
    }
    if (token && this.hstackMap.has(token.address)) {
      this.hstackMap.get(token.address).background.color = Theme.action.active;
    }
    this.currentToken = token?.address || ''
  }

  private async onSelect(token: ITokenObject, isNew: boolean = false) {
    this._token = token
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
    this.setActive(token)
    if (this.onSelectToken)
      this.onSelectToken({ ...token, isNew })
    this.mdTokenSelection.visible = false
  }

  async init() {
    this.i18n.init({...translations})
    this.classList.add(customStyle)
    super.init()
    this.onSelectToken = this.getAttribute('onSelectToken', true) || this.onSelectToken
    const titleAttr = this.getAttribute('title', true)
    if (titleAttr) this.title = titleAttr
    this.tokenDataListProp = this.getAttribute('tokenDataListProp', true, [])
    const token = this.getAttribute('token', true)
    if (token) this.token = token
    this.chainId = this.getAttribute('chainId', true)
    this.isCommonShown = this.getAttribute('isCommonShown', true, false)
    this.isSortBalanceShown = this.getAttribute('isSortBalanceShown', true, true)
    this.importable = this.getAttribute('importable', true, false)
  }

  showImportTokenModal(target: Control, event: Event, token: ITokenObject) {
    event.stopPropagation()
    this.mdImportToken.token = token
    this.mdImportToken.showModal()
    this.mdImportToken.onUpdate = this.onImportToken.bind(this)
  }

  onImportToken(target: Control, token: ITokenObject) {
    this.onSelect(token, true)
  }

  onCloseModal() {
    this.filterValue = ''
    if (this.inputSearch) this.inputSearch.value = ''
    this.filterValue = ''
    this.sortValue = undefined
    this.iconSortUp.fill = Theme.text.primary;
    this.iconSortDown.fill = Theme.text.primary;
  }

  onOpenModal() {
    if (this._title) this.title = this._title
    this.renderTokenList();
  }

  render() {
    return (
      <i-panel>
        <i-modal
          id="mdTokenSelection"
          width={440}
          border={{ radius: 8 }}
          onClose={() => this.onCloseModal()}
          onOpen={() => this.onOpenModal()}
        >
          <i-panel>
            <i-hstack
              horizontalAlignment='space-between'
              padding={{ top: '0.25rem', bottom: '1rem' }}
              border={{
                bottom: { width: '2px', style: 'solid', color: Theme.divider },
              }}
              margin={{ bottom: '1rem' }}
            >
              <i-hstack id='titleStack' gap='4px'>
                <i-label
                  caption='$select_token'
                  font={{
                    color: Theme.colors.primary.main,
                    size: '1rem',
                    bold: true,
                  }}
                ></i-label>
              </i-hstack>
              <i-icon
                name='times'
                fill={Theme.colors.primary.main}
                width={16}
                height={16}
                onClick={this.closeModal.bind(this)}
                class='pointer'
              ></i-icon>
            </i-hstack>
            <i-panel margin={{ bottom: '1rem' }}>
              <i-icon
                width={16}
                height={16}
                name='search'
                fill={Theme.text.primary}
                position='absolute'
                left={10}
                top='50%'
                class='centered'
              />
              <i-input
                id='inputSearch'
                placeholder='$search_name_or_paste_address'
                width='100%'
                height='auto'
                border={{
                  radius: '0.5rem',
                  width: '1px',
                  style: 'solid',
                  color: Theme.divider,
                }}
                background={{color: Theme.input.background}}
                padding={{top: '1rem', right: '1rem', bottom: '1rem', left: '2.25rem'}}
                onKeyUp={this.onSearch.bind(this)}
              ></i-input>
            </i-panel>
            <i-panel id='pnlCommonToken' margin={{ top: '0.5rem', bottom: '0.5rem' }}>
              <i-label caption='$common_token' />
              <i-grid-layout
                id='gridCommonToken'
                columnsPerRow={4}
                gap={{ row: '0.5rem', column: '1rem' }}
                verticalAlignment='center'
              ></i-grid-layout>
            </i-panel>
            <i-hstack
              id='pnlSortBalance'
              horizontalAlignment='space-between'
              verticalAlignment='center'
              margin={{top: '0.5rem', bottom: '0.5rem'}}
              visible={this.isSortBalanceShown}
            >
              <i-label
                caption='$token'
                font={{ color: Theme.colors.primary.main }}
              />
              <i-panel margin={{ left: 'auto' }} onClick={() => this.sortBalance()}>
                <i-label
                  caption='$balance'
                  margin={{ right: '1rem' }}
                  font={{ color: Theme.colors.primary.main }}
                />
                <i-icon
                  id='iconSortUp'
                  name='sort-up'
                  width={10}
                  height={14}
                  display='flex'
                  fill={Theme.text.primary}
                  position='absolute'
                  right="0px" top='2px'
                  class="pointer"
                ></i-icon>
                <i-icon
                  id='iconSortDown'
                  name='sort-down'
                  width={10}
                  height={14}
                  display='flex'
                  fill={Theme.text.primary}
                  position='absolute'
                  right="0px" bottom='2px'
                  class="pointer"
                ></i-icon>
              </i-panel>
            </i-hstack>
            <i-grid-layout
              id='gridTokenList'
              width='100%'
              columnsPerRow={1}
              templateRows={['max-content']}
              gap={{ row: '0.5rem' }}
              maxHeight={'50vh'} overflow={{y: 'auto'}}
              class={tokenListStyle}
            ></i-grid-layout>
          </i-panel>
        </i-modal>
        <import-token id='mdImportToken' />
      </i-panel>
    )
  }
}
