<template>
  <div>
    <div class="title">Steve's Demo</div>
    <div v-if="account" class="wallet-display"><span><i class="pi pi-wallet"></i></span> {{ trimAccount(account) }}</div>
    <div class="button-container">
      <Button style="background-color: #00ffe0; color: black;" label="Connect" class="p-button-rounded p-button-lg" v-if="displayConnect && !connecting" @click="connectWallet">Connect</Button>
      <ProgressSpinner style="color: #00ffe0" strokeWidth="5" v-if="connecting"></ProgressSpinner>
    </div>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { signer } from './ethereum/ethers.js';
import Button from 'primevue/button';

const account = ref<string>('');
const displayConnect = ref<boolean>(true);
const connecting = ref<boolean>(false);


onMounted(() => {
  getAccount();
}); 

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

const trimAccount = (account: string) => {
  return account.substring(0, 6) + '...' + account.substring(38);
}
</script>

<style>
@import '@/assets/base.css';

.title {
  text-align: center;
  font-size: 5vw;
  background-color: #00ffe0;
  color: black;
}

.wallet-display {
  color: #00ffe0;
  font-size: 2vw;
  font-weight: bold;
  margin-right: 1vw;
  text-align: right;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10vw;
}

.button {
  background-color: #00ffe0;
}
</style>
