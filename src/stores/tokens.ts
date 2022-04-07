import type ERC20Token from '@/types/ERC20Token';
import type NFT from '@/types/NFT';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import TokenService from '../services/TokenService';
import { useUserStore } from './user';

export const useTokensStore = defineStore('tokens', () => {
    const erc20Tokens = ref<ERC20Token[]>([]);
    const nfts = ref<NFT[]>([]);

    const getERC20Tokens = async (address: string) => {

        await TokenService.getAllERC20Tokens(address).then(resp => {
            erc20Tokens.value = resp.data;
        }); 

    }

    const getNFTs = async (address: string) => {
        
        await TokenService.getAllNFTs(address).then(resp => {
            nfts.value = resp.data.result;
        });
        
    }

    return { getERC20Tokens, getNFTs, nfts, erc20Tokens }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTokensStore, import.meta.hot))
}