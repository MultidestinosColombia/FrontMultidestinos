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
    </q-table>
    <div v-else class="text-grey q-mt-md">
      No hay hoteles asociados a este plan.
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
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
      ],
    };
  },
  mounted() {
    this.cargarDetallesPlan();
  },
  methods: {
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
  },
};
</script>
