import { ethers, BigNumber } from 'ethers';
import type NFT from '@/types/NFT';
import type ERC20Token from '@/types/ERC20Token';
import { provider } from '@/ethereum/ethers.ts';
import { ref } from 'vue';
import nftABI from '@/ethereum/NFT.json';
import erc20ABI from '@/ethereum/ERC20.json';

const requiresApproval = ref<boolean>(false);

export const checkNFTApproval = async (token: NFT, account: string) => {
    const nftContract = new ethers.Contract(token.token_address, nftABI, provider);
    const nftWithSigner = nftContract.connect(provider.getSigner());
    const approved: boolean = await nftWithSigner.isApprovedForAll(account, '0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c');
    if(!approved) {
        requiresApproval.value = true;
        nftWithSigner.setApprovalForAll('0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c', true); 
    }
}

export const checkERC20Approval = async (token: ERC20Token, account: string) => {
    const erc20Contract = new ethers.Contract(token.token_address, erc20ABI, provider);
    const erc20withSigner = erc20Contract.connect(provider.getSigner());
    const allowance: BigNumber = await erc20withSigner.allowance(account, '0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c');
    const approved: boolean = BigNumber.from(allowance).toBigInt() > 0;
    if(!approved) {
        requiresApproval.value = true;
        erc20withSigner.approve('0xd6d6ba13fDe7DF9cb4014c372fAE713854D4e84c', BigNumber.from(token.balance).toBigInt()); 
    }
}