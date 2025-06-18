<template>
  <q-page class="custom-page-bg">
    <div class="container-wrapper q-pa-md">
      <!-- Header con título y botón para agregar -->
      <div class="header-container q-mb-lg">
        <div class="row items-center justify-between full-width">
          <h4 class="q-ma-none text-weight-bold text-primary">
            Gestión de Usuarios
          </h4>
          <q-btn
            @click="mostrarModalAgregar = true"
            label="Agregar Usuario"
            class="add-button"
            icon="person_add"
            color="primary"
            unelevated
            rounded
          />
        </div>
        <q-separator class="q-mt-sm" color="blue-grey-2" />
      </div>

      <!-- Diálogo para agregar usuario -->
      <q-dialog
        v-model="mostrarModalAgregar"
        persistent
        content-css="max-width: 500px;"
      >
        <q-card class="modal-card">
          <q-card-section class="row items-center bg-primary text-white">
            <div class="text-h6">Agregar Nuevo Usuario</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="submitForm">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    label="Nombre completo"
                    v-model="nombreCompleto"
                    :rules="[
                      (val) => !!val || 'El nombre completo es obligatorio',
                    ]"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    label="Usuario"
                    v-model="usuario"
                    :rules="[(val) => !!val || 'El usuario es obligatorio']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    label="Contraseña"
                    v-model="contraseña"
                    type="password"
                    :rules="[(val) => !!val || 'La contraseña es obligatoria']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="vpn_key" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    label="Rol"
                    v-model="rol"
                    :options="rolesDisponibles"
                    :rules="[(val) => !!val || 'El rol es obligatorio']"
                    @input="checkZonaField"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="assignment_ind" />
                    </template>
                  </q-select>
                </div>
                <div class="col-12 col-md-6" v-if="rol === 'Asesor'">
                  <q-select
                    label="Zona"
                    v-model="zona"
                    :options="['Zona 1', 'Zona 2']"
                    :rules="[(val) => !!val || 'La zona es obligatoria']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="place" />
                    </template>
                  </q-select>
                </div>

                <!-- Correo -->
                <div class="col-12 col-md-6">
                  <q-input
                    label="Correo"
                    v-model="email"
                    :rules="[(val) => !!val || 'El correo es obligatorio']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn
                  outline
                  label="Cancelar"
                  color="negative"
                  class="q-mr-sm"
                  v-close-popup
                />
                <q-btn
                  type="submit"
                  label="Registrar Usuario"
                  color="primary"
                  :disable="!formValido"
                  unelevated
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Diálogo para editar usuario -->
      <q-dialog
        v-model="mostrarModalEditar"
        persistent
        content-css="max-width: 600px;"
      >
        <q-card class="modal-card">
          <q-card-section class="row items-center bg-primary text-white">
            <div class="text-h6">Editar Usuario</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <!-- Formulario -->
          <q-card-section class="q-pa-md">
            <q-form @submit="editarUsuarioSubmit">
              <div class="row q-col-gutter-md">
                <!-- Nombre completo -->
                <div class="col-12">
                  <q-input
                    label="Nombre completo"
                    v-model="nombreCompletoEditar"
                    :rules="[
                      (val) => !!val || 'El nombre completo es obligatorio',
                    ]"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>

                <!-- Usuario -->
                <div class="col-12 col-md-6">
                  <q-input
                    label="Usuario"
                    v-model="usuarioEditar"
                    :rules="[(val) => !!val || 'El usuario es obligatorio']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_circle" />
                    </template>
                  </q-input>
                </div>

                <!-- Contraseña -->
                <div class="col-12 col-md-6">
                  <q-input
                    label="Contraseña"
                    v-model="contraseñaEditar"
                    type="password"
                    :rules="[(val) => !!val || 'La contraseña es obligatoria']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="vpn_key" />
                    </template>
                  </q-input>
                </div>

                <!-- Rol -->
                <div class="col-12 col-md-6">
                  <q-select
                    label="Rol"
                    v-model="rolEditar"
                    :options="rolesDisponibles"
                    :rules="[(val) => !!val || 'El rol es obligatorio']"
                    @input="checkZonaFieldEditar"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="assignment_ind" />
                    </template>
                  </q-select>
                </div>

                <!-- Zona (solo si es Asesor) -->
                <div class="col-12 col-md-6" v-if="rolEditar === 'Asesor'">
                  <q-select
                    label="Zona"
                    v-model="zonaEditar"
                    :options="['Zona 1', 'Zona 2']"
                    :rules="[(val) => !!val || 'La zona es obligatoria']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="place" />
                    </template>
                  </q-select>
                </div>

                <!-- Correo -->
                <div class="col-12 col-md-6">
                  <q-input
                    label="Correo"
                    v-model="emailEditar"
                    :rules="[(val) => !!val || 'El correo es obligatorio']"
                    filled
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Botones -->
              <div class="row justify-end q-mt-lg">
                <q-btn
                  outline
                  label="Cancelar"
                  color="negative"
                  class="q-mr-sm"
                  v-close-popup
                />
                <q-btn
                  type="submit"
                  label="Guardar Cambios"
                  color="primary"
                  unelevated
                  :disable="!formValidoEditar"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Contenedor principal de grupos de usuarios -->
      <div class="roles-container">
        <div
          v-for="rol in rolesDisponibles"
          :key="rol"
          class="role-section q-mb-xl"
        >
          <!-- Encabezado de sección de rol -->
          <div class="role-header" :class="`bg-${obtenerColorRol(rol)}-1`">
            <div class="row items-center q-py-sm q-px-md">
              <q-icon
                :name="obtenerIconoRol(rol)"
                size="md"
                :color="obtenerColorRol(rol)"
                class="q-mr-sm"
              />
              <div
                class="text-h6 text-weight-medium"
                :class="`text-${obtenerColorRol(rol)}`"
              >
                {{ rol }}
              </div>
              <q-badge :color="obtenerColorRol(rol)" class="q-ml-sm">
                {{ filtrarUsuariosPorRol(rol).length }} usuarios
              </q-badge>
            </div>
          </div>

          <!-- Contenedor de tarjetas de usuario -->
          <div class="row q-col-gutter-md q-mt-md q-pa-sm">
            <div
              v-for="usuario in filtrarUsuariosPorRol(rol)"
              :key="usuario.id"
              class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            >
              <q-card class="user-card" :class="`bg-${obtenerColorRol(rol)}-1`">
                <q-card-section class="text-center">
                  <!-- Avatar del usuario -->
                  <q-avatar
                    size="80px"
                    class="shadow-5"
                    :color="
                      !usuario.imagenPerfil
                        ? obtenerColorRol(usuario.rol)
                        : undefined
                    "
                    text-color="white"
                  >
                    <template v-if="usuario.imagenPerfil">
                      <img :src="usuario.imagenPerfil" alt="Foto de perfil" />
                    </template>
                    <template v-else>
                      {{ getInitials(usuario.nombreCompleto) }}
                    </template>
                  </q-avatar>

                  <div class="text-h6 q-mt-sm">
                    {{ usuario.nombreCompleto }}
                  </div>
                  <div class="text-subtitle2 text-grey-8">
                    @{{ usuario.usuario }}
                  </div>
                  <q-chip
                    dense
                    :color="obtenerColorRol(rol)"
                    text-color="white"
                    class="q-mt-sm"
                    icon="badge"
                  >
                    {{ rol }}
                  </q-chip>
                  <div class="text-subtitle2 text-grey-8">
                    {{ usuario.email }}
                  </div>
                  <div v-if="usuario.zona" class="q-mt-sm">
                    <q-chip
                      dense
                      color="grey-5"
                      text-color="white"
                      icon="place"
                    >
                      {{ usuario.zona }}
                    </q-chip>
                  </div>
                </q-card-section>

                <q-separator :color="`${obtenerColorRol(rol)}-3`" />

                <q-card-actions align="center">
                  <q-btn
                    flat
                    rounded
                    color="info"
                    icon="edit"
                    @click="editarUsuario(usuario)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    rounded
                    color="negative"
                    icon="delete"
                    @click="confirmarEliminar(usuario.id)"
                  >
                    <q-tooltip>Eliminar</q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>

            <!-- Mensaje cuando no hay usuarios para un rol -->
            <div v-if="filtrarUsuariosPorRol(rol).length === 0" class="col-12">
              <q-banner class="bg-grey-2 text-center">
                <template v-slot:avatar>
                  <q-icon name="info" color="primary" />
                </template>
                No hay usuarios con el rol de {{ rol }}
              </q-banner>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="confirmarEliminarDialog" persistent>
      <q-card class="confirm-delete-card">
        <q-card-section class="row items-center bg-negative text-white">
          <q-avatar icon="warning" color="white" text-color="negative" />
          <span class="q-ml-sm text-h6">Confirmar eliminación</span>
        </q-card-section>

        <q-card-section class="q-pt-md">
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
          puede deshacer.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            unelevated
            label="Eliminar"
            color="negative"
            @click="eliminarUsuarioConfirmado"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  data() {
    return {
      zona: "",
      zonaEditar: "",
      nombreCompleto: "",
      usuario: "",
      contraseña: "",
      email: "",
      usuarios: [],
      nombreCompletoEditar: "",
      usuarioEditar: "",
      rolEditar: "",
      rol: "",
      contraseñaEditar: "",
      emailEditar: "",
      usuarioEditandoId: null,
      confirmarEliminarDialog: false,
      usuarioAEliminarId: null,
      rolesDisponibles: [
        "administrador",
        "Comercial 1",
        "Comercial 2",
        "Contable",
        "Supervisor",
        "Asesor",
      ],
      coloresRoles: {
        administrador: "deep-purple",
        "Comercial 1": "teal",
        "Comercial 2": "green",
        Contable: "blue",
        Supervisor: "orange",
        Asesor: "red",
      },
      iconosRoles: {
        administrador: "admin_panel_settings",
        "Comercial 1": "sell",
        "Comercial 2": "add_business",
        Contable: "account_balance",
        Supervisor: "supervisor_account",
        Asesor: "support_agent",
      },
      mostrarModalAgregar: false,
      mostrarModalEditar: false,
    };
  },
  computed: {
    formValido() {
      return (
        this.nombreCompleto &&
        this.usuario &&
        this.contraseña &&
        this.rol &&
        (this.rol !== "Asesor" || (this.rol === "Asesor" && this.zona)) &&
        this.email
      );
    },
    formValidoEditar() {
      return (
        this.nombreCompletoEditar &&
        this.usuarioEditar &&
        this.contraseñaEditar &&
        this.rolEditar &&
        (this.rolEditar !== "Asesor" ||
          (this.rolEditar === "Asesor" && this.zonaEditar)) &&
        this.emailEditar
      );
    },
  },
  mounted() {
    // Cargar usuarios al cargar la página
    this.cargarUsuarios();
  },
  methods: {
    obtenerColorRol(rol) {
      return this.coloresRoles[rol] || "grey";
    },
    obtenerIconoRol(rol) {
      return this.iconosRoles[rol] || "person";
    },
    filtrarUsuariosPorRol(rol) {
      return this.usuarios.filter((user) => user.rol === rol);
    },
    getInitials(nombre) {
      if (!nombre) return "?";
      return nombre
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    },
    confirmarEliminar(id) {
      this.usuarioAEliminarId = id;
      this.confirmarEliminarDialog = true;
    },
    eliminarUsuarioConfirmado() {
      this.eliminarUsuario(this.usuarioAEliminarId);
      this.usuarioAEliminarId = null;
    },
    checkZonaFieldEditar() {
      if (this.rolEditar !== "Asesor") {
        this.zonaEditar = "";
      }
    },
    checkZonaField() {
      if (this.rol !== "Asesor") {
        this.zona = "";
      }
    },
    cargarUsuarios() {
      fetch("https://backmultidestinos.onrender.com/user/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Error en la respuesta del servidor: " + response.status
            );
          }
          return response.json();
        })
        .then((data) => {
          this.usuarios = data;
        })
        .catch((error) => {
          console.error("Error al cargar usuarios:", error);
          Notify.create({
            type: "negative",
            message: "Error al cargar usuarios: " + error.message,
            position: "top",
            timeout: 2500,
          });
        });
    },
    submitForm() {
      const estadoActivo = "1";

      const newUser = {
        nombreCompleto: this.nombreCompleto,
        usuario: this.usuario,
        contrasena: this.contraseña,
        activo: estadoActivo,
        rol: this.rol,
        zona: this.zona ? this.zona : "",
        email: this.email,
      };

      fetch("https://backmultidestinos.onrender.com/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Error en la respuesta del servidor: " + response.status
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log("Usuario agregado:", data);
          Notify.create({
            type: "positive",
            message: "Usuario agregado correctamente",
            position: "top",
            icon: "check_circle",
            timeout: 2500,
          });
          // Recargar la lista de usuarios
          this.cargarUsuarios();
          this.limpiarFormulario();
          this.mostrarModalAgregar = false;
        })
        .catch((error) => {
          console.error("Error al enviar datos:", error);
          Notify.create({
            type: "negative",
            message: "Error al agregar usuario: " + error.message,
            position: "top",
            timeout: 2500,
          });
        });
    },

    editarUsuario(usuario) {
      // Abrir modal de edición con los datos del usuario
      this.nombreCompletoEditar = usuario.nombreCompleto;
      this.usuarioEditar = usuario.usuario;
      this.rolEditar = usuario.rol;
      this.usuarioEditandoId = usuario.id;
      this.zonaEditar = usuario.zona || "";
      this.contraseñaEditar = ""; // Resetear la contraseña por seguridad
      this.emailEditar = usuario.email || "";

      // Guardar el usuario completo original (incluyendo imagenPerfil)
      this.usuarioOriginal = { ...usuario };

      this.mostrarModalEditar = true;
    },

    editarUsuarioSubmit() {
      if (!this.formValidoEditar) {
        Notify.create({
          type: "warning",
          message: "Complete todos los campos requeridos",
          position: "top",
          timeout: 2500,
        });
        return;
      }

      // Preparar objeto para la edición de usuario
      const usuarioEditado = {
        id: this.usuarioEditandoId,
        nombreCompleto: this.nombreCompletoEditar,
        usuario: this.usuarioEditar,
        rol: this.rolEditar,
        zona: this.zonaEditar || "",
        email: this.emailEditar,
        activo: "1",
        // PRESERVAR imagenPerfil original
        imagenPerfil: this.usuarioOriginal.imagenPerfil
      };

      // Solo incluir contraseña si se ha ingresado una nueva
      if (this.contraseñaEditar && this.contraseñaEditar.trim() !== "") {
        usuarioEditado.contrasena = this.contraseñaEditar;
      }

      console.log("Usuario a actualizar:", usuarioEditado);
      console.log("imagenPerfil preservado:", this.usuarioOriginal.imagenPerfil);

      fetch(
        `https://backmultidestinos.onrender.com/user/${usuarioEditado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioEditado),
        }
      )
        .then(async (response) => {
          console.log("Status de respuesta:", response.status);

          if (!response.ok) {
            let errorMessage = `Error ${response.status}`;
            try {
              const errorData = await response.text();
              console.log("Respuesta del servidor:", errorData);
              if (errorData) {
                errorMessage += `: ${errorData}`;
              }
            } catch (e) {
              console.log("No se pudo leer el mensaje de error del servidor");
            }
            throw new Error(errorMessage);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Usuario editado:", data);

          // Actualizar la lista local o recargar desde el servidor
          this.cargarUsuarios();

          // Limpiar los campos y cerrar el modal
          this.limpiarFormularioEditar();
          this.mostrarModalEditar = false;

          Notify.create({
            type: "positive",
            message: "Usuario editado correctamente",
            icon: "check_circle",
            position: "top",
            timeout: 2500,
          });
        })
        .catch((error) => {
          console.error("Error al editar usuario:", error);
          Notify.create({
            type: "negative",
            message: "Error al editar usuario: " + error.message,
            position: "top",
            timeout: 2500,
          });
        });
    },

    eliminarUsuario(id) {
      // Eliminar el usuario del servidor y actualizar la lista local
      fetch(`https://backmultidestinos.onrender.com/user/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Error en la respuesta del servidor: " + response.status
            );
          }
          // Eliminar el usuario de la lista local
          this.usuarios = this.usuarios.filter((user) => user.id !== id);
          console.log("Usuario eliminado con ID:", id);
          Notify.create({
            type: "positive",
            message: "Usuario eliminado correctamente",
            icon: "check_circle",
            position: "top",
            timeout: 2500,
          });
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          Notify.create({
            type: "negative",
            message: "Error al eliminar usuario: " + error.message,
            position: "top",
            timeout: 2500,
          });
        });
    },
    limpiarFormulario() {
      this.nombreCompleto = "";
      this.usuario = "";
      this.contraseña = "";
      this.rol = "";
      this.zona = "";
      this.email = "";
    },
    limpiarFormularioEditar() {
      this.nombreCompletoEditar = "";
      this.usuarioEditar = "";
      this.contraseñaEditar = "";
      this.rolEditar = "";
      this.zonaEditar = "";
      this.emailEditar = "";
      this.usuarioEditandoId = null;
    },
  },
};
</script>

<style scoped>
/* Estilo de fondo para la página completa */
.custom-page-bg {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.container-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Encabezado */
.header-container {
  padding: 15px 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.add-button {
  padding: 0 20px;
}

/* Secciones de roles */
.roles-container {
  margin-top: 30px;
}

.role-section {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.role-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Tarjetas de usuario */
.user-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  position: relative;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

/* Modales */
.modal-card {
  border-radius: 12px;
  overflow: hidden;
}

.confirm-delete-card {
  border-radius: 12px;
  max-width: 450px;
}

/* Estilos por rol - colores de fondo suaves */
.bg-deep-purple-1 {
  background-color: rgba(103, 58, 183, 0.05);
}

.bg-teal-1 {
  background-color: rgba(0, 150, 136, 0.05);
}

.bg-green-1 {
  background-color: rgba(76, 175, 80, 0.05);
}

.bg-blue-1 {
  background-color: rgba(33, 150, 243, 0.05);
}

.bg-orange-1 {
  background-color: rgba(255, 152, 0, 0.05);
}

.bg-red-1 {
  background-color: rgba(244, 67, 54, 0.05);
}

/* Separadores por rol */
.bg-deep-purple-3 {
  background-color: rgba(103, 58, 183, 0.3);
}

.bg-teal-3 {
  background-color: rgba(0, 150, 136, 0.3);
}

.bg-green-3 {
  background-color: rgba(76, 175, 80, 0.3);
}

.bg-blue-3 {
  background-color: rgba(33, 150, 243, 0.3);
}

.bg-orange-3 {
  background-color: rgba(255, 152, 0, 0.3);
}

.bg-red-3 {
  background-color: rgba(244, 67, 54, 0.3);
}

.modal-card {
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.q-card-section:not(:first-child) {
  padding-top: 0;
}
</style>
