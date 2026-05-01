/* index.js */
const fs = require("fs");
const path = require("path");
const { parse } = require("node-html-parser");

const htmlInput = `<button class="btn btn-primary btn-md">제출</button>`;

function generateTS(html) {
  const root = parse(html);
  const el = root.querySelector("*");
  const tagName = el.tagName.toLowerCase();
  const content = el.innerHTML.trim();

  // React TSX Template
  const reactSource = `
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, ...props }) => (
  <${tagName} {...props} className={\`btn btn-\${variant} btn-\${size}\`}>
    {children || '${content}'}
  </${tagName}>
);`;

  // Vue TS Template
  const vueSource = `
<template>
  <${tagName} v-bind="$attrs" :class="['btn', \`btn-\${variant}\`, \`btn-\${size}\`]">
    <slot>${content}</slot>
  </${tagName}>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>(), {
  variant: 'primary',
  size: 'md'
});
</script>`;

  const dist = path.join(__dirname, "dist");
  if (!fs.existsSync(dist)) fs.mkdirSync(dist);

  fs.writeFileSync(path.join(dist, "Button.tsx"), reactSource.trim());
  fs.writeFileSync(path.join(dist, "Button.vue"), vueSource.trim());
  console.log("✨ TS 컴포넌트 생성 완료 (dist/)");
}

generateTS(htmlInput);
