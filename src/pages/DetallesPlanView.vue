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
        color="primary"
        @click="abrirModal('agregar')"
      />
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
                <q-input
                  v-model="hotelForm.noches"
                  label="Noches"
                  :disable="modoModal === 'editar'"
                />
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
  </q-page>
</template>

<script>
import { Notify } from "quasar";
export default {
  data() {
    return {
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
    };
  },
  mounted() {
    this.cargarDetallesPlan();
  },
  methods: {
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
  },
};
</script>
