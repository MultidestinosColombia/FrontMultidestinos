<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Detalles del Plan {{ planId }}</div>

    <q-table
      v-if="plan"
      :rows="[plan]"
      :columns="columnasPlanes"
      row-key="id"
      :pagination="true"
      class="q-mt-md"
    >
      <template v-slot:body-cell-hotel="props">
        <q-td :props="props">
          <div class="chips-container">
            <q-chip
              v-for="hotel in props.row.hotel.split('*')"
              :key="hotel"
              :label="hotel.trim()"
              class="q-mb-xs"
              outline
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-noches="props">
        <q-td :props="props">
          <div class="chips-container">
            <q-chip
              v-for="noche in props.row.noches.split('*')"
              :key="noche"
              :label="noche.trim()"
              class="q-mb-xs"
              outline
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-acomodacion="props">
        <q-td :props="props">
          <div class="chips-container">
            <q-chip
              v-for="acomodacion in props.row.acomodacion.split('*')"
              :key="acomodacion"
              :label="acomodacion.trim()"
              class="q-mb-xs"
              outline
            />
          </div>
        </q-td>
      </template>
    </q-table>

    <div class="text-h6 q-mt-lg">Hoteles Asociados</div>

    <div class="row justify-end q-gutter-sm q-mb-md">
      <q-btn
        label="Agregar Hotel"
        class="q-mb-md q-mr-sm"
        color="primary"
        @click="abrirModal('agregar')"
      />

      <!--------------------------------------------------Boton de Descarga de Formato----------------------------------------------------->
      <q-btn
        @click="abrirModalFormato"
        label="Descargar Formato"
        class="q-mb-md q-mr-sm"
        color="primary"
        icon="download"
      />

      <!-- Modal de Descarga -->
      <q-dialog v-model="MostrarFormato" persistent>
        <q-card
          class="q-pa-lg"
          style="
            border-radius: 12px;
            max-width: 500px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          "
        >
          <q-card-section class="text-center">
            <div class="text-h6 text-weight-bold">Seleccionar Formato</div>
            <div class="text-subtitle1 text-grey-7 q-mt-xs">
              ¿Qué tipo de formato necesitas?
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-y-md">
            <q-list bordered separator>
              <!-- Botón para descargar formato para nuevos registros -->
              <q-item
                clickable
                v-ripple
                class="hover-effect"
                @click="descargarExcel('nuevo')"
              >
                <q-item-section avatar>
                  <q-avatar size="48px" class="bg-primary text-white">
                    <q-icon name="cloud_download" size="28px" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold">Hoteles Nuevos</q-item-label>
                  <q-item-label caption
                    >Formato para crear nuevos registros</q-item-label
                  >
                </q-item-section>
              </q-item>

              <!-- Botón para descargar formato con datos existentes -->
              <q-item
                clickable
                v-ripple
                class="hover-effect selected-item"
                @click="descargarExcel('existente')"
              >
                <q-item-section avatar>
                  <q-avatar size="48px" class="bg-blue-3 text-primary">
                    <q-icon name="assignment" size="28px" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-bold"
                    >Actualización De Hoteles</q-item-label
                  >
                  <q-item-label caption
                    >Formato con datos existentes</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" class="q-mt-md">
            <q-btn
              label="Cancelar"
              color="grey-8"
              flat
              v-close-popup
              class="full-width q-pa-md text-bold"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Botón para abrir el modal de importar datos -->
      <q-btn
        @click="mostrarModalImportar = true"
        label="Importar Datos"
        class="q-mb-md"
        color="positive"
        icon="upload_file"
      />

      <!-- Modal para importar datos -->
      <q-dialog
        v-model="mostrarModalImportar"
        persistent
        transition-show="scale"
        transition-hide="fade"
      >
        <q-card
          style="
            min-width: 420px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          "
        >
          <q-card-section class="bg-positive text-white">
            <div class="text-h6 flex items-center">
              <q-icon name="upload_file" size="md" class="q-mr-sm" />
              Importar Datos
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-separator class="q-my-md" color="positive" />
            <div class="q-pa-md">
              <q-file
                v-model="archivoExcel"
                label="Seleccionar archivo Excel"
                accept=".xlsx"
                @rejected="onRejected"
                filled
                color="positive"
                counter
                bottom-slots
                class="animated-input"
              >
                <template v-slot:append>
                  <q-icon name="cloud_upload" size="md" class="text-white" />
                </template>
                <template v-slot:hint> Solo archivos Excel (.xlsx) </template>
              </q-file>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md q-gutter-md">
            <q-btn
              flat
              label="Cancelar"
              color="grey-8"
              v-close-popup
              :disable="procesando"
              class="rounded-borders animated-btn"
            />

            <!-- Botón para importar datos nuevos -->
            <q-btn
              label="Importar Datos Nuevos"
              color="positive"
              @click="importarDatosNuevo"
              :loading="procesando"
              :disable="!archivoExcel"
              icon="file_upload"
              class="rounded-borders animated-btn"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>

            <!-- Botón para actualizar datos -->
            <q-btn
              label="Actualizar Datos"
              color="primary"
              @click="importarDatosExistente"
              :loading="procesando"
              :disable="!archivoExcel"
              icon="refresh"
              class="rounded-borders animated-btn"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>
          </q-card-actions>

          <!-- Barra de progreso para mostrar el avance -->
          <q-linear-progress
            :value="progreso"
            color="positive"
            class="q-mt-sm"
          />
        </q-card>
      </q-dialog>

      <!---------------------------------------------------------------------------------------------------------------------------------->
    </div>
    <q-table
      v-if="hotelesRelacionados.length > 0"
      :rows="hotelesRelacionados"
      :columns="columnasHoteles"
      row-key="id"
      :pagination="false"
    >
      <template v-slot:body-cell-incluye="props">
        <q-td :props="props">
          <span v-html="props.value"></span>
        </q-td>
      </template>
      <template v-slot:body-cell-noIncluye="props">
        <q-td :props="props">
          <span v-html="props.value"></span>
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn
            icon="edit"
            color="primary"
            flat
            round
            dense
            @click="abrirModal('editar', props.row)"
          />
          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            dense
            @click="eliminarHotel(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    <div v-else class="text-grey q-mt-md">
      No hay hoteles asociados a este plan.
    </div>
    <q-dialog v-model="mostrarModal">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">
            {{ modoModal === "agregar" ? "Agregar Hotel" : "Editar Hotel" }}
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="guardarHotel">
            <div class="row q-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="hotelForm.hotel"
                  label="Hotel"
                  :disable="modoModal === 'editar'"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.plan"
                  label="Plan"
                  :disable="modoModal === 'editar'"
                />
              </div>
              <div class="col-12">
                <q-input v-model="hotelForm.noches" label="Noches" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.tipoHabitacion"
                  label="Tipo de Habitación"
                />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.sencilla" label="Sencilla" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.doble" label="Doble" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.triple" label="Triple" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.cuadruple" label="Cuádruple" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.quintuple" label="Quíntuple" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.sextuple" label="Séxtuple" />
              </div>
              <div class="col-6">
                <q-input v-model="hotelForm.niño" label="Niño" />
              </div>
              <div class="col-6">
                <q-input
                  v-model="hotelForm.nocheAdicionalsencilla"
                  label="Noche Adicional Sencilla"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="hotelForm.nocheAdicionaldoble"
                  label="Noche Adicional Doble"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="hotelForm.nocheAdicionaltriple"
                  label="Noche Adicional Triple"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="hotelForm.nocheAdicionalcuadruple"
                  label="Noche Adicional Cuádruple"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="hotelForm.nocheAdicionalniño"
                  label="Noche Adicional Niño"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.incluye"
                  type="textarea"
                  label="Incluye"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.noIncluye"
                  type="textarea"
                  label="No Incluye"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.FechaInicio"
                  label="Fecha de Inicio"
                  filled
                  type="date"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="hotelForm.FechaFin"
                  label="Fecha de Fin"
                  filled
                  type="date"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="q-px-md">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            type="submit"
            @click="guardarHotel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="mostrarDialogoEliminar">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm"
            >¿Estás seguro de que quieres eliminar este hotel?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Eliminar"
            color="negative"
            @click="confirmarEliminarHotel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { onMounted, ref, nextTick, reactive } from "vue";
import { LocalStorage } from "quasar";
import axios from "axios";
import { Notify } from "quasar";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      mostrarDialogoEliminar: false,
      hotelAEliminar: null,
      mostrarModal: false,
      modoModal: "agregar",
      hotelForm: {
        id: null,
        pertenece: null,
        destino: null,
        nombrePrograma: null,
        hotel: null,
        plan: null,
        noches: null,
        tipoHabitacion: null,
        sencilla: null,
        doble: null,
        triple: null,
        cuadruple: null,
        quintuple: null,
        sextuple: null,
        niño: null,
        nocheAdicionalsencilla: null,
        nocheAdicionaldoble: null,
        nocheAdicionaltriple: null,
        nocheAdicionalcuadruple: null,
        nocheAdicionalniño: null,
        incluye: null,
        noIncluye: null,
        FechaInicio: null,
        FechaFin: null,
      },
      planId: this.$route.params.id,
      plan: null,
      hoteles: [],
      hotelesRelacionados: [],
      columnasPlanes: [
        {
          name: "pertenece",
          label: "Pertenece",
          field: "pertenece",
          format: (val) => val || "N/A",
        },
        {
          name: "destino",
          label: "Destino",
          field: "destino",
          format: (val) => val || "N/A",
        },
        {
          name: "nombrePrograma",
          label: "Nombre del Programa",
          field: "nombrePrograma",
          format: (val) => val || "N/A",
        },
        {
          name: "hotel",
          label: "Hotel",
          field: "hotel",
          format: (val) => val || "N/A",
        },
        {
          name: "plan",
          label: "Plan",
          field: "plan",
          format: (val) => val || "N/A",
        },
        {
          name: "noches",
          label: "Noches",
          field: "noches",
          format: (val) => val || "N/A",
        },
        {
          name: "acomodacion",
          label: "Acomodación",
          field: "acomodacion",
          format: (val) => val || "N/A",
        },
      ],
      columnasHoteles: [
        {
          name: "pertenece",
          label: "Pertenece",
          field: "pertenece",
          format: (val) => val || "N/A",
        },
        {
          name: "destino",
          label: "Destino",
          field: "destino",
          format: (val) => val || "N/A",
        },
        {
          name: "nombrePrograma",
          label: "Nombre del Programa",
          field: "nombrePrograma",
          format: (val) => val || "N/A",
        },
        {
          name: "hotel",
          label: "Hotel",
          field: "hotel",
          format: (val) => val || "N/A",
        },
        {
          name: "plan",
          label: "Plan",
          field: "plan",
          format: (val) => val || "N/A",
        },
        {
          name: "noches",
          label: "Noches",
          field: "noches",
          format: (val) => val || "N/A",
        },
        {
          name: "tipoHabitacion",
          label: "Tipo de Habitación",
          field: "tipoHabitacion",
          format: (val) => val || "N/A",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          field: "sencilla",
          format: (val) => val || "N/A",
        },
        {
          name: "doble",
          label: "Doble",
          field: "doble",
          format: (val) => val || "N/A",
        },
        {
          name: "triple",
          label: "Triple",
          field: "triple",
          format: (val) => val || "N/A",
        },
        {
          name: "cuadruple",
          label: "cuadruple",
          field: "cuadruple",
          format: (val) => val || "N/A",
        },
        {
          name: "quintuple",
          label: "Quíntuple",
          field: "quintuple",
          format: (val) => val || "N/A",
        },
        {
          name: "sextuple",
          label: "Séxtuple",
          field: "sextuple",
          format: (val) => val || "N/A",
        },
        {
          name: "niño",
          label: "Niño",
          field: "niño",
          format: (val) => val || "N/A",
        },
        {
          name: "nocheAdicionalsencilla",
          label: "Noche Adicional Sencilla",
          field: "nocheAdicionalsencilla",
          format: (val) => val || "N/A",
        },
        {
          name: "nocheAdicionaldoble",
          label: "Noche Adicional Doble",
          field: "nocheAdicionaldoble",
          format: (val) => val || "N/A",
        },
        {
          name: "nocheAdicionaltriple",
          label: "Noche Adicional Triple",
          field: "nocheAdicionaltriple",
          format: (val) => val || "N/A",
        },
        {
          name: "nocheAdicionalcuadruple",
          label: "Noche Adicional Cuádruple",
          field: "nocheAdicionalcuadruple",
          format: (val) => val || "N/A",
        },
        {
          name: "nocheAdicionalniño",
          label: "Noche Adicional Niño",
          field: "nocheAdicionalniño",
          format: (val) => val || "N/A",
        },
        {
          name: "incluye",
          label: "Incluye",
          field: "incluye",
          align: "left",
          format: (val) => (val || "N/A").replace(/¿/g, "<br>"), // Reemplaza "¿" por "<br>"
          html: true, // Renderiza el contenido como HTML
        },
        {
          name: "noIncluye",
          label: "No Incluye",
          field: "noIncluye",
          align: "left",
          format: (val) => (val || "N/A").replace(/¿/g, "<br>"), // Reemplaza "¿" por "<br>"
          html: true, // Renderiza el contenido como HTML
        },
        {
          name: "FechaInicio",
          label: "Fecha Inicio",
          field: "FechaInicio",
          format: (val) => this.formatearFecha(val) || "N/A",
        },
        {
          name: "FechaFin",
          label: "Fecha Fin",
          field: "FechaFin",
          format: (val) => this.formatearFecha(val) || "N/A",
        },

        { name: "acciones", label: "Acciones", field: "id" },
      ],

      //------------------------------------ Retornar datos de formato-------------------------------------------//
      // Datos para la descarga e importación
      procesando: false,
      archivoExcel: null,
      columnasRequeridas: [
        "id",
        "pertenece",
        "destino",
        "nombrePrograma",
        "hotel",
        "plan",
        "noches",
        "tipoHabitacion",
        "sencilla",
        "doble",
        "triple",
        "cuadruple",
        "quintuple",
        "sextuple",
        "niño",
        "nocheAdicionalsencilla",
        "nocheAdicionaldoble",
        "nocheAdicionaltriple",
        "nocheAdicionalcuadruple",
        "nocheAdicionalniño",
        "incluye",
        "noIncluye",
        "FechaInicio",
        "FechaFin",
      ],
      mostrarModalImportar: false,
      MostrarFormato: false,
      descargando: false,
      progreso: 0, // Nueva propiedad de estado para el progreso
    };
  },
  mounted() {
    this.cargarDetallesPlan();
  },
  methods: {
    eliminarHotel(hotelId) {
      this.hotelAEliminar = hotelId; // Guardar el ID del hotel a eliminar
      this.mostrarDialogoEliminar = true; // Mostrar el diálogo de confirmación
    },

    confirmarEliminarHotel() {
      this.mostrarDialogoEliminar = false; // Ocultar el diálogo

      fetch(
        `https://backmultidestinos.onrender.com/hoteles/${this.hotelAEliminar}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar el hotel");
          }
          this.cargarHoteles();
          Notify.create({
            message: "Hotel eliminado con éxito",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al eliminar hotel:", error);
          Notify.create({
            message:
              "Error al eliminar el hotel. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    formatearFecha(fechaISO) {
      if (!fechaISO) return null;
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC", // Indicar que la fecha ISO está en UTC
      });
    },
    cargarDetallesPlan() {
      // Lógica para obtener los detalles del plan desde la API
      fetch(`https://backmultidestinos.onrender.com/planes/${this.planId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los detalles del plan");
          }
          return response.json();
        })
        .then((data) => {
          this.plan = data;
          this.cargarHoteles(); // Carga los hoteles después de obtener el plan
        })
        .catch((error) => {
          console.error("Error al cargar detalles del plan:", error);
          Notify.create({
            message:
              "Error al cargar los detalles del plan. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },

    cargarHoteles() {
      fetch("https://backmultidestinos.onrender.com/hoteles")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los hoteles desde la API");
          }
          return response.json();
        })
        .then((data) => {
          this.hoteles = data;
          this.cargarHotelesRelacionados(); // Llama a esta función después de cargar los hoteles
        })
        .catch((error) => {
          console.error("Error al cargar hoteles:", error);
          Notify.create({
            message:
              "Error al cargar los hoteles. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },

    cargarHotelesRelacionados() {
      this.hotelesRelacionados = this.hoteles.filter((hotel) => {
        return (
          hotel.pertenece === this.plan.pertenece &&
          hotel.destino === this.plan.destino &&
          hotel.nombrePrograma === this.plan.nombrePrograma
        );
      });
    },

    //AGREGAR:
    abrirModal(modo, hotel = null) {
      this.modoModal = modo;

      if (modo === "agregar") {
        this.hotelForm = {
          id: null,
          pertenece: this.plan.pertenece,
          destino: this.plan.destino,
          nombrePrograma: this.plan.nombrePrograma,
          hotel: null,
          plan: null,
          noches: null,
          tipoHabitacion: null,
          FechaInicio: null,
          FechaFin: null,
          sencilla: null,
          doble: null,
          triple: null,
          cuadruple: null,
          quintuple: null,
          sextuple: null,
          niño: null,
          nocheAdicionalsencilla: null,
          nocheAdicionaldoble: null,
          nocheAdicionaltriple: null,
          nocheAdicionalcuadruple: null,
          nocheAdicionalniño: null,
          incluye: null,
          noIncluye: null,
        };
      } else if (modo === "editar" && hotel) {
        this.hotelForm = {
          ...hotel,
          FechaInicio: hotel.FechaInicio
            ? hotel.FechaInicio.split("T")[0] // Extrae solo "YYYY-MM-DD"
            : null,
          FechaFin: hotel.FechaFin ? hotel.FechaFin.split("T")[0] : null,
        };
      }

      this.mostrarModal = true;
    },

    guardarHotel() {
      let url = "https://backmultidestinos.onrender.com/hoteles";
      let method = "POST";

      if (this.modoModal === "editar") {
        url = `${url}/${this.hotelForm.id}`;
        method = "PUT";
      }
      let hotelData = { ...this.hotelForm };
      hotelData.incluye = (hotelData.incluye || "").replace(/\n/g, "¿");
      hotelData.noIncluye = (hotelData.noIncluye || "").replace(/\n/g, "¿");
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.hotelForm),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al guardar el hotel");
          }
          return response.json();
        })
        .then((data) => {
          this.mostrarModal = false;
          this.cargarHoteles(); // Recarga la lista de hoteles
          Notify.create({
            message: "Hotel guardado con éxito",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al guardar hotel:", error);
          Notify.create({
            message:
              "Error al guardar el hotel. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },

    //---------------------------------------------Descarga del Formato --------------------------------------------------//
    // Abre el modal para descargar formato
    abrirModalFormato() {
      this.MostrarFormato = true;
    },

    // Descarga el formato en Excel
    async descargarExcel(tipo) {
      try {
        this.descargando = true;
        let columnasConId;
        let datosExistentes = [];

        if (tipo === "existente") {
          const response = await fetch(
            "https://backmultidestinos.onrender.com/hoteles",
            {
              headers: { Accept: "application/json" },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error en la respuesta del servidor: ${response.status}`
            );
          }

          datosExistentes = await response.json();
          columnasConId = ["id", ...this.columnasRequeridas];

          // Formatear fechas a 'YYYY-MM-DD'
          datosExistentes = datosExistentes.map((dato) => {
            columnasConId.forEach((col) => {
              if (col.toLowerCase().includes("fecha") && dato[col]) {
                dato[col] = new Date(dato[col]).toISOString().split("T")[0];
              }
            });
            return dato;
          });
        } else {
          columnasConId = this.columnasRequeridas.filter((col) => col !== "id");
        }

        const columnas = datosExistentes.map((dato) => {
          const fila = columnasConId.reduce((acc, columna) => {
            acc[columna] = dato[columna] || (columna === "id" ? "" : "");
            return acc;
          }, {});
          return fila;
        });

        if (tipo === "nuevo") {
          columnas.push(
            columnasConId.reduce((acc, columna) => {
              acc[columna] = "";
              return acc;
            }, {})
          );
        }

        const hoja = XLSX.utils.json_to_sheet(columnas);
        hoja["!autofilter"] = { ref: `A1:AE1` };
        hoja["!cols"] = columnasConId.map(() => ({ wch: 20 }));

        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          libro,
          hoja,
          tipo === "existente" ? "DatosExistentes" : "NuevoFormato"
        );

        const excelBuffer = XLSX.write(libro, {
          bookType: "xlsx",
          type: "array",
          compression: true,
        });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fechaFormateada = new Date().toISOString().split("T")[0];
        const nombreArchivo =
          tipo === "existente"
            ? `formato_hoteles_existentes_${fechaFormateada}.xlsx`
            : `formato_hoteles_nuevos_${fechaFormateada}.xlsx`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.$q.notify({
          type: "positive",
          message: "Formato descargado exitosamente",
          position: "top",
          timeout: 3000,
        });
        this.MostrarFormato = false;
      } catch (error) {
        console.error("Error al descargar el formato:", error);
        this.$q.notify({
          type: "negative",
          message: `Error al descargar el formato: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.descargando = false;
      }
    },

    // Lee el archivo Excel y devuelve los datos en formato JSON
    async leerArchivoExcel(archivo) {
      return new Promise((resolve, reject) => {
        if (!archivo) {
          return reject(new Error("No se ha seleccionado un archivo."));
        }

        if (
          archivo.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          return reject(
            new Error(
              "El archivo no es un archivo Excel válido. Asegúrate de seleccionar un archivo .xlsx."
            )
          );
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error(
                "El archivo Excel está vacío o no contiene hojas válidas."
              );
            }

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            if (firstSheet["!autofilter"]) {
              delete firstSheet["!autofilter"];
            }

            let jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              raw: false,
              defval: null,
            });

            if (jsonData.length === 0) {
              throw new Error("El archivo Excel no contiene datos válidos.");
            }

            let lastValidId = 0;
            jsonData = jsonData.map((row) => {
              if (!row.id || isNaN(Number(row.id))) {
                row.id = ++lastValidId;
              } else {
                row.id = Number(row.id);
                lastValidId = Math.max(lastValidId, row.id);
              }

              const parseCurrency = (value) =>
                value ? Number(String(value).replace(/\./g, "")) : null;
              const parseDate = (value) => {
                if (!value) return null;
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                  if (value.includes(" A ")) {
                    const [startDate, endDate] = value
                      .split(" A ")
                      .map((dateStr) => new Date(dateStr.trim()));
                    if (
                      isNaN(startDate.getTime()) ||
                      isNaN(endDate.getTime())
                    ) {
                      throw new Error(`Invalid date range value: ${value}`);
                    }
                    return {
                      startDate: startDate.toISOString().split("T")[0],
                      endDate: endDate.toISOString().split("T")[0],
                    };
                  }
                  throw new Error(`Invalid date value: ${value}`);
                }
                return date.toISOString().split("T")[0];
              };

              const fechaInicio = parseDate(row.FechaInicio);
              const fechaFin = parseDate(row.FechaFin);
              return {
                id: row.id,
                pertenece: row.pertenece != null ? String(row.pertenece) : null,
                destino: row.destino != null ? String(row.destino) : null,
                nombrePrograma:
                  row.nombrePrograma != null
                    ? String(row.nombrePrograma)
                    : null,
                hotel: row.hotel != null ? String(row.hotel) : null,
                plan: row.plan != null ? String(row.plan) : null,
                noches: row.noches != null ? String(row.noches) : null,
                tipoHabitacion:
                  row.tipoHabitacion != null
                    ? String(row.tipoHabitacion)
                    : null,
                sencilla: parseCurrency(row.sencilla),
                doble: parseCurrency(row.doble),
                triple: parseCurrency(row.triple),
                cuadruple: parseCurrency(row.cuadruple),
                quintuple: parseCurrency(row.quintuple),
                sextuple: parseCurrency(row.sextuple),
                niño: parseCurrency(row.niño),
                nocheAdicionalsencilla: parseCurrency(
                  row.nocheAdicionalsencilla
                ),
                nocheAdicionaldoble: parseCurrency(row.nocheAdicionaldoble),
                nocheAdicionaltriple: parseCurrency(row.nocheAdicionaltriple),
                nocheAdicionalcuadruple: parseCurrency(
                  row.nocheAdicionalcuadruple
                ),
                nocheAdicionalniño: parseCurrency(row.nocheAdicionalniño),
                incluye: row.incluye != null ? String(row.incluye) : null,
                noIncluye: row.noIncluye != null ? String(row.noIncluye) : null,
                FechaInicio:
                  fechaInicio && fechaInicio.startDate
                    ? fechaInicio.startDate
                    : fechaInicio,
                FechaFin:
                  fechaInicio && fechaInicio.endDate
                    ? fechaInicio.endDate
                    : fechaFin,
              };
            });

            resolve(jsonData);
          } catch (error) {
            reject(
              new Error("Error al procesar el archivo Excel: " + error.message)
            );
          }
        };

        reader.onerror = () => {
          reject(
            new Error(
              "Error al leer el archivo. Verifica que el archivo no esté corrupto o vacío."
            )
          );
        };

        reader.readAsArrayBuffer(archivo);
      });
    },

    // Importa nuevos datos desde el archivo Excel
    async importarDatosNuevo() {
      try {
        if (!this.archivoExcel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        console.log("Archivo seleccionado:", this.archivoExcel);

        this.procesando = true;
        this.progreso = 0; // Reiniciar el progreso
        console.log("Iniciando la importación de nuevos datos...");

        const datos = await this.leerArchivoExcel(this.archivoExcel);

        if (datos.length === 0) {
          throw new Error(
            "El archivo no contiene datos válidos para importar."
          );
        }

        const datosNuevos = datos.map((plan) => {
          if (!plan.id || isNaN(plan.id)) {
            plan.id = null;
          }
          return plan;
        });

        const totalDatos = datosNuevos.length;
        let procesados = 0;

        for (const plan of datosNuevos) {
          await this.guardarEnBaseDeDatos([plan], "nuevo");
          procesados++;
          this.progreso = (procesados / totalDatos) * 100; // Actualizar el progreso
        }

        this.mostrarModalImportar = false;
        this.$q.notify({
          type: "positive",
          message: "Importación completada exitosamente",
          position: "top",
          timeout: 5000,
        });
      } catch (error) {
        console.error("Error al importar datos:", error);
        this.$q.notify({
          type: "negative",
          message: `Error: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.procesando = false;
        this.progreso = 0; // Reiniciar el progreso
      }
    },

    // Actualiza datos existentes desde el archivo Excel
    async importarDatosExistente() {
      try {
        if (!this.archivoExcel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        this.procesando = true;
        this.progreso = 0;
        console.log("Iniciando la actualización de datos...");

        // Mostrar notificación inicial
        this.$q.notify({
          type: "info",
          message: `Progreso: 0% - Tiempo restante estimado: Calculando...`,
          position: "top",
          timeout: 1000,
        });

        const datos = await this.leerArchivoExcel(this.archivoExcel);

        if (datos.length === 0) {
          throw new Error(
            "El archivo no contiene datos válidos para actualizar."
          );
        }

        // Obtener todos los datos existentes de una sola vez
        const responseExistentes = await fetch(
          "https://backmultidestinos.onrender.com/hoteles"
        );
        if (!responseExistentes.ok) {
          throw new Error(
            `Error al obtener los datos existentes: ${responseExistentes.status}`
          );
        }
        const hotelesExistentes = await responseExistentes.json();

        // Crear un mapa para búsqueda rápida
        const mapaExistentes = new Map(
          hotelesExistentes.map((hotel) => [hotel.id, hotel])
        );

        // Procesar todos los datos en memoria
        const datosActualizados = datos.map((hotel) => {
          const existente = mapaExistentes.get(hotel.id);
          if (!existente) {
            return { ...hotel, id: null };
          }
          return { ...existente, ...hotel };
        });

        // Dividir en lotes más pequeños
        const BATCH_SIZE = 100; // Tamaño del lote reducido
        const batches = [];
        for (let i = 0; i < datosActualizados.length; i += BATCH_SIZE) {
          batches.push(datosActualizados.slice(i, i + BATCH_SIZE));
        }

        // Procesar lotes en paralelo con límite de concurrencia
        const CONCURRENT_BATCHES = 20; // Número de lotes procesados simultáneamente aumentado
        let completados = 0;
        const startTime = Date.now();

        for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
          const batchPromises = batches
            .slice(i, i + CONCURRENT_BATCHES)
            .map(async (batch) => {
              const response = await fetch(
                "http://localhost:8010/hoteles/procesar-lote",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ hoteles: batch }),
                }
              );

              if (!response.ok) {
                throw new Error(`Error en el lote: ${response.statusText}`);
              }

              completados += batch.length;
              this.progreso = (completados / datosActualizados.length) * 100;

              // Calcular el tiempo estimado restante en segundos
              const elapsedTime = Date.now() - startTime;
              const remainingTime =
                (elapsedTime / completados) *
                (datosActualizados.length - completados);
              const remainingSeconds = (remainingTime / 1000).toFixed(2);

              // Notificar progreso y tiempo restante
              this.$q.notify({
                type: "info",
                message: `Progreso: ${Math.floor(
                  this.progreso
                )}% - Tiempo restante estimado: ${remainingSeconds} segundos`,
                position: "top",
                timeout: 6000,
              });

              return response.json();
            });

          await Promise.all(batchPromises);
        }

        this.mostrarModalImportar = false;
        this.$q.notify({
          type: "positive",
          message: "Actualización completada exitosamente",
          position: "top",
          timeout: 10000,
        });
      } catch (error) {
        console.error("Error en la importación:", error);
        this.$q.notify({
          type: "negative",
          message: `Error: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.procesando = false;
        this.progreso = 0;
      }
    },

    // Guarda los datos en la base de datos
    async guardarEnBaseDeDatos(datos, tipo) {
      try {
        const responseExistentes = await fetch(
          "https://backmultidestinos.onrender.com/hoteles"
        );
        if (!responseExistentes.ok) {
          throw new Error(
            `Error al obtener los datos. Estado: ${responseExistentes.status}`
          );
        }
        const hotelesExistentes = await responseExistentes.json();

        const procesarDatos = datos.map((hotel) => {
          const existe = hotelesExistentes.find(
            (hotelExistente) => hotelExistente.id === hotel.id
          );

          if (tipo === "nuevo" || !existe) {
            return { ...hotel, id: null };
          }

          const cambios = Object.keys(hotel).reduce((acc, key) => {
            if (hotel[key] !== existe[key]) {
              acc[key] = hotel[key];
            }
            return acc;
          }, {});

          if (Object.keys(cambios).length > 0) {
            return { ...existe, ...cambios };
          }

          return existe;
        });

        const datosConCambios = procesarDatos.filter((hotel) => {
          const original = hotelesExistentes.find((h) => h.id === hotel.id);
          return (
            !original || JSON.stringify(hotel) !== JSON.stringify(original)
          );
        });

        if (datosConCambios.length === 0) {
          this.$q.notify({
            type: "info",
            message: "No hay cambios para actualizar.",
            position: "top",
            timeout: 3000,
          });
          return;
        }

        // Dividir los datos en lotes
        const batchSize = 100;
        const batches = [];
        for (let i = 0; i < datosConCambios.length; i += batchSize) {
          batches.push(datosConCambios.slice(i, i + batchSize));
        }

        // Procesar los lotes concurrentemente
        const promises = batches.map(async (batch) => {
          batch = batch.map((hotel) => {
            Object.keys(hotel).forEach((key) => {
              if (key.toLowerCase().includes("fecha") && hotel[key]) {
                hotel[key] = new Date(hotel[key]).toISOString().split("T")[0];
              }
            });
            return hotel;
          });

          const response = await fetch(
            "http://localhost:8010/hoteles/procesar-lote",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ hoteles: batch }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              `Error al procesar los datos: ${
                errorData.mensaje || response.statusText
              }`
            );
          }

          return response.json();
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promises);

        this.$q.notify({
          type: "positive",
          message: `Acción realizada con éxito`,
          position: "top",
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error al guardar los datos en la base de datos:", error);
        this.$q.notify({
          type: "negative",
          message: `Error al guardar los datos: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
        throw error;
      }
    },
  },
};
</script>
