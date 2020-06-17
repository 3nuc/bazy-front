import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Main from "../views/Main.vue"
import Artist from "../views/Artist.vue"
import Home from "../views/Home.vue"
import Album from "../views/Album.vue"
import Admin from "../views/Admin.vue"
import { component } from 'vue/types/umd';


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Main",
    redirect: '/home',
    component: Main,
    children: [
      {
        name: "Artist",
        path: 'artist/:artistId',
        component: Artist,
      },

      {
        name: "Home",
        path: 'home',
        component: Home,
      },
      {
        name: "Admin",
        path: "admin",
        component: Admin
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
