<template>
  <div>
    <div class="title">Steve's Demo</div>
    <div v-if="getNetwork()" class="network-warning">Please switch network to Rinkeby</div>
    <div v-if="account" class="wallet-display"><span><i class="pi pi-wallet"></i></span> {{ trimAccount(account) }}</div>
    <ConnectButton/>
    <TokenLists/>
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
</style>
