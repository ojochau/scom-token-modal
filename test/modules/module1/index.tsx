import { Module, customModule, Container, Button, Panel } from '@ijstech/components';
import ScomTokenModal from '@scom/scom-token-modal'
@customModule
export default class Module1 extends Module {
    private mainStack: Panel;
    private btnSelect: Button;
    private mbToken1: ScomTokenModal;
    private mbToken2: ScomTokenModal;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    async init() {
        super.init();
        this.mbToken2 = await ScomTokenModal.create({
            importable: true,
            chainId: 43113
        })
        this.mainStack.appendChild(this.mbToken2);
        this.btnSelect.onClick = () => this.mbToken2.showModal()
    }

    private onOpenModal() {
        this.mbToken1.showModal()
    }

    private onSelectToken(token: any) {
        console.log(token)
    }

    render() {
        return <i-vstack gap = "1rem">
            <i-hstack margin={{top: '1rem', left: '1rem'}} gap="2rem">
                <i-button
                    caption='Select token'
                    height={40} width={150}
                    onClick={this.onOpenModal.bind(this)}
                ></i-button>
                <i-scom-token-modal
                    id="mbToken1"
                    isCommonShown={true}
                    token={{
                        "name": "OpenSwap",
                        "address": "0x78d9D80E67bC80A11efbf84B7c8A65Da51a8EF3C",
                        "symbol": "OSWAP",
                        "decimals": 18,
                        "isCommon": true
                    }}
                    onSelectToken={this.onSelectToken.bind(this)}
                ></i-scom-token-modal>
            </i-hstack>
            <i-hstack id="mainStack" margin={{top: '1rem', left: '1rem'}} gap="2rem">
                <i-button
                    id="btnSelect"
                    caption='Select token'
                    height={40} width={150}
                ></i-button>
            </i-hstack>
        </i-vstack>
    }
}