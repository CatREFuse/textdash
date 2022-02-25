<script setup lang='ts'>
import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'
import { onMounted, ref } from 'vue';
import { handleEvent, dispatch } from './uiMessageHandler';

let textNodeArray = ref([] as TextNode[])

onMounted(() => {
  handleEvent("selectionchange", data => {
    console.log("ui detect change");
    textNodeArray.value = data.textNodeArray
  })
})

function handleChange(event: Event, textNode: TextNode) {
  dispatch('change-text', { id: textNode.id, characters: textNode.characters })
}


</script>


<template>
  <div id="ui">
    <h3>Text Dash</h3>
    <p>🖋</p>
    <div id="input-container">
      <div v-for="(item, index) in textNodeArray" :key="index">
        <h6>name: {{ item.name }}, id: {{ item.id }}</h6>
        <input type="text" v-model="item.characters" @change="handleChange($event, item)" />
      </div>
    </div>
  </div>
</template>



<style scoped>
#ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-medium);
}
</style>