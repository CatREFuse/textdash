<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { handleEvent, dispatch } from "./uiMessageHandler";
import "figma-plugin-ds/dist/figma-plugin-ds.css";
// import { attach } from "@frsource/autoresize-textarea";

let textNodeArray = ref([] as TextNode[]);

onMounted(() => {
  handleEvent("selectionchange", (data) => {
    console.log("ui detect change");
    textNodeArray.value = data.textNodeArray;
    // setTimeout(() => {
    //   document.getElementById("0")?.focus()
    // }, 10)
    console.log(document.getElementsByTagName("textarea"));

    // for (const textarea of document.getElementsByTagName("textarea")) {
    //   const buffer = textarea.value;
    //   textarea.value = " ";
    //   textarea.value = buffer;
    //   console.log("attach");
    //   attach(textarea);
    // }
  });
});

function handleChange(event: Event, textNode: TextNode) {
  console.log("onchange");

  dispatch("change-text", { id: textNode.id, characters: textNode.characters });
}

function toNextInput(event: KeyboardEvent, index: number) {
  console.log("enter");

  if (event.isComposing) {
    return;
  }
  // document.getElementById(`${index + 1}`)?.focus()
}

function handleFocus(event: FocusEvent, item: TextNode) {
  dispatch("input-focus", { id: item.id });
}

function handleBlur(event: FocusEvent, item: TextNode) {
  dispatch("input-blur", { id: item.id });
}
</script>

<template>
  <div id="ui">
    <div
      class="type type--large type-bold"
      v-if="textNodeArray.length == 0"
    >🧐 select something to edit text inside</div>
    <!-- <div
      v-else
      class="type type--large type-bold"
    >{{ textNodeArray.length }} text nodes found in your selection</div>-->

    <div id="input-container">
      <div v-for="(item, index) in textNodeArray" :key="index" class>
        <div class="head-container">
          <div class="icon">𝚃</div>
          <div class="type type--medium type--bold" id="input-head">{{ item.name }}</div>
        </div>

        <textarea
          type="text"
          v-model="item.characters"
          @input="handleChange($event, item)"
          @keypress.enter="toNextInput($event, index)"
          :id="index.toString()"
          rows="2"
          class="textarea"
          @focus="handleFocus($event, item)"
          @blur="handleBlur($event, item)"
        />
      </div>
    </div>

    <div class="tips">
      <div class="type">
        <strong>⇥ tab</strong>: switch to the next one
      </div>
      <div class="type">
        <strong>⇧ shift + ⇥ tab</strong>: switch to the previous one
      </div>
    </div>
  </div>
</template>

<style scoped>
#ui {
  padding: 16px;
}

#input-head {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.head-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.icon {
  height: 24px;
  width: 24px;
  font-size: 16px;
  transform: scale(1.2, 1);
}

#input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.textarea {
  resize: vertical;
  min-height: 24px !important;
}

.tips {
  margin-top: 16px;
}
</style>
