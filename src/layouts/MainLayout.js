import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { LocalStorage } from "quasar";

export default {
  name: "MainLayout",

  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const miniState = ref(true);
    const drawer = ref(false);
    const linksList = [];
    const userData = LocalStorage.getItem("userData");
    const userRole = userData ? userData.rol : null;

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toggleMiniState = () => {
      leftDrawerOpen.value = true;
      miniState.value = !miniState.value;
    };

    const goPage = (pagina) => {
      router.push(pagina);
    };

    const logout = () => {
      console.log("Logout initiated");
      LocalStorage.remove("userData");
      LocalStorage.remove("token");
      LocalStorage.clear();

      console.log(
        "Token almacenado en el LocalStorage:",
        LocalStorage.getItem("token")
      );
      console.log("Datos del usuario eliminados al cerrar sesión");

      router.push("/");
    };

    return {
      userRole,
      router,
      essentialLinks: linksList,
      leftDrawerOpen,
      drawer,
      toggleLeftDrawer,
      miniState,
      toggleMiniState,
      goPage,
      logout,
    };
  },

  beforeMount() {},

  async data() {
    return {};
  },
};
