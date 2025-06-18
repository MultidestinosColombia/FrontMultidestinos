import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LocalStorage } from "quasar";

export default {
  name: "MainLayout",

  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const drawer = ref(false);
    const nombre = ref("Usuario");
    const imagenPerfil = ref("https://imgs.search.brave.com/-pUIVTqW8I-PGNqZNvfunzlQC_Gl8kxUWz05wrmd-aM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hbmF0/by5vcmcvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDUvbXVs/dGlkZXN0aW5vcy5q/cGc"); // Imagen por defecto
    const linksList = [];


    const userData = LocalStorage.getItem("userData");
    const userRole = userData ? userData.rol : null;

    if (userData) {
      try {
        const usuario = typeof userData === "string" ? JSON.parse(userData) : userData;
        nombre.value = usuario.nombreCompleto || "Usuario";
        imagenPerfil.value = usuario.imagenPerfil || imagenPerfil.value;
      } catch (error) {
        console.error("Error al analizar los datos del usuario:", error);
        nombre.value = "Usuario";
      }
    }

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };



    const goPage = (pagina) => {
      router.push(pagina);
    };

    const logout = () => {
      console.log("Logout iniciado...");
      LocalStorage.remove("userData");
      LocalStorage.remove("token");
      LocalStorage.clear();

      console.log("Token eliminado, datos del usuario borrados.");
      router.push("/");
    };


     // Agregando la hora actual con actualización en tiempo real
     const currentTime = ref("");

     const updateClock = () => {
      const now = new Date();
      let time = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // 🔹 Activa el formato de 12 horas (AM/PM)
      });

      time = time.replace(" a. m", " AM").replace(" p. m", " PM");

      currentTime.value = time;
    };


     onMounted(() => {
       updateClock();
       setInterval(updateClock, 1000);
     });

    return {
      nombre, // Se devuelve la variable nombre
      imagenPerfil,
      userRole,
      router,
      essentialLinks: linksList,
      leftDrawerOpen,
      drawer,
      toggleLeftDrawer,

      goPage,
      logout,
      currentTime, // ✅ Se devuelve la variable de la hora actual

      // ------------------------------------------------------------- //


      interval: null,
      drawerState: 'expanded'
    };



  },
};
