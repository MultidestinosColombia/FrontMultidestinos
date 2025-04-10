<template>
  <q-page class="flex flex-center page-container">
    <div class="cards-container">
      <!-- Tarjeta de perfil -->
      <q-card class="profile-card">
        <div class="avatar-container">
          <q-avatar size="100px">
            <img :src="imagenPerfil" alt="Foto de perfil" />
          </q-avatar>
        </div>

        <q-dialog v-model="showAvatarDialog">
          <q-card class="q-pa-md">
            <q-card-section class="text-h6"
              >Selecciona un avatar</q-card-section
            >
            <q-separator />

            <q-card-section class="avatar-grid">
              <q-avatar
                v-for="avatar in avatarOptions"
                :key="avatar"
                size="80px"
                class="q-ma-sm cursor-pointer"
                :style="{
                  border:
                    imagenPerfil === avatar ? '3px solid #1976d2' : 'none',
                }"
                @click="selectAvatar(avatar)"
              >
                <img :src="avatar" />
              </q-avatar>
            </q-card-section>

            <q-card-section>
              <q-input
                v-model="customAvatar"
                label="O usa una URL personalizada"
                outlined
                dense
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" v-close-popup />
              <q-btn
                color="primary"
                label="Guardar"
                @click="editarUsuarioSubmit"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-card-section class="text-center">
          <div class="text-h5">{{ nombreCompleto }}</div>
          <div class="text-caption text-grey-7">@{{ username }}</div>
          <q-separator class="q-my-md" />
          <div class="text-subtitle1">{{ email }}</div>
          <div class="text-caption text-grey">{{ userRole }}</div>
        </q-card-section>

        <q-card-section
          v-if="userRole === 'administrador'"
          class="admin-options"
        >
          <q-btn
            flat
            color="secondary"
            icon="settings"
            label="Configuración"
            class="q-mb-sm"
            @click="showDevelopmentAlert"
          />
          <q-btn
            flat
            color="secondary"
            icon="group"
            label="Gestión de Usuarios"
            class="q-mb-sm"
            to="/ControlUser"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn color="primary" label="Editar Perfil" @click="editProfile" />
        </q-card-actions>
      </q-card>

      <!-- Tarjeta de edición -->
      <q-card v-if="showEditCard" class="profile-card edit-card q-pa-md">
        <q-card-section class="text-center">
          <div class="text-h5">Editar Perfil</div>
          <q-separator class="q-my-md" />
        </q-card-section>

        <!-- Si es administrador, mostrar campos extra -->
        <q-card-section>
          <q-input
            v-if="userRole === 'administrador'"
            v-model="nombreCompletoEditar"
            label="Nombre completo"
            outlined
            dense
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />
          <q-input
            v-model="emailEditar"
            label="Correo"
            outlined
            dense
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />
          <q-input
            v-if="userRole === 'administrador'"
            v-model="usuarioEditar"
            label="Usuario"
            outlined
            dense
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />
          <q-input
            v-model="imagenPerfil"
            label="Imagen de perfil url"
            outlined
            dense
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />
          <q-select
            v-if="userRole === 'administrador'"
            v-model="rolEditar"
            label="Rol"
            outlined
            dense
            class="q-mb-md"
            :options="[
              'administrador',
              'Comercial 1',
              'Comercial 2',
              'Contable',
              'Supervisor',
              'Asesor',
            ]"
            :rules="[(val) => !!val || 'El rol es obligatorio']"
          />

          <q-input
            v-model="contraseñaEditar"
            label="Nueva Contraseña"
            outlined
            dense
            type="password"
            class="q-mb-md"
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            @click="showEditCard = false"
          />
          <q-btn color="primary" label="Guardar" @click="editarUsuarioSubmit" />
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar, LocalStorage, Notify } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

// ---------------------- Datos del usuario actual ----------------------
const userData = LocalStorage.getItem("userData") || {};

const nombreCompleto = ref(userData.nombreCompleto || "Usuario");
const username = ref(userData.usuario || "usuario_default");
const email = ref(userData.email || "Multidestos@gmail.com");
const userRole = ref(userData.rol || "Usuario");

const imagenPerfil = ref(
  userData.imagenPerfil ||
    "https://imgs.search.brave.com/-pUIVTqW8I-PGNqZNvfunzlQC_Gl8kxUWz05wrmd-aM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hbmF0/by5vcmcvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDUvbXVs/dGlkZXN0aW5vcy5q/cGc"
);

// ---------------------- UI ----------------------
const showEditCard = ref(false);
const showAvatarDialog = ref(false);
const customAvatar = ref("");

// ---------------------- Avatares ----------------------
const avatarOptions = [
  "https://cdn.quasar.dev/img/avatar.png",
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=2",
  "https://i.pravatar.cc/100?img=3",
  "https://i.pravatar.cc/100?img=4",
  "https://i.pravatar.cc/100?img=5",
];

const selectAvatar = (avatar) => {
  imagenPerfil.value = avatar;
  const usuarioActualizado = {
    ...userData,
    imagenPerfil: avatar,
  };

  fetch(
    `https://backmultidestinos.onrender.com/user/${usuarioActualizado.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioActualizado),
    }
  )
    .then((res) => {
      if (res.ok) {
        LocalStorage.set("userData", usuarioActualizado);
        Notify.create({ message: "Avatar actualizado", color: "positive" });
        showAvatarDialog.value = false;
      } else {
        throw new Error("Error al actualizar avatar");
      }
    })
    .catch(() => {
      Notify.create({
        message: "No se pudo actualizar el avatar",
        color: "negative",
      });
    });
};

// ---------------------- Editar perfil actual ----------------------
const nombreCompletoEditar = ref("");
const usuarioEditar = ref("");
const emailEditar = ref("");
const contraseñaEditar = ref("");
const rolEditar = ref("");
const zonaEditar = ref("");
const usuarioEditandoId = ref(userData.id || null);

const editProfile = () => {
  nombreCompletoEditar.value = nombreCompleto.value;
  usuarioEditar.value = username.value;
  emailEditar.value = email.value;
  rolEditar.value = userRole.value;
  showEditCard.value = true;
};

// ---------------------- Guardar cambios ----------------------
const editarUsuarioSubmit = () => {
  const usuarioEditado = {
    id: usuarioEditandoId.value,
    nombreCompleto: nombreCompletoEditar.value,
    email: emailEditar.value,
    usuario: usuarioEditar.value,
    contrasena: contraseñaEditar.value,
    rol: rolEditar.value,
    zona: zonaEditar.value || "",
    activo: "1",
    imagenPerfil: imagenPerfil.value,
  };

  fetch(`https://backmultidestinos.onrender.com/user/${usuarioEditado.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuarioEditado),
  })
    .then((response) => {
      if (response.ok) {
        LocalStorage.set("userData", {
          ...userData,
          ...usuarioEditado,
        });

        nombreCompleto.value = usuarioEditado.nombreCompleto;
        username.value = usuarioEditado.usuario;
        email.value = usuarioEditado.email;
        userRole.value = usuarioEditado.rol;
        imagenPerfil.value = usuarioEditado.imagenPerfil;

        Notify.create({
          message: "Perfil actualizado correctamente",
          color: "positive",
        });

        showEditCard.value = false;
      } else {
        Notify.create({
          message: "Error al editar usuario",
          color: "negative",
        });
      }
    })
    .catch((error) => {
      console.error("Error al editar usuario:", error);
      Notify.create({
        message: "Error al editar usuario",
        color: "negative",
      });
    });
};

// ---------------------- Otros ----------------------
const showDevelopmentAlert = () => {
  $q.notify({
    message: "Esta funcionalidad está en desarrollo",
    color: "blue-4",
    position: "bottom",
    icon: "info",
    textColor: "white",
    timeout: 2000,
  });
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.cards-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.profile-card {
  width: 360px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: white;
  text-align: center;
}

.avatar-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  color: #1976d2;
  border-radius: 50%;
  padding: 5px;
}

.admin-options {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
