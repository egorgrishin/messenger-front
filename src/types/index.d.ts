export {};

declare global {
  interface Window {
    Echo: Echo,
    Pusher: Pusher,
  }
}