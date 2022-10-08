<template>
  <div class="cb-and-label">
    <label v-if="labelLeft && text" :for="name" :class="disabled ? 'text-mygray-600' : 'text-black'">{{ text }}</label>
    <input
      type="checkbox"
      :id="name"
      :name="name"
      @change="(e) => $emit('change', e.target.checked)"
      :checked="checked"
      :disabled="disabled"
      class="w-5 h-5"
    />
    <label v-if="!labelLeft && text" :for="name" :class="disabled ? 'text-mygray-600' : 'text-black'">{{ text }}</label>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'MyCheckbox',
    props: {
      name: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        default: '',
      },
      labelLeft: {
        type: Boolean,
        default: false,
      },
      checked: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style lang="postcss" scoped>
  .cb-and-label {
    @apply flex items-center gap-3;
  }
  .cb-and-label > input {
    @apply flex-shrink-0;
  }
</style>
