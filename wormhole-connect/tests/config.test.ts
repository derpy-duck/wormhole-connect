import { MAINNET_NETWORKS, MAINNET_TOKENS } from '../src/config/mainnet';
import { TESTNET_NETWORKS, TESTNET_TOKENS } from '../src/config/testnet';

export const envTests = [{
  title: 'mainnet configs',
  NETWORKS: MAINNET_NETWORKS,
  TOKENS: MAINNET_TOKENS,
}, {
  title: 'testnet configs',
  NETWORKS: TESTNET_NETWORKS,
  TOKENS: TESTNET_TOKENS,
}]

envTests.forEach((env) => {
  const { title, NETWORKS, TOKENS } = env;
  describe(title, () => {
    test('network gas tokens', () => {
      Object.values(NETWORKS).forEach(({gasToken}) => {
        const tokenConfig = TOKENS[gasToken];
        expect(tokenConfig).toBeTruthy();
      });
    })

    test('native tokens have valid wrapped token', () => {
      Object.values(TOKENS).forEach((token) => {
        if (!token.tokenId) {
          expect(token.wrappedAsset).toBeTruthy();
          const wrappedToken = TOKENS[token.wrappedAsset!];
          expect(wrappedToken).toBeTruthy();
        }
      });
    })
  })
})
