/// <reference types="vite/client" />

export {};
declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    Pusher: Pusher;
    Echo: Echo;
  }
}