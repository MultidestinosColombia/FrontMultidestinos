<template>
  <div class="login-container">
    <div class="video-background">
      <video ref="videoPlayer" loop>
        <source src="../vid/presentacion.mp4" type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>
      <div class="video-overlay"></div>
    </div>
    <button class="video-toggle" @click="toggleAudio">
      <q-icon :name="isMuted ? 'volume_off' : 'volume_up'" />
    </button>
    <div class="contenido"></div>

    <q-card class="login-card">
      <div class="login-header">
        <h2 class="login-title">Bienvenido</h2>
        <p class="login-subtitle">Ingresa tus credenciales para continuar</p>
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
            class="custom-input"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <q-input
            outlined
            v-model="password"
            :type="isPwdVisible ? 'text' : 'password'"
            id="password"
            filled
            clearable
            autocomplete="current-password"
            class="custom-input"
          >
            <template v-slot:prepend>
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LocalStorage, Notify } from "quasar";

const userName = ref("");
const password = ref("");
const router = useRouter();

const videoPlayer = ref(null);
const isMuted = ref(true);

const login = async () => {
  try {
    const response = await fetch("https://backmultidestinos.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: userName.value,
        contrasena: password.value,
      }),
    });

    if (response.ok) {
      const responseBody = await response.text();

      if (responseBody === "Inicio de sesión exitoso") {
        Notify.create({
          message: "Iniciando sesión...",
          color: "info",
          position: "top",
          timeout: 1000,
        });

        const userDataResponse = await fetch(
          `https://backmultidestinos.onrender.com/user/username/${userName.value}`
        );

        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();
          LocalStorage.set("userData", userData);
          console.log("Datos del usuario guardados:", userData);

          router.push("/home");
        } else {
          Notify.create({
            message: "Error al obtener datos del usuario",
            color: "negative",
          });
        }
      } else {
        Notify.create({
          message: "Usuario o contraseña incorrectos",
          color: "negative",
        });
      }
    } else {
      Notify.create({
        message: "Usuario o contraseña incorrectos",
        color: "negative",
      });
    }
  } catch (error) {
    console.error("Error en la autenticación:", error);
    Notify.create({
      message: "Error en la autenticación",
      color: "negative",
    });
  }
};

const toggleAudio = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted;
    isMuted.value = videoPlayer.value.muted;
  }
};

onMounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = true; // Iniciar el video silenciado por defecto
    videoPlayer.value.play(); // Intentar reproducir el video
  }
});
</script>

<style scoped>
/* Contenedor principal del login */
.login-container {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Alinea verticalmente */
  height: 100vh;
  gap: 20px; /* Espaciado entre elementos */
}

/* Contenido con imagen de fondo */
.contenido {
  position: absolute;
  top: 0%; /* Ajuste vertical */
  left: -10%; /* Ajuste horizontal */
  width: 30%;
  height: auto;
  background-image: url("../img/imgAzul.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Tarjeta del login con efecto Glassmorphism */
.login-card {
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(0%, -50%);
  width: 400%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.12); /* Fondo translúcido */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 255, 0.779);
  border: 1px solid rgba(255, 255, 255, 0.18); /* Línea blanca alrededor */
  animation: fadeIn 0.8s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Estilo del header */
.login-header {
  text-align: center;
  margin-bottom: 20px;
}

/* Logo de la app */
.app-logo {
  width: 220px;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  transition: transform 0.3s ease;
}

.app-logo:hover {
  transform: scale(1.05);
}

/* Cuerpo del login */
.login-body {
  width: 100%;
}

/* Grupos de formulario */
.form-group {
  width: 100%;
  margin-bottom: 15px;
  color: rgb(
    255,
    255,
    255
  ) !important; /* Hace que las etiquetas sean blancas */
  font-weight: bold; /* Opcional: resalta el texto */
}

/* ----------------------- Estilos del INPUT ----------------------- */
.q-input {
  width: 100%;
}

/* Input con borde y fondo ajustados */
.q-input input {
  color: white !important; /* Texto blanco */
  border: 2px solid white !important; /* Borde blanco */
  background: rgba(255, 255, 255, 0.1) !important; /* Fondo translúcido */
  padding: 10px;
  border-radius: 8px;
  caret-color: white !important; /* Color del cursor */
}

/* Placeholder blanco */
.q-input ::placeholder,
.q-input input::placeholder {
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Línea blanca en el input cuando está activo */
.q-input input:focus {
  border: 2px solid white !important;
  outline: none;
}

/* ----------------------- Iconos ----------------------- */
.q-icon {
  color: white !important; /* Color de iconos */
}

/* ----------------------- Botón de Inicio de Sesión ----------------------- */
.login-btn-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-btn {
  width: 100%;
  background: linear-gradient(45deg, #ffffff, #ffffff); /* Fondo blanco */
  color: rgb(255, 255, 255); /* Texto negro */
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  transition: 0.3s ease;
  border: 2px solid rgb(0, 38, 255) !important; /* Borde blanco */
}

.login-btn:hover {
  background: linear-gradient(45deg, #ffffff, #dddddd);
  transform: scale(1.05);
}

/* ----------------------- Fondo con Video ----------------------- */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
}

/* Ajuste del video */
.video-background video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

/* Botón de sonido del video */
.video-toggle {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
}

/* Overlay del video para oscurecerlo */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.684); /* Ajusta el nivel de oscurecimiento */
  z-index: 1;
}

/* ----------------------- Ajuste del Contenido ----------------------- */
.contenido {
  position: relative;
  width: 90%;
  height: 10vh;
  background-image: url("../img/imgAzul.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/*------------------------------------------------------------------------------------------- */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilo del header */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  color: white;
  font-size: 28px;
  margin: 0 0 8px 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
}

/* Cuerpo del login */
.login-body {
  width: 100%;
}

/* Grupos de formulario */
.form-group {
  width: 100%;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Estilos de Input mejorados */
.custom-input {
  width: 100%;
}

.custom-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  height: 50px;
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field__control:hover) {
  border-color: rgba(255, 255, 255, 0.4);
}

.custom-input :deep(.q-field__control--focused) {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
}

.custom-input :deep(.q-field__native),
.custom-input :deep(.q-field__prefix),
.custom-input :deep(.q-field__suffix) {
  color: white;
}

.custom-input :deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.8);
}

/* Opciones de login */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 13px;
}

.forgot-password {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: white;
  text-decoration: underline;
}

/* Botón de Inicio de Sesión mejorado */
.login-btn-container {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #2980b9, #1f6aa1);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(52, 152, 219, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsividad */
@media (min-width: 768px) and (max-width: 1399px) and (min-height: 739px) {
  .contenido {
    position: absolute;
    top: 10%;
    left: 59%;
    transform: translate(-61%, -50%);
    width: 90%;
    height: 10vh;
    background-image: url("../img/imgAzul.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .login-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Lo centra completamente */
    width: 90%; /* Ajusta el ancho al 90% del contenedor */
    max-width: 400px; /* No supera los 400px */
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 255, 0.779);
    border: 1px solid rgba(255, 255, 255, 0.18);
    animation: fadeIn 0.8s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media (min-width: 300px) and (max-width: 767px) {
  .contenido {
    position: absolute;
    top: 6%;
    left: 59%;
    transform: translate(-61%, -50%);
    width: 90%;
    height: 10vh;
    background-image: url("../img/imgAzul.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .login-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Lo centra completamente */
    width: 90%; /* Ajusta el ancho al 90% del contenedor */
    max-width: 400px; /* No supera los 400px */
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 255, 0.779);
    border: 1px solid rgba(255, 255, 255, 0.18);
    animation: fadeIn 0.8s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
