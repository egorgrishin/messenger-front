import { RouteLocationNormalized } from "vue-router";

const ChatListView = () => import('../views/ChatListView.vue');
const MessageListView = () => import('../views/ChatView.vue');

function propsParse(props: { [key: string]: (value: any) => any }) {
  return function (route: RouteLocationNormalized) {
    // console.log(1, props);
    const res: { [key: string]: (value: any) => any } = {};
    for (let key in props) {
      const parser: (value: any) => any = props[key];
      // console.log(11, props, parser, route);
      res[key] = parser(route.params[key]);
    }
    // console.log(21, props);
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
  }
];