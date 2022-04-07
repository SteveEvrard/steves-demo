import type ERC20Token from '@/types/ERC20Token';
import type NFT from '@/types/NFT';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import TokenService from '../services/TokenService';
import { useUserStore } from './user';

export const useTokensStore = defineStore('tokens', () => {
    const userStore = useUserStore();
    const erc20Tokens = ref<ERC20Token[]>([]);
    const nfts = ref<NFT[]>([]);
    const { account } = storeToRefs(userStore);

    const getERC20Tokens = async () => {

        await TokenService.getAllERC20Tokens(account.value).then(resp => {
            erc20Tokens.value = resp.data;
        }); 

    }

    const getNFTs = async () => {
        
        await TokenService.getAllNFTs(account.value).then(resp => {
            nfts.value = resp.data.results;
            // console.log(resp)
        })
    }

    return { getERC20Tokens, getNFTs, nfts, erc20Tokens }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTokensStore, import.meta.hot))
}