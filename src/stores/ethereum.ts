import { ethers } from 'ethers';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';

export const useEthereumStore = defineStore('user', () => {
    const account = ref<string>('');
    const loading = ref<boolean>(false);
    
    async function connectWallet() {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account.value = accounts[0];
        
    }

    return { connectWallet, account }
})