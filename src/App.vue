<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import kittyAvatar from './assets/kitty-avatar.png'
import inputIcon from './assets/input-icon.svg'

const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const savedTheme = window.localStorage.getItem('login-theme')
const theme = ref(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme)

const themeLabel = computed(() => (theme.value === 'dark' ? '深色' : '浅色'))
const toggleLabel = computed(() => (theme.value === 'dark' ? '切换浅色' : '切换深色'))

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function applyTheme(value) {
  document.documentElement.dataset.theme = value
  window.localStorage.setItem('login-theme', value)
}

onMounted(() => {
  applyTheme(theme.value)
})

watch(theme, applyTheme)
</script>

<template>
  <main class="app-shell">
    <button class="theme-toggle" type="button" :aria-label="toggleLabel" @click="toggleTheme">
      <span class="theme-toggle__dot" aria-hidden="true"></span>
      {{ themeLabel }}
    </button>

    <section class="login-screen" aria-label="登录">
      <div class="brand-block">
        <div class="brand-mark">
          <img class="brand-mark__image" :src="kittyAvatar" alt="" />
        </div>

        <div class="brand-copy">
          <h1>欢迎回来</h1>
          <p>登录后继续管理账户、安全设置和个人服务。</p>
        </div>
      </div>

      <form class="login-form" action="#" @submit.prevent>
        <label class="input-card">
          <img class="input-card__icon" :src="inputIcon" alt="" />
          <span class="input-card__content">
            <span class="input-card__label">邮箱</span>
            <input type="email" value="chen@example.com" autocomplete="email" readonly />
          </span>
        </label>

        <label class="input-card">
          <img class="input-card__icon" :src="inputIcon" alt="" />
          <span class="input-card__content">
            <span class="input-card__label">密码</span>
            <input type="password" value="password" autocomplete="current-password" readonly />
          </span>
        </label>

        <div class="form-actions">
          <span>记住我</span>
          <a href="#" aria-label="忘记密码">忘记密码</a>
        </div>

        <button class="button button--primary" type="button">登录</button>
        <button class="button button--secondary" type="button">使用验证码登录</button>
      </form>

      <div class="login-spacer" aria-hidden="true"></div>

      <p class="footer-link">
        <span>还没有账户？</span>
        <a href="#">立即注册</a>
      </p>
    </section>
  </main>
</template>
