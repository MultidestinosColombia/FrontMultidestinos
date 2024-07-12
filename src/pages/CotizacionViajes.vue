<template>
  <q-page padding>
    <div v-if="userData">
      <h5 padding>Bienvenido, {{ userData.nombreCompleto }}</h5>
    </div>
    <div v-else>
      <p>Cargando datos del usuario...</p>
    </div>
    <q-btn label="Crear cotizacion" @click="openModal" color="primary" />
    <br />
    <q-dialog v-model="modalVisible" content-css="max-width: 600px;">
      <q-card>
        <q-card-section class="q-pa-md">
          <!-- Contenido de las pestañas -->
          <div v-show="activeTab === 'tab1'">
            <!-- primera formulario -->
            <q-card
              :style="{
                border: '0',
                borderRadius: '100%',
                boxShadow: 'none',
              }"
            >
              <q-card-section class="q-pa-md">
                <!-- FECHA INICIO -->
                <div class="row q-col-gutter-md">
                  <!-- Fecha de inicio -->
                  <div class="col" style="margin-left: 10px">
                    <q-input
                      filled
                      v-model="dateRange[0]"
                      mask="date"
                      :rules="startDateRules"
                      label="Fecha de inicio"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="dateRange[0]">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <!-- Fecha de fin -->
                  <div class="col">
                    <q-input
                      filled
                      v-model="dateRange[1]"
                      mask="date"
                      :rules="endDateRules"
                      label="Fecha de fin"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="dateRange[1]">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="q-gutter-md">
                  <!-- Salida -->
                  <q-select
                    outlined
                    v-model="selectedDeparture"
                    label="Salida"
                    :options="departureOptions"
                    @update:modelValue="handleDepartureChange"
                    class="q-mb-md q-ml-md"
                  />

                  <!-- Destino -->
                  <q-select
                    outlined
                    v-model="destination"
                    label="Destino"
                    :options="destinationOptions"
                    @update:modelValue="updateOptionsByDestination"
                    class="q-mb-md relative-position"
                  >
                    <template #append>
                      <div
                        class="error-message"
                        v-show="!destinationOptions.length"
                        style="color: red; font-size: 15px; align-items: center"
                      >
                        Ups... no hay información
                      </div>
                    </template>
                  </q-select>

                  <!-- Cliente y Nombre del Programa -->
                  <div class="row q-col-gutter-md">
                    <div class="col">
                      <q-select
                        outlined
                        v-model="selectedClient"
                        label="Cliente"
                        :options="clientOptions"
                        filter
                        use-input
                        class="q-mb-md q-ml-md"
                        @update:modelValue="fetchOptionCorreo"
                      />
                    </div>
                    <div class="col">
                      <q-select
                        outlined
                        v-model="programName"
                        label="Nombre del Programa"
                        :options="programNameOptions"
                        @update:modelValue="handleSelectionChangeTipo"
                        class="q-mb-md"
                      />
                    </div>
                  </div>

                  <!-- Plan y Hotel -->
                  <div class="row q-col-gutter-md">
                    <div class="col">
                      <q-select
                        outlined
                        v-model="noche"
                        label="Duración"
                        :options="nochesOptions"
                        class="q-mb-md q-ml-md"
                      />
                    </div>
                    <div class="col">
                      <q-select
                        outlined
                        v-model="hotel"
                        label="Hotel"
                        :options="hotelOptions"
                        @update:modelValue="handleSelectionChangeTipo"
                        class="q-mb-md"
                      />
                    </div>
                  </div>
                  <!-- noche adicional -->
                  <div
                    class="row q-col-gutter-md"
                    v-if="!shouldHideAdditionalNightSection()"
                  >
                    <div class="col">
                      <!-- Checkbox para Noche adicional -->
                      <q-checkbox
                        v-model="additionalNightSelected"
                        label="Noche adicional"
                        class="q-mb-md q-ml-md"
                      />
                    </div>
                    <div class="col">
                      <!-- Campo de entrada para el número de noches adicionales -->
                      <q-input
                        filled
                        v-model="additionalNightCount"
                        label="Noches adicionales"
                        type="number"
                        :disable="!additionalNightSelected"
                        class="q-mb-md"
                      />
                    </div>
                  </div>
                  <!-- Número de habitaciones -->
                  <div class="row q-col-gutter-md">
                    <div class="col">
                      <q-select
                        outlined
                        v-model="correo"
                        label="Correo Cliente"
                        :options="OptionCorreo"
                        class="q-mb-md q-ml-md"
                      />
                    </div>
                    <div class="col">
                      <q-select
                        outlined
                        v-model="numRooms"
                        label="Número de habitaciones"
                        :options="roomOptions"
                        class="q-mb-md q-ml-md"
                        @update:modelValue="handleNumRoomsChange"
                      />
                    </div>
                  </div>

                  <!-- Bucle para mostrar el formulario de cada habitación -->
                  <div v-for="(room, index) in rooms" :key="index">
                    <q-card
                      :style="{
                        border: '0',
                        borderRadius: '10px',
                        boxShadow: 'none',
                        marginTop: '20px',
                      }"
                    >
                      <q-card-section class="q-pa-md">
                        <p style="text-align: center">
                          <span style="margin-left: 10px; font-weight: bold">
                            Habitación {{ index + 1 }}
                          </span>
                        </p>
                        <div class="row q-col-gutter-md">
                          <div class="col">
                            <!-- Tipo de habitación -->
                            <q-select
                              outlined
                              v-model="room.roomType"
                              label="Tipo de Habitación"
                              :options="roomTypeOptions"
                              class="q-mb-md"
                            />
                          </div>
                          <div class="col">
                            <!-- Número de adultos -->
                            <q-select
                              outlined
                              v-model="room.adults"
                              label="Adultos"
                              :options="adultsOptions"
                              class="q-mb-md"
                            />
                          </div>
                        </div>

                        <!-- Checkbox para niños -->
                        <div class="row q-col-gutter-md">
                          <div class="col">
                            <q-checkbox
                              v-model="hasChildren[index]"
                              label="¿Niños?"
                              @update:modelValue="handleChildrenChange(index)"
                            />
                          </div>
                          <!-- Input bloqueado para número de niños (máximo 1) -->
                          <div class="col">
                            <q-input
                              filled
                              v-model="room.numChildren"
                              label="Niños"
                              readonly
                              :disable="!hasChildren[index]"
                            />
                          </div>
                        </div>
                        <!-- EDADES CAÑO CRISTAL -->
                        <div v-if="mostrarCamposEdad(index)">
                          <div v-for="(room, index) in rooms" :key="index">
                            <div class="row">
                              <div class="col-12">
                                <p class="age-input-label">
                                  Edades y nacionalidad de los adultos:
                                </p>
                              </div>

                              <div
                                v-for="(age, i) in adultAgesComputed(room)"
                                :key="'adult' + i + '-' + index"
                                class="col-6 col-sm-4 col-md-3"
                              >
                                <q-input
                                  filled
                                  v-model="room.adultAges[i]"
                                  :label="'Adulto ' + (i + 1) + ' - Edad'"
                                  type="number"
                                />

                                <q-checkbox
                                  v-model="room.isForeigner[i]"
                                  label="Extranjero"
                                />
                              </div>
                            </div>

                            <div class="row" v-if="hasChildren[index]">
                              <div class="col-12">
                                <p class="age-input-label">Edad del niño:</p>
                              </div>
                              <div class="col-6 col-sm-4 col-md-3">
                                <q-input
                                  filled
                                  v-model="room.childAge"
                                  label="Niño"
                                  type="number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- FIN EDADES -->
                        <!-- Acomodación de la habitación -->
                        <q-select
                          outlined
                          v-model="room.accommodation"
                          label="Acomodación"
                          :options="accommodationOptions"
                          class="q-mb-md"
                        />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <div>
              <!-- Contenido de la primera pestaña -->
            </div>
          </div>
          <div v-show="activeTab === 'tab2'">
            <!-- segunda pestaña -->

            <!-- Aerolina-->

            <p style="text-align: center">
              <span style="margin-left: 10px; font-weight: bold"
                >Información ida</span
              >
            </p>

            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-select
                    v-model="aerolineaValue1"
                    label="Aerolinea"
                    outlined
                    :options="aerolineaOptions"
                    class="q-mb-md"
                  />
                </div>
              </div>
              <!-- Vuelo-->
              <div class="col">
                <q-input
                  v-model="vueloValue1"
                  label="Vuelo"
                  outlined
                  type="text"
                  class="q-mb-md"
                />
              </div>
            </div>
            <!-- hora salida -->
            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-input
                    v-model="horaSalidaValue1"
                    label="Hora de salida"
                    outlined
                    type="time"
                    step="1800"
                    class="q-mb-md"
                  />
                </div>
              </div>

              <!-- hora llegada-->
              <div class="col">
                <q-input
                  v-model="horaLlegadaValue1"
                  label="Hora de llegada"
                  outlined
                  type="time"
                  step="1800"
                  class="q-mb-md"
                />
              </div>
            </div>
            <!-- CLASE -->
            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-input
                    v-model="claseValue1"
                    label="Clase"
                    outlined
                    type="text"
                    class="q-mb-md"
                  />
                </div>
              </div>
              <!-- FECHA-->
              <div class="col" style="margin-left: 10px">
                <q-input
                  filled
                  v-model="dateRange[0]"
                  mask="date"
                  :rules="startDateRules"
                  label="Fecha de inicio"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateRange[0]">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <p style="text-align: center">
              <span style="margin-left: 10px; font-weight: bold"
                >Información vuelta</span
              >
            </p>

            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-select
                    v-model="aerolineaValue2"
                    label="Aerolinea"
                    outlined
                    :options="aerolineaOptions"
                    class="q-mb-md"
                  />
                </div>
              </div>
              <!-- Vuelo-->
              <div class="col">
                <q-input
                  v-model="vueloValue2"
                  label="Vuelo"
                  outlined
                  type="text"
                  class="q-mb-md"
                />
              </div>
            </div>
            <!-- hora salida -->
            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-input
                    v-model="horaSalidaValue2"
                    label="Hora de salida"
                    outlined
                    type="time"
                    step="1800"
                    class="q-mb-md"
                  />
                </div>
              </div>

              <!-- hora llegada-->
              <div class="col">
                <q-input
                  v-model="horaLlegadaValue2"
                  label="Hora de llegada"
                  outlined
                  type="time"
                  step="1800"
                  class="q-mb-md"
                />
              </div>
            </div>
            <!-- CLASE -->
            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-input
                    v-model="claseValue2"
                    label="Clase"
                    outlined
                    type="text"
                    class="q-mb-md"
                  />
                </div>
              </div>
              <!-- FECHA-->
              <!-- Fecha de fin -->
              <div class="col">
                <q-input
                  filled
                  v-model="dateRange[1]"
                  mask="date"
                  :rules="endDateRules"
                  label="Fecha de fin"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dateRange[1]">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <!-- Suplemento y Campo de entrada para el suplemento -->
            <div class="row q-col-gutter-md">
              <div class="col">
                <div class="q-mb-md q-ml-md">
                  <q-checkbox v-model="supplementChecked" label="Suplemento?" />
                </div>
              </div>
            </div>

            <div v-if="supplementChecked">
              <q-input
                v-model="numberOfPeople"
                label="Número de personas"
                outlined
                type="number"
                class="q-mb-md"
              />

              <div v-for="person in peopleArray" :key="person">
                <q-input
                  v-model="supplementValues[person - 1]"
                  :label="`Suplemento persona ${person}`"
                  outlined
                  type="number"
                  class="q-mb-md"
                />
              </div>
            </div>
          </div>

          <!-- Botones de navegación -->
          <div class="row q-mt-md justify-center">
            <div class="col" v-if="activeTab === 'tab2'">
              <q-btn label="Atrás" @click="goBack" color="primary" />
            </div>
            <div class="col" v-if="activeTab === 'tab1'">
              <q-btn label="Siguiente" @click="goNext" color="primary" />
            </div>
            <div class="col" v-if="activeTab === 'tab2'">
              <q-btn label="Registrar" @click="saveFormData" color="primary" />
            </div>
            <div
              class="col"
              v-if="activeTab === 'tab1' || activeTab === 'tab2'"
            >
              <q-btn label="Cerrar" @click="closeModal" color="red" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div>
      <br />
      <q-table :rows="cotizacionData" :columns="columns">
        <template v-slot:body-cell-cotizacion="props">
          <q-td :props="props">
            <q-btn
              @click="descargarCotizacionN(props.row)"
              color="primary"
              label="Descargar Cotización"
            />
            <br />
            <br />
            <q-btn
              @click="enviarCotizacion(props.row)"
              color="secondary"
              label="Enviar Cotización"
            />
          </q-td>
        </template>
      </q-table>
      <input type="file" ref="fileInput" style="display: none" />
    </div>
  </q-page>
</template>


<script>
import numeral from "numeral";
import { Notify } from "quasar";
import { jsPDF } from "jspdf";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { LocalStorage } from "quasar";
import axios from "axios";
import { format } from "date-fns";
import emailjs from "emailjs-com";
import { PDFDocument } from "pdf-lib";

const formatCurrency = (value) => {
  const formatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP", // Cambia 'COP' por la moneda que necesites
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};

export default {
  setup() {
    let sumaTotalAcomodacion = 0;
    let sumaValorBrutohab = 0;
    let sumaTotalDescuento = 0;
    const peopleArray = computed(() => {
      return Array.from({ length: numberOfPeople.value }, (_, i) => i + 1);
    });
    const cotizacionCounter = ref(0);
    const additionalNightSelected = ref(false);
    const additionalNightCount = ref(null);
    // Definir un rango de opciones para el número de habitaciones
    const roomOptions = Array.from({ length: 10 }, (_, i) => i + 1);
    //otros
    const children = ref([]);
    const hasChildren = ref([]);
    const numRooms = ref(1);
    const rooms = ref([]);
    const nochesOptionsRaw = ref([]);

    const showAgeInputs = (index) => {
      return (
        destination.value === "La Macarena" &&
        programName.value === "Caño Cristales"
      );
    };
    const addRoom = () => {
      rooms.value.push({
        index: rooms.value.length,
        accommodation: "",
        adults: 1,
        adultAges: [null], // Inicializa con un valor nulo para el primer adulto
        childAge: null,
        isForeigner: [false], // Inicializa con 'false' para el primer adulto
      });
      hasChildren.value.push(false);
    };

    // Watcher para actualizar room.adultAges al cambiar room.adults
    watch(
      () => rooms.value.map((room) => room.adults),
      (newAdultsArray) => {
        rooms.value.forEach((room, index) => {
          const newAdultAges = Array.from(
            { length: newAdultsArray[index] },
            () => null
          );
          const newIsForeigner = Array.from(
            { length: newAdultsArray[index] },
            () => false
          );
          room.adultAges.splice(0, room.adultAges.length, ...newAdultAges);
          room.isForeigner.splice(
            0,
            room.isForeigner.length,
            ...newIsForeigner
          ); // Actualizar isForeigner
        });
      },
      { deep: true }
    );

    // Función para calcular las edades de los adultos de una habitación
    const adultAgesComputed = (room) => {
      return room ? [...room.adultAges] : [];
    };

    const updateAccommodationOptions = () => {
      rooms.value = [];
      for (let i = 0; i < numRooms.value; i++) {
        rooms.value.push({
          index: i,
          accommodation: null,
          adultAges: [null],
          childAge: null,
          isForeigner: [false],
        });
      }
    };
    const mostrarCamposEdad = (index) => {
      return (
        destination.value === "La Macarena" &&
        programName.value === "Caño Cristales"
      );
    };

    updateAccommodationOptions();
    const handleNumRoomsChange = () => {
      console.log("Número de habitaciones cambiado:", numRooms.value);
      updateAccommodationOptions();
    };

    //TRAE LA DATA
    const cotizacionData = ref([]);
    const usersMap = ref({}); // Mapa de usuarios por ID
    //trae la data de cotizacion
    const fetchCotizacionData = async () => {
      try {
        const response = await axios.get(
          "https://backendmultidestinosexpress.onrender.com/cotizacion"
        );
        cotizacionData.value = response.data;
        await fetchUsers(); // Llama a fetchUsers después de obtener las cotizaciones
        replaceUserIdsWithNames(); // Reemplaza los IDs de usuario con nombres completos
        formatValues(); // Formatea los valores de totalPrecio y valorDescuento
      } catch (error) {
        console.error("Error fetching cotizacion data:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backendmultidestinosexpress.onrender.com/user/"
        );
        const users = response.data;
        users.forEach((user) => {
          usersMap.value[user.id] = user.nombreCompleto; // Cambia 'fullName' por el nombre del campo en tu API
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const replaceUserIdsWithNames = () => {
      cotizacionData.value.forEach((cotizacion) => {
        cotizacion.CreadorCotizacion =
          usersMap.value[cotizacion.CreadorCotizacion];
        cotizacion.fechaCreacion = formatDate(cotizacion.fechaCreacion);
        cotizacion.fechaInicio = formatDate(cotizacion.fechaInicio);
        cotizacion.fechaFin = formatDate(cotizacion.fechaFin);
      });
    };
    const formatValues = () => {
      cotizacionData.value.forEach((cotizacion) => {
        cotizacion.precioBrutoTotal = formatCurrency(
          Number(cotizacion.precioBrutoTotal)
        );
        cotizacion.totalPrecioCliente = formatCurrency(
          Number(cotizacion.totalPrecioCliente)
        );
      });
    };

    const formatDate = (date) => format(new Date(date), "yyyy-MM-dd");

    //VUELO INFO DATA

    const aerolineaValue1 = ref("");
    const idCotizacion = ref("");
    const vueloValue1 = ref("");
    const horaLlegadaValue1 = ref("");
    const horaSalidaValue1 = ref("");
    const claseValue1 = ref("");
    const aerolineaValue2 = ref("");
    const vueloValue2 = ref("");
    const horaLlegadaValue2 = ref("");
    const horaSalidaValue2 = ref("");
    const claseValue2 = ref("");
    //resto

    const activeTab = ref("tab1"); // Pestaña activa por defecto
    // Método para avanzar a la siguiente página
    const goNext = () => {
      if (activeTab.value === "tab1") {
        // Validación de Fechas
        if (!dateRange.value[0] || !dateRange.value[1]) {
          Notify.create({
            message:
              "Por favor ingrese una fecha de inicio y una fecha de fin.",
            color: "negative",
          });
          return;
        }

        // Validación de Selección de Destino y Cliente
        if (!destination.value || !selectedClient.value) {
          Notify.create({
            message: "Por favor seleccione un destino y un cliente.",
            color: "negative",
          });
          return;
        }

        // Validación de Habitaciones
        if (
          rooms.value.length === 0 ||
          rooms.value.some(
            (room) => !room.roomType || !room.adults || !room.accommodation
          )
        ) {
          Notify.create({
            message:
              "Por favor complete la información de al menos una habitación.",
            color: "negative",
          });
          return;
        }

        activeTab.value = "tab2";
      }
    };

    // Método para retroceder a la página anterior
    const goBack = () => {
      if (activeTab.value === "tab2") {
        activeTab.value = "tab1";
      }
    };
    const today = new Date();
    const correo = ref("");
    const formattedDate = today.toISOString().split("T")[0];
    const dateRange = ref([formattedDate, formattedDate]);
    const adjustEndDate = (newValue) => {
      if (dateRange.value[1] < newValue) {
        dateRange.value[1] = newValue;
      }
    };
    const startDateRules = [
      (val) =>
        today <= new Date(val) ||
        "La fecha de inicio no puede ser anterior a hoy",
    ];
    const endDateRules = [
      (val) =>
        val >= dateRange.value[0] ||
        "La fecha de fin no puede ser anterior a la fecha de inicio",
    ];
    const userData = ref(null);
    const router = useRouter();
    const modalVisible = ref(false);
    const departureOptions = ref([
      "Bogota",
      "Cali",
      "Medellin",
      "Amazonas",
      "Guajira",
      "Nariño",
      "Guajira",
      "San Andres",
    ]); // Opciones iniciales de salida
    const destinationOptions = ref([]);
    const programNameOptions = ref([]);
    const hotelOptions = ref([]);
    const nochesOptions = ref([]);
    const planOptions = ref([]);
    const adultsOptions = ref([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ]);
    let habitacionesDatos = [];
    let ultimaCotizacionDescargada = null;
    const childrenOptions = ref(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    const accommodationOptions = ref([]);
    const roomTypeOptions = ref([]);
    const clientOptions = ref([]);
    const OptionCorreo = ref([]);
    const aerolineaOptions = ref(["Satena", "Avianca", "Latam", "JetSmart"]);
    const selectedDeparture = ref("");
    const destination = ref(""); // Propiedad para el destino
    const programName = ref(""); // Propiedad para el nombre del programa
    const hotel = ref(""); // Propiedad para el hotel
    const noche = ref(""); // Propiedad para el noche
    const plan = ref(""); // Propiedad para el plan
    const adults = ref(""); // Propiedad para el número de adultos
    // Propiedad para el número de niños
    const accommodation = ref(""); // Propiedad para la acomodación
    const roomType = ref(""); // Propiedad para el tipo de habitación
    const selectedClient = ref("");
    const supplementChecked = ref(false);
    const supplementValue = ref(null);
    const numberOfPeople = ref(null);
    const supplementValues = ref([]);
    const mostrarDialogo = ref(false);
    const archivoSeleccionado = ref(null);
    onMounted(() => {
      console.log(
        "Intentando recuperar los datos del usuario del almacenamiento local..."
      );
      fetchCotizacionData();
      updateAccommodationOptions();
      const storedUserData = LocalStorage.getItem("userData");
      console.log("Datos del usuario recuperados:", storedUserData);
      if (storedUserData) {
        userData.value = storedUserData;
      } else {
        console.log(
          "No se encontraron datos de usuario en el almacenamiento local. Redirigiendo a la página de inicio de sesión..."
        );
        router.push("/login");
      }
    });
    const clearFields = () => {
      // Limpiar campos de la primera pestaña
      selectedDeparture.value = "";
      destination.value = "";
      programName.value = "";
      hotel.value = "";
      noche.value = "";
      // plan = "";
      adults.value = "";
      children.value = "";
      accommodation.value = "";
      roomType.value = "";
      selectedClient.value = "";

      // Limpiar campos de las habitaciones
      rooms.value.forEach((room) => {
        room.roomType = "";
        room.adults = "";
        room.hasChildren = false;
        room.numChildren = "";
        room.accommodation = "";
      });
      // Limpiar campos de la segunda pestaña
      aerolineaValue1.value = "";
      vueloValue1.value = "";
      horaSalidaValue1.value = "";
      horaLlegadaValue1.value = "";
      claseValue1.value = "";
      aerolineaValue2.value = "";
      vueloValue2.value = "";
      horaSalidaValue2.value = "";
      horaLlegadaValue2.value = "";
      claseValue2.value = "";
      supplementChecked.value = false;
      supplementValue.value = "";
    };
    const clearFieldsc = () => {
      destination.value = "";
      programName.value = "";
      hotel.value = "";
      noche.value = "";
      // plan.value = "";
      adults.value = "";
      children.value = "";
      accommodation.value = "";
      roomType.value = "";
      selectedClient.value = "";
      correo.value = "";
    };
    let totalAdultos = 0;
    let totalNiños = 0;
    return {
      adultAgesComputed,
      mostrarCamposEdad,
      showAgeInputs,
      nochesOptionsRaw,
      peopleArray,
      numberOfPeople,
      supplementValues,
      idCotizacion,
      archivoSeleccionado,
      mostrarDialogo,
      ultimaCotizacionDescargada,
      correo,
      OptionCorreo,
      cotizacionCounter,
      sumaTotalDescuento,
      sumaTotalAcomodacion,
      sumaValorBrutohab,
      habitacionesDatos,
      additionalNightSelected,
      additionalNightCount,
      // Definir un rango de opciones para el número de habitaciones
      handleNumRoomsChange,
      roomOptions,
      addRoom,
      hasChildren,
      numRooms,
      rooms,
      updateAccommodationOptions,
      //TABLA
      cotizacionData,
      usersMap,
      formatDate: (date) => format(new Date(date), "yyyy-MM-dd"),
      columns: [
        {
          name: "idCotizacion",
          label: "Id-cotización",
          align: "left",
          field: "idCotizacion",
        },
        {
          name: "fechaCreacion",
          label: "Fecha de Creación",
          align: "left",
          field: "fechaCreacion",
        },
        {
          name: "CreadorCotizacion",
          label: "Usuario que la Creó",
          align: "left",
          field: "CreadorCotizacion",
        },
        { name: "cliente", label: "Cliente", align: "left", field: "cliente" },
        {
          name: "precioBrutoTotal",
          label: "precio Bruto",
          align: "left",
          field: "precioBrutoTotal",
        },
        {
          name: "totalPrecioCliente",
          label: "Valor Total con Descuento",
          align: "left",
          field: "totalPrecioCliente",
        },
        {
          name: "totalAdultos",
          label: "Adultos",
          align: "left",
          field: "totalAdultos",
        },
        {
          name: "totalNinos",
          label: "Niños",
          align: "left",
          field: "totalNinos",
        },
        {
          name: "fechaInicio",
          label: "Fecha de Inicio",
          align: "left",
          field: "fechaInicio",
        },
        {
          name: "fechaFin",
          label: "Fecha de Fin",
          align: "left",
          field: "fechaFin",
        },
        { name: "salida", label: "Salida", align: "left", field: "salida" },
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "cotizacion",
          label: "Cotizacion",
          align: "left",
          field: "cotizacion",
          format: (value) => "",
        },
        // ...
      ],
      //vuelo info
      aerolineaValue1,
      vueloValue1,
      horaLlegadaValue1,
      horaSalidaValue1,
      claseValue1,
      aerolineaValue2,
      vueloValue2,
      horaLlegadaValue2,
      horaSalidaValue2,
      claseValue2,
      //otro
      startDateRules,
      activeTab,
      goNext,
      goBack,
      params: {
        hotel: "",
        nombrePrograma: "",
        destino: "",
      },
      userData,
      modalVisible,
      departureOptions,
      destinationOptions,
      programNameOptions,
      hotelOptions,
      nochesOptions,
      planOptions,
      adultsOptions,
      childrenOptions,
      aerolineaOptions,

      accommodationOptions,
      roomTypeOptions,
      selectedDeparture,
      destination,
      programName,
      hotel,
      noche,
      plan,
      adults,
      children,
      accommodation,
      roomType,
      clientOptions,
      selectedClient,
      clearFields,
      clearFieldsc,
      supplementChecked,
      supplementValue,
      dateRange,
      adjustEndDate,
      endDateRules,
      totalAdultos,
      totalNiños,
    };
  },

  watch: {
    hotel() {
      this.fetchOptions();
    },
  },
  methods: {
    descargarCotizacionN(row) {
      if (row.idCotizacion.includes("-C")) {
        this.descargarCotizacionCano(row.idCotizacion);
      } else {
        this.descargarCotizacion(row.idCotizacion);
      }
    },
    shouldHideAdditionalNightSection() {
      return (
        this.destination === "Bahía Solano" &&
        this.programName === "Temporada Baja" &&
        this.hotel === "El Almejal Ecolodge"
      );
    },
    mostrarDialogoSeleccionArchivo() {
      this.mostrarDialogo = true;
    },
    seleccionarArchivo(event) {
      this.archivoSeleccionado = event.target.files[0];
    },
    async enviarCotizacion(cotizacion) {
      try {
        // 1. Generar el PDF
        const pdfBlob = await (cotizacion.idCotizacion.includes("-C")
          ? this.descargarCotizacionCano(cotizacion.idCotizacion)
          : this.descargarCotizacion(cotizacion.idCotizacion));

        // 2. Crear un enlace temporal para descargar el PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `cotizacion_${cotizacion.cliente}.pdf`;
        link.style.display = "none"; // Ocultar el enlace

        // 3. Agregar el enlace al DOM y simular un clic
        document.body.appendChild(link);
        link.click();

        // 4. Esperar un breve tiempo para que el archivo se descargue (opcional)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 5. Crear el enlace mailto: (sin archivo adjunto)
        const mailtoLink = `mailto:${cotizacion.correo}?subject=Cotización para ${cotizacion.cliente}&body=Estimado(a) ${cotizacion.cliente},%0D%0A%0D%0AAdjuntamos su cotización (recién descargada).%0D%0A%0D%0ASaludos cordiales,`;

        // 6. Abrir el cliente de correo predeterminado del usuario
        window.location.href = mailtoLink;

        // 7. Eliminar el enlace temporal después de un breve retraso
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href); // Limpiar la Blob URL
        }, 1000);

        // 8. Notificar al usuario
        this.$q.notify({
          message: "Abriendo cliente de correo...",
          color: "info",
        });
      } catch (error) {
        console.error(error);
        this.$q.notify({
          message: "Error al enviar la cotización",
          color: "negative",
        });
      }
    },
    async descargarCotizacionCano(idCotizacion) {
      try {
        // Realizar las solicitudes HTTP para obtener los datos

        const [habitacionResponse, cotizacionResponse] = await Promise.all([
          axios.get(
            `https://backendmultidestinosexpress.onrender.com/habitacionCotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backendmultidestinosexpress.onrender.com/cotizacion/${idCotizacion}`
          ),
        ]);

        // Verificar si las solicitudes fueron exitosas
        if (
          habitacionResponse.status !== 200 ||
          cotizacionResponse.status !== 200
        ) {
          console.error(
            "Error al obtener datos de habitacionCotizacion o cotizacion"
          );
          return;
        }

        // Obtener los datos de las respuestas
        const cotizacion = cotizacionResponse.data[0];
        console.log("cotizacion", cotizacion);
        const habitacion = habitacionResponse.data;
        console.log("habitacion", habitacion);

        //clientes porcentaje
        const clienteResponse = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/cliente/buscar/${cotizacion.cliente}`
        );
        console.log("clienteResponse", clienteResponse);
        const clienteData = clienteResponse.data[0];
        console.log("clienteData", clienteData);
        const tipoBase = clienteData.tipoBase;
        const vendedorResponse = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/user/${cotizacion.CreadorCotizacion}`
        );
        const vendedorData = vendedorResponse.Data;
        console.log("vendedor", vendedorResponse.data.nombreCompleto);
        // Agregar parámetros a la URL
        // Crear el objeto de parámetros
        const params = {
          hotel: cotizacion.hotel,
          nombrePrograma: cotizacion.nombrePrograma,
          destino: cotizacion.destino,
        };

        // Realizar la solicitud POST con los parámetros
        const hotelesResponse = await axios.post(
          "https://backendmultidestinosexpress.onrender.com/hoteles/buscar",
          params
        );
        const hotelincluye = hotelesResponse.data[0].incluye;
        const hotelnoincluye = hotelesResponse.data[0].noIncluye;

        // Crear el documento PDF
        const doc = new jsPDF();
        const margins = { top: 10, bottom: 10, left: 10, right: 10 };
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        // Configuración del encabezado
        const headerHeight = 40;
        const headerPadding = { left: 10, right: 10, top: 5, bottom: 5 };

        // Cargar imagen (reemplaza con la ruta correcta)
        const imgData = await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = "https://i.ibb.co/1sFJ7dT/imgAzul.png";
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

        // Calcular dimensiones de la imagen
        const aspectRatio = imgData.width / imgData.height;
        const maxImgWidth =
          pageWidth / 4 - headerPadding.left - headerPadding.right;
        const imgWidth = Math.min(100, maxImgWidth);
        const imgHeight = imgWidth / aspectRatio;
        const imgY = margins.top + (headerHeight - imgHeight) / 2;

        // Dividir el texto del encabezado en dos partes: texto general y número de cotización
        const headerTextGeneral = `PBX(601)7621133\nCALLE 64 No. 11-37 LOC 211\nEMAIL: MULTIDESTINOS_EXPRESS@YAHOO.COM`;
        const headerTextCotizacion = `Numero de cotización: ${idCotizacion}`;

        // Agregar imagen al encabezado
        doc.addImage(
          imgData,
          "PNG",
          margins.left + headerPadding.left,
          imgY,
          imgWidth,
          imgHeight
        );

        // Calcular ancho disponible para el texto general
        const availableWidth =
          pageWidth -
          margins.left -
          margins.right -
          imgWidth -
          headerPadding.left -
          headerPadding.right -
          10;

        // Agregar texto general al encabezado
        doc.setFontSize(10);
        doc.text(
          doc.splitTextToSize(headerTextGeneral, availableWidth),
          margins.left + imgWidth + headerPadding.left + headerPadding.right,
          margins.top + 10
        );

        // Calcular posición horizontal para el número de cotización (alinear a la derecha)
        const cotizacionX =
          pageWidth -
          margins.right -
          doc.getTextWidth(headerTextCotizacion) -
          headerPadding.right;

        // Aumentar el tamaño de fuente para el número de cotización y mantenerlo en negrita
        doc.setFontSize(12);
        doc.setFont("Helvetica-Bold", 12);
        doc.text(headerTextCotizacion, cotizacionX, margins.top + 10);

        // Dibujar borde del encabezado
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          margins.top,
          pageWidth - margins.left - margins.right,
          headerHeight,
          "S"
        );

        // Sección: SOLICITUD DE RESERVA
        doc.setFontSize(10); // Tamaño de fuente para el título
        const bodyY = margins.top + headerHeight + 10;
        // Sección: SOLICITUD DE RESERVA (Título principal)
        doc.setFontSize(10); // Tamaño de fuente para el título
        doc.text("SOLICITUD DE RESERVA:", margins.left, bodyY - 4);

        doc.setFontSize(8); // Cambiando el tamaño de fuente a 8

        const enunciados = [
          "FECHA SOLICITUD:",
          "AGENCIA:",
          "TELÉFONO:",
          "CONTACTO:",
          "NIT:",
          "VENDEDOR:",
        ];
        const campos = [
          new Date(cotizacion.fechaCreacion).toLocaleDateString(),
          cotizacion.cliente.toString(),
          clienteData.telefono ? clienteData.telefono.toString() : "N/A",
          clienteData.nit ? clienteData.nit.toString() : "N/A",
          clienteData.nit ? clienteData.nit.toString() : "N/A",
          vendedorResponse.data.nombreCompleto
            ? vendedorResponse.data.nombreCompleto.toString()
            : "N/A",
        ];

        // Calcular el ancho máximo disponible para los campos en una fila
        const maxCamposPorFila = 6; // Ahora hay 6 campos por fila
        const anchoDisponiblePorCampo =
          (pageWidth - margins.left - margins.right) / maxCamposPorFila;

        let currentX = margins.left;
        let currentY = bodyY;

        // Iterar a través de los enunciados y los campos
        for (let i = 0; i < enunciados.length; i++) {
          // Mostrar enunciado en la primera fila
          doc.text(enunciados[i], currentX, currentY);

          // Mostrar campo debajo del enunciado en la segunda fila
          const valorCampo = campos[i] !== undefined ? campos[i] : "N/A";
          const lines = doc.splitTextToSize(
            valorCampo,
            anchoDisponiblePorCampo - 2
          ); // Reducir el ancho del texto por 2 para evitar superposiciones
          doc.text(lines, currentX, currentY + 5);

          // Avanzar a la siguiente posición horizontal
          currentX += anchoDisponiblePorCampo;

          // Salto de línea si se llenó la fila o es el último campo
          if ((i + 1) % maxCamposPorFila === 0 || i === enunciados.length - 1) {
            currentY += 15; // Avanzar a la siguiente fila
            currentX = margins.left; // Restaurar la posición horizontal
          }
        }
        function obtenerAcomodacion(habitaciones) {
          return habitaciones
            .map((habitacion) => {
              const adultos = habitacion.adultos;
              const niños = habitacion.niños;
              const tipoAcomodacion = `1x${adultos}`;
              return niños > 0 ? `${tipoAcomodacion} CHD` : tipoAcomodacion;
            })
            .join(", ");
        }

        const acomodacion = obtenerAcomodacion(habitacion);

        // SEGUNDA FILA: Enunciados y campos modificados
        const enunciados2 = [
          "NOCHES:",
          "HOTEL:",
          "PLAN:",
          "DESTINO:",
          "DIRECCION:",
          "ACOMODACIÓN:",
        ];
        const campos2 = [
          cotizacion.noches ? cotizacion.noches.toString() : "N/A",
          cotizacion.hotel ? cotizacion.hotel.toString() : "N/A",

          cotizacion.plan ? cotizacion.plan.toString() : "N/A",

          cotizacion.destino ? cotizacion.destino.toString() : "N/A",
          cotizacion.direccion ? cotizacion.direccion.toString() : "N/A",

          acomodacion.toString(),
        ];
        console.log("campso2", campos2);
        // Calcular el ancho disponible para los campos de la segunda fila
        const maxCamposPorFila2 = 6; // Ahora son 5 campos en la segunda fila
        const anchoDisponiblePorCampo2 =
          (pageWidth - margins.left - margins.right) / maxCamposPorFila2;

        // Ajustar la posición vertical para la nueva fila (mantener el mismo incremento que antes)
        currentY += 1;

        // Iterar a través de los nuevos enunciados y campos de la SEGUNDA FILA
        for (let i = 0; i < enunciados2.length; i++) {
          // Mostrar enunciado
          doc.text(enunciados2[i], currentX, currentY);

          // Mostrar campo debajo del enunciado
          const valorCampo2 = campos2[i] !== undefined ? campos2[i] : "N/A";
          const lines2 = doc.splitTextToSize(
            valorCampo2,
            anchoDisponiblePorCampo2 - 2
          );
          doc.text(lines2, currentX, currentY + 5);

          // Avanzar a la siguiente posición horizontal
          currentX += anchoDisponiblePorCampo2;
        }
        // SECCIÓN: ITINERARIO (Nuevo título)
        currentY += 1;
        doc.setFontSize(10);
        doc.text("ITINERARIO: ", margins.left, currentY + 12);

        // Mover a la posición donde se empezará a dibujar la tabla
        currentY += 20;

        // Calcular las dimensiones del recuadro del itinerario
        const tableItinerarioWidth = pageWidth - margins.left - margins.right;
        const tableItinerarioHeight = 10 + 18; // 15 para el espacio superior e inferior

        // Dibujar el recuadro alrededor de la tabla
        doc.rect(
          margins.left,
          currentY - 5,
          tableItinerarioWidth,
          tableItinerarioHeight,
          "S"
        );

        // Configuración de la tabla
        const columns = [
          "AEROLINEA",
          "VUELO",
          "FECHA",
          "RUTA",
          "CLASE",
          "HR SALIDA",
          "HR LLEGADA",
          "RECORD",
        ];
        const data = [
          [
            cotizacion.aerolineaIda
              ? cotizacion.aerolineaIda.toString()
              : "N/A",
            cotizacion.vueloIda ? cotizacion.vueloIda.toString() : "N/A",
            cotizacion.fechaInicio
              ? new Date(cotizacion.fechaInicio).toLocaleDateString()
              : "N/A",
            cotizacion.ruta1 ? cotizacion.ruta1.toString() : "N/A",
            cotizacion.claseIda ? cotizacion.claseIda.toString() : "N/A",
            cotizacion.horaSalidaIda
              ? cotizacion.horaSalidaIda.toString()
              : "N/A",
            cotizacion.horaLlegadaIda
              ? cotizacion.horaLlegadaIda.toString()
              : "N/A",
            cotizacion.recordIda ? cotizacion.recordIda.toString() : "N/A", // Agregado para mostrar el record
          ],
          [
            cotizacion.aerolineaVuelta
              ? cotizacion.aerolineaVuelta.toString()
              : "N/A",
            cotizacion.vueloVuelta ? cotizacion.vueloVuelta.toString() : "N/A",
            cotizacion.fechaFin
              ? new Date(cotizacion.fechaFin).toLocaleDateString()
              : "N/A",
            cotizacion.ruta2 ? cotizacion.ruta2.toString() : "N/A",
            cotizacion.claseVuelta ? cotizacion.claseVuelta.toString() : "N/A",
            cotizacion.horaSalidaVuelta
              ? cotizacion.horaSalidaVuelta.toString()
              : "N/A",
            cotizacion.horaLlegadaVuelta
              ? cotizacion.horaLlegadaVuelta.toString()
              : "N/A",
            cotizacion.recordVuelta
              ? cotizacion.recordVuelta.toString()
              : "N/A", // Agregado para mostrar el record
          ],
        ];

        // Calcular el ancho de cada columna
        const columnWidth =
          (pageWidth - margins.left - margins.right) / columns.length;

        // Dibujar encabezados de la tabla
        doc.setFontSize(8);
        columns.forEach((column, index) => {
          doc.text(column, margins.left + index * columnWidth, currentY);
        });

        // Dibujar contenido de la tabla
        data.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell,
              margins.left + cellIndex * columnWidth,
              currentY + (rowIndex + 1) * 10
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección
        currentY += tableItinerarioHeight - 10;

        //-----------------------------------------------------------------------------------------------------------
        // SECCIÓN: OBSERVACIONES
        const observationsText =
          "Esta cotización está sujeta a cambio y disponibilidad al momento de reservar (Sin servicio confirmado)";
        const observationsTop = currentY + 10;
        const observationsHeight = 30; // Altura del recuadro de observaciones

        // Dibujar el recuadro de observaciones con el título dentro
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          observationsTop,
          pageWidth - margins.left - margins.right,
          observationsHeight
        );
        doc.setFontSize(12);
        doc.text("OBSERVACIONES:", margins.left + 2, observationsTop + 6);
        doc.setFontSize(10);
        doc.text(observationsText, margins.left + 2, observationsTop + 15, {
          maxWidth: pageWidth - margins.left - margins.right - 4,
        });
        //------------------------------------------------------------------
        //INCLUYE
        currentY += observationsHeight + 2;
        // Ajustes de posición y tamaño
        const incluyeTop = currentY + 10;
        const incluyeLines = hotelincluye.split("¿");
        const incluyeHeight = 32 + incluyeLines.length * 5; // Altura del recuadro de INCLUYE
        const lineHeight = 6;

        // Dibujar el recuadro de INCLUYE con el título dentro y el texto
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          incluyeTop,
          pageWidth - margins.left - margins.right,
          incluyeHeight
        );
        doc.setFontSize(12);
        doc.text("INCLUYE:", margins.left + 2, incluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de INCLUYE
        incluyeLines.forEach((line, index) => {
          const lineY = incluyeTop + 15 + index * lineHeight; // Ajusta el espacio entre líneas
          doc.text(line, margins.left + 2, lineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
        });

        // Añadir una nueva página
        doc.addPage();
        currentY = margins.top; // Reiniciar la posición Y en la nueva página

        // Sección: NO INCLUYE
        const noIncluyeTop = currentY + 10;

        // Dividir el texto de hotelnoinclye por el carácter "¿" para obtener líneas individuales
        const noIncluyeLines = hotelnoincluye.split("¿");

        // Calcular la altura requerida para el recuadro
        const titleHeight = 5; // Espacio para el título
        const noIncluyeHeight =
          noIncluyeLines.length * lineHeight + titleHeight + 5; // Altura total requerida

        // Dibujar el recuadro de NO INCLUYE con el título dentro y el texto
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          noIncluyeTop,
          pageWidth - margins.left - margins.right,
          noIncluyeHeight
        );
        doc.setFont("helvetica"); // Cambiar la fuente a helvetica
        doc.setFontSize(10);
        doc.setTextColor(0); // Color de texto negro
        doc.text("NO INCLUYE:", margins.left + 2, noIncluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de NO INCLUYE
        noIncluyeLines.forEach((line, index) => {
          const lineY = noIncluyeTop + titleHeight + 8 + index * lineHeight; // Ajustar el espacio entre líneas
          doc.text(line.trim(), margins.left + 10, lineY, {
            maxWidth: pageWidth - margins.left - margins.right - 10,
          });
        });

        // Actualizar la posición Y para la próxima sección
        currentY += noIncluyeHeight + 15; // Agregar un espacio adicional entre secciones
        //------------------------------------
        // Sección: LIQUIDACIÓN
        // Título de la sección LIQUIDACIÓN
        doc.setFontSize(10);
        doc.text("LIQUIDACIÓN:", margins.left, currentY);
        currentY += 5; // Espacio después del título

        // Variables de configuración de la tabla
        const liquidacionTop = currentY + 5;
        const cellPadding = 2;
        const cellHeight = 6; // Altura de cada celda
        const tableWidth = pageWidth - margins.left - margins.right;
        const cellWidth = tableWidth / 6; // Ajustar para 6 columnas

        // Dibujar el borde de la tabla
        doc.setDrawColor(0); // Color del borde

        // Función para dibujar una fila
        function drawRow(y) {
          for (let j = 0; j <= 6; j++) {
            const x = margins.left + j * cellWidth;
            doc.line(x, y, x, y + cellHeight); // Dibujar columna
          }
          doc.line(margins.left, y, pageWidth - margins.right, y); // Dibujar fila superior
          doc.line(
            margins.left,
            y + cellHeight,
            pageWidth - margins.right,
            y + cellHeight
          ); // Dibujar fila inferior
        }

        // Variables para las sumas
        let sumaTotalHabitaciones = 0;

        // Ajustar tamaño de fuente para el contenido de las celdas
        doc.setFontSize(7);

        // Iterar a través de las habitaciones y añadir datos a la tabla
        let currentRow = 0;

        habitacion.forEach((habitacionData) => {
          const y = liquidacionTop + currentRow * cellHeight;

          // Dibujar la fila de la tabla
          drawRow(y);

          // Primera columna: Valor adul {Acomodacion}
          const valorAdul = `Valor adul ${habitacionData.acomodacion}`;
          doc.text(valorAdul, margins.left + cellPadding, y + cellHeight / 2, {
            baseline: "middle",
          });

          // Segunda columna: precioComisionableAdulto
          const precioComisionablePorAdulto = Math.round(
            habitacionData.precioComisionableAdulto
          );
          doc.text(
            precioComisionablePorAdulto.toString(),
            margins.left + cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Tercera columna: Número de adultos
          const numAdultos = habitacionData.adultos;
          doc.text(
            numAdultos.toString(),
            margins.left + 2 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Cuarta columna: Valor original x número adultos
          const precioComisionableAdulto = Math.round(
            habitacionData.precioComisionableAdulto * habitacionData.adultos
          );
          doc.text(
            precioComisionableAdulto.toString(),
            margins.left + 3 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Añadir BASE DE DESCUENTO o BASE COMISIÓN en la quinta columna de la primera fila
          if (currentRow === 0) {
            doc.setFontSize(6);
            const baseText =
              tipoBase === "Comisión" ? "BASE COMISIÓN" : "BASE DE DESCUENTO";
            doc.text(
              baseText,
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );
            doc.setFontSize(7);
          }

          // Calcular la suma de los valores de la habitación (adultos y niños)
          let sumaHabitacion = precioComisionableAdulto;
          if (habitacionData.niños > 0) {
            sumaHabitacion += Math.round(
              habitacionData.precioComisionableNino * habitacionData.niños
            );
          }
          sumaTotalHabitaciones += sumaHabitacion;

          currentRow++; // Incrementar la fila para la siguiente iteración

          // Verificar si hay niños
          if (habitacionData.niños > 0) {
            const yChild = liquidacionTop + currentRow * cellHeight;

            // Dibujar la fila de la tabla
            drawRow(yChild);

            // Primera columna: Valor child {Acomodacion}
            const valorChild = `Valor child ${habitacionData.acomodacion}`;
            doc.text(
              valorChild,
              margins.left + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Segunda columna: precioComisionableNiño
            const precioComisionablePorNiño = Math.round(
              habitacionData.precioComisionableNino
            );
            doc.text(
              precioComisionablePorNiño.toString(),
              margins.left + cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Tercera columna: Número de niños
            const numNiños = habitacionData.niños;
            doc.text(
              numNiños.toString(),
              margins.left + 2 * cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Cuarta columna: Valor original x niños
            const precioComisionableNino = Math.round(
              habitacionData.precioComisionableNino * habitacionData.niños
            );
            doc.text(
              precioComisionableNino.toString(),
              margins.left + 3 * cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            currentRow++; // Incrementar la fila para la siguiente iteración
          }
        });

        // Añadir la suma total en la sexta columna de la primera fila
        doc.text(
          sumaTotalHabitaciones.toString(),
          margins.left + 5 * cellWidth + cellPadding,
          liquidacionTop + cellHeight / 2,
          { baseline: "middle" }
        );

        currentY = liquidacionTop + currentRow * cellHeight + 10; // Actualizar currentY después de las filas de habitaciones

        // Nombres reflejando los valores
        const nombres = [
          // Impuestos adicionales aquí

          "TRANSPORTE NO COMI",
          "Q",
          "YS",
          "CO",
          "TA",
          "YS TA",

          "defensaCivil",
          "alcaldiaNacional",
          "alcaldiaExtranjero",
          "pqsNaturalesExtranjero",
          "pqsNaturales25a65",
          "pqsNaturales5a24",
          "cormacarenaExtranjero",
          "cormacarena5a11",
          "cormacarena12a65",
          "TOTAL IMPUESTOS",
        ];

        // Valores correspondientes
        const valores = [
          cotizacion.otros,
          cotizacion.combus,
          cotizacion.iva,
          cotizacion.tasa,
          cotizacion.ta,
          cotizacion.ivaTa,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          cotizacion.precioTrans,
        ];
        // Definir impuestosAdicionales FUERA del else if
        const impuestosAdicionales = [
          "defensaCivil",
          "alcaldiaNacional",
          "alcaldiaExtranjero",
          "pqsNaturalesExtranjero",
          "pqsNaturales25a65",
          "pqsNaturales5a24",
          "cormacarenaExtranjero",
          "cormacarena5a11",
          "cormacarena12a65",
        ];

        // Calcular valores de impuestos adicionales y actualizar totalImpuestos
        habitacion.forEach((habitacionData) => {
          impuestosAdicionales.forEach((impuesto, index) => {
            const valorImpuesto = parseInt(habitacionData[impuesto] || 0, 10); // Convertir a entero
            valores[6 + index] = valorImpuesto; // Reemplazar el valor inicial con el valor calculado
            valores[valores.length - 1] =
              parseInt(valores[valores.length - 1], 10) + valorImpuesto; // Sumar al totalImpuestos (convertido a entero)
          });
        });

        if (cotizacion.suplemento > 0) {
          nombres.push("SUPLEMENTO");
          valores.push(cotizacion.suplemento);
        }

        // Añadir los nombres y valores a la tabla
        nombres.forEach((nombre, index) => {
          const y = currentY + index * cellHeight;

          // Dibujar la fila de la tabla
          drawRow(y);

          // Primera columna: Nombre
          doc.text(nombre, margins.left + cellPadding, y + cellHeight / 2, {
            baseline: "middle",
          });

          // Segunda columna: Valor dividido por el total de pasajeros
          const totalPasajeros = cotizacion.totalPasajeros;
          const valor = valores[index] || 0;
          const valorDividido =
            totalPasajeros !== 0 ? Math.trunc(valor / totalPasajeros) : "";
          doc.text(
            valorDividido.toString(),
            margins.left + cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Tercera columna: Número total de pasajeros
          const totalPasajerosTexto =
            totalPasajeros !== 0 ? Math.trunc(totalPasajeros).toString() : "";
          doc.text(
            totalPasajerosTexto,
            margins.left + 2 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Cuarta columna: Valor original
          const valorOriginalTexto =
            valor !== 0 ? Math.trunc(valor).toString() : "";
          doc.text(
            valorOriginalTexto,
            margins.left + 3 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Columna 5 y 6 para "Q" y "YS"
          if (nombre === "Q") {
            doc.text(
              "Porcentaje",
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            const descuento = cotizacion.clientePorcentaje || 0;
            const descuentoTexto = Math.trunc(descuento).toString() + "%";
            doc.text(
              descuentoTexto,
              margins.left + 5 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );
          } else if (nombre === "YS") {
            doc.text(
              "Valor Descuento",
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            const valorDescuento = cotizacion.valorDescuento || 0;
            const valorDescuentoTexto = Math.trunc(valorDescuento).toString();
            doc.text(
              valorDescuentoTexto,
              margins.left + 5 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Agregar filas adicionales si tipoBase es "Comisión"
            if (tipoBase === "Comisión") {
              const additionalRows = [
                {
                  label: `IVA(${clienteData.porcentajeIva}%) (-)`,
                  value: cotizacion.ivaValor,
                },
                {
                  label: `RTE FUENTE(${clienteData.rteFuente}%) (+)`,
                  value: cotizacion.rteFuente,
                },
                {
                  label: `RTE ICA(${clienteData.rteIca}%) (+)`,
                  value: cotizacion.rteIca,
                },
                {
                  label: "Total Comisión",
                  value: cotizacion.totalComision,
                },
              ];

              additionalRows.forEach((row, idx) => {
                const yAdditional = y + (idx + 1) * cellHeight;

                drawRow(yAdditional);

                doc.text(
                  row.label,
                  margins.left + 4 * cellWidth + cellPadding,
                  yAdditional + cellHeight / 2,
                  { baseline: "middle" }
                );

                doc.text(
                  row.value.toString(),
                  margins.left + 5 * cellWidth + cellPadding,
                  yAdditional + cellHeight / 2,
                  { baseline: "middle" }
                );
              });
            }
          }
        });
        currentY += nombres.length * cellHeight;

        // Añadir los valores por habitación
        habitacion.forEach((habitacionData) => {
          if (habitacionData.adultos > 0) {
            const y = currentY;
            drawRow(y);

            // Descripción en la primera columna (sin cambios)
            doc.text(
              `Valor total Adt ${habitacionData.acomodacion}`,
              margins.left + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Formatear el precio con Numeral.js
            const precioHabitacionAdulto =
              habitacionData.precioHabitacionAdulto || 0;
            const precioAdultoTexto = numeral(precioHabitacionAdulto).format(
              "$0,0"
            );

            doc.text(
              precioAdultoTexto,
              margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            currentY += cellHeight;
          }

          if (habitacionData.niños > 0) {
            const y = currentY;
            drawRow(y);

            // Descripción en la primera columna (sin cambios)
            doc.text(
              `Valor total Chd ${habitacionData.acomodacion}`,
              margins.left + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Formatear el precio con Numeral.js
            const precioHabitacionNino =
              habitacionData.precioHabitacionNino || 0;
            const precioNinoTexto =
              numeral(precioHabitacionNino).format("$0,0");

            doc.text(
              precioNinoTexto,
              margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            currentY += cellHeight;
          }
        });
        // Añadir valor total y otros valores en la misma fila
        doc.setFontSize(8);
        currentY += cellHeight; // Espacio antes de la fila final
        drawRow(currentY); // Dibujar la fila para los valores finales
        doc.text(
          "Valor total",
          margins.left + cellPadding,
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        // Formatear el precio bruto total con Numeral.js
        const precioBrutoTotal = cotizacion.precioBrutoTotal || 0;
        const precioBrutoTotalTexto = numeral(precioBrutoTotal).format("$0,0"); // Formato con separador de miles y símbolo de peso

        doc.text(
          precioBrutoTotalTexto, // Mostrar el precio formateado
          margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        doc.text(
          "Precio a pagar",
          margins.left + 4 * cellWidth + cellPadding,
          currentY + cellHeight / 2 - 2,
          { baseline: "middle" }
        ); // Primera línea
        doc.text(
          "a Multidestinos",
          margins.left + 4 * cellWidth + cellPadding,
          currentY + cellHeight / 2 + 2,
          { baseline: "middle" }
        ); // Segunda línea
        // Convertir a números antes de sumar
        const suplemento = parseFloat(cotizacion.suplemento) || 0;
        const totalPrecioCliente =
          parseFloat(cotizacion.totalPrecioCliente) || 0;

        // Sumar el suplemento si existe
        const totalConSuplemento =
          suplemento > 0 ? totalPrecioCliente + suplemento : totalPrecioCliente;
        const totalConSuplementoTexto =
          numeral(totalConSuplemento).format("$0,0");
        doc.text(
          totalConSuplementoTexto,
          margins.left + 5 * cellWidth + cellPadding,
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        currentY += cellHeight + 10; // Espacio después de la fila final

        // Mover a la siguiente sección del documento si es necesario

        // Mover a la siguiente sección del documento si es necesario
        // Agregar recuadro con el título "Depósito y Condiciones de Pago"
        const recuadroX = margins.left;
        let recuadroY = currentY + 5;
        const recuadroWidth = 190;
        let recuadroHeight = 30; // Inicializamos con un valor base

        doc.setFontSize(7);
        doc.setLineWidth(0.5);

        // Condiciones de pago (como un solo párrafo)
        const condiciones =
          "PARA CONFIRMACIONES SE DEBE ENVIAR DEPOSITO DEL 50% DEL VALOR DEL PLAN Y EL SALDO 30 DIAS ANTES DE LA SALIDA, SI LA FECHA DE VIAJES CERCANA SE DEBE CANCELAR EL 100%. LOS SERVICIOS DEJADOS DE TOMAR NO SON REMBOLSABLES. LA CANCELACIÓN CON 18 DIAS ANTES DE VIAJE LA PENALIDAD SERA DEL 100% DEL VALOR DEL PLAN, LOS TIQUETES NO SON REEMBOLSABLE, NI ENDOSABLES, PENALIDAD POR CAMBIO (FECHA, NOMBRE, HORA, RUTAS) 200.000. ESTAS POLITICAS ESTAN PUBLICADAS DE MANERA CLARA Y ESPECIFICA EN NUESTRA PAGINA WWW.MULTIDESTINOSEXPRESS.COM. *TARIFAS SUJETA A CAMBIO Y DISPONIBILIDAD SIN PREVIO AVISO*";

        // Dividir el párrafo en líneas que quepan en el recuadro
        const splitLines = doc.splitTextToSize(condiciones, recuadroWidth - 10);

        // Verificar si el recuadro cabe en la página actual
        if (recuadroY + recuadroHeight > pageHeight - margins.bottom) {
          doc.addPage();
          currentY = margins.top; // Reiniciar currentY en la nueva página
          recuadroY = currentY + 5;
        }
        // Título del recuadro (sin cambios)
        doc.text(
          "Deposito y Condiciones de Pago",
          recuadroX + 5,
          recuadroY + 3
        );

        // Reducir tamaño de fuente y ajustar espaciado entre líneas
        doc.setFontSize(6);
        const lineHeightPago = 5; // Espacio entre líneas (nombre cambiado)
        // Calcular la altura necesaria para el recuadro
        recuadroHeight = 20 + splitLines.length * lineHeightPago; // 20 para el título y margen superior
        // Dibujar el recuadro
        doc.rect(recuadroX, recuadroY, recuadroWidth, recuadroHeight);

        // Escribir el texto dentro del recuadro
        splitLines.forEach((splitLine, splitIndex) => {
          doc.text(
            splitLine,
            recuadroX + 5,
            recuadroY + 10 + splitIndex * lineHeightPago
          );
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección
        currentY += recuadroHeight + 5; // Agregar un espacio adicional después del recuadro

        // Obtener el Blob del PDF
        const pdfBlob = doc.output("blob");
        // Guardar el documento como archivo PDF
        doc.save(`cotizacion_${idCotizacion}.pdf`);
        // Almacenar la ruta del archivo descargado
        // Devolver el Blob
        return pdfBlob;
      } catch (error) {
        console.error("Error al descargar cotización:", error);
      }
    },
    async descargarCotizacion(idCotizacion) {
      try {
        // Realizar las solicitudes HTTP para obtener los datos

        const [habitacionResponse, cotizacionResponse] = await Promise.all([
          axios.get(
            `https://backendmultidestinosexpress.onrender.com/habitacionCotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backendmultidestinosexpress.onrender.com/cotizacion/${idCotizacion}`
          ),
        ]);

        // Verificar si las solicitudes fueron exitosas
        if (
          habitacionResponse.status !== 200 ||
          cotizacionResponse.status !== 200
        ) {
          console.error(
            "Error al obtener datos de habitacionCotizacion o cotizacion"
          );
          return;
        }

        // Obtener los datos de las respuestas
        const cotizacion = cotizacionResponse.data[0];
        console.log("cotizacion", cotizacion);
        const habitacion = habitacionResponse.data;
        console.log("habitacion", habitacion);

        //clientes porcentaje
        const clienteResponse = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/cliente/buscar/${cotizacion.cliente}`
        );
        console.log("clienteResponse", clienteResponse);
        const clienteData = clienteResponse.data[0];
        console.log("clienteData", clienteData);
        const tipoBase = clienteData.tipoBase;
        const vendedorResponse = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/user/${cotizacion.CreadorCotizacion}`
        );
        const vendedorData = vendedorResponse.Data;
        console.log("vendedor", vendedorResponse.data.nombreCompleto);
        // Agregar parámetros a la URL
        // Crear el objeto de parámetros
        const params = {
          hotel: cotizacion.hotel,
          nombrePrograma: cotizacion.nombrePrograma,
          destino: cotizacion.destino,
        };

        // Realizar la solicitud POST con los parámetros
        const hotelesResponse = await axios.post(
          "https://backendmultidestinosexpress.onrender.com/hoteles/buscar",
          params
        );
        const hotelincluye = hotelesResponse.data[0].incluye;
        const hotelnoincluye = hotelesResponse.data[0].noIncluye;

        // Crear el documento PDF
        const doc = new jsPDF();
        const margins = { top: 10, bottom: 10, left: 10, right: 10 };
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        // Configuración del encabezado
        const headerHeight = 40;
        const headerPadding = { left: 10, right: 10, top: 5, bottom: 5 };

        // Cargar imagen (reemplaza con la ruta correcta)
        const imgData = await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = "https://i.ibb.co/1sFJ7dT/imgAzul.png";
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

        // Calcular dimensiones de la imagen
        const aspectRatio = imgData.width / imgData.height;
        const maxImgWidth =
          pageWidth / 4 - headerPadding.left - headerPadding.right;
        const imgWidth = Math.min(100, maxImgWidth);
        const imgHeight = imgWidth / aspectRatio;
        const imgY = margins.top + (headerHeight - imgHeight) / 2;

        // Dividir el texto del encabezado en dos partes: texto general y número de cotización
        const headerTextGeneral = `PBX(601)7621133\nCALLE 64 No. 11-37 LOC 211\nEMAIL: MULTIDESTINOS_EXPRESS@YAHOO.COM`;
        const headerTextCotizacion = `Numero de cotización: ${idCotizacion}`;

        // Agregar imagen al encabezado
        doc.addImage(
          imgData,
          "PNG",
          margins.left + headerPadding.left,
          imgY,
          imgWidth,
          imgHeight
        );

        // Calcular ancho disponible para el texto general
        const availableWidth =
          pageWidth -
          margins.left -
          margins.right -
          imgWidth -
          headerPadding.left -
          headerPadding.right -
          10;

        // Agregar texto general al encabezado
        doc.setFontSize(10);
        doc.text(
          doc.splitTextToSize(headerTextGeneral, availableWidth),
          margins.left + imgWidth + headerPadding.left + headerPadding.right,
          margins.top + 10
        );

        // Calcular posición horizontal para el número de cotización (alinear a la derecha)
        const cotizacionX =
          pageWidth -
          margins.right -
          doc.getTextWidth(headerTextCotizacion) -
          headerPadding.right;

        // Aumentar el tamaño de fuente para el número de cotización y mantenerlo en negrita
        doc.setFontSize(12);
        doc.setFont("Helvetica-Bold", 12);
        doc.text(headerTextCotizacion, cotizacionX, margins.top + 10);

        // Dibujar borde del encabezado
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          margins.top,
          pageWidth - margins.left - margins.right,
          headerHeight,
          "S"
        );

        // Sección: SOLICITUD DE RESERVA
        doc.setFontSize(10); // Tamaño de fuente para el título
        const bodyY = margins.top + headerHeight + 10;
        // Sección: SOLICITUD DE RESERVA (Título principal)
        doc.setFontSize(10); // Tamaño de fuente para el título
        doc.text("SOLICITUD DE RESERVA:", margins.left, bodyY - 4);

        doc.setFontSize(8); // Cambiando el tamaño de fuente a 8

        const enunciados = [
          "FECHA SOLICITUD:",
          "AGENCIA:",
          "TELÉFONO:",
          "CONTACTO:",
          "NIT:",
          "VENDEDOR:",
        ];
        const campos = [
          new Date(cotizacion.fechaCreacion).toLocaleDateString(),
          cotizacion.cliente.toString(),
          clienteData.telefono ? clienteData.telefono.toString() : "N/A",
          clienteData.nit ? clienteData.nit.toString() : "N/A",
          clienteData.nit ? clienteData.nit.toString() : "N/A",
          vendedorResponse.data.nombreCompleto
            ? vendedorResponse.data.nombreCompleto.toString()
            : "N/A",
        ];

        // Calcular el ancho máximo disponible para los campos en una fila
        const maxCamposPorFila = 6; // Ahora hay 6 campos por fila
        const anchoDisponiblePorCampo =
          (pageWidth - margins.left - margins.right) / maxCamposPorFila;

        let currentX = margins.left;
        let currentY = bodyY;

        // Iterar a través de los enunciados y los campos
        for (let i = 0; i < enunciados.length; i++) {
          // Mostrar enunciado en la primera fila
          doc.text(enunciados[i], currentX, currentY);

          // Mostrar campo debajo del enunciado en la segunda fila
          const valorCampo = campos[i] !== undefined ? campos[i] : "N/A";
          const lines = doc.splitTextToSize(
            valorCampo,
            anchoDisponiblePorCampo - 2
          ); // Reducir el ancho del texto por 2 para evitar superposiciones
          doc.text(lines, currentX, currentY + 5);

          // Avanzar a la siguiente posición horizontal
          currentX += anchoDisponiblePorCampo;

          // Salto de línea si se llenó la fila o es el último campo
          if ((i + 1) % maxCamposPorFila === 0 || i === enunciados.length - 1) {
            currentY += 15; // Avanzar a la siguiente fila
            currentX = margins.left; // Restaurar la posición horizontal
          }
        }
        function obtenerAcomodacion(habitaciones) {
          return habitaciones
            .map((habitacion) => {
              const adultos = habitacion.adultos;
              const niños = habitacion.niños;
              const tipoAcomodacion = `1x${adultos}`;
              return niños > 0 ? `${tipoAcomodacion} CHD` : tipoAcomodacion;
            })
            .join(", ");
        }

        const acomodacion = obtenerAcomodacion(habitacion);

        // SEGUNDA FILA: Enunciados y campos modificados
        const enunciados2 = [
          "NOCHES:",
          "HOTEL:",
          "PLAN:",
          "DESTINO:",
          "DIRECCION:",
          "ACOMODACIÓN:",
        ];
        const campos2 = [
          cotizacion.noches ? cotizacion.noches.toString() : "N/A",
          cotizacion.hotel ? cotizacion.hotel.toString() : "N/A",

          cotizacion.plan ? cotizacion.plan.toString() : "N/A",

          cotizacion.destino ? cotizacion.destino.toString() : "N/A",
          cotizacion.direccion ? cotizacion.direccion.toString() : "N/A",

          acomodacion.toString(),
        ];
        console.log("campso2", campos2);
        // Calcular el ancho disponible para los campos de la segunda fila
        const maxCamposPorFila2 = 6; // Ahora son 5 campos en la segunda fila
        const anchoDisponiblePorCampo2 =
          (pageWidth - margins.left - margins.right) / maxCamposPorFila2;

        // Ajustar la posición vertical para la nueva fila (mantener el mismo incremento que antes)
        currentY += 1;

        // Iterar a través de los nuevos enunciados y campos de la SEGUNDA FILA
        for (let i = 0; i < enunciados2.length; i++) {
          // Mostrar enunciado
          doc.text(enunciados2[i], currentX, currentY);

          // Mostrar campo debajo del enunciado
          const valorCampo2 = campos2[i] !== undefined ? campos2[i] : "N/A";
          const lines2 = doc.splitTextToSize(
            valorCampo2,
            anchoDisponiblePorCampo2 - 2
          );
          doc.text(lines2, currentX, currentY + 5);

          // Avanzar a la siguiente posición horizontal
          currentX += anchoDisponiblePorCampo2;
        }
        // SECCIÓN: ITINERARIO (Nuevo título)
        currentY += 1;
        doc.setFontSize(10);
        doc.text("ITINERARIO: ", margins.left, currentY + 12);

        // Mover a la posición donde se empezará a dibujar la tabla
        currentY += 20;

        // Calcular las dimensiones del recuadro del itinerario
        const tableItinerarioWidth = pageWidth - margins.left - margins.right;
        const tableItinerarioHeight = 10 + 18; // 15 para el espacio superior e inferior

        // Dibujar el recuadro alrededor de la tabla
        doc.rect(
          margins.left,
          currentY - 5,
          tableItinerarioWidth,
          tableItinerarioHeight,
          "S"
        );

        // Configuración de la tabla
        const columns = [
          "AEROLINEA",
          "VUELO",
          "FECHA",
          "RUTA",
          "CLASE",
          "HR SALIDA",
          "HR LLEGADA",
          "RECORD",
        ];
        const data = [
          [
            cotizacion.aerolineaIda
              ? cotizacion.aerolineaIda.toString()
              : "N/A",
            cotizacion.vueloIda ? cotizacion.vueloIda.toString() : "N/A",
            cotizacion.fechaInicio
              ? new Date(cotizacion.fechaInicio).toLocaleDateString()
              : "N/A",
            cotizacion.ruta1 ? cotizacion.ruta1.toString() : "N/A",
            cotizacion.claseIda ? cotizacion.claseIda.toString() : "N/A",
            cotizacion.horaSalidaIda
              ? cotizacion.horaSalidaIda.toString()
              : "N/A",
            cotizacion.horaLlegadaIda
              ? cotizacion.horaLlegadaIda.toString()
              : "N/A",
            cotizacion.recordIda ? cotizacion.recordIda.toString() : "N/A", // Agregado para mostrar el record
          ],
          [
            cotizacion.aerolineaVuelta
              ? cotizacion.aerolineaVuelta.toString()
              : "N/A",
            cotizacion.vueloVuelta ? cotizacion.vueloVuelta.toString() : "N/A",
            cotizacion.fechaFin
              ? new Date(cotizacion.fechaFin).toLocaleDateString()
              : "N/A",
            cotizacion.ruta2 ? cotizacion.ruta2.toString() : "N/A",
            cotizacion.claseVuelta ? cotizacion.claseVuelta.toString() : "N/A",
            cotizacion.horaSalidaVuelta
              ? cotizacion.horaSalidaVuelta.toString()
              : "N/A",
            cotizacion.horaLlegadaVuelta
              ? cotizacion.horaLlegadaVuelta.toString()
              : "N/A",
            cotizacion.recordVuelta
              ? cotizacion.recordVuelta.toString()
              : "N/A", // Agregado para mostrar el record
          ],
        ];

        // Calcular el ancho de cada columna
        const columnWidth =
          (pageWidth - margins.left - margins.right) / columns.length;

        // Dibujar encabezados de la tabla
        doc.setFontSize(8);
        columns.forEach((column, index) => {
          doc.text(column, margins.left + index * columnWidth, currentY);
        });

        // Dibujar contenido de la tabla
        data.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell,
              margins.left + cellIndex * columnWidth,
              currentY + (rowIndex + 1) * 10
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección
        currentY += tableItinerarioHeight - 10;

        //-----------------------------------------------------------------------------------------------------------
        // SECCIÓN: OBSERVACIONES
        const observationsText =
          "Esta cotización está sujeta a cambio y disponibilidad al momento de reservar (Sin servicio confirmado)";
        const observationsTop = currentY + 10;
        const observationsHeight = 30; // Altura del recuadro de observaciones

        // Dibujar el recuadro de observaciones con el título dentro
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          observationsTop,
          pageWidth - margins.left - margins.right,
          observationsHeight
        );
        doc.setFontSize(12);
        doc.text("OBSERVACIONES:", margins.left + 2, observationsTop + 6);
        doc.setFontSize(10);
        doc.text(observationsText, margins.left + 2, observationsTop + 15, {
          maxWidth: pageWidth - margins.left - margins.right - 4,
        });
        //------------------------------------------------------------------
        //INCLUYE
        currentY += observationsHeight + 2;
        // Ajustes de posición y tamaño
        const incluyeTop = currentY + 10;
        const incluyeLines = hotelincluye.split("¿");
        const incluyeHeight = 32 + incluyeLines.length * 5; // Altura del recuadro de INCLUYE
        const lineHeight = 6;

        // Dibujar el recuadro de INCLUYE con el título dentro y el texto
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          incluyeTop,
          pageWidth - margins.left - margins.right,
          incluyeHeight
        );
        doc.setFontSize(12);
        doc.text("INCLUYE:", margins.left + 2, incluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de INCLUYE
        incluyeLines.forEach((line, index) => {
          const lineY = incluyeTop + 15 + index * lineHeight; // Ajusta el espacio entre líneas
          doc.text(line, margins.left + 2, lineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
        });

        // Añadir una nueva página
        doc.addPage();
        currentY = margins.top; // Reiniciar la posición Y en la nueva página

        // Sección: NO INCLUYE
        const noIncluyeTop = currentY + 5;

        // Dividir el texto de hotelnoinclye por el carácter "¿" para obtener líneas individuales
        const noIncluyeLines = hotelnoincluye.split("¿");

        // Calcular la altura requerida para el recuadro
        const titleHeight = 5; // Espacio para el título
        const noIncluyeHeight =
          noIncluyeLines.length * lineHeight + titleHeight + 2; // Altura total requerida

        // Dibujar el recuadro de NO INCLUYE con el título dentro y el texto
        doc.setDrawColor(0); // Color del borde
        doc.rect(
          margins.left,
          noIncluyeTop,
          pageWidth - margins.left - margins.right,
          noIncluyeHeight
        );
        doc.setFont("helvetica"); // Cambiar la fuente a helvetica
        doc.setFontSize(10);
        doc.setTextColor(0); // Color de texto negro
        doc.text("NO INCLUYE:", margins.left + 2, noIncluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de NO INCLUYE
        noIncluyeLines.forEach((line, index) => {
          const lineY = noIncluyeTop + titleHeight + 8 + index * lineHeight; // Ajustar el espacio entre líneas
          doc.text(line.trim(), margins.left + 10, lineY, {
            maxWidth: pageWidth - margins.left - margins.right - 10,
          });
        });

        // Actualizar la posición Y para la próxima sección
        currentY += noIncluyeHeight + 15; // Agregar un espacio adicional entre secciones
        //------------------------------------
        // Sección: LIQUIDACIÓN
        // Título de la sección LIQUIDACIÓN
        doc.setFontSize(10);
        doc.text("LIQUIDACIÓN:", margins.left, currentY);
        currentY += 5; // Espacio después del título

        // Variables de configuración de la tabla
        const liquidacionTop = currentY + 5;
        const cellPadding = 2;
        const cellHeight = 6; // Altura de cada celda
        const tableWidth = pageWidth - margins.left - margins.right;
        const cellWidth = tableWidth / 6; // Ajustar para 6 columnas

        // Dibujar el borde de la tabla
        doc.setDrawColor(0); // Color del borde

        // Función para dibujar una fila
        function drawRow(y) {
          for (let j = 0; j <= 6; j++) {
            const x = margins.left + j * cellWidth;
            doc.line(x, y, x, y + cellHeight); // Dibujar columna
          }
          doc.line(margins.left, y, pageWidth - margins.right, y); // Dibujar fila superior
          doc.line(
            margins.left,
            y + cellHeight,
            pageWidth - margins.right,
            y + cellHeight
          ); // Dibujar fila inferior
        }

        // Variables para las sumas
        let sumaTotalHabitaciones = 0;

        // Ajustar tamaño de fuente para el contenido de las celdas
        doc.setFontSize(7);

        // Iterar a través de las habitaciones y añadir datos a la tabla
        let currentRow = 0;

        habitacion.forEach((habitacionData) => {
          const y = liquidacionTop + currentRow * cellHeight;

          // Dibujar la fila de la tabla
          drawRow(y);

          // Primera columna: Valor adul {Acomodacion}
          const valorAdul = `Valor adul ${habitacionData.acomodacion}`;
          doc.text(valorAdul, margins.left + cellPadding, y + cellHeight / 2, {
            baseline: "middle",
          });

          // Segunda columna: precioComisionableAdulto
          const precioComisionablePorAdulto = Math.round(
            habitacionData.precioComisionableAdulto
          );
          doc.text(
            precioComisionablePorAdulto.toString(),
            margins.left + cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Tercera columna: Número de adultos
          const numAdultos = habitacionData.adultos;
          doc.text(
            numAdultos.toString(),
            margins.left + 2 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Cuarta columna: Valor original x número adultos
          const precioComisionableAdulto = Math.round(
            habitacionData.precioComisionableAdulto * habitacionData.adultos
          );
          doc.text(
            precioComisionableAdulto.toString(),
            margins.left + 3 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Añadir BASE DE DESCUENTO o BASE COMISIÓN en la quinta columna de la primera fila
          if (currentRow === 0) {
            doc.setFontSize(6);
            const baseText =
              tipoBase === "Comisión" ? "BASE COMISIÓN" : "BASE DE DESCUENTO";
            doc.text(
              baseText,
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );
            doc.setFontSize(7);
          }

          // Calcular la suma de los valores de la habitación (adultos y niños)
          let sumaHabitacion = precioComisionableAdulto;
          if (habitacionData.niños > 0) {
            sumaHabitacion += Math.round(
              habitacionData.precioComisionableNino * habitacionData.niños
            );
          }
          sumaTotalHabitaciones += sumaHabitacion;

          currentRow++; // Incrementar la fila para la siguiente iteración

          // Verificar si hay niños
          if (habitacionData.niños > 0) {
            const yChild = liquidacionTop + currentRow * cellHeight;

            // Dibujar la fila de la tabla
            drawRow(yChild);

            // Primera columna: Valor child {Acomodacion}
            const valorChild = `Valor child ${habitacionData.acomodacion}`;
            doc.text(
              valorChild,
              margins.left + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Segunda columna: precioComisionableNiño
            const precioComisionablePorNiño = Math.round(
              habitacionData.precioComisionableNino
            );
            doc.text(
              precioComisionablePorNiño.toString(),
              margins.left + cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Tercera columna: Número de niños
            const numNiños = habitacionData.niños;
            doc.text(
              numNiños.toString(),
              margins.left + 2 * cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            // Cuarta columna: Valor original x niños
            const precioComisionableNino = Math.round(
              habitacionData.precioComisionableNino * habitacionData.niños
            );
            doc.text(
              precioComisionableNino.toString(),
              margins.left + 3 * cellWidth + cellPadding,
              yChild + cellHeight / 2,
              { baseline: "middle" }
            );

            currentRow++; // Incrementar la fila para la siguiente iteración
          }
        });

        // Añadir la suma total en la sexta columna de la primera fila
        doc.text(
          sumaTotalHabitaciones.toString(),
          margins.left + 5 * cellWidth + cellPadding,
          liquidacionTop + cellHeight / 2,
          { baseline: "middle" }
        );

        currentY = liquidacionTop + currentRow * cellHeight + 10; // Actualizar currentY después de las filas de habitaciones

        // Nombres reflejando los valores
        const nombres = [
          "TRANSPORTE NO COMISI",
          "Q",
          "YS",
          "CO",
          "TA",
          "YS TA",
          "TOTAL IMPUESTOS",
        ];

        // Valores correspondientes
        const valores = [
          cotizacion.otros,
          cotizacion.combus,
          cotizacion.iva,
          cotizacion.tasa,
          cotizacion.ta,
          cotizacion.ivaTa,
          cotizacion.precioTrans,
        ];

        if (cotizacion.suplemento > 0) {
          nombres.push("SUPLEMENTO");
          valores.push(cotizacion.suplemento);
        }

        // Añadir los nombres y valores a la tabla
        nombres.forEach((nombre, index) => {
          const y = currentY + index * cellHeight;

          // Dibujar la fila de la tabla
          drawRow(y);

          // Primera columna: Nombre
          doc.text(nombre, margins.left + cellPadding, y + cellHeight / 2, {
            baseline: "middle",
          });

          // Segunda columna: Valor dividido por el total de pasajeros
          const totalPasajeros = cotizacion.totalPasajeros;
          const valor = valores[index] || 0;
          const valorDividido =
            totalPasajeros !== 0 ? Math.trunc(valor / totalPasajeros) : "";
          doc.text(
            valorDividido.toString(),
            margins.left + cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Tercera columna: Número total de pasajeros
          const totalPasajerosTexto =
            totalPasajeros !== 0 ? Math.trunc(totalPasajeros).toString() : "";
          doc.text(
            totalPasajerosTexto,
            margins.left + 2 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Cuarta columna: Valor original
          const valorOriginalTexto =
            valor !== 0 ? Math.trunc(valor).toString() : "";
          doc.text(
            valorOriginalTexto,
            margins.left + 3 * cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Columna 5 y 6 para "Q" y "YS"
          if (nombre === "Q") {
            doc.text(
              "Porcentaje",
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            const descuento = cotizacion.clientePorcentaje || 0;
            const descuentoTexto = Math.trunc(descuento).toString() + "%";
            doc.text(
              descuentoTexto,
              margins.left + 5 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );
          } else if (nombre === "YS") {
            doc.text(
              "Valor Descuento",
              margins.left + 4 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            const valorDescuento = cotizacion.valorDescuento || 0;
            const valorDescuentoTexto = Math.trunc(valorDescuento).toString();
            doc.text(
              valorDescuentoTexto,
              margins.left + 5 * cellWidth + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Agregar filas adicionales si tipoBase es "Comisión"
            if (tipoBase === "Comisión") {
              const additionalRows = [
                {
                  label: `IVA(${clienteData.porcentajeIva}%) (-)`,
                  value: cotizacion.ivaValor,
                },
                {
                  label: `RTE FUENTE(${clienteData.rteFuente}%) (+)`,
                  value: cotizacion.rteFuente,
                },
                {
                  label: `RTE ICA(${clienteData.rteIca}%) (+)`,
                  value: cotizacion.rteIca,
                },
                {
                  label: "Total Comisión",
                  value: cotizacion.totalComision,
                },
              ];

              additionalRows.forEach((row, idx) => {
                const yAdditional = y + (idx + 1) * cellHeight;

                drawRow(yAdditional);

                doc.text(
                  row.label,
                  margins.left + 4 * cellWidth + cellPadding,
                  yAdditional + cellHeight / 2,
                  { baseline: "middle" }
                );

                doc.text(
                  row.value.toString(),
                  margins.left + 5 * cellWidth + cellPadding,
                  yAdditional + cellHeight / 2,
                  { baseline: "middle" }
                );
              });
            }
          }
        });
        currentY += nombres.length * cellHeight;

        // Añadir los valores por habitación
        habitacion.forEach((habitacionData) => {
          if (habitacionData.adultos > 0) {
            const y = currentY;
            drawRow(y);

            // Descripción en la primera columna (sin cambios)
            doc.text(
              `Valor total Adt ${habitacionData.acomodacion}`,
              margins.left + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Formatear el precio con Numeral.js
            const precioHabitacionAdulto =
              habitacionData.precioHabitacionAdulto || 0;
            const precioAdultoTexto = numeral(precioHabitacionAdulto).format(
              "$0,0"
            );

            doc.text(
              precioAdultoTexto,
              margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            currentY += cellHeight;
          }

          if (habitacionData.niños > 0) {
            const y = currentY;
            drawRow(y);

            // Descripción en la primera columna (sin cambios)
            doc.text(
              `Valor total Chd ${habitacionData.acomodacion}`,
              margins.left + cellPadding,
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            // Formatear el precio con Numeral.js
            const precioHabitacionNino =
              habitacionData.precioHabitacionNino || 0;
            const precioNinoTexto =
              numeral(precioHabitacionNino).format("$0,0");

            doc.text(
              precioNinoTexto,
              margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
              y + cellHeight / 2,
              { baseline: "middle" }
            );

            currentY += cellHeight;
          }
        });
        // Añadir valor total y otros valores en la misma fila
        doc.setFontSize(8);
        currentY += cellHeight; // Espacio antes de la fila final
        drawRow(currentY); // Dibujar la fila para los valores finales
        doc.text(
          "Valor total",
          margins.left + cellPadding,
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        // Formatear el precio bruto total con Numeral.js
        const precioBrutoTotal = cotizacion.precioBrutoTotal || 0;
        const precioBrutoTotalTexto = numeral(precioBrutoTotal).format("$0,0"); // Formato con separador de miles y símbolo de peso

        doc.text(
          precioBrutoTotalTexto, // Mostrar el precio formateado
          margins.left + 3 * cellWidth + cellPadding, // Movido a la cuarta columna
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        doc.text(
          "Precio a pagar",
          margins.left + 4 * cellWidth + cellPadding,
          currentY + cellHeight / 2 - 2,
          { baseline: "middle" }
        ); // Primera línea
        doc.text(
          "a Multidestinos",
          margins.left + 4 * cellWidth + cellPadding,
          currentY + cellHeight / 2 + 2,
          { baseline: "middle" }
        ); // Segunda línea
        // Convertir a números antes de sumar
        const suplemento = parseFloat(cotizacion.suplemento) || 0;
        const totalPrecioCliente =
          parseFloat(cotizacion.totalPrecioCliente) || 0;

        // Sumar el suplemento si existe
        const totalConSuplemento =
          suplemento > 0 ? totalPrecioCliente + suplemento : totalPrecioCliente;
        const totalConSuplementoTexto =
          numeral(totalConSuplemento).format("$0,0");
        doc.text(
          totalConSuplementoTexto,
          margins.left + 5 * cellWidth + cellPadding,
          currentY + cellHeight / 2,
          { baseline: "middle" }
        );

        currentY += cellHeight + 10; // Espacio después de la fila final

        // Mover a la siguiente sección del documento si es necesario

        // Mover a la siguiente sección del documento si es necesario
        // Agregar recuadro con el título "Depósito y Condiciones de Pago"
        const recuadroX = margins.left;
        const recuadroY = currentY + 5;
        const recuadroWidth = 190;
        let recuadroHeight = 30; // Inicializamos con un valor base

        doc.setFontSize(7);
        doc.setLineWidth(0.5);

        // Título del recuadro (sin cambios)
        doc.text(
          "Deposito y Condiciones de Pago",
          recuadroX + 5,
          recuadroY + 3
        );

        // Reducir tamaño de fuente y ajustar espaciado entre líneas
        doc.setFontSize(6);
        const lineHeightPago = 5; // Espacio entre líneas (nombre cambiado)

        // Condiciones de pago (como un solo párrafo)
        const condiciones =
          "PARA CONFIRMACIONES SE DEBE ENVIAR DEPOSITO DEL 50% DEL VALOR DEL PLAN Y EL SALDO 30 DIAS ANTES DE LA SALIDA, SI LA FECHA DE VIAJES CERCANA SE DEBE CANCELAR EL 100%. LOS SERVICIOS DEJADOS DE TOMAR NO SON REMBOLSABLES. LA CANCELACIÓN CON 18 DIAS ANTES DE VIAJE LA PENALIDAD SERA DEL 100% DEL VALOR DEL PLAN, LOS TIQUETES NO SON REEMBOLSABLE, NI ENDOSABLES, PENALIDAD POR CAMBIO (FECHA, NOMBRE, HORA, RUTAS) 200.000. ESTAS POLITICAS ESTAN PUBLICADAS DE MANERA CLARA Y ESPECIFICA EN NUESTRA PAGINA WWW.MULTIDESTINOSEXPRESS.COM. *TARIFAS SUJETA A CAMBIO Y DISPONIBILIDAD SIN PREVIO AVISO*";

        // Dividir el párrafo en líneas que quepan en el recuadro
        const splitLines = doc.splitTextToSize(condiciones, recuadroWidth - 10);

        // Calcular la altura necesaria para el recuadro
        recuadroHeight = 20 + splitLines.length * lineHeightPago; // 20 para el título y margen superior

        // Verificar si el recuadro cabe en la página actual
        if (recuadroY + recuadroHeight > pageHeight - margins.bottom) {
          doc.addPage();
          currentY = margins.top; // Reiniciar currentY en la nueva página
        }

        // Dibujar el recuadro
        doc.rect(recuadroX, currentY, recuadroWidth, recuadroHeight);

        // Escribir el texto dentro del recuadro
        splitLines.forEach((splitLine, splitIndex) => {
          doc.text(
            splitLine,
            recuadroX + 5,
            recuadroY + 10 + splitIndex * lineHeightPago
          );
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección
        currentY += recuadroHeight + 5; // Agregar un espacio adicional después del recuadro

        // Obtener el Blob del PDF
        const pdfBlob = doc.output("blob");
        // Guardar el documento como archivo PDF
        doc.save(`cotizacion_${idCotizacion}.pdf`);
        // Almacenar la ruta del archivo descargado
        // Devolver el Blob
        return pdfBlob;
      } catch (error) {
        console.error("Error al descargar cotización:", error);
      }
    },

    handleChildrenChange(index) {
      // Si el checkbox está marcado, establecer el número de niños en 1; de lo contrario, en 0
      this.rooms[index].numChildren = this.hasChildren[index] ? 1 : 0;
    },
    //TABLA

    //TRAE DATOS
    async fetchCotizacionData() {
      try {
        const response = await axios.get(
          "https://backendmultidestinosexpress.onrender.com/cotizacion"
        );
        this.cotizacionData = response.data;
      } catch (error) {
        console.error("Error fetching cotizacion data:", error);
      }
    },
    //METODO DE CLIENTES
    async fetchClientOptions() {
      try {
        console.log("Obteniendo opciones de clientes...");
        const response = await axios.get(
          "https://backendmultidestinosexpress.onrender.com/cliente"
        );
        console.log("Opciones de clientes nombre:", response.data.nombre);
        const allclientes = response.data.map((item) => item.nombre);
        console.log("Opciones de clientes:", allclientes);

        this.clientOptions = allclientes;
      } catch (error) {
        console.error("Error al obtener opciones de clientes:", error);
      }
    },
    async fetchOptionCorreo() {
      this.correo = "";

      this.OptionCorreo = [];

      try {
        const response = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/cliente/buscar/${this.selectedClient}`
        );
        const allCorreo = response.data.flatMap((item) =>
          item.correo.split(",")
        );
        this.OptionCorreo = allCorreo;
      } catch (error) {
        console.error("Error al obtener opciones de clientes:", error);
      }
    },
    // Método para realizar la solicitud HTTP y cargar las opciones
    async fetchOptions() {
      try {
        console.log("Realizando solicitud HTTP para cargar opciones...");
        console.log("Salida seleccionada:", this.selectedDeparture);

        const response = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/planes/porCiudad/${this.selectedDeparture}`
        );

        console.log("Respuesta del servidor:", response.data);

        // Agrupar opciones por destino Y guardar las originales
        const optionsByDestination = {};
        const originalOptionsByDestination = {};
        response.data.forEach((item) => {
          const destino = item.destino;
          if (!optionsByDestination[destino]) {
            optionsByDestination[destino] = {
              programNameOptions: [],
              hotelOptions: [],
              nochesOptions: [],
              accommodationOptions: [],
            };
            originalOptionsByDestination[destino] = {
              // Guardamos las originales
              nochesOptions: [],
            };
          }
          optionsByDestination[destino].programNameOptions.push(
            item.nombrePrograma
          );
          optionsByDestination[destino].hotelOptions.push(
            ...item.hotel.split("*")
          );
          optionsByDestination[destino].nochesOptions.push(
            ...item.noches.split("*")
          );
          optionsByDestination[destino].accommodationOptions.push(
            ...item.acomodacion.split("*")
          );
          originalOptionsByDestination[destino].nochesOptions.push(
            ...item.noches.split("*")
          ); // Guardamos las originales
        });

        this.optionsByDestination = optionsByDestination;
        this.originalOptionsByDestination = originalOptionsByDestination; // Guardamos las originales

        // Obtener todos los destinos y eliminar duplicados
        const allDestinations = response.data.map((item) => item.destino);
        this.destinationOptions = [...new Set(allDestinations)];
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      }
    },

    updateOptionsByDestination(selectedDestination) {
      const selectedOptions = this.optionsByDestination[selectedDestination];

      if (selectedOptions) {
        this.programNameOptions = [
          ...new Set(selectedOptions.programNameOptions),
        ];
        this.hotelOptions = [...new Set(selectedOptions.hotelOptions)];
        this.accommodationOptions = [
          ...new Set(selectedOptions.accommodationOptions),
        ];
        this.nochesOptions = [...new Set(selectedOptions.nochesOptions)].map(
          (noche) => ({
            label: noche,
            value: parseInt(noche.split(" ")[0]),
          })
        );

        // Limpiamos las selecciones de nombre de programa, duración y hotel
        this.programName = null;
        this.noche = null;
        this.hotel = null;
      } else {
        // Manejo de opciones no encontradas
        this.programNameOptions = [];
        this.hotelOptions = [];
        this.nochesOptions = [];
        this.accommodationOptions = [];
        this.programName = null; // Limpiamos también en este caso
        this.noche = null;
        this.hotel = null;
      }
    },

    // filterNightsByHotel() {
    //   // Filtramos las noches según el hotel seleccionado, partiendo de allNochesOptions
    //   this.nochesOptions = this.allNochesOptions.filter((opcion) => {
    //     if (this.hotel === "") {
    //       return opcion.value <= 2;
    //     } else {
    //       return opcion.value !== 1;
    //     }
    //   });

    //   // Eliminamos la asignación automática de la noche
    //   // if (this.nochesOptions.length && !this.nochesOptions.some(opcion => opcion.value === this.noche)) {
    //   //   this.noche = this.nochesOptions[0].value;
    //   // }
    // },

    buscarTiposDeHabitacion() {
      // Realizar la solicitud POST al servidor con los parámetros actuales
      axios
        .post(
          "https://backendmultidestinosexpress.onrender.com/hoteles/buscar",
          this.params
        )
        .then((response) => {
          // Obtener la lista de tipos de habitación de la respuesta del servidor
          const tiposDeHabitacion = response.data.map(
            (hotel) => hotel.tipoDeHabitacion
          );

          // Eliminar duplicados utilizando un Set
          const tiposDeHabitacionUnicos = [...new Set(tiposDeHabitacion)];

          // Asignar los tipos de habitación únicos a la opción de tipo de habitación
          this.tipoDeHabitacionOptions = tiposDeHabitacionUnicos;
        })
        .catch((error) => {
          console.error("Error al buscar hoteles:", error);
        });
    },
    // Método para manejar el cambio en la selección de salida
    handleDepartureChange() {
      this.clearFieldsc();
      this.destinationOptions = [];
      this.programNameOptions = [];
      this.nochesOptions = [];

      // this.planOptions = [];
      this.accommodationOptions = [];
      this.OptionCorreo = [];
      this.hotelOptions = [];
      this.roomTypeOptions = [];
      console.log("Cambio en la selección de salida. Cargando opciones...");
      this.fetchOptions();
      this.fetchClientOptions();
    },
    // Método para manejar el cambio en la selección de hotel, programa y destino

    handleSelectionChangeTipo(selectedValue) {
      const newValue = selectedValue.value;
      // Actualizar los parámetros con los valores seleccionados
      this.params.hotel = this.hotel;
      this.params.nombrePrograma = this.programName;
      this.params.destino = this.destination;

      console.log(this.params);
      // Realizar la búsqueda de tipos de habitación
      axios
        .post(
          "https://backendmultidestinosexpress.onrender.com/hoteles/buscar",
          this.params
        )
        .then((response) => {
          // Obtener la lista de tipos de habitación de la respuesta del servidor
          console.log("hola", response.data);
          const tiposDeHabitacion = response.data.map(
            (item) => item.tipoHabitacion
          );

          // Eliminar duplicados utilizando un Set
          const tiposDeHabitacionUnicos = [...new Set(tiposDeHabitacion)];
          console.log(tiposDeHabitacionUnicos);
          // Asignar los tipos de habitación únicos a la opción de tipo de habitación
          this.roomTypeOptions = tiposDeHabitacionUnicos;
        })
        .catch((error) => {
          console.error("Error al buscar hoteles:", error);
        });
    },
    // Método para abrir el modal
    openModal() {
      this.modalVisible = true;
    },

    // Método para cerrar el modal
    closeModal() {
      this.modalVisible = false;
      this.clearFields();
    },
    resetVariables() {
      // Reinicializar todas las variables utilizadas
      this.aerolineaValue1 = "";
      this.vueloValue1 = "";
      this.aerolineaValue2 = "";
      this.vueloValue2 = "";
      this.horaSalidaValue1 = "";
      this.horaLlegadaValue1 = "";
      this.horaSalidaValue2 = "";
      this.horaLlegadaValue2 = "";
      this.claseValue1 = "";
      this.claseValue2 = "";
      this.totalAdultos = 0;
      this.totalNiños = 0;
      this.hasChildren = [];
      this.additionalNightSelected = false;
      this.additionalNightCount = 0;
      this.habitacionesDatos = [];
      this.sumaTotalAcomodacion = 0;
      this.sumaValorBrutohab = 0;
      this.sumaTotalDescuento = 0;
      this.childrenPriceNumber = 0;
    },
    async obtenerInformacionTiquete(salida, destino) {
      try {
        // Realizar la solicitud GET para obtener la información del tiquete
        const response = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/tiquete/buscar/${salida}/${destino}`
        );

        // Aquí puedes manejar la respuesta recibida
        console.log("Información del tiquete:", response.data);

        // Puedes retornar la respuesta si necesitas usarla en otro lugar
        return response.data;
      } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la solicitud
        console.error("Error al obtener la información del tiquete:", error);
        throw error; // Propaga el error para que pueda ser manejado fuera de esta función si es necesario
      }
    },

    async saveFormData() {
      //
      // Iterar sobre los datos de transporte y calcular totales
      if (
        !this.aerolineaValue1 ||
        !this.vueloValue1 ||
        !this.aerolineaValue2 ||
        !this.vueloValue2
      ) {
        this.$q.notify({
          message:
            "Por favor complete la información de aerolínea y vuelo para ambas direcciones.",
          color: "negative",
        });
        return; // Detiene el proceso si hay campos obligatorios sin completar
      }

      if (
        !this.horaSalidaValue1 ||
        !this.horaLlegadaValue1 ||
        !this.horaSalidaValue2 ||
        !this.horaLlegadaValue2
      ) {
        this.$q.notify({
          message:
            "Por favor complete la información de horas de salida y llegada para ambas direcciones.",
          color: "negative",
        });
        return;
      }

      if (!this.claseValue1 || !this.claseValue2) {
        this.$q.notify({
          message:
            "Por favor complete la información de clase para ambas direcciones.",
          color: "negative",
        });
        return;
      }

      if (!this.dateRange[0] || !this.dateRange[1]) {
        this.$q.notify({
          message:
            "Por favor complete la información de fechas de inicio y fin.",
          color: "negative",
        });
        return;
      }
      let combus = 0,
        tasa = 0,
        iva = 0,
        ta = 0,
        ivaTa = 0,
        otros = 0,
        precioTrans = 0;

      const impuestosResponse = await axios.get(
        "https://backendmultidestinosexpress.onrender.com/canoCristal/"
      );
      const impuestosData = impuestosResponse.data;
      console.log("Datos de impuestos obtenidos:", impuestosData);
      try {
        //clientes porcentaje
        const clienteResponse = await axios.get(
          `https://backendmultidestinosexpress.onrender.com/cliente/buscar/${this.selectedClient}`
        );
        console.log("clienteResponse", clienteResponse);

        // Obtener el porcentaje del cliente
        let clientePorcentaje = null;
        let clienteTipoBase = null;
        let rteFuente = null;
        let rteIca = null;
        let ivaValor = null;

        clienteResponse.data.forEach((cliente) => {
          if (cliente.nombre === this.selectedClient) {
            clientePorcentaje =
              this.programName === "Caño Cristales"
                ? parseFloat(cliente.lmc) // Valor si es "Caño Cristales"
                : parseFloat(cliente.demas); // Valor por defecto
            clienteTipoBase = cliente.tipoBase;
            rteFuente = cliente.rteFuente;
            rteIca = cliente.rteIca;
            ivaValor = cliente.porcentajeIva;
          }
        });

        console.log("clientePorcentaje", clientePorcentaje);
        console.log("clienteTipoBase", clienteTipoBase);
        console.log("rteFuente", rteFuente);
        console.log("rteIca", rteIca);
        console.log("ivaValor", ivaValor);

        //fin de porcentaje clientes
        // HASTA ACA ESTA BIEN.

        //ACA SUPLEMENTO

        // Obtener información del tiquete
        const informacionTiquete = await this.obtenerInformacionTiquete(
          this.selectedDeparture,
          this.destination
        );

        // Puedes usar la información del tiquete aquí como lo necesites
        console.log("Información del tiquete obtenida:", informacionTiquete);
        const tiquete = informacionTiquete[0].total;
        const tiqueteNum = parseFloat(tiquete);
        console.log("tiquete", tiquete);
        console.log("tiqueteNum", tiqueteNum);
        // Después de obtener la información del tiquete
        let valorSuplemento = 0; // Valor predeterminado si no hay suplemento

        if (this.supplementValues) {
          // Si hay un suplemento, calcula el valor restando el suplemento del precio del tiquete
          for (let i = 0; i < this.supplementValues.length; i++) {
            if (this.supplementValues[i]) {
              console.log("persona", [i], this.supplementValues[i]);

              valorSuplemento +=
                parseFloat(this.supplementValues[i]) - tiqueteNum;
            }
            console.log("Total suplemento", [i], valorSuplemento);
          }
        }

        // Ahora puedes usar valorSuplemento según sea necesario
        console.log("Valor del suplemento:", valorSuplemento);
        //----------------------------------------------------------------
        //HABITACION PETICION

        // Construir el cuerpo de la solicitud para obtener los precios de las habitaciones
        // Iterar sobre las habitaciones en el formulario
        const preciosRequestDataArray = [];

        this.rooms.forEach((room, index) => {
          // Crear el objeto de solicitud para esta habitación
          const preciosRequestData = {
            pertenece: this.selectedDeparture,
            destino: this.destination,
            nombrePrograma: this.programName,
            hotel: this.hotel,
            tipoHabitacion: room.roomType, // Usar el tipo de habitación de esta habitación específica
            noches: this.noche.value,
          };
          // Agregar el objeto de solicitud al array
          preciosRequestDataArray.push(preciosRequestData);
        });

        console.log("edades", preciosRequestDataArray);
        try {
          // Realizar todas las solicitudes simultáneamente
          const preciosResponseArray = await Promise.all(
            preciosRequestDataArray.map((data) =>
              axios.post(
                "https://backendmultidestinosexpress.onrender.com/hoteles/buscarT",
                data
              )
            )
          );
          console.log("preciosResponseArray", preciosResponseArray);
          console.log("preciosResponseArray data", preciosResponseArray.data);
          // corresponde a las habitaciones y precios
          const datosProcesados = [];

          // Iterar sobre cada objeto en preciosResponseArray
          preciosResponseArray.forEach((response) => {
            // Verificar si hay datos en esta respuesta
            if (response.data.length > 0) {
              // Agregar los datos completos al array local
              datosProcesados.push(...response.data);
            } else {
              console.log("No se encontraron datos en esta respuesta");
            }
          });

          // Ahora puedes usar datosProcesados para acceder a los datos de manera más conveniente
          console.log(datosProcesados);

          //TRANSPORTE Y IVAS Y OTROS

          // Realizar la solicitud para obtener información sobre transporte
          const transporteRequestData = {
            pertenece: this.selectedDeparture,
            destino: this.destination,
          };
          const transporteResponse = await axios.get(
            "https://backendmultidestinosexpress.onrender.com/transporte/buscar",
            {
              params: transporteRequestData,
            }
          );

          transporteResponse.data.forEach((transporte) => {
            combus += parseFloat(transporte.combus) || 0;
            tasa += parseFloat(transporte.tasa) || 0;
            iva += parseFloat(transporte.iva) || 0;
            ta += parseFloat(transporte.ta) || 0;
            ivaTa += parseFloat(transporte.ivaTa) || 0;
            otros += parseFloat(transporte.otros) || 0;
            precioTrans += parseFloat(transporte.total) || 0;
          });
          console.log("precioTrans", precioTrans);
          //FIN TRASNPORTES------------------------------------------------------------------------------------------------
          // Inicializar variables para el total de adultos y niños

          let childrenPrice = 0;
          // Iterar sobre cada habitación en el formulario
          this.rooms.forEach(async (room, index) => {
            console.log(`Procesando habitación ${index + 1}`);

            // Obtener el tipo de habitación seleccionado en el formulario para esta habitación
            //roomAccommodation es igual a la acomodacion
            const roomAccommodation = room.accommodation;
            //roomtype es igual al tipo de habitacion
            const roomType = room.roomType;
            console.log(`Tipo de habitación seleccionado: ${roomType}`);

            // Obtener los datos de precio para el tipo de habitación seleccionado
            const roomPriceData = datosProcesados.find(
              (data) => data.tipoHabitacion === roomType
            );
            console.log("Datos de precio encontrados:", roomPriceData);

            // Verificar si se encontraron datos de precio para este tipo de habitación
            if (roomPriceData) {
              // Extraer el precio de la acomodación
              const accommodationPrice = roomPriceData[roomAccommodation]; // Utilizar el tipo de habitación como clave
              console.log(`la acomodacio es: ${roomAccommodation}`);
              console.log(`Precio de la acomodación: ${accommodationPrice}`);

              // Guardar el precio de la acomodación en la habitación
              room.accommodationPrice = accommodationPrice;
              // Inicializar el precio total
              let totalPrice = 0;
              // Si hay niños en esta habitación, obtener su precio
              let childrenPriceNumber = 0;
              if (this.hasChildren[index]) {
                // Obtener el precio de los niños según el tipo de acomodación
                childrenPrice = roomPriceData.niño;
                console.log("childrenPrice", childrenPrice);
                this.childrenPriceNumber = parseFloat(
                  childrenPrice.replace(/\./g, "")
                );

                totalPrice += childrenPrice;
              }
              console.log("childrenPriceNumber1", this.childrenPriceNumber);

              // Verificar si hay noches adicionales seleccionadas
              let additionalNightTotalPriceAdulto = 0;
              let additionalNightTotalPriceNiño = 0;
              if (
                this.additionalNightSelected &&
                this.additionalNightCount > 0
              ) {
                // Obtener el precio de la noche adicional para adultos según el tipo de acomodación
                const additionalNightPriceAdulto = parseFloat(
                  roomPriceData[`nocheAdicional${roomAccommodation}`].replace(
                    /\./g,
                    ""
                  )
                );
                console.log(
                  "additionalNightPriceAdulto",
                  additionalNightPriceAdulto
                );
                const nochesAdicionales = this.additionalNightCount;
                console.log("nochesAdicionales", nochesAdicionales);
                // Calcular el precio total de las noches adicionales para adultos
                additionalNightTotalPriceAdulto =
                  additionalNightPriceAdulto * this.additionalNightCount;
                console.log(
                  "additionalNightTotalPriceAdulto",
                  additionalNightTotalPriceAdulto
                );

                // Agregar el precio total de las noches adicionales para adultos al precio total
                totalPrice += additionalNightTotalPriceAdulto;

                // Si hay niños en esta habitación, obtener el precio de la noche adicional para niños
                if (this.hasChildren[index]) {
                  const additionalNightPriceNiño = parseFloat(
                    roomPriceData[`nocheAdicionalniño`].replace(/\./g, "")
                  );
                  console.log(
                    "additionalNightPriceNiño",
                    additionalNightPriceNiño
                  );

                  // Calcular el precio total de las noches adicionales para niños
                  additionalNightTotalPriceNiño =
                    additionalNightPriceNiño *
                    this.additionalNightCount *
                    room.numChildren;
                  console.log(
                    "additionalNightTotalPriceNiño",
                    additionalNightTotalPriceNiño
                  );

                  // Agregar el precio total de las noches adicionales para niños al precio total
                  totalPrice += additionalNightTotalPriceNiño;
                }
              }
              // // Calcular el precio total sumando el precio de la acomodación y otros costos adicionales
              // room.totalPrice = totalPrice + accommodationPrice;

              //SACAR VALOR COMISIONABLE.

              const accommodationPriceNumber = parseFloat(
                accommodationPrice.replace(/\./g, "")
              );
              console.log("accommodationPriceNumber", accommodationPriceNumber);
              console.log("precioTrans", precioTrans);

              const ValorComisionableAdultos =
                accommodationPriceNumber -
                precioTrans +
                (this.additionalNightSelected
                  ? additionalNightTotalPriceAdulto
                  : 0);
              this.ValorComisionableNiños = 0;
              let ValorClienteNiño = 0;
              console.log(
                "antes de childrenPriceNumber",
                this.childrenPriceNumber
              );
              if (this.hasChildren[index]) {
                this.ValorComisionableNiños =
                  this.childrenPriceNumber -
                  precioTrans +
                  additionalNightTotalPriceNiño;

                this.ValorClienteNiño =
                  this.ValorComisionableNiños -
                  this.ValorComisionableNiños * (clientePorcentaje / 100);
              }
              console.log("this.ValorClienteNiño", this.ValorClienteNiño);
              console.log("ValorComisionableAdultos", ValorComisionableAdultos);
              console.log(
                "ValorComisionableNiños",
                this.ValorComisionableNiños
              );

              // PORCENTAJE

              //PRECIO CON PORCENTAJE
              const ValorClienteAdulto =
                ValorComisionableAdultos -
                ValorComisionableAdultos * (clientePorcentaje / 100);
              console.log("ValorClienteAdulto", ValorClienteAdulto);
              console.log("ValorClienteNiño", ValorClienteNiño);

              //valor total descuento con adulto + niño x habitacion

              const ValorCliente = ValorClienteAdulto + ValorClienteNiño;

              console.log("ValorCliente", ValorCliente);

              const numAdultos = room.adults;
              const numNiños = this.hasChildren[index] ? room.numChildren : 0;
              const valorBrutoAdulto = accommodationPriceNumber * numAdultos;
              const valorBrutoniño =
                (this.childrenPriceNumber ? this.childrenPriceNumber : 0) *
                numNiños;
              let valorBrutoTotal = valorBrutoAdulto + valorBrutoniño;
              console.log("valorBrutoAdulto", valorBrutoAdulto);
              console.log("valorBrutoniño", valorBrutoniño);
              console.log("valorBrutoTotal", valorBrutoTotal);

              console.log(
                `Número de adultos en la habitación ${index + 1}: ${numAdultos}`
              );
              console.log(
                `Número de niños en la habitación ${index + 1}: ${numNiños}`
              );

              const TotalAcomodacionAdulto = ValorClienteAdulto * numAdultos;
              console.log("TotalAcomodacionAdulto", TotalAcomodacionAdulto);
              let TotalAcomodacionNiño = this.ValorClienteNiño * numNiños;
              console.log("TotalAcomodacionNiño", TotalAcomodacionNiño);
              if (
                TotalAcomodacionNiño === null ||
                isNaN(TotalAcomodacionNiño)
              ) {
                TotalAcomodacionNiño = 0;
              }
              console.log(
                "TotalAcomodacionNiño después de la condición",
                TotalAcomodacionNiño
              );
              let TotalAcomodacion =
                TotalAcomodacionNiño + TotalAcomodacionAdulto;

              console.log("TotalAcomodacion", TotalAcomodacion);

              // Agregar el número de adultos y niños al total
              this.totalAdultos += parseInt(numAdultos);
              this.totalNiños += numNiños;
              const Valorporcentaje =
                ValorComisionableAdultos * numAdultos +
                this.ValorComisionableNiños * numNiños;
              const descuento = Valorporcentaje * (clientePorcentaje / 100);
              console.log("descuento", descuento);
              console.log("Valorporcentaje", Valorporcentaje);

              //IMPUESTOS CAÑO CRISTAL

              // Calcular impuestos
              let impuestosHabitacion = {
                cormacarena5a11: 0,
                cormacarena12a65: 0,
                cormacarenaExtranjero: 0,
                pqsNaturales5a24: 0,
                pqsNaturales25a65: 0,
                pqsNaturalesExtranjero: 0,
                alcaldiaNacional: 0,
                alcaldiaExtranjero: 0,
                defensaCivil: 0,
              };

              console.log("Habitación actual:", room);

              // Verificar si hay edades para calcular impuestos
              if (room.adultAges.length > 0 || room.childAge) {
                // Calcular impuestos para cada adulto
                for (let i = 0; i < room.adultAges.length; i++) {
                  const edadAdulto = room.adultAges[i];
                  const esExtranjero = room.isForeigner[i];

                  console.log(
                    `Calculando impuestos para adulto ${
                      i + 1
                    } (edad: ${edadAdulto}, extranjero: ${esExtranjero})`
                  );

                  for (const impuesto of impuestosData) {
                    const nombreImpuesto = impuesto.IMPUESTO;

                    console.log(`Impuesto actual: ${nombreImpuesto}`);

                    if (nombreImpuesto === "cormacarena") {
                      if (esExtranjero) {
                        impuestosHabitacion.cormacarenaExtranjero +=
                          parseFloat(impuesto.EXTRANJERO) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (Extranjero): ${impuesto.EXTRANJERO} (acumulado)`
                        );
                      } else if (edadAdulto >= 5 && edadAdulto <= 11) {
                        impuestosHabitacion.cormacarena5a11 +=
                          parseFloat(impuesto["5 a 24 años"]) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (5 a 11 años): ${impuesto["5 a 11 años"]} (acumulado)`
                        );
                      } else if (edadAdulto >= 12 && edadAdulto <= 65) {
                        impuestosHabitacion.cormacarena12a65 +=
                          parseFloat(impuesto["12 a 65 años"]) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (12 a 65 años): ${impuesto["12 a 65 años"]} (acumulado)`
                        );
                      }
                    } else if (nombreImpuesto === "pqsNaturales") {
                      if (esExtranjero) {
                        impuestosHabitacion.pqsNaturalesExtranjero +=
                          parseFloat(impuesto.EXTRANJERO) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (Extranjero): ${impuesto.EXTRANJERO} (acumulado)`
                        );
                      } else if (edadAdulto >= 5 && edadAdulto <= 24) {
                        impuestosHabitacion.pqsNaturales5a24 +=
                          parseFloat(impuesto["5 a 23 años"]) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (5 a 24 años): ${impuesto["5 a 23 años"]} (acumulado)`
                        );
                      } else if (edadAdulto >= 25 && edadAdulto <= 65) {
                        impuestosHabitacion.pqsNaturales25a65 +=
                          parseFloat(impuesto["25 a 65 años"]) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (25 a 65 años): ${impuesto["25 a 65 años"]} (acumulado)`
                        );
                      }
                    } else if (nombreImpuesto === "alcaldia") {
                      if (esExtranjero) {
                        impuestosHabitacion.alcaldiaExtranjero +=
                          parseFloat(impuesto.EXTRANJERO) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (Extranjero): ${impuesto.EXTRANJERO} (acumulado)`
                        );
                      } else if (edadAdulto >= 5 && edadAdulto <= 65) {
                        // Solo para nacionales mayores de 12 años
                        impuestosHabitacion.alcaldiaNacional +=
                          parseFloat(impuesto["12 a 65 años"]) || 0;
                        console.log(
                          `  Impuesto ${nombreImpuesto} (Nacional): ${impuesto["12 a 65 años"]} (acumulado)`
                        );
                      }
                    } else if (nombreImpuesto === "defensaCivil") {
                      // Asumiendo que el impuesto de Defensa Civil se aplica a todos por igual
                      impuestosHabitacion.defensaCivil +=
                        parseFloat(impuesto["5 a 11 años"]) || 0;
                      console.log(
                        `  Impuesto ${nombreImpuesto}: ${impuesto["5 a 11 años"]} (acumulado)`
                      );
                    }
                  }
                }

                // Calcular impuesto para el niño (si existe)
                if (
                  room.childAge &&
                  room.childAge >= 5 &&
                  room.childAge <= 11
                ) {
                  console.log(
                    `Calculando impuestos para el niño (edad: ${room.childAge})`
                  );

                  for (const impuesto of impuestosData) {
                    const nombreImpuesto = impuesto.IMPUESTO;
                    if (nombreImpuesto === "PQS NATURALES") {
                      const valorImpuesto =
                        parseFloat(impuesto["5 a 11 años"]) || 0;
                      impuestosHabitacion.pqsNaturales5a24 += valorImpuesto;
                      console.log(
                        `  Impuesto ${nombreImpuesto} (5 a 24 años): ${valorImpuesto} (acumulado)`
                      );
                    } else if (
                      nombreImpuesto === "ALCALDIA" ||
                      nombreImpuesto === "CORMACARENA"
                    ) {
                      const valorImpuesto =
                        parseFloat(impuesto["5 a 11 años"]) || 0;
                      impuestosHabitacion[`${nombreImpuesto}5a11`] +=
                        valorImpuesto;
                      console.log(
                        `  Impuesto ${nombreImpuesto} (5 a 11 años): ${valorImpuesto} (acumulado)`
                      );
                    } else if (nombreImpuesto === "DEFENSA CIVIL") {
                      const valorImpuesto =
                        parseFloat(impuesto["5 a 11 años"]) || 0;
                      impuestosHabitacion.defensaCivil += valorImpuesto;
                      console.log(
                        `  Impuesto ${nombreImpuesto}: ${valorImpuesto} (acumulado)`
                      );
                    }
                  }
                }
              }

              // Convertir impuestos a null si son 0
              for (const impuesto in impuestosHabitacion) {
                if (impuestosHabitacion[impuesto] === 0) {
                  impuestosHabitacion[impuesto] = null;
                }
              }

              console.log(
                "Impuestos calculados para la habitación:",
                impuestosHabitacion
              ); // Verificar impuestos calculados

              //FIN IMPUESTOS CAÑO CRISTAL
              //suma
              let totalImpuestos = 0;
              for (const impuesto in impuestosHabitacion) {
                totalImpuestos += impuestosHabitacion[impuesto];
              }

              // Add to TotalAcomodacion
              TotalAcomodacion += totalImpuestos;
              valorBrutoTotal += totalImpuestos;
              console.log(
                "TOTALACOMODACION DESPUES DE IMPUESTOS ",
                TotalAcomodacion
              );
              console.log("TOTALBRUTO DESPUES DE IMPUESTOS ", valorBrutoTotal);
              this.habitacionesDatos.push({
                idCotizacion: "",
                adultos: numAdultos,
                niños: numNiños,
                acomodacion: roomAccommodation,
                tipoHabitacion: roomType,

                //preciosTotales
                precioFlayerAdulto: accommodationPriceNumber,
                precioFlayerNino: this.childrenPriceNumber,

                //valores brutos
                precioHabitacionNino: valorBrutoniño,
                precioHabitacionAdulto: valorBrutoAdulto,
                precioHabitacionTotal: valorBrutoTotal,

                //comisionables
                precioComisionableAdulto: ValorComisionableAdultos,
                precioComisionableNino: this.ValorComisionableNiños,

                //descuentos

                valorDescuentoHabitacionNino: this.ValorClienteNiño,

                valorDescuentoHabitacionAdulto: ValorClienteAdulto,
                valorDescuentoCliente: ValorCliente,
                descuento: descuento,

                TotalAcomodacionAdulto: TotalAcomodacionAdulto,
                TotalAcomodacionNino: TotalAcomodacionNiño,
                TotalAcomodacion: TotalAcomodacion,

                //EDADES SOLO SI ES CAÑO CRISTAL
                edadesAdultos: room.adultAges
                  .filter((age) => age !== null)
                  .join(","),
                edadNino: room.childAge !== null ? room.childAge : null,
                extranjero: room.isForeigner // Nuevo campo con la información de extranjeros
                  .map((isForeign) => (isForeign ? "SI" : "NO")) // Convertir a "SI" o "NO"
                  .join(","), // Unir en una cadena separada por comas

                //impuestos:
                defensaCivil: impuestosHabitacion.defensaCivil,

                //2
                alcaldiaNacional: impuestosHabitacion.alcaldiaNacional,
                alcaldiaExtranjero: impuestosHabitacion.alcaldiaExtranjero,

                //3
                pqsNaturalesExtranjero:
                  impuestosHabitacion.pqsNaturalesExtranjero,
                pqsNaturales25a65: impuestosHabitacion.pqsNaturales25a65,
                pqsNaturales5a24: impuestosHabitacion.pqsNaturales5a24,
                //3
                cormacarenaExtranjero:
                  impuestosHabitacion.cormacarenaExtranjero,
                cormacarena5a11: impuestosHabitacion.cormacarena5a11,
                cormacarena12a65: impuestosHabitacion.cormacarena12a65,
                // Agrega otros valores que desees enviar
              });
            } else {
              console.log(
                "No se encontraron datos de precio para esta habitación"
              );
            }
          });
        } catch (error) {
          // Maneja cualquier error que pueda ocurrir durante las solicitudes
          console.log("error");
          this.$q.notify({
            message: "¡Ha ocurrido un error al guardar las habitaciones!",
            color: "negative",
          });
        }
        // fin ciclo de hablitaciones
        //---------------------------------------------------------
        //FIN HABITACIONES

        // Ahora tienes el total de adultos y niños de todos los cuartos
        console.log("Array de habitacionesDatos:", this.habitacionesDatos);

        console.log("Total de adultos:", this.totalAdultos);
        console.log("Total de niños:", this.totalNiños);

        // Iterar sobre el array habitacionesDatos
        this.habitacionesDatos.forEach((habitacion) => {
          // Sumar el valor de TotalAcomodacion de cada habitación a la suma total
          this.sumaTotalAcomodacion += habitacion.TotalAcomodacion;
          this.sumaValorBrutohab += habitacion.precioHabitacionTotal;
          this.sumaTotalDescuento += habitacion.descuento;
        });

        this.sumaValorBrutohab += valorSuplemento;
        this.sumaTotalAcomodacion += valorSuplemento;
        // Imprimir la suma total
        console.log(
          "La suma total de TotalAcomodacion en todas las habitaciones es:",
          this.sumaTotalAcomodacion
        );
        console.log(
          "La suma total de sumaValorBrutohab en todas las habitaciones es:",
          this.sumaValorBrutohab
        );
        console.log(
          "La suma total de descuetno en todas las habitaciones es:",
          this.sumaTotalDescuento
        );

        //SI ES COMISION O NO
        // Variables para almacenar los valores calculados
        let rteFuenteCalculado = null;
        let ivaCalculado = null;
        let rteIcaCalculado = null;
        let totalComision = null;
        if (clienteTipoBase === "Comisión") {
          console.log("si es comison");
          this.total;
          totalComision = this.sumaTotalDescuento;
          if (ivaValor !== null && ivaValor !== 0) {
            // Calcula y redondea el valor de ivaCalculado
            ivaCalculado = Math.round(
              this.sumaTotalDescuento * (ivaValor / 100)
            );
            this.ivaCalculado = ivaCalculado;
            totalComision += ivaCalculado;
          }

          if (rteFuente !== null && rteFuente !== 0) {
            // Calcula y redondea el valor de rteFuenteCalculado
            rteFuenteCalculado = Math.round(
              this.sumaTotalDescuento * (rteFuente / 100)
            );
            this.rteFuenteCalculado = rteFuenteCalculado;
            totalComision -= rteFuenteCalculado;
          }

          if (rteIca !== null && rteIca !== 0) {
            // Calcula y redondea el valor de rteIcaCalculado
            rteIcaCalculado = Math.round(
              this.sumaTotalDescuento * (rteIca / 100)
            );
            this.rteIcaCalculado = rteIcaCalculado;
            totalComision -= rteIcaCalculado;
          }
        }

        // Imprime los valores calculados en la consola
        console.log("this.ivaCalculado", ivaCalculado);
        console.log("this.rteFuenteCalculado", rteFuenteCalculado);
        console.log("this.rteIcaCalculado", rteIcaCalculado);
        console.log("this.totalComision", totalComision);

        //transporte

        const totalPasajeros =
          this.totalAdultos + (this.totalNiños ? this.totalNiños : 0);

        console.log("totalPasajeros", totalPasajeros);

        combus *= totalPasajeros;
        tasa *= totalPasajeros;
        iva *= totalPasajeros;
        ta *= totalPasajeros;
        ivaTa *= totalPasajeros;
        otros *= totalPasajeros;
        precioTrans *= totalPasajeros;
        this.sumaTotalAcomodacion += precioTrans;

        console.log("combus", combus);
        console.log("precioTrans", precioTrans);
        //suma nueva total precioClienteAcomodacion
        if (clienteTipoBase === "Comisión") {
          this.sumaTotalAcomodacion = 0;
          this.sumaTotalAcomodacion = this.sumaValorBrutohab - totalComision;
        }
        //fecha
        const fechaCreacion = new Date();
        fechaCreacion.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00.000
        console.log(fechaCreacion.toISOString().split("T")[0]); // Obtiene solo la parte de la fecha
        //id usuario
        const userData = LocalStorage.getItem("userData");
        console.log(userData);
        let numeroNoches = parseInt(this.noche.value); // Extrae el número usando una expresión regular
        let totalNoche =
          parseInt(numeroNoches) + // Asegúrate de que numeroNoches sea un número válido
          parseInt(this.additionalNightCount ? this.additionalNightCount : 0); // Asegúrate de que additionalNightCount sea un número válido o establece 0 como valor por defecto si no está definido

        // Imprime los valores de numeroNoches y additionalNightCount para depurar
        console.log("numeroNoches:", numeroNoches);
        console.log("additionalNightCount:", this.additionalNightCount);

        console.log("totalNoche:", totalNoche); // Imprime el resultado de la suma

        // SI APLICA RTE FUENTE O NO.

        const formData = {
          // idCotizacion: idCotizacion,
          salida: this.selectedDeparture,
          destino: this.destination,
          nombrePrograma: this.programName,
          noches: totalNoche,
          // plan: this.plan,
          hotel: this.hotel,
          totalAdultos: this.totalAdultos,
          totalNinos: this.totalNiños,
          totalPasajeros: totalPasajeros,
          precioBrutoTotal: this.sumaValorBrutohab,
          totalPrecioCliente: this.sumaTotalAcomodacion,
          valorDescuento: this.sumaTotalDescuento,

          //transporte
          combus: combus,
          tasa: tasa,
          iva: iva,
          ta: ta,
          ivaTa: ivaTa,
          otros: otros,
          precioTrans: precioTrans, // Este es el valor real, no una cadena literal

          suplemento: valorSuplemento,
          totalPrecio: "",
          notas: "",

          // esto siempre va.
          cliente: this.selectedClient,
          clientePorcentaje: clientePorcentaje,
          CreadorCotizacion: userData.id,
          fechaCreacion: fechaCreacion.toISOString().split("T")[0],
          aerolineaIda: this.aerolineaValue1,
          vueloIda: this.vueloValue1,
          horaLlegadaIda: this.horaLlegadaValue1,
          horaSalidaIda: this.horaSalidaValue1,
          claseIda: this.claseValue1,
          fechaInicio: this.dateRange[0],
          aerolineaVuelta: this.aerolineaValue2,
          vueloVuelta: this.vueloValue2,
          horaLlegadaVuelta: this.horaLlegadaValue2,
          horaSalidaVuelta: this.horaSalidaValue2,
          claseVuelta: this.claseValue2,
          fechaFin: this.dateRange[1],

          //valores si es comision
          rteFuente: rteFuenteCalculado,
          ivaValor: ivaCalculado,
          rteIca: rteIcaCalculado,
          totalComision: totalComision,
          correo: this.correo,
        };
        console.log("formData", formData);

        // Realizar la solicitud para guardar la cotización con los precios de las habitaciones
        const cotizacionResponse = await axios.post(
          this.programName !== "Caño Cristales"
            ? "https://backendmultidestinosexpress.onrender.com/cotizacion"
            : "https://backendmultidestinosexpress.onrender.com/cotizacion/c",
          formData
        );
        if (cotizacionResponse.data.success) {
          // Obtener el idCotizacion generado por el backend
          console.log("mirar el numero", cotizacionResponse.data.success);
          console.log("mirar el numero1", cotizacionResponse.data.idCotizacion);
          this.idCotizacion = cotizacionResponse.data.idCotizacion;

          this.$q.notify({
            message: `Cotización guardada con éxito. ID: ${this.idCotizacion}`,
            color: "positive",
          });
          console.log("idCotizacion", this.idCotizacion);
        }
        console.log("Respuesta del servidor:", cotizacionResponse.data);
        console.log("idCotizacion1", this.idCotizacion);

        // Obtener el idCotizacion generado
        // Realizar las solicitudes para guardar las habitaciones
        const habitacionesPromises = this.habitacionesDatos.map(
          async (habitacion) => {
            // Agregar el idCotizacion correspondiente al objeto de la habitación
            habitacion.idCotizacion = this.idCotizacion;

            // Realizar la solicitud POST para guardar los datos de la habitación
            const habitacionResponse = await axios.post(
              "https://backendmultidestinosexpress.onrender.com/habitacionCotizacion/",
              habitacion
            );
            console.log("Respuesta de la habitación:", habitacionResponse.data);

            return habitacionResponse.data; // Retornar la respuesta de la solicitud POST
          }
        );

        const habitacionesResponses = await Promise.all(habitacionesPromises);
        console.log(
          "Respuestas de todas las habitaciones:",
          habitacionesResponses
        );
        // Muestra el mensaje de éxito
        this.$q.notify({
          message: "¡Se ha registrado con éxito!",
          color: "positive",
        });

        this.resetVariables();
        // Llama al método para cerrar el modal
        this.closeModal();
        // Manejar la respuesta del servidor si es necesario
      } catch (error) {
        console.error("Error al guardar la cotización:", error);
        this.resetVariables();

        this.$q.notify({
          message: "¡Ha ocurrido un error al guardar la cotización!",
          color: "negative",
        });
      }
    },
  },
};
</script>



