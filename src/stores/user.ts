import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import { signer } from '../ethereum/ethers.js';

export const useUserStore = defineStore('user', () => {
    const account = ref<string>('');
    const displayConnect = ref<boolean>(true);
    const connecting = ref<boolean>(false);

    const getAccount = async () => {
        if(signer) {
          await signer.getAddress().then((acct: string) => {
            account.value = acct;
            displayConnect.value = false;
          })
          .catch((err: string) => {
            console.log(err);
          });
        }
      }
    
    const connectWallet = async () => {
        connecting.value = true;
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          .catch(() => {
            connecting.value = false
            displayConnect.value = true;
          });
      
        account.value = accounts[0];
        displayConnect.value = false;
        connecting.value = false;
    }

    return { connectWallet, getAccount, account, connecting, displayConnect }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}