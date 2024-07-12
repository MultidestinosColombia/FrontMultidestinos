<template>
  <q-page class="q-pa-md">
    <q-btn
      @click="mostrarModalAgregar = true"
      label="Agregar Usuario"
      class="q-mb-md"
      color="primary"
    />

    <q-dialog v-model="mostrarModalAgregar" content-css="max-width: 400px;">
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <q-form @submit="submitForm">
            <q-input
              label="Nombre completo"
              v-model="nombreCompleto"
              :rules="[(val) => !!val || 'El nombre completo es obligatorio']"
            />
            <q-input
              label="Usuario"
              v-model="usuario"
              :rules="[(val) => !!val || 'El usuario es obligatorio']"
            />
            <q-input
              label="Contraseña"
              v-model="contraseña"
              type="password"
              :rules="[(val) => !!val || 'La contraseña es obligatoria']"
            />
            <q-select
              label="Rol"
              v-model="rol"
              :options="[
                'administrador',
                'Comercial 1',
                'Comercial 2',
                'Contable',
                'Supervisor',
                'Asesor',
              ]"
              :rules="[(val) => !!val || 'El rol es obligatorio']"
              @input="checkZonaField"
            />
            <q-select
              v-if="rol === 'Asesor'"
              label="Zona"
              v-model="zona"
              :options="['Zona 1', 'Zona 2']"
              :rules="[(val) => !!val || 'La zona es obligatoria']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                type="submit"
                label="Registrar"
                color="primary"
                :disable="!formValido"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="mostrarModalEditar" content-css="max-width: 400px;">
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <q-form @submit="editarUsuarioSubmit">
            <q-input
              label="Nombre completo"
              v-model="nombreCompletoEditar"
              :rules="[(val) => !!val || 'El nombre completo es obligatorio']"
            />
            <q-input
              label="Usuario"
              v-model="usuarioEditar"
              :rules="[(val) => !!val || 'El usuario es obligatorio']"
            />
            <q-select
              label="Rol"
              v-model="rolEditar"
              :options="[
                'administrador',
                'Comercial 1',
                'Comercial 2',
                'Contable',
                'Supervisor',
                'Asesor',
              ]"
              :rules="[(val) => !!val || 'El rol es obligatorio']"
              @input="checkZonaFieldEditar"
            />
            <q-select
              v-if="rolEditar === 'Asesor'"
              label="Zona"
              v-model="zonaEditar"
              :options="['Zona 1', 'Zona 2']"
              :rules="[(val) => !!val || 'La zona es obligatoria']"
            />
            <q-input
              label="Contraseña"
              v-model="contraseñaEditar"
              type="password"
              :rules="[(val) => !!val || 'La contraseña es obligatoria']"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                type="submit"
                label="Guardar Cambios"
                :disable="!formValidoEditar"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table
      :rows="usuarios"
      :columns="columnas"
      row-key="id"
      :pagination="true"
      class="q-mt-md"
    >
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props">
          <q-btn
            dense
            color="primary"
            @click="editarUsuario(props.row)"
            class="q-mx-xs"
            >Editar</q-btn
          >
          <q-btn
            dense
            color="negative"
            @click="eliminarUsuario(props.row.id)"
            class="q-mx-xs"
            >Eliminar</q-btn
          >
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { Notify } from "quasar";
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      zona: "",
      zonaEditar: "",
      nombreCompleto: "",
      usuario: "",
      contraseña: "",
      usuarios: [],
      nombreCompletoEditar: "",
      usuarioEditar: "",
      rolEditar: "",
      rol: "",
      contraseñaEditar: "",
      usuarioEditandoId: null,
      columnas: [
        {
          name: "nombreCompleto",
          label: "Nombre Completo",
          align: "left",
          field: (row) => row.nombreCompleto,
        },
        {
          name: "usuario",
          label: "Usuario",
          align: "left",
          field: (row) => row.usuario,
        },
        {
          name: "rol",
          label: "Rol",
          align: "left",
          field: (row) => row.rol,
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center",
        },
      ],
      mostrarModalAgregar: false,
      mostrarModalEditar: false,
    };
  },
  computed: {
    formValido() {
      return this.nombreCompleto && this.usuario && this.contraseña && this.rol;
    },
    formValidoEditar() {
      return (
        this.nombreCompletoEditar &&
        this.usuarioEditar &&
        this.contraseñaEditar &&
        this.rolEditar
      );
    },
  },
  mounted() {
    // Cargar usuarios al cargar la página
    this.cargarUsuarios();
  },
  methods: {
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
      fetch("https://backendmultidestinosexpress.onrender.com/user/")
        .then((response) => response.json())
        .then((data) => {
          this.usuarios = data;
        })
        .catch((error) => {
          console.error("Error al cargar usuarios:", error);
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
      };
      console.log(newUser);

      fetch("https://backendmultidestinosexpress.onrender.com/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          // Manejar la respuesta si es necesario
          console.log("Respuesta del servidor:", data);
          Notify.create({
            message: "Usuario agregado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al enviar datos:", error);
          Notify.create({
            message: "Error al agregar usuario",
            color: "negative",
          });
        });

      // Simulamos agregar el usuario a la lista local
      const nuevoUsuario = {
        id: this.usuarios.length + 1,
        nombreCompleto: this.nombreCompleto,
        usuario: this.usuario,
        rol: this.rol,
      };
      this.usuarios.push(nuevoUsuario);

      this.limpiarFormulario();
      this.mostrarModalAgregar = false;
    },
    editarUsuario(usuario) {
      // Abrir modal de edición con los datos del usuario
      this.nombreCompletoEditar = usuario.nombreCompleto;
      this.usuarioEditar = usuario.usuario;
      this.rolEditar = usuario.rol;
      this.usuarioEditandoId = usuario.id;
      this.zonaEditar = usuario.zona ? usuario.zona : "";

      this.mostrarModalEditar = true;
    },
    editarUsuarioSubmit() {
      // Simular la edición de usuario
      const usuarioEditado = {
        id: this.usuarioEditandoId,
        nombreCompleto: this.nombreCompletoEditar,
        usuario: this.usuarioEditar,
        contrasena: this.contraseñaEditar,
        rol: this.rolEditar,
        zona: this.zonaEditar ? this.zonaEditar : "",
        activo: "1",
      };

      console.log("Usuario editado:", usuarioEditado);

      fetch(
        `https://backendmultidestinosexpress.onrender.com/user/${usuarioEditado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioEditado),
        }
      )
        .then((response) => {
          if (response.ok) {
            // Actualizar la lista local de usuarios o recargarlos desde el servidor
            this.cargarUsuarios();
            // Limpiar los campos y cerrar el modal
            this.limpiarFormularioEditar();
            this.mostrarModalEditar = false;
            // Mostrar notificación de éxito
            this.$q.notify({
              message: "Usuario editado correctamente",
              color: "positive",
            });
          } else {
            // Mostrar notificación de error si la solicitud no fue exitosa
            this.$q.notify({
              message: "Error al editar usuario",
              color: "negative",
            });
          }
        })
        .catch((error) => {
          // Mostrar notificación de error si ocurrió un error en la solicitud
          console.error("Error al editar usuario:", error);
          this.$q.notify({
            message: "Error al editar usuario",
            color: "negative",
          });
        });
    },
    eliminarUsuario(id) {
      // Eliminar el usuario del servidor y actualizar la lista local
      fetch(`https://backendmultidestinosexpress.onrender.com/user/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Eliminar el usuario de la lista local
            this.usuarios = this.usuarios.filter((user) => user.id !== id);
            console.log("Usuario eliminado con ID:", id);
            Notify.create({
              message: "Usuario eliminado correctamente",
              color: "positive",
            });
          } else {
            console.error("Error al eliminar usuario con ID:", id);
            Notify.create({
              message: "Error al eliminar usuario",
              color: "negative",
            });
          }
        })
        .catch((error) => {
          console.error("Error al eliminar usuario:", error);
          Notify.create({
            message: "Error al eliminar usuario",
            color: "negative",
          });
        });
    },
    limpiarFormulario() {
      this.nombreCompleto = "";
      this.usuario = "";
      this.contraseña = "";
      this.rol = "";
    },
    limpiarFormularioEditar() {
      this.nombreCompletoEditar = "";
      this.usuarioEditar = "";
      this.contraseñaEditar = "";
      this.rol = "";
      this.usuarioEditandoId = null;
    },
  },
};
</script>

<style scoped>
.q-page {
  padding: 20px;
}
</style>
