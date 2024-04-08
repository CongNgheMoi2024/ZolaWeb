import SockJS from 'sockjs-client/dist/sockjs'
import Stomp from 'stompjs'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const sock = new SockJS(runtimeConfig.wsUrl)
  const stompClient = Stomp.over(sock)
  nuxtApp.provide('stompClient', stompClient)
})
