import { FormatUtils } from "@ijstech/components";
import { BigNumber, Wallet } from "@ijstech/eth-wallet";

export const formatNumber = (value: number | string | BigNumber, decimals?: number) => {
  const minValue = '0.0000001';
  const newValue = typeof value === 'object' ? value.toString() : value;
  return FormatUtils.formatNumber(newValue, { decimalFigures: decimals || 4, minValue });
};

export const getNetworkInfo = (chainId: number): any => {
  return Wallet.getClientInstance().getNetworkInfo(chainId) as any
}

export const viewOnExplorerByAddress = (chainId: number, address: string) => {
  let network = getNetworkInfo(chainId);
  if (network && network.blockExplorerUrls[0]) {
    const url = `${network.blockExplorerUrls[0]}${address}`;
    window.open(url);
  }
}