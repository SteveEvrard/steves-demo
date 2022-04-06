<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { signer } from './ethereum/ethers.js';
import Button from 'primevue/button';

const account = ref<string>('');
const displayConnect = ref<boolean>(true);


onMounted(() => {
  getAccount();
}); 

const connectWallet = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  account.value = accounts[0];
  displayConnect.value = false;
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
</script>

<template>
  <div>
    <div class="title">Steve's Demo</div>
    <div class="button-container">
      <Button style="background-color: #00ffe0; color: black;" label="Connect" class="p-button-rounded p-button-lg" v-if="displayConnect" @click="connectWallet">Connect</Button>
    </div>
  </div>

</template>

<style>
@import '@/assets/base.css';

.title {
  text-align: center;
  font-size: 5vw;
  background-color: #00ffe0;;
  color: black;
}

.button-container {
  display: flex;
  justify-content: center;
}

.button {
  background-color: #00ffe0;
}
</style>
