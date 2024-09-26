<template>
  <q-page class="q-pa-md">
    <q-btn
      @click="mostrarModalAgregar = true"
      label="Agregar Plan"
      class="q-mb-md"
      color="primary"
    />

    <q-dialog v-model="mostrarModalAgregar" content-css="max-width: 400px;">
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <q-form @submit="submitForm"> </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- TEMPLATE EDITAR -->
    <q-dialog v-model="mostrarModalEditar" content-css="max-width: 400px;">
      <q-card>
        <q-card-section class="row items-center q-pa-md">
          <q-form @submit="editarPlanSubmit">
            <q-input
              label="Pertenece"
              v-model="perteneceEditar"
              :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
            />
            <q-input
              label="Destino"
              v-model="destinoEditar"
              :rules="[(val) => !!val || 'El campo Destino es obligatorio']"
            />
            <q-input
              label="Nombre del Programa"
              v-model="nombreProgramaEditar"
              :rules="[
                (val) => !!val || 'El campo Nombre del Programa es obligatorio',
              ]"
            />

            <div class="q-mb-md">
              <label>Hoteles</label>
              <q-chip
                v-for="hotel in hotelesEditar"
                :key="hotel"
                removable
                @remove="eliminarHotelEditar(hotel)"
                :label="hotel"
                class="q-ma-xs"
                color="primary"
                text-color="white"
              />
              <q-input
                v-model="nuevoHotel"
                placeholder="Agregar hotel"
                dense
                outlined
                @keyup.enter.prevent="agregarHotelEditar"
              />
            </div>

            <div class="q-mb-md">
              <label>Noches</label>
              <q-chip
                v-for="noche in nochesEditar"
                :key="noche"
                removable
                @remove="eliminarNocheEditar(noche)"
                :label="noche"
                class="q-ma-xs"
                color="primary"
                text-color="white"
              />
              <q-input
                v-model="nuevaNoche"
                placeholder="Agregar noche"
                dense
                outlined
                @keyup.enter.prevent="agregarNocheEditar"
              />
            </div>

            <div class="q-mb-md">
              <label>Acomodación</label>
              <q-chip
                v-for="acomodacion in acomodacionEditar"
                :key="acomodacion"
                removable
                @remove="eliminarAcomodacionEditar(acomodacion)"
                :label="acomodacion"
                class="q-ma-xs"
                color="primary"
                text-color="white"
              />
              <q-input
                v-model="nuevaAcomodacion"
                placeholder="Agregar acomodación"
                dense
                outlined
                @keyup.enter.prevent="agregarAcomodacionEditar"
              />
            </div>

            <q-input
              label="Plan"
              v-model="planEditar"
              :rules="[(val) => !!val || 'El campo Plan es obligatorio']"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                type="submit"
                label="Guardar Cambios"
                color="primary"
                :disable="!formValidoEditar"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-table
      :rows="planes"
      :columns="columnas"
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
              v-for="noches in props.row.noches.split('*')"
              :key="noches"
              :label="noches.trim()"
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
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props">
          <q-btn
            dense
            color="primary"
            @click="editarPlan(props.row)"
            class="q-mx-xs"
            >Editar</q-btn
          >
          <q-btn
            dense
            color="negative"
            @click="eliminarPlan(props.row.id)"
            class="q-mx-xs"
            >Eliminar</q-btn
          >
          <q-btn
            dense
            color="info"
            @click="verDetallesPlan(props.row.id)"
            class="q-mx-xs"
          >
            Ver Detalles
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  data() {
    return {
      //editar formulario
      mostrarModalEditar: false,
      planEditando: null,

      // Variables para los campos del formulario de edición (como arrays)

      perteneceEditar: "",
      destinoEditar: "",
      nombreProgramaEditar: "",
      hotelesEditar: [],
      planEditar: "",
      nochesEditar: [],
      acomodacionEditar: [],

      // Variables para agregar nuevos elementos a los chips
      nuevoHotel: "",
      nuevaNoche: "",
      nuevaAcomodacion: "",
      // Variables para el formulario de agregar
      pertenece: "",
      destino: "",
      nombrePrograma: "",
      hotel: "",
      plan: "",
      noches: "",
      baseComisionable: "",
      baseTiqueta: "",
      acomodacion: "",
      fechaBloqueo: "",
      vigenciaInicio: null, // Asegúrate de manejar fechas correctamente
      vigenciaFinal: null,
      incluye: "",
      noIncluye: "",
      notas: "",

      // Variables para el formulario de editar (similares a las de agregar)
      planEditandoId: null, // Para identificar el plan que se está editando
      // ... otras variables para editar ...

      planes: [], // Aquí se almacenarán los datos de los planes
      columnas: [
        {
          name: "pertenece",
          label: "Pertenece",
          align: "left",
          sortable: true,
          field: (row) => row.pertenece,
        },
        {
          name: "destino",
          label: "Destino",
          align: "left",
          sortable: true,
          field: (row) => row.destino,
        },
        {
          name: "nombrePrograma",
          label: "Nombre del Programa",
          align: "left",
          field: (row) => row.nombrePrograma,
        },
        {
          name: "hotel",
          label: "Hotel",
          align: "left",
          field: (row) => row.hotel,
        },
        {
          name: "plan",
          label: "Plan",
          align: "left",
          field: (row) => row.plan,
        },
        {
          name: "noches",
          label: "Noches",
          align: "left",
          field: (row) => row.noches,
        },
        {
          name: "acomodacion",
          label: "Acomodación",
          align: "left",
          field: (row) => row.acomodacion,
        },

        {
          name: "acciones",
          label: "Acciones",
          align: "center",
        },
      ],
      columnasHoteles: [
        // Columnas para la tabla de detalles de hotel
        { name: "hotel", label: "Hotel", field: "hotel" },
        { name: "noches", label: "Noches", field: "noches" },
        {
          name: "tipoHabitacion",
          label: "Tipo de Habitación",
          field: "tipoHabitacion",
        },
        // ... otras columnas relevantes de 'hoteles' ...
      ],
      mostrarModalAgregar: false,
    };
  },
  computed: {
    formValidoEditar() {
      return (
        this.perteneceEditar &&
        this.destinoEditar &&
        this.nombreProgramaEditar &&
        this.hotelesEditar.length > 0 && // Asegúrate de que haya al menos un hotel
        this.planEditar &&
        this.nochesEditar.length > 0 && // Asegúrate de que haya al menos una noche
        this.acomodacionEditar.length > 0 // Asegúrate de que haya al menos una acomodación
      );
    },
  },
  mounted() {
    this.cargarPlanes(); // Cargar los planes al iniciar el componente
  },
  methods: {
    //EDITAR
    agregarHotelEditar() {
      if (this.nuevoHotel && this.nuevoHotel.trim() !== "") {
        this.hotelesEditar.push(this.nuevoHotel.trim());
        this.nuevoHotel = "";
      }
    },

    eliminarHotelEditar(index) {
      this.hotelesEditar.splice(index, 1);
    },

    agregarNocheEditar() {
      if (this.nuevaNoche && this.nuevaNoche.trim() !== "") {
        this.nochesEditar.push(this.nuevaNoche.trim());
        this.nuevaNoche = "";
      }
    },

    eliminarNocheEditar(index) {
      this.nochesEditar.splice(index, 1);
    },

    agregarAcomodacionEditar() {
      if (this.nuevaAcomodacion && this.nuevaAcomodacion.trim() !== "") {
        this.acomodacionEditar.push(this.nuevaAcomodacion.trim());
        this.nuevaAcomodacion = "";
      }
    },

    eliminarAcomodacionEditar(index) {
      this.acomodacionEditar.splice(index, 1);
    },
    limpiarFormularioEditar() {
      this.planEditando = null;
      this.perteneceEditar = "";
      this.destinoEditar = "";
      this.nombreProgramaEditar = "";
      this.hotelEditar = "";
      this.planEditar = "";
      this.nochesEditar = "";
      this.acomodacionEditar = "";
      this.incluyeEditar = "";
      this.noIncluyeEditar = "";
    },
    editarPlanSubmit() {
      const hotelString = this.hotelesEditar.join("*");
      const nochesString = this.nochesEditar.join("*");
      const acomodacionString = this.acomodacionEditar.join("*");
      const updatedPlan = {
        id: this.planEditando.id,
        pertenece: this.perteneceEditar,
        destino: this.destinoEditar,
        nombrePrograma: this.nombreProgramaEditar,
        hotel: hotelString,
        plan: this.planEditar,
        noches: nochesString,
        acomodacion: acomodacionString,

        // ... otros campos que quieras actualizar ...
        // Incluir los campos que no se están editando con sus valores originales
        baseComisionable: this.planEditando.baseComisionable,
        baseTiqueta: this.planEditando.baseTiqueta,
        fechaBloqueo: this.planEditando.fechaBloqueo,
        vigenciaInicio: this.planEditando.vigenciaInicio,
        vigenciaFinal: this.planEditando.vigenciaFinal,
        incluye: this.planEditando.incluye,
        noIncluye: this.planEditando.noIncluye,
        notas: this.planEditando.notas,
      };
      console.log("Datos que se enviarán al servidor:", updatedPlan);
      fetch(`https://backmultidestinos.onrender.com/planes/${updatedPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlan),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el plan");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Plan actualizado:", data);

          const index = this.planes.findIndex((p) => p.id === updatedPlan.id);
          if (index !== -1) {
            this.planes[index] = data;
          }
          this.mostrarModalEditar = false;
          this.limpiarFormularioEditar();
          Notify.create({
            message: "Plan actualizado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al actualizar plan:", error);
          Notify.create({
            message:
              "Error al actualizar el plan. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    editarPlan(plan) {
      // Copia los datos del plan a las variables de edición
      this.planEditando = plan;
      this.perteneceEditar = plan.pertenece;
      this.destinoEditar = plan.destino;
      this.nombreProgramaEditar = plan.nombrePrograma;
      this.hotelEditar = plan.hotel;
      this.planEditar = plan.plan;
      this.nochesEditar = plan.noches;
      this.acomodacionEditar = plan.acomodacion;
      this.incluyeEditar = plan.incluye;
      this.noIncluyeEditar = plan.noIncluye;
      this.hotelesEditar = plan.hotel
        ? plan.hotel.split("*").map((item) => item.trim())
        : [];
      this.nochesEditar = plan.noches
        ? plan.noches.split("*").map((item) => item.trim())
        : [];
      this.acomodacionEditar = plan.acomodacion
        ? plan.acomodacion.split("*").map((item) => item.trim())
        : [];
      this.mostrarModalEditar = true;
    },
    //FIN EDITAR
    cargarPlanes() {
      fetch("https://backmultidestinos.onrender.com/planes")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los planes desde la API");
          }
          return response.json();
        })
        .then((data) => {
          this.planes = data; // Asigna los datos de la API a la variable 'planes'
        })
        .catch((error) => {
          console.error("Error al cargar planes:", error);
          Notify.create({
            message:
              "Error al cargar los planes. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
      this.cargarHoteles();
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
    verDetallesPlan(planId) {
      this.$router.push({
        name: "DetallesPlan",
        params: { id: planId },
      });
    },
    submitForm() {
      // Lógica para agregar un nuevo plan
      // ... (implementa la llamada fetch aquí) ...
    },

    eliminarPlan(id) {
      // Lógica para eliminar un plan
      // ... (implementa la llamada fetch aquí) ...
    },
    // ... otras funciones auxiliares ...
  },
};
</script>
