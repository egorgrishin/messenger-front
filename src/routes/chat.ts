import { RouteLocationNormalized } from "vue-router";

const ChatListView = () => import('views/ChatListView.vue');
const MessageListView = () => import('views/ChatView.vue');

export default [
  {
    path: '/chats',
    name: 'chat.index',
    component: ChatListView,
  },
  {
    path: '/chats/:chatId',
    name: 'chat.show',
    component: MessageListView,
    props: (route: RouteLocationNormalized) => ({
      chatId: route.params.chatId,
    }),
  },
];