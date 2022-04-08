import type ERC20Token from '@/types/ERC20Token';
import type NFT from '@/types/NFT';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import TokenService from '../services/TokenService';

export const useTokensStore = defineStore('tokens', () => {
    const erc20Tokens = ref<ERC20Token[]>([]);
    const nfts = ref<NFT[]>([]);

    const getERC20Tokens = async (address: string) => {

        await TokenService.getAllERC20Tokens(address).then(resp => {
            erc20Tokens.value = resp.data.map((token: ERC20Token) => {
                return {...token, contract_type: 'ERC20', token_id: 0}
            });
        }); 

    }

    const getNFTs = async (address: string) => {
        
        await TokenService.getAllNFTs(address).then(resp => {
            nfts.value = resp.data.result.filter((token: NFT) => {
                return token.token_address != '0xd6d6ba13fde7df9cb4014c372fae713854d4e84c';
            });
        });

    }

    return { getERC20Tokens, getNFTs, nfts, erc20Tokens }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useTokensStore, import.meta.hot))
}