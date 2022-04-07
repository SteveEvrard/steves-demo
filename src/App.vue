<template>
  <div>
    <div class="title">Steve's Demo</div>
    <div v-if="account" class="wallet-display"><span><i class="pi pi-wallet"></i></span> {{ trimAccount(account) }}</div>
    <ConnectButton/>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import ConnectButton from './components/ConnectButton.vue'
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { getAccount } = useUserStore();
const { account } = storeToRefs(userStore); 

onMounted(() => {
  getAccount();
}); 

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
</style>
