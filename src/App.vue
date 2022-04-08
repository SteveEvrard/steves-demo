<template>
  <div>
    <div class="title">Steve's Demo</div>
    <div v-if="getNetwork()" class="network-warning">Please switch network to Rinkeby</div>
    <div v-if="account" class="wallet-display"><span><i class="pi pi-wallet"></i></span> {{ trimAccount(account) }}</div>
    <h1 class="content-header">Select Up to 10 Different Assets</h1>
    <p class="content">Combine as many as 10 ERC20, ERC721, or ERC1155 to bundle together</p>
    <ConnectButton v-if="!account"/>
    <TokenLists v-if="account"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import ConnectButton from './components/ConnectButton.vue'
import { storeToRefs } from 'pinia';
import TokenLists from './components/TokenLists.vue';

const userStore = useUserStore();
const { getAccount } = useUserStore();
const { account } = storeToRefs(userStore);

onMounted(() => {
  getAccount();
}); 

const trimAccount = (account: string) => {
  return account.substring(0, 6) + '...' + account.substring(38);
}

const getNetwork = () => {
  return window.ethereum.networkVersion != '4';
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

.network-warning {
  text-align: center;
  background-color: goldenrod;
  color: black;
}

.content-header {
  text-align: center;
  color: #00ffe0;
  font-size: 4vw;
}

.content {
  text-align: center;
  color: #00ffe0;
  margin-bottom: 2vw;
  font-size: 2vw;
}
</style>
