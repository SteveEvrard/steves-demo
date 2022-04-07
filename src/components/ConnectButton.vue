<template>
    <div class="button-container">
      <Button style="background-color: #00ffe0; color: black;" label="Connect" class="p-button-rounded p-button-lg" v-if="displayConnect && !connecting" @click="connectWallet">Connect</Button>
      <ProgressSpinner strokeWidth="5" v-if="connecting"></ProgressSpinner>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';

const userStore = useUserStore()

const { connecting, displayConnect } = storeToRefs(userStore);
const { connectWallet } = useUserStore();
</script>

<style>
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10vw;
}
</style>