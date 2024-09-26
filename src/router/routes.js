import DetallesPlanView from "pages/DetallesPlanView.vue";
const routes = [
  {
    path: "/cotizacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/cotizacion",
        component: () => import("pages/CotizacionViajes.vue"),
      },

      {
        path: "/ControlUser",
        component: () => import("pages/ControlUser.vue"),
      },
      {
        path: "/ControlClient",
        component: () => import("pages/ControlClient.vue"),
      },
      {
        path: "/ControlPlanes",
        component: () => import("pages/ControlPlanes.vue"),
      },
      {
        path: "/planes/:id", // Nueva ruta para los detalles del plan
        name: "DetallesPlan",
        component: DetallesPlanView,
      },
    ],
  },
  {
    name: "login",
    path: "/",
    component: () => import("pages/IndexPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
