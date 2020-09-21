import DefaultEditor from './../components/editor/index.vue';
import Hello from './../components/HelloWorld.vue';
import Arrow from "./../components/arrowSign/arrow.vue";

const router = [
    {
        path:'/',
        component: DefaultEditor
    },
    {
        path:'/hello',
        component: Hello
    },
    {
        path:'/home',
        component: Arrow
    }
]

export default router;