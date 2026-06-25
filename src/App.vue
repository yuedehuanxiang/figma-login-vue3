<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import kittyAvatar from './assets/kitty-avatar.png'
import inputIcon from './assets/input-icon.svg'

const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
const savedTheme = window.localStorage.getItem('login-theme')
const theme = ref(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : systemTheme)
const email = ref('chen@example.com')
const password = ref('')
const isLoginSuccessOpen = ref(false)
const isCodeDialogOpen = ref(false)
const codeDigits = ref(['', '', '', '', '', ''])

const themeLabel = computed(() => (theme.value === 'dark' ? '深色' : '浅色'))
const toggleLabel = computed(() => (theme.value === 'dark' ? '切换浅色' : '切换深色'))
const codeValue = computed(() => codeDigits.value.join(''))

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function showLoginSuccess() {
  isLoginSuccessOpen.value = true
}

function openCodeDialog() {
  codeDigits.value = ['', '', '', '', '', '']
  isCodeDialogOpen.value = true

  requestAnimationFrame(() => {
    document.querySelector('.code-input')?.focus()
  })
}

function closeDialogs() {
  isLoginSuccessOpen.value = false
  isCodeDialogOpen.value = false
}

function handleCodeInput(index, event) {
  const input = event.target
  const value = input.value.replace(/\D/g, '').slice(-1)
  codeDigits.value[index] = value
  input.value = value

  if (value && index < codeDigits.value.length - 1) {
    input.nextElementSibling?.focus()
  }

  if (codeValue.value.length === 6) {
    window.setTimeout(() => {
      isCodeDialogOpen.value = false
    }, 160)
  }
}

function handleCodeKeydown(index, event) {
  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    event.preventDefault()
    codeDigits.value[index - 1] = ''
    event.target.previousElementSibling?.focus()
  }
}

function handleCodePaste(event) {
  const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  if (!pasted) return

  event.preventDefault()
  codeDigits.value = [...pasted.padEnd(6, '')].slice(0, 6)

  if (pasted.length === 6) {
    window.setTimeout(() => {
      isCodeDialogOpen.value = false
    }, 160)
    return
  }

  const nextInput = document.querySelectorAll('.code-input')[pasted.length]
  nextInput?.focus()
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

      <form class="login-form" action="#" @submit.prevent="showLoginSuccess">
        <label class="input-card">
          <img class="input-card__icon" :src="inputIcon" alt="" />
          <span class="input-card__content">
            <span class="input-card__label">邮箱</span>
            <input v-model="email" type="email" autocomplete="email" placeholder="请输入邮箱" />
          </span>
        </label>

        <label class="input-card">
          <img class="input-card__icon" :src="inputIcon" alt="" />
          <span class="input-card__content">
            <span class="input-card__label">密码</span>
            <input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码" />
          </span>
        </label>

        <div class="form-actions">
          <span>记住我</span>
          <a href="#" aria-label="忘记密码">忘记密码</a>
        </div>

        <button class="button button--primary" type="submit">登录</button>
        <button class="button button--secondary" type="button" @click="openCodeDialog">使用验证码登录</button>
      </form>

      <div class="login-spacer" aria-hidden="true"></div>

      <p class="footer-link">
        <span>还没有账户？</span>
        <a href="#">立即注册</a>
      </p>
    </section>

    <Teleport to="body">
      <div v-if="isLoginSuccessOpen" class="dialog-backdrop" role="presentation" @click.self="closeDialogs">
        <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="success-title">
          <div class="dialog__mark" aria-hidden="true">✓</div>
          <h2 id="success-title">登录成功</h2>
          <p>欢迎回来，页面已为你准备好。</p>
          <button class="dialog__button" type="button" @click="closeDialogs">知道了</button>
        </section>
      </div>

      <div v-if="isCodeDialogOpen" class="dialog-backdrop" role="presentation" @click.self="closeDialogs">
        <section class="dialog code-dialog" role="dialog" aria-modal="true" aria-labelledby="code-title">
          <div class="dialog__mark" aria-hidden="true">6</div>
          <h2 id="code-title">验证码已发送</h2>
          <p>请输入收到的 6 位数字验证码。</p>
          <div class="code-fields" @paste="handleCodePaste">
            <input
              v-for="(_, index) in codeDigits"
              :key="index"
              class="code-input"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="1"
              :aria-label="`验证码第 ${index + 1} 位`"
              :value="codeDigits[index]"
              @input="handleCodeInput(index, $event)"
              @keydown="handleCodeKeydown(index, $event)"
            />
          </div>
        </section>
      </div>
    </Teleport>
  </main>
</template>
