import { RouteLocationNormalized } from "vue-router";

const ChatListView = () => import('views/ChatListView.vue');
const MessageListView = () => import('views/ChatView.vue');

function propsParse(props: { [key: string]: (value: any) => any }) {
  console.log(props)
  return function (route: RouteLocationNormalized) {
    const res: { [key: string]: (value: any) => any } = {};
    for (let key in props) {
      const parser: (value: any) => any = props[key];
      res[key] = parser(route.params[key]);
    }
    return res;
  }
}

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
    props: propsParse({ chatId: Number }),
  },
];