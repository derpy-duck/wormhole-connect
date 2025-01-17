import { BigNumber } from 'ethers';
import {
  AnyContracts,
  ParsedMessage,
  ParsedRelayerMessage,
  TokenId,
  ChainName,
  ChainId,
} from '../../types';
import { WormholeContext } from 'wormhole';

/**
 * @abstract
 *
 * A standard set of methods for interacting with the Token Bridge contracts across any of the supported chains
 *
 * @example
 * const context = Wormhole.getContext(chain); // get the chain Context
 * context.send(...); // call any of the supported methods in a standardized uniform fashion
 */
export abstract class TokenBridgeAbstract<TransactionResult> {
  /**
   * A standard set of methods for accessing interfaces for Wormhole contracts on a given chain
   */
  protected abstract contracts: AnyContracts;
  protected abstract context: WormholeContext;

  /**
   * Send a Token Bridge transfer
   *
   * @dev This _must_ be claimed on the destination chain, see {@link WormholeContext#redeem | redeem}
   *
   * @param token The Token Identifier (chain/address) or `'native'` if sending the native token
   * @param amount The token amount to be sent, as a string
   * @param sendingChain The source chain name or id
   * @param senderAddress The address that is dispatching the transfer
   * @param recipientChain The destination chain name or id
   * @param recipientAddress The wallet address where funds will be sent (On solana, this is the associated token account)
   * @param relayerFee A fee that would go to a relayer, if any
   * @returns The transaction receipt
   */
  protected abstract send(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    relayerFee: any,
  ): Promise<TransactionResult>;

  /**
   * Send a Token Bridge transfer with a payload.  The payload is used to convey extra information about a transfer to be utilized in an application
   *
   * @dev This _must_ be claimed on the destination chain, see {@link WormholeContext#redeem | redeem}
   *
   * @param token The Token Identifier (chain/address) or `'native'` if sending the native token
   * @param amount The token amount to be sent, as a string
   * @param sendingChain The source chain name or id
   * @param senderAddress The address that is dispatching the transfer
   * @param recipientChain The destination chain name or id
   * @param recipientAddress The wallet address where funds will be sent (On solana, this is the associated token account)
   * @param payload Arbitrary bytes that can contain any addition information about a given transfer
   * @returns The transaction receipt
   */
  protected abstract sendWithPayload(
    token: TokenId | 'native',
    amount: string,
    sendingChain: ChainName | ChainId,
    senderAddress: string,
    recipientChain: ChainName | ChainId,
    recipientAddress: string,
    payload: any,
  ): Promise<TransactionResult>;

  /**
   * Format an address to a 32-byte universal address, which can be utilized by the Wormhole contracts
   *
   * @param address The address as a string
   * @returns The address as a 32-byte Wormhole address
   */
  protected abstract formatAddress(address: string): any;
  /**
   * Parse an address from a 32-byte universal address to a cannonical address
   *
   * @param address The 32-byte wormhole address
   * @returns The address in the blockchain specific format
   */
  protected abstract parseAddress(address: any): string;

  /**
   * Format a token address to 32-bytes universal address, which can be utilized by the Wormhole contracts
   *
   * How is this different from {@link WormholeContext#formatAddress | formatAddress}? Converting some assets to a universal representation might require querying a registry first
   *
   * @param address The token address as a string
   * @returns The token address as a 32-byte Wormhole address
   */
  protected abstract formatAssetAddress(address: string): Promise<any>;
  /**
   * Parse a token address from a 32-byte universal address to a cannonical token address
   *
   * How is this different from {@link WormholeContext#parseAddress | parseAddress}? Converting some assets from a universal to cannonical representation might require querying a registry first
   *
   * @param address The 32-byte wormhole address
   * @returns The token address in the blockchain specific format
   */
  protected abstract parseAssetAddress(address: any): Promise<string>;

  /**
   * Fetches the address for a token representation on any chain (These are the Wormhole token addresses, not necessarily the cannonical version of that token)
   *
   * @param tokenId The Token ID (chain/address)
   * @param chain The chain name or id
   * @returns The Wormhole address on the given chain, null if it does not exist
   */
  protected abstract getForeignAsset(
    tokenId: TokenId,
    chain: ChainName | ChainId,
  ): Promise<string | null>;
  /**
   * Fetches the address for a token representation on any chain (These are the Wormhole token addresses, not necessarily the cannonical version of that token)
   *
   * @param tokenId The Token ID (chain/address)
   * @param chain The chain name or id
   * @returns The Wormhole address on the given chain
   * @throws Throws if the token does not exist
   */
  protected abstract mustGetForeignAsset(
    tokenId: TokenId,
    chain: ChainName | ChainId,
  ): Promise<string>;
  /**
   * Parses all relevant information from a transaction given the sending tx hash and sending chain
   *
   * @param tx The sending transaction hash
   * @param chain The sending chain name or id
   * @returns The parsed data
   */
  protected abstract parseMessageFromTx(
    tx: string,
    chain: ChainName | ChainId,
  ): Promise<ParsedMessage[] | ParsedRelayerMessage[]>;

  /**
   * Fetches the native token balance for a wallet
   *
   * @param walletAddress The wallet address
   * @param chain The chain name or id
   * @returns The native balance as a BigNumber
   */
  protected abstract getNativeBalance(
    walletAddress: string,
    chain: ChainName | ChainId,
  ): Promise<BigNumber>;
  /**
   * Fetches the balance of a given token for a wallet
   *
   * @param walletAddress The wallet address
   * @param tokenId The token ID (its home chain and address on the home chain)
   * @param chain The chain name or id
   * @returns The token balance of the wormhole asset as a BigNumber
   */
  protected abstract getTokenBalance(
    walletAddress: string,
    tokenId: TokenId,
    chain: ChainName | ChainId,
  ): Promise<BigNumber | null>;

  /**
   * Redeems funds for a token bridge transfer on the destination chain
   *
   * @param destChain The destination chain name or id
   * @param signedVAA The Signed VAA bytes
   * @param overrides Optional overrides, varies between chains
   * @param payerAddr Optional. The address that pays for the redeem transaction, defaults to the sender address if not specified
   * @returns The transaction receipt
   */
  protected abstract redeem(
    destChain: ChainName | ChainId,
    signedVAA: Uint8Array,
    overrides: any,
    payerAddr?: any,
  ): Promise<TransactionResult>;

  /**
   * Checks if a transfer has been completed or not
   *
   * @param destChain The destination chain name or id
   * @param signedVAA The Signed VAA bytes
   * @returns True if the transfer has been completed, otherwise false
   */
  protected abstract isTransferCompleted(
    destChain: ChainName | ChainId,
    signedVaa: string,
  ): Promise<boolean>;
}
