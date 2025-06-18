const routes = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        component: () => import("pages/homeSystem.vue"),
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
        path: "/cotizacion",
        component: () => import("src/pages/CotizacionViajes.vue"),
      },
      {
        path: "/Cotizacion2",
        component: () => import("src/pages/CotizacionFormulario.vue"),
      },
      {
        path: "/liquidacion",
        component: () => import("pages/LiquidacionViajes.vue"),
      },

      {
        path: "/Liquidaciondecostos",
        component: () => import("pages/Liquidacion_de_costos.vue"),
      },

      {
        path: "/ControlPlanes",
        component: () => import("pages/ControlPlanes.vue"),
      },
      {
        path: "/ControlLiquidacion",
        component: () => import("pages/ControlLiquidacion.vue"),
      },
      {
        path: "/Perfil",
        component: () => import("pages/PerfilUsuario.vue"),
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
