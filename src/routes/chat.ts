import { RouteLocationNormalized } from "vue-router";

const ChatListView = () => import('views/ChatListView.vue');
const MessageListView = () => import('views/ChatView.vue');

export default [
  {
    path: '/chats',
    name: 'chat.list',
    component: ChatListView,
  },
  {
    path: '/chats/:chatId',
    name: 'message.list',
    component: MessageListView,
    props: (route: RouteLocationNormalized) => ({
      chatId: route.params.chatId,
    }),
  },
];