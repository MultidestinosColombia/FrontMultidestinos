<template>
  <q-page class="q-pa-md">
    <!-- Botón para agregar cliente -->
    <q-btn
      @click="mostrarModalAgregar = true"
      label="Agregar Cliente"
      class="q-mb-md"
      color="primary"
    />

    <q-dialog v-model="mostrarModalAgregar" content-css="max-width: 900px;">
      <q-card style="align-items: center">
        <q-card-section class="q-pa-md">
          <div class="q-ma-md">
            <q-form @submit="submitForm">
              <div class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <!-- Sección de Correos -->
                  <div class="col-12">
                    <q-card class="q-pa-md q-mb-md">
                      <q-card-section>
                        <div class="text-h6">Correos Electrónicos</div>
                        <div class="text-caption q-mb-md">
                          Agrega uno o más correos electrónicos.
                        </div>
                      </q-card-section>
                      <q-separator />

                      <q-card-section>
                        <div
                          v-for="(correo, index) in correos"
                          :key="index"
                          class="row q-col-gutter-md q-mb-md"
                        >
                          <div class="col-12">
                            <q-input
                              :label="'Correo ' + (index + 1)"
                              v-model="correos[index]"
                              :rules="[
                                (val) => !!val || 'El correo es obligatorio',
                                (val) =>
                                  /\S+@\S+\.\S+/.test(val) ||
                                  'Correo no válido',
                              ]"
                              outlined
                              dense
                            />
                          </div>
                          <div class="col-auto">
                            <q-btn
                              icon="delete"
                              color="negative"
                              @click="eliminarCorreo(index)"
                              outline
                              round
                              flat
                            />
                          </div>
                        </div>
                        <q-btn
                          label="Agregar otro correo"
                          @click="agregarCorreo"
                          color="primary"
                          outline
                          round
                          class="full-width"
                        />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <!-- Sección de nombre -->
                <div class="col-12">
                  <q-input
                    label="Nombre"
                    v-model="nombre"
                    :rules="[(val) => !!val || 'El nombre es obligatorio']"
                    class="q-mb-md"
                  />
                </div>

                <!-- Sección de direccion y ciudad -->

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Dirección"
                      v-model="direccion"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'La dirección es obligatoria']"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="ciudad"
                      label="Ciudad"
                      class="q-mb-md"
                      :options="['BOGOTA', 'CALI']"
                      emit-value
                      map-options
                      :rules="[(val) => !!val || 'la ciudad es obligatoria']"
                      :hide-selected="false"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Teléfono"
                      v-model="telefono"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="NIT"
                      v-model="nit"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'El nit es obligatorio']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input label="RNT" v-model="rnt" class="q-mb-md" />
                  </div>
                  <div class="col">
                    <q-input
                      label="LMC"
                      v-model="lmc"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'lmc es obligatorio']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Demás"
                      v-model="demas"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'Demas es obligatorio']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="1er Depósito"
                      v-model="primerDeposito"
                      class="q-mb-md"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="2do Depósito"
                      v-model="segundoDeposito"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="tipoBase"
                      label="Tipo de Base"
                      :options="['Comisión', 'Descuento']"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'tipo de base es obligatorio']"
                    />
                  </div>
                </div>

                <div v-if="tipoBase === 'Comisión'" class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      type="number"
                      label="Porcentaje de IVA"
                      v-model="porcentajeIva"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="rteFuente"
                      label="RTE Fuente"
                      :options="['10', '11']"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="rteIca"
                      label="RTE ICA"
                      :options="['0.966', '1.4']"
                      class="q-mb-md"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-select
                      v-model="zona"
                      label="Zona"
                      :options="zonas"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="asesorCargo"
                      label="Asesor Cargo"
                      :options="usuariosPorZona[zona]"
                      class="q-mb-md"
                    />
                  </div>
                </div>
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn type="submit" label="Registrar" color="primary" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mostrarModalEditar" content-css="max-width: 800px;">
      <q-card>
        <q-card-section class="q-pa-md">
          <div class="q-ma-md">
            <q-form @submit="editarClienteSubmit">
              <div class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Nombre"
                      v-model="nombreEditar"
                      :rules="[(val) => !!val || 'El nombre es obligatorio']"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="ciudadEditar"
                      label="Ciudad"
                      class="q-mb-md"
                      :options="['BOGOTA', 'CALI']"
                      emit-value
                      map-options
                      :hide-selected="false"
                      :rules="[(val) => !!val || 'La ciudad es obligatoria']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-chip
                      v-for="(correo, index) in correosArray"
                      :key="index"
                      removable
                      @remove="eliminarCorreoEditar(index)"
                    >
                      {{ correo }}
                    </q-chip>

                    <!-- Campo para ingresar nuevo correo -->
                    <q-input
                      v-model="nuevoCorreo"
                      label="Nuevo Correo"
                      hint="Presiona Enter para agregar"
                      @keydown.enter="agregarCorreoEditar"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="Dirección"
                      v-model="direccionEditar"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'La dirección es obligatoria']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Teléfono"
                      v-model="telefonoEditar"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="NIT"
                      v-model="nitEditar"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'El nit es obligatorio']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input label="RNT" v-model="rntEditar" class="q-mb-md" />
                  </div>
                  <div class="col">
                    <q-input
                      label="LMC"
                      v-model="lmcEditar"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'El lmc es obligatorio']"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="Demás"
                      v-model="demasEditar"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'Demas es obligatorio']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      label="1er Depósito"
                      v-model="primerDepositoEditar"
                      class="q-mb-md"
                    />
                  </div>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-input
                      label="2do Depósito"
                      v-model="segundoDepositoEditar"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="tipoBaseEditar"
                      label="Tipo de Base"
                      :options="['Comisión', 'Descuento']"
                      class="q-mb-md"
                      :rules="[(val) => !!val || 'tipo de base es obligatorio']"
                    />
                  </div>
                </div>

                <div
                  v-if="tipoBaseEditar === 'Comisión'"
                  class="row q-col-gutter-md"
                >
                  <div class="col">
                    <q-input
                      type="number"
                      label="Porcentaje de IVA"
                      v-model="porcentajeIvaEditar"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="rteFuenteEditar"
                      label="RTE Fuente"
                      :options="[10, 11]"
                      class="q-mb-md"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="rteIcaEditar"
                      label="RTE ICA"
                      :options="['0.966', '1.4']"
                      class="q-mb-md"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col">
                    <q-select
                      v-model="zonaEditar"
                      label="Zona"
                      :options="['Zona 1', 'Zona 2']"
                      emit-value
                      map-options
                      :hide-selected="false"
                      @update:modelValue="cargarAsesoresPorZona"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="asesorEditar"
                      label="Asesor"
                      :options="asesoresOptions"
                      emit-value
                      map-options
                      :hide-selected="false"
                    />
                  </div>
                </div>
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn type="submit" label="Guardar Cambios" color="primary" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table
      :rows="clientes"
      :columns="[
        ...columnas,
        { name: 'acciones', label: 'Acciones', align: 'center' },
      ]"
      row-key="id"
      :pagination="true"
      class="q-mt-md"
    >
      <template v-slot:body-cell-correo="props">
        <q-td :props="props">
          <div class="chips-container">
            <q-chip
              v-for="(correo, index) in props.row.correo.split(',')"
              :key="index"
              :label="correo"
              class="q-mb-xs"
              outline
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="fit">
          <div class="q-gutter-xs q-h-full q-v-center">
            <q-btn
              dense
              color="primary"
              @click="editarCliente(props.row)"
              class="q-mx-xs"
            >
              Editar
            </q-btn>
            <q-btn
              dense
              color="negative"
              @click="eliminarCliente(props.row.id)"
              class="q-mx-xs"
            >
              Eliminar
            </q-btn>
          </div>
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
      nuevoCorreo: "",
      rteFuente: "",
      porcentajeIva: "",
      rteIca: "",
      tipoBase: "",
      zonasOptions: [],
      zonaEditar: "",
      asesoresOptions: [],
      asesorEditar: "",
      zona: "",
      asesorCargo: "",
      zonas: [],
      usuariosPorZona: {
        "Zona 1": [],
        "Zona 2": [],
      },
      nombre: "",
      ciudad: "",
      correos: [""],
      direccion: "",
      telefono: "",
      nit: "",
      rnt: "",
      lmc: "",
      demas: "",
      primerDeposito: "",
      segundoDeposito: "",
      nombreEditar: "",
      ciudadEditar: "",
      correoEditar: [],
      direccionEditar: "",
      telefonoEditar: "",
      nitEditar: "",
      rntEditar: "",
      lmcEditar: "",
      demasEditar: "",
      primerDepositoEditar: "",
      segundoDepositoEditar: "",
      rteFuenteEditar: "",
      porcentajeIvaEditar: "",
      rteIcaEditar: "",
      tipoBaseEditar: "",
      clienteEditandoId: null,
      clientes: [], // Tu arreglo de clientes
      columnas: [
        { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
        { name: "ciudad", label: "Ciudad", align: "left", field: "ciudad" },
        { name: "correo", label: "Correo", align: "left", field: "correo" },
        {
          name: "direccion",
          label: "Dirección",
          align: "left",
          field: "direccion",
        },
        {
          name: "telefono",
          label: "Teléfono",
          align: "left",
          field: "telefono",
        },
        { name: "nit", label: "NIT", align: "left", field: "nit" },
        { name: "rnt", label: "RNT", align: "left", field: "rnt" },
        { name: "lmc", label: "LMC", align: "left", field: "lmc" },
        { name: "demas", label: "Demás", align: "left", field: "demas" },
        {
          name: "primerDeposito",
          label: "Primer Depósito",
          align: "left",
          field: "primerDeposito",
        },
        {
          name: "segundoDeposito",
          label: "Segundo Depósito",
          align: "left",
          field: "segundoDeposito",
        },
      ],
      mostrarModalAgregar: false,
      mostrarModalEditar: false,
    };
  },
  computed: {
    correosArray() {
      return this.correoEditar.split(",").map((correo) => correo.trim());
    },
    formValido() {
      return (
        this.nombre &&
        this.ciudad &&
        this.correo &&
        this.direccion &&
        this.telefono &&
        this.nit &&
        this.rnt &&
        this.lmc &&
        this.demas &&
        this.primerDeposito &&
        this.segundoDeposito
      );
    },
    formValidoEditar() {
      return (
        this.nombreEditar &&
        this.ciudadEditar &&
        this.correoEditar &&
        this.direccionEditar &&
        this.telefonoEditar &&
        this.nitEditar &&
        this.rntEditar &&
        this.lmcEditar &&
        this.demasEditar &&
        this.primerDepositoEditar &&
        this.segundoDepositoEditar
      );
    },
  },
  mounted() {
    // Cargar clientes al cargar la página
    this.cargarZonasYUsuarios();
    this.cargarClientes();
  },
  methods: {
    agregarCorreoEditar() {
      if (this.nuevoCorreo && this.nuevoCorreo.trim() !== "") {
        // Agregar el nuevo correo al string correoEditar
        if (this.correoEditar) {
          this.correoEditar += ", " + this.nuevoCorreo.trim();
        } else {
          this.correoEditar = this.nuevoCorreo.trim();
        }
        this.nuevoCorreo = ""; // Limpiar el campo después de agregar
      }
    },
    eliminarCorreoEditar(index) {
      // Eliminar el correo del string correoEditar
      const correos = this.correosArray;
      correos.splice(index, 1);
      this.correoEditar = correos.join(", ");
    },
    agregarCorreo() {
      this.correos.push(""); // Agrega un nuevo campo de correo vacío
    },
    eliminarCorreo(index) {
      this.correos.splice(index, 1); // Elimina el correo en la posición especificada
    },
    async cargarAsesoresPorZona() {
      try {
        console.log("Cargando asesores por zona...");

        // Verificar si se ha seleccionado una zona
        if (!this.zonaEditar) {
          // Si no hay una zona seleccionada, no hay necesidad de hacer la solicitud
          console.log("No se ha seleccionado ninguna zona.");
          this.asesoresOptions = [];
          return;
        }

        console.log("Zona seleccionada:", this.zonaEditar);

        // Realizar la solicitud para obtener todos los asesores
        const response = await fetch(
          "https://backendmultidestinosexpress.onrender.com/user/zona/zona"
        );
        if (!response.ok) {
          throw new Error("Error al cargar los asesores por zona");
        }
        const data = await response.json();

        // Filtrar los asesores según la zona seleccionada
        const asesoresFiltrados = data.filter(
          (asesor) => asesor.zona === this.zonaEditar
        );

        // Mapear los datos para configurar las opciones del select
        const asesoresOptions = asesoresFiltrados.map((asesor) => ({
          value: asesor.id,
          label: asesor.nombreCompleto,
        }));

        // Actualizar opciones de asesores en el componente
        this.asesoresOptions = asesoresOptions;
        console.log(
          "Asesores por zona cargados exitosamente:",
          this.asesoresOptions
        );
        this.asesorEditar = "";
      } catch (error) {
        console.error("Error al cargar asesores por zona:", error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    },

    async cargarZonasYUsuarios() {
      try {
        console.log("Cargando zonas y usuarios...");
        const response = await fetch(
          "https://backendmultidestinosexpress.onrender.com/user/zona/zona"
        );
        if (!response.ok) {
          throw new Error("Error al cargar las zonas y usuarios");
        }
        const data = await response.json();
        // Clasificar zonas
        const zonas = {
          "Zona 1": [],
          "Zona 2": [],
        };
        data.forEach((usuario) => {
          const zonaUsuario = usuario.zona; // Obtener la zona del usuario
          if (zonas[zonaUsuario]) {
            zonas[zonaUsuario].push({
              value: usuario.id,
              label: usuario.nombreCompleto,
            });
          }
        });
        // Actualizar datos en el componente
        this.zonas = Object.keys(zonas);
        this.usuariosPorZona = zonas;
        console.log(
          "Zonas y usuarios cargados exitosamente:",
          this.zonas,
          this.usuariosPorZona
        );
      } catch (error) {
        console.error("Error al cargar zonas y usuarios:", error);
        // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      }
    },
    cargarClientes() {
      fetch("https://backendmultidestinosexpress.onrender.com/cliente")
        .then((response) => response.json())
        .then((data) => {
          // Manejar los datos obtenidos
          const clientes = data.map((cliente) => ({
            id: cliente.id,
            nombre: cliente.nombre ?? "",
            ciudad: cliente.ciudad ?? "",
            correo: cliente.correo ?? "",
            direccion: cliente.direccion ?? "",
            telefono: cliente.telefono ?? "",
            nit: cliente.nit ?? "",
            rnt: cliente.rnt ?? "",
            lmc: cliente.lmc ?? "",
            demas: cliente.demas ?? "",
            primerDeposito: cliente.primerDeposito ?? "",
            segundoDeposito: cliente.segundoDeposito ?? "",
            zona: cliente.zona ?? "",
            asesor: cliente.asesor ?? "",
            rteFuente: cliente.rteFuente ?? "",
            porcentajeIva: cliente.porcentajeIva ?? "",

            rteIca: cliente.rteIca ?? "",

            tipoBase: cliente.tipoBase ?? "",
          }));
          console.log(clientes);
          this.clientes = clientes;
        })
        .catch((error) => {
          // Manejar errores
          console.error("Error al obtener los datos:", error);
        });
    },
    submitForm() {
      const zonaId = this.zona
        ? this.usuariosPorZona[this.zona][0].value
        : null;
      const correosConcatenados = this.correos.join(",");
      const newClient = {
        nombre: this.nombre,
        ciudad: this.ciudad ? this.ciudad : null,
        correo: correosConcatenados ? correosConcatenados : null,
        direccion: this.direccion ? this.direccion : null,
        telefono: this.telefono ? this.telefono : null,
        nit: this.nit ? this.nit : null,
        rnt: this.rnt ? this.rnt : null,
        lmc: this.lmc,
        demas: this.demas,
        primerDeposito: this.primerDeposito ? this.primerDeposito : null,
        segundoDeposito: this.segundoDeposito ? this.segundoDeposito : null,
        zona: this.zona ? this.zona : null,
        asesor: zonaId, // ID de la zona seleccionada o null si no se seleccionó ninguna zona
        tipoBase: this.tipoBase,
        porcentajeIva: this.porcentajeIva ? this.porcentajeIva : null,

        rteFuente: this.rteFuente ? this.rteFuente : null,
        rteIca: this.rteIca ? this.rteIca : null,
      };
      console.log("newClient", newClient);

      fetch("https://backendmultidestinosexpress.onrender.com/cliente/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      })
        .then((response) => response.json())
        .then((data) => {
          Notify.create({
            message: "Cliente agregado correctamente",
            color: "positive",
          });
          // Recargar la lista de clientes
          this.cargarClientes();
          // Limpiar el formulario y cerrar el modal
          this.limpiarFormulario();
          this.mostrarModalAgregar = false;
        })
        .catch((error) => {
          console.error("Error al agregar cliente:", error);
          Notify.create({
            message: "Error al agregar cliente",
            color: "negative",
          });
        });
    },
    editarCliente(cliente) {
      // Construir la URL con el ID del cliente
      const url = `https://backendmultidestinosexpress.onrender.com/user/${cliente.asesor}`;

      // Realizar la solicitud para obtener la información completa del cliente
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Asignar el nombre completo obtenido al cliente
          cliente.nombreCompleto = data.nombreCompleto;

          // Asignar otros datos del cliente si es necesario
          cliente.usuario = data.usuario;
          cliente.contrasena = data.contrasena;
          cliente.activo = data.activo;
          cliente.rol = data.rol;
          cliente.zona = data.zona;

          // Abre el modal de edición con los datos actualizados del cliente
          this.zonaEditar = cliente.zona;
          this.asesorEditar = cliente.nombreCompleto;
          this.nombreEditar = cliente.nombre;
          this.ciudadEditar = cliente.ciudad;
          this.correoEditar = cliente.correo;
          this.direccionEditar = cliente.direccion;
          this.telefonoEditar = cliente.telefono;
          this.nitEditar = cliente.nit;
          this.rntEditar = cliente.rnt;
          this.lmcEditar = cliente.lmc;
          this.demasEditar = cliente.demas;
          this.primerDepositoEditar = cliente.primerDeposito;
          this.segundoDepositoEditar = cliente.segundoDeposito;
          this.rteFuenteEditar = cliente.rteFuente;
          this.porcentajeIvaEditar = cliente.porcentajeIva;
          this.rteIcaEditar = cliente.rteIca;
          this.tipoBaseEditar = cliente.tipoBase;
          this.clienteEditandoId = cliente.id;
          this.mostrarModalEditar = true;
        })
        .catch((error) => {
          console.error("Error al obtener la información del cliente:", error);
        });
    },
    editarClienteSubmit() {
      const zonaId = this.zonaEditar
        ? this.usuariosPorZona[this.zonaEditar][0].value
        : null;
      const clienteEditado = {
        id: this.clienteEditandoId,
        nombre: this.nombreEditar,
        ciudad: this.ciudadEditar ? this.ciudadEditar : null,
        correo: this.correoEditar ? this.correoEditar : null,
        direccion: this.direccionEditar ? this.direccionEditar : null,
        telefono: this.telefonoEditar ? this.telefonoEditar : null,
        nit: this.nitEditar ? this.nitEditar : null,
        rnt: this.rntEditar ? this.rntEditar : null,
        lmc: this.lmcEditar,
        demas: this.demasEditar,
        primerDeposito: this.primerDepositoEditar,
        segundoDeposito: this.segundoDepositoEditar,
        zona: this.zonaEditar ? this.zonaEditar : null,
        rteFuente: this.rteFuenteEditar ? this.rteFuenteEditar : null,
        porcentajeIva: this.porcentajeIvaEditar
          ? this.porcentajeIvaEditar
          : null,
        rteIca: this.rteIcaEditar ? this.rteIcaEditar : null,
        tipoBase: this.tipoBaseEditar ? this.tipoBaseEditar : null,
        asesor: zonaId, // ID de la zona seleccionada o null si no se seleccionó ninguna zona
      };

      fetch(
        `https://backendmultidestinosexpress.onrender.com/cliente/${clienteEditado.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clienteEditado),
        }
      )
        .then((response) => {
          if (response.ok) {
            Notify.create({
              message: "Cliente editado correctamente",
              color: "positive",
            });
            // Recargar la lista de clientes
            this.cargarClientes();
            // Limpiar el formulario de edición y cerrar el modal
            this.limpiarFormularioEditar();
            this.mostrarModalEditar = false;
          } else {
            console.error("Error al editar cliente:", response.statusText);
            Notify.create({
              message: "Error al editar cliente",
              color: "negative",
            });
          }
        })
        .catch((error) => {
          console.error("Error al editar cliente:", error);
          Notify.create({
            message: "Error al editar cliente",
            color: "negative",
          });
        });
    },
    eliminarCliente(id) {
      fetch(`https://backendmultidestinosexpress.onrender.com/cliente/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            Notify.create({
              message: "Cliente eliminado correctamente",
              color: "positive",
            });
            // Eliminar el cliente de la lista
            this.clientes = this.clientes.filter(
              (cliente) => cliente.id !== id
            );
          } else {
            console.error("Error al eliminar cliente:", response.statusText);
            Notify.create({
              message: "Error al eliminar cliente",
              color: "negative",
            });
          }
        })
        .catch((error) => {
          console.error("Error al eliminar cliente:", error);
          Notify.create({
            message: "Error al eliminar cliente",
            color: "negative",
          });
        });
    },
    limpiarFormulario() {
      this.nombre = "";
      this.ciudad = "";
      this.correo = "";
      this.direccion = "";
      this.telefono = "";
      this.nit = "";
      this.rnt = "";
      this.lmc = "";
      this.demas = "";
      this.primerDeposito = "";
      this.segundoDeposito = "";
      this.rteFuente = "";
      this.porcentajeIva = "";
      this.rteIca = "";
      this.tipoBase = "";
    },
    limpiarFormularioEditar() {
      this.nombreEditar = "";
      this.ciudadEditar = "";
      this.correoEditar = "";
      this.direccionEditar = "";
      this.telefonoEditar = "";
      this.nitEditar = "";
      this.rntEditar = "";
      this.lmcEditar = "";
      this.demasEditar = "";
      this.primerDepositoEditar = "";
      this.segundoDepositoEditar = "";
      this.rteFuenteEditar = "";
      this.porcentajeIvaEditar = "";
      this.rteIcaEditar = "";
      this.tipoBaseEditar = "";

      this.clienteEditandoId = null;
    },
  },
};
</script>
<style scoped>
.q-table .q-td.fit {
  display: flex;
  justify-content: space-between;
}
</style>
