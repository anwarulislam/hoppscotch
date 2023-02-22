import { createApp } from 'vue';
import urql, { createClient } from '@urql/vue';
import App from './App.vue';
import '../assets/scss/themes.scss';
import '../assets/scss/styles.scss';
import '@hoppscotch/ui/style.css';
import 'virtual:windi.css';
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';

const routes = setupLayouts(generatedRoutes);

import { plugin as HoppUIPlugin, HoppUIPluginOptions } from '@hoppscotch/ui';

const options: HoppUIPluginOptions = {
  /* Define options here */
};
const app = createApp(App).use(
  urql,
  createClient({
    url: 'https://hoppscotch.io/graphql',
    fetchOptions: () => {
      return {
        credentials: 'include',
      };
    },
  })
);
app.use(HoppUIPlugin, options);

app.use(
  createRouter({
    history: createWebHistory(),
    routes,
  })
);

app.mount('#app');
