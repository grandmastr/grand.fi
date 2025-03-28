import { shuffleArray } from '@/utils';

const ethRPCList = [
  'https://eth.llamarpc.com',
  'https://ethereum.publicnode.com',
  'https://rpc.ankr.com/eth',
  'https://eth-mainnet.public.blastapi.io',
];

const optRPCList = [
  'https://mainnet.optimism.io',
  'https://op-pokt.nodies.app',
  'https://optimism.meowrpc.com',
];

const arbRPCList = [
  'https://arb1.arbitrum.io/rpc',
  'https://arb-pokt.nodies.app',
  'https://arbitrum.meowrpc.com',
];

const basRPCList = [
  'https://mainnet.base.org/',
  'https://base.meowrpc.com',
  'https://base-pokt.nodies.app',
];

export const publicRPCList = {
  '1': shuffleArray(ethRPCList),
  '10': shuffleArray(optRPCList),
  '42161': shuffleArray(arbRPCList),
  '8453': shuffleArray(basRPCList),
};
