<template>
  <q-page class="profile-page">
    <video
      autoplay
      muted
      loop
      playsinline
      class="video-background"
    >
      <source src="../vid/cotizaciones.mp4" type="video/mp4" />
      Tu navegador no soporta video HTML5.
    </video>
    <!-- Header con imagen de fondo -->
    <div class="profile-header">
      <!-- Avatar y información básica -->
      <div class="profile-info">
        <div class="avatar-section">
          <q-avatar size="120px" class="profile-avatar">
            <img :src="imagenPerfil" alt="Foto de perfil" />
            <q-btn
              round
              size="sm"
              color="primary"
              icon="photo_camera"
              class="avatar-edit-btn"
              @click="showAvatarDialog = true"
            />
          </q-avatar>
        </div>

        <div class="user-details">
          <h2 class="user-name">{{ nombreCompleto }}</h2>
          <p class="user-username">@{{ username }}</p>
          <div class="user-role-badge">
            <q-chip
              :color="getRoleColor(userRole)"
              text-color="white"
              :label="userRole"
              icon="work"
            />
          </div>
        </div>

        <div class="header-actions">
          <q-btn
            color="primary"
            icon="edit"
            label="Editar Perfil"
            @click="editProfile"
            class="edit-profile-btn"
          />
          <q-btn
            v-if="userRole === 'administrador'"
            color="secondary"
            icon="admin_panel_settings"
            label="Panel Admin"
            to="/ControlUser"
            class="admin-btn"
          />
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="profile-content">
      <div class="content-grid">
        <!-- Información del perfil -->
        <q-card class="info-card">
          <q-card-section class="card-header">
            <div class="card-title">
              <q-icon name="person" size="24px" />
              <span>Información Personal</span>
            </div>
          </q-card-section>

          <q-card-section class="info-content">
            <div class="info-item">
              <q-icon name="email" color="primary" />
              <div>
                <span class="info-label">Correo Electrónico</span>
                <p class="info-value">{{ email }}</p>
              </div>
            </div>

            <div class="info-item">
              <q-icon name="badge" color="secondary" />
              <div>
                <span class="info-label">Rol en la Empresa</span>
                <p class="info-value">{{ userRole }}</p>
              </div>
            </div>

            <div class="info-item">
              <q-icon name="verified_user" color="positive" />
              <div>
                <span class="info-label">Estado</span>
                <p class="info-value">Activo</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Estadísticas -->
        <q-card class="stats-card">
          <q-card-section class="card-header">
            <div class="card-title">
              <q-icon name="analytics" size="24px" />
              <span>Estadísticas</span>
            </div>
          </q-card-section>

          <q-card-section class="stats-content">
            <div class="stat-item">
              <div class="stat-number">127</div>
              <div class="stat-label">Clientes Atendidos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">45</div>
              <div class="stat-label">Viajes Vendidos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Satisfacción</div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Acciones rápidas -->
        <q-card class="actions-card">
          <q-card-section class="card-header">
            <div class="card-title">
              <q-icon name="quick_reference" size="24px" />
              <span>Acciones Rápidas</span>
            </div>
          </q-card-section>

          <q-card-section class="actions-content">
            <q-btn
              v-if="userRole === 'administrador'"
              flat
              class="quick-action-btn"
              icon="settings"
              label="Configuración del Sistema"
              @click="showDevelopmentAlert"
            />
            <q-btn
              flat
              class="quick-action-btn"
              icon="flight_takeoff"
              label="Nuevo Destino"
              @click="showDevelopmentAlert"
            />
            <q-btn
              flat
              class="quick-action-btn"
              icon="people"
              label="Gestionar Clientes"
              @click="showDevelopmentAlert"
            />
            <q-btn
              flat
              class="quick-action-btn"
              icon="report"
              label="Generar Reporte"
              @click="showDevelopmentAlert"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog para seleccionar avatar -->
    <q-dialog v-model="showAvatarDialog" class="avatar-dialog">
      <q-card class="avatar-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon name="photo_camera" size="24px" />
            <span>Cambiar Foto de Perfil</span>
          </div>
        </q-card-section>

        <q-card-section class="avatar-options">
          <div class="avatar-grid">
            <q-avatar
              v-for="avatar in avatarOptions"
              :key="avatar"
              size="80px"
              class="avatar-option"
              :class="{ 'selected': imagenPerfil === avatar }"
              @click="selectAvatar(avatar)"
            >
              <img :src="avatar" />
            </q-avatar>
          </div>

          <q-input
            v-model="customAvatar"
            label="URL personalizada"
            outlined
            dense
            class="custom-avatar-input"
            prepend-icon="link"
          />
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Aplicar URL" @click="applyCustomAvatar" v-if="customAvatar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para editar perfil -->
    <q-dialog v-model="showEditDialog" class="edit-dialog" persistent>
      <q-card class="edit-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon name="edit" size="24px" />
            <span>Editar Perfil</span>
          </div>
        </q-card-section>

        <q-card-section class="edit-form">
          <div class="form-grid">
            <q-input
              v-if="userRole === 'administrador'"
              v-model="nombreCompletoEditar"
              label="Nombre completo"
              outlined
              dense
              prepend-icon="person"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />

            <q-input
              v-model="emailEditar"
              label="Correo Electrónico"
              outlined
              dense
              prepend-icon="email"
              type="email"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />

            <q-input
              v-if="userRole === 'administrador'"
              v-model="usuarioEditar"
              label="Nombre de Usuario"
              outlined
              dense
              prepend-icon="alternate_email"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />

            <q-select
              v-if="userRole === 'administrador'"
              v-model="rolEditar"
              label="Rol"
              outlined
              dense
              prepend-icon="work"
              :options="roleOptions"
              :rules="[(val) => !!val || 'El rol es obligatorio']"
            />

            <q-input
              v-model="contraseñaEditar"
              label="Nueva Contraseña"
              outlined
              dense
              prepend-icon="lock"
              type="password"
              :rules="[(val) => !!val || 'Campo obligatorio']"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Cancelar" @click="cancelEdit" />
          <q-btn color="primary" label="Guardar Cambios" @click="editarUsuarioSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar, LocalStorage } from "quasar";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2';

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
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80"
);

// ---------------------- UI ----------------------
const showEditDialog = ref(false);
const showAvatarDialog = ref(false);
const customAvatar = ref("");

// ---------------------- Opciones ----------------------
const roleOptions = [
  'administrador',
  'Comercial 1',
  'Comercial 2',
  'Contable',
  'Supervisor',
  'Asesor',
];

const avatarOptions = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1494790108755-2616b612b23c?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=387&q=80",
];

// ---------------------- Funciones auxiliares ----------------------
const getRoleColor = (role) => {
  const colors = {
    'administrador': 'red-6',
    'Comercial 1': 'blue-6',
    'Comercial 2': 'green-6',
    'Contable': 'orange-6',
    'Supervisor': 'purple-6',
    'Asesor': 'teal-6',
  };
  return colors[role] || 'grey-6';
};

// ---------------------- Avatar ----------------------
const selectAvatar = async (avatar) => {
  try {
    // Obtener datos actuales del LocalStorage
    const currentUserData = LocalStorage.getItem("userData") || {};

    const usuarioActualizado = {
      ...currentUserData,
      imagenPerfil: avatar,
    };

    const response = await fetch(
      `https://backmultidestinos.onrender.com/user/${usuarioActualizado.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioActualizado),
      }
    );

    if (response.ok) {
      // Actualizar LocalStorage
      LocalStorage.set("userData", usuarioActualizado);

      // Actualizar ref reactivo
      imagenPerfil.value = avatar;

      showAvatarDialog.value = false;

      Swal.fire({
        title: '¡Perfecto!',
        text: 'Tu foto de perfil ha sido actualizada',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          container: 'swal-high-z-index'
        },
        zIndex: 10000
      });
    } else {
      throw new Error("Error al actualizar avatar");
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar la foto de perfil',
      icon: 'error',
      confirmButtonColor: '#1976d2',
      customClass: {
        container: 'swal-high-z-index'
      },
      zIndex: 10000
    });
  }
};

const applyCustomAvatar = () => {
  if (customAvatar.value) {
    selectAvatar(customAvatar.value);
    customAvatar.value = "";
  }
};

// ---------------------- Editar perfil ----------------------
const nombreCompletoEditar = ref("");
const usuarioEditar = ref("");
const emailEditar = ref("");
const contraseñaEditar = ref("");
const rolEditar = ref("");
const usuarioEditandoId = ref(userData.id || null);

// Valores originales para comparar
const valoresOriginales = ref({
  nombreCompleto: nombreCompleto.value,
  usuario: username.value,
  email: email.value,
  rol: userRole.value
});

const editProfile = () => {
  // Obtener datos actuales del LocalStorage
  const currentUserData = LocalStorage.getItem("userData") || {};

  nombreCompletoEditar.value = currentUserData.nombreCompleto || nombreCompleto.value;
  usuarioEditar.value = currentUserData.usuario || username.value;
  emailEditar.value = currentUserData.email || email.value;
  rolEditar.value = currentUserData.rol || userRole.value;
  contraseñaEditar.value = ""; // Siempre vacío para nueva contraseña
  usuarioEditandoId.value = currentUserData.id;

  // Actualizar valores originales con datos actuales
  valoresOriginales.value = {
    nombreCompleto: currentUserData.nombreCompleto || nombreCompleto.value,
    usuario: currentUserData.usuario || username.value,
    email: currentUserData.email || email.value,
    rol: currentUserData.rol || userRole.value
  };

  showEditDialog.value = true;
};

const cancelEdit = () => {
  showEditDialog.value = false;
  // Reset form
  nombreCompletoEditar.value = "";
  usuarioEditar.value = "";
  emailEditar.value = "";
  contraseñaEditar.value = "";
  rolEditar.value = "";
};

// ---------------------- Guardar cambios ----------------------
const editarUsuarioSubmit = async () => {
  try {
    // Obtener datos actuales del LocalStorage
    const currentUserData = LocalStorage.getItem("userData") || {};

      // Crear objeto con todos los datos actuales
      const usuarioEditado = {
        ...currentUserData, // Mantener TODOS los datos existentes
        id: usuarioEditandoId.value,
        email: emailEditar.value, // Siempre actualizar email
      };

      // Solo actualizar campos específicos si el usuario es administrador
      if (userRole.value === 'administrador') {
        usuarioEditado.nombreCompleto = nombreCompletoEditar.value;
        usuarioEditado.usuario = usuarioEditar.value;
        usuarioEditado.rol = rolEditar.value;
      }

      // Solo agregar contraseña si se proporcionó una nueva
      if (contraseñaEditar.value && contraseñaEditar.value.trim() !== "") {
        usuarioEditado.contrasena = contraseñaEditar.value;
      }

      console.log('Datos a enviar:', usuarioEditado); // Para debug

      const response = await fetch(`https://backmultidestinos.onrender.com/user/${usuarioEditado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioEditado),
      });

      if (response.ok) {
        // Actualizar LocalStorage con los nuevos datos
        LocalStorage.set("userData", usuarioEditado);

        // Cerrar diálogo PRIMERO
        showEditDialog.value = false;

        // Pequeña pausa para asegurar que el diálogo se cierre
        await new Promise(resolve => setTimeout(resolve, 100));

        // Actualizar refs reactivos
        nombreCompleto.value = usuarioEditado.nombreCompleto;
        username.value = usuarioEditado.usuario;
        email.value = usuarioEditado.email;
        userRole.value = usuarioEditado.rol;

        // Mantener imagen actual si no se cambió
        if (usuarioEditado.imagenPerfil) {
          imagenPerfil.value = usuarioEditado.imagenPerfil;
        }

        // Mostrar mensaje de éxito con z-index alto
        await Swal.fire({
          title: '¡Éxito!',
          text: 'Tu perfil ha sido actualizado correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            container: 'swal-high-z-index'
          },
          zIndex: 10000
        });
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error("Error al editar usuario: " + response.status);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar el perfil: ' + error.message,
      icon: 'error',
      confirmButtonColor: '#1976d2',
      customClass: {
        container: 'swal-high-z-index'
      },
      zIndex: 10000
    });
  }
};
// ---------------------- Otros ----------------------
const showDevelopmentAlert = () => {
  Swal.fire({
    title: 'Funcionalidad en desarrollo',
    text: 'Esta característica estará disponible próximamente',
    icon: 'info',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#1976d2'
  });
};
</script>

<style scoped>
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
  filter: brightness(0.6);
}


.profile-page {
  min-height: 100vh;
}

/* Header Section */
.profile-header {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.profile-info {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
  padding: 20px;
}

.avatar-section {
  position: relative;
  margin-bottom: 20px;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  color: #1976d2;
}

.user-details {
  margin-bottom: 30px;
}

.user-name {
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.user-username {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0 0 16px 0;
}

.user-role-badge .q-chip {
  font-size: 0.9rem;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.edit-profile-btn, .admin-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 500;
  text-transform: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.edit-profile-btn:hover, .admin-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Content Section */
.profile-content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card, .stats-card, .actions-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 500;
}

.info-content {
  padding: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0;
}

/* Stats */
.stats-content {
  display: flex;
  justify-content: space-around;
  padding: 32px 20px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Actions */
.actions-content {
  padding: 20px;
}

.quick-action-btn {
  width: 100%;
  justify-content: flex-start;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  text-transform: none;
}

.quick-action-btn:hover {
  background: #f5f5f5;
}

/* Dialogs */
.avatar-dialog .avatar-card,
.edit-dialog .edit-card {
  min-width: 500px;
  border-radius: 16px;
}

.dialog-header {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 20px;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  font-weight: 500;
}

.avatar-options {
  padding: 24px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-option {
  cursor: pointer;
  border: 3px solid transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.3);
}

.custom-avatar-input {
  margin-top: 16px;
}

.edit-form {
  padding: 24px;
}

.form-grid {
  display: grid;
  gap: 20px;
}

.dialog-actions {
  padding: 16px 24px;
  background: #f9f9f9;
}

/* Responsive */
@media (max-width: 768px) {
  .user-name {
    font-size: 2rem;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .edit-profile-btn, .admin-btn {
    width: 100%;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-content {
    flex-direction: column;
    gap: 20px;
  }

  .avatar-dialog .avatar-card,
  .edit-dialog .edit-card {
    min-width: 90vw;
  }
}


.swal-high-z-index {
  z-index: 10000 !important;
}


.swal2-container {
  z-index: 10000 !important;
}


.swal2-backdrop-show {
  z-index: 9999 !important;
}
</style>
