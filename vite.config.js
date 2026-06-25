import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgPage = repositoryName?.endsWith('.github.io')

export default defineConfig({
  base: process.env.GITHUB_ACTIONS && repositoryName
    ? isUserOrOrgPage ? '/' : `/${repositoryName}/`
    : '/',
  plugins: [vue()]
})
