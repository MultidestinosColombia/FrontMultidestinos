<template>
  <div class="login-container">
    <div class="login-background"></div>
    <q-card class="login-card">
      <div class="login-header">
        <div class="app-name-box">
          <h4 class="app-name">
            <q-img src="../img/imgAzul.png" class="app-logo" alt="Logo" />
          </h4>
        </div>
      </div>
      <div class="login-body">
        <div class="form-group">
          <label for="username">Usuario</label>
          <q-input
            outlined
            v-model="userName"
            type="text"
            id="username"
            filled
            clearable
            autocomplete="username"
            :color="inputColor"
          >
            <template v-slot:before>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <q-input
            outlined
            v-model="password"
            type="password"
            id="password"
            filled
            clearable
            autocomplete="current-password"
            :color="inputColor"
          >
            <template v-slot:before>
              <q-icon name="lock" />
            </template>
          </q-input>
        </div>
        <div class="login-btn-container">
          <q-btn
            class="login-btn"
            color="primary"
            label="Iniciar Sesión"
            @click="login"
            :disable="userName.trim() === '' || password.trim() === ''"
          />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { LocalStorage, Notify } from "quasar";
import { ref } from "vue";

const userName = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch(
      "https://backendmultidestinosexpress.onrender.com/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: userName.value,
          contrasena: password.value,
        }),
      }
    );

    if (response.ok) {
      const responseBody = await response.text(); // Leer el cuerpo de la respuesta

      if (responseBody === "Inicio de sesión exitoso") {
        // Aquí obtenemos los datos del usuario desde la API usando el nombre de usuario ingresado
        const userDataResponse = await fetch(
          `https://backendmultidestinosexpress.onrender.com/user/username/${userName.value}`
        );
        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();
          // Guardamos los datos del usuario en el almacenamiento local
          LocalStorage.set("userData", userData);
          console.log("Datos del usuario guardados:", userData); // Agrega este console.log para verificar
          router.push("/cotizacion");
        } else {
          // Si la respuesta de la API para obtener los datos del usuario falla, mostramos un mensaje de error
          Notify.create({
            message: "Error al obtener datos del usuario",
            color: "negative",
          });
        }
      } else {
        // Si la respuesta no es "Inicio de sesión exitoso", mostrar un mensaje de error
        Notify.create({
          message: responseBody,
          color: "negative",
        });
      }
    } else {
      // Si la respuesta del servidor indica un error, mostrar un mensaje de error
      Notify.create({
        message: "Usuario o contraseña incorrectos",
        color: "negative",
      });
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    // Manejo del error
    Notify.create({
      message: "Error en la autenticación",
      color: "negative",
    });
  }
};
</script>
<style scoped>
.login-container {
  position: relative; /* Establece la posición relativa para que el fondo y el contenido se superpongan correctamente */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-background {
  position: absolute; /* Establece la posición absoluta para el fondo */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../img/inicio3.jpg");
  background-size: cover;
  background-position: center;
  filter: blur(5px); /* Aplica el desenfoque solo al fondo */
  z-index: -1; /* Coloca el fondo detrás de los otros elementos */
}

.login-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  border-radius: 5px 5px 0 0;
  padding: 20px 0;
}

/* segundo tema */
/* .app-name-box {
  background-color: #2823bc;
  border-radius: 8px;
  padding: 10px;
} */

.app-name {
  margin: 0;
  font-size: 18px;
  color: #fff;
}

.login-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.login-btn-container {
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}
.app-logo {
  width: 28vw; /* Ajusta el tamaño según tus necesidades */
  height: auto; /* Permite que la altura se ajuste automáticamente */
}
.login-btn {
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  align-items: center;
  align-content: center;
}
</style>
