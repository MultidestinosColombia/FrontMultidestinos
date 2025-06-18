<template>
  <q-page class="q-pa-md">
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
    <!-- Header fuera de la carta -->
    <div class="travel-header">
      <div class="row items-center">
        <div class="col">
          <div class="text-h4 text-weight-bold">
            <q-icon name="flight" class="q-mr-sm" />
            Gestión de Viajes
          </div>
          <div class="text-subtitle1">
            Administra hoteles, transportes y tiquetes de tu agencia
          </div>
        </div>
      </div>
    </div>

    <!-- Todo el contenido dentro de una carta -->
    <q-card class="main-card">
      <!-- Tabs -->
      <q-card-section class="q-pb-none custom-tabs">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-black"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="hoteles" icon="hotel" label="Hoteles" />
          <q-tab name="transportes" icon="directions_car" label="Transportes" />
          <q-tab name="tiquetes" icon="confirmation_number" label="Tiquetes" />
        </q-tabs>
      </q-card-section>

      <!-- Content -->
      <q-card-section class="tab-content">
        <q-tab-panels v-model="activeTab" animated>

          <!-- HOTELES -->
          <q-tab-panel name="hoteles" class="q-pa-none">
            <div class="search-section">
              <div class="row q-gutter-md items-center action-buttons">
                <div class="col-md-4 col-12">
                  <q-input
                    v-model="searchHoteles"
                    outlined
                    placeholder="Buscar hoteles..."
                    dense
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    icon="add"
                    label="Agregar Hotel"
                    @click="Agregar_Hotel"
                    unelevated
                    class="action-btn"
                  />


                </div>
                <div class="col-auto">
                  <q-btn
                    color="green"
                    icon="upload"
                    label="Importar"
                   @click="importarDatos('hoteles')"
                    outline
                    class="action-btn"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="blue"
                    icon="download"
                    label="Exportar"
                    @click="ExportarExcel('hoteles')"
                    outline
                    class="action-btn"
                  />
                </div>
              </div>
            </div>

            <q-card flat bordered class="data-table">
              <q-table
                :rows="filteredHoteles"
                :columns="hotelesColumns"
                row-key="id"
                :loading="loadingHoteles"
                :pagination="{ rowsPerPage: 10 }"
                class="my-sticky-header-table"
              >
                <template v-slot:body-cell-categoria="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-rating
                        :model-value="props.row.categoria"
                        max="5"
                        size="sm"
                        color="amber"
                        readonly
                        class="rating-stars"
                      />
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="blue"
                      icon="edit"
                      size="sm"
                      @click="EditarItem('hotel', props.row)"
                      class="action-btn q-mr-xs"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      size="sm"
                      @click="EliminarItem('hotel', props.row.id)"
                      class="action-btn"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>

          <!-- TRANSPORTES -->
          <q-tab-panel name="transportes" class="q-pa-none">
            <div class="search-section">
              <div class="row q-gutter-md items-center action-buttons">
                <div class="col-md-4 col-12">
                  <q-input
                    v-model="searchTransportes"
                    outlined
                    placeholder="Buscar transportes..."
                    dense
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    icon="add"
                    label="Agregar Transporte"
                    @click="Agregar_Transporte"
                    unelevated
                    class="action-btn"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="green"
                    icon="upload"
                    label="Importar"
                    @click="importarDatos('transportes')"
                    outline
                    class="action-btn"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="blue"
                    icon="download"
                    label="Exportar"
                    @click="ExportarExcel('transportes')"
                    outline
                    class="action-btn"
                  />
                </div>
              </div>
            </div>

            <q-card flat bordered class="data-table">
              <q-table
                :rows="filteredTransportes"
                :columns="transportesColumns"
                row-key="id"
                :loading="loadingTransportes"
                :pagination="{ rowsPerPage: 10 }"
                class="my-sticky-header-table"
              >
                <template v-slot:body-cell-tipo="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-icon
                        :name="props.row.tipo === 'Vuelo' ? 'flight' : 'directions_bus'"
                        :color="props.row.tipo === 'Vuelo' ? 'blue' : 'green'"
                        class="q-mr-sm"
                      />
                      {{ props.row.tipo }}
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="blue"
                      icon="edit"
                      size="sm"
                      @click="EditarItem('transporte', props.row)"
                      class="action-btn q-mr-xs"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      size="sm"
                      @click="EliminarItem('transporte', props.row.id)"
                      class="action-btn"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>

          <!-- TIQUETES -->
          <q-tab-panel name="tiquetes" class="q-pa-none">
            <div class="search-section">
              <div class="row q-gutter-md items-center action-buttons">
                <div class="col-md-4 col-12">
                  <q-input
                    v-model="searchTiquetes"
                    outlined
                    placeholder="Buscar tiquetes..."
                    dense
                    class="form-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
                <div class="col-auto">
                  <q-btn
                    color="primary"
                    icon="add"
                    label="Agregar Tiquete"
                    @click="Agregar_Tiquete"
                    unelevated
                    class="action-btn"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="green"
                    icon="upload"
                    label="Importar"
                    @click="importarDatos('tiquete')"
                    outline
                    class="action-btn"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    color="blue"
                    icon="download"
                    label="Exportar"
                    @click="ExportarExcel('tiquete')"
                    outline
                    class="action-btn"
                  />
                </div>
              </div>
            </div>

            <q-card flat bordered class="data-table">
              <q-table
                :rows="filteredTiquetes"
                :columns="tiquetesColumns"
                row-key="id"
                :loading="loadingTiquetes"
                :pagination="{ rowsPerPage: 10 }"
                class="my-sticky-header-table"
              >
                <template v-slot:body-cell-cliente="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-avatar size="32px" text-color="white" class="q-mr-sm avatar-client">
                        {{ props.row.cliente.charAt(0) }}
                      </q-avatar>
                      {{ props.row.cliente }}
                    </div>
                  </q-td>
                </template>

                <template v-slot:body-cell-acciones="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      round
                      color="blue"
                      icon="edit"
                      size="sm"
                      @click="EditarItem('tiquete', props.row)"
                      class="action-btn q-mr-xs"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      size="sm"
                      @click="EliminarItem('tiquete', props.row.id)"
                      class="action-btn"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import Swal from 'sweetalert2'
import axios from 'axios'



export default {
  setup() {
    const $q = useQuasar()

    // Reactive data
    const activeTab = ref('hoteles')
    const searchHoteles = ref('')
    const searchTransportes = ref('')
    const searchTiquetes = ref('')

    // Loading states
    const loadingListas = ref(false)
    const savingHotel = ref(false)

    // Data
    const hoteles = ref([])
    const transportes = ref([])
    const tiquetes = ref([])
    const formatOrNA = (val) => {
      return isNaN(val) || val === null
        ? "N/A"
        : `$ ${Number(val).toLocaleString('es-CO')} COP`;
    };
    const formatText = (val) => {
      return val && val.trim() !== "" ? val : "N/A";
    };




    // Dialog states
    const showHotelDialog = ref(false)


    // ====================================================================================== Hora y Fecha de la tabla  =========================================================== //

    const formatearFecha = (fecha, opciones = {}) => {
      if (!fecha) return "N/A";

      const date = new Date(fecha);
      if (isNaN(date)) return "N/A";

      const formatoPorDefecto = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      };

      return date.toLocaleDateString("es-ES", { ...formatoPorDefecto, ...opciones });
    };

    // Table columns
    const hotelesColumns = [
      { name: 'pertenece', label: 'Pertenece', field: 'pertenece', align: 'left', format: formatText },
      { name: 'destino', label: 'Destino', field: 'destino', align: 'left', format: formatText },
      { name: 'nombrePrograma', label: 'Nombre del Programa', field: 'nombrePrograma', align: 'center', format: formatText },
      { name: 'hotel', label: 'Hotel', field: 'hotel', align: 'right', format: formatText },
      { name: 'plan', label: 'Plan', field: 'plan', align: 'center', format: formatText },
      { name: 'noches', label: 'Noches', field: 'noches', align: 'left',format: formatText },
      { name: "tipoHabitacion", label: "Tipo de Habitación", field: "tipoHabitacion", format: formatText },
      { name: "sencilla", label: "Sencilla", field: "sencilla", format: formatOrNA},
      { name: "doble", label: "Doble", field: "doble", format: formatOrNA},
      { name: "triple", label: "Triple", field: "triple", format: formatOrNA},
      { name: "cuadruple", label: "cuadruple", field: "cuadruple", format: formatOrNA},
      { name: "quintuple", label: "Quíntuple", field: "quintuple", format: formatOrNA},
      { name: "sextuple", label: "Séxtuple", field: "sextuple", format: formatOrNA},
      { name: "niño", label: "Niño", field: "niño", format: formatOrNA},
      { name: "nocheAdicionalsencilla", label: "Noche Adicional Sencilla", field: "nocheAdicionalsencilla", format: formatOrNA},
      { name: "nocheAdicionaldoble", label: "Noche Adicional Doble", field: "nocheAdicionaldoble", format: formatOrNA},
      { name: "nocheAdicionaltriple", label: "Noche Adicional Triple", field: "nocheAdicionaltriple", format: formatOrNA},
      { name: "nocheAdicionalcuadruple", label: "Noche Adicional Cuádruple", field: "nocheAdicionalcuadruple", format: formatOrNA},
      { name: "nocheAdicionalniño", label: "Noche Adicional Niño", field: "nocheAdicionalniño", format: formatOrNA},
      { name: "incluye", label: "Incluye", field: "incluye", align: "left", format: (val) => (val || "N/A").replace(/¿/g, "<br>"), html: true},
      { name: "noIncluye", label: "No Incluye", field: "noIncluye", align: "left", format: (val) => (val || "N/A").replace(/¿/g, "<br>"),html: true},
      { name: "FechaInicio", label: "Fecha Inicio", field: "FechaInicio", format: formatearFecha },
      { name: "FechaFin", label: "Fecha Fin", field: "FechaFin", format: formatearFecha },
      { name: "acciones", label: "Acciones", field: "acciones" },
    ]

    const transportesColumns = [
      { name: "pertenece",  label: "Pertenece",  field: "pertenece", sortable: true},
      { name: "destino", label: "Destino", field: "destino", sortable: true},
      {name: "combus",label: "Combustible",field: "combus", sortable: true, format: formatOrNA},
      { name: "tasa", label: "Tasa", field: "tasa", sortable: true,format: formatOrNA  },
      { name: "iva", label: "IVA", field: "iva", sortable: true,format: formatOrNA  },
      { name: "ta", label: "TA", field: "ta", sortable: true,format: formatOrNA  },
      { name: "ivaTa", label: "IVA TA", field: "ivaTa", sortable: true,format: formatOrNA  },
      { name: "sencilla_ImpuestoHotel", label: "Sencilla Impuesto Hotel", field: "sencilla_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "doble_ImpuestoHotel", label: "Doble Impuesto Hotel", field: "doble_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "triple_ImpuestoHotel", label: "Triple Impuesto Hotel", field: "triple_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "cuadruple_ImpuestoHotel", label: "Cuadruple Impuesto Hotel", field: "cuadruple_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "quintuple_ImpuestoHotel", label: "Quintuple Impuesto Hotel", field: "quintuple_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "sextuple_ImpuestoHotel", label: "Sextuple Impuesto Hotel", field: "sextuple_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "niño_ImpuestoHotel", label: "niño Impuesto Hotel", field: "niño_ImpuestoHotel", sortable: true,format: formatOrNA  },
      { name: "sencilla_ImpuestoIngr", label: "Sencilla Impuesto Ingr", field: "sencilla_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "doble_ImpuestoIngr", label: "Doble Impuesto Ingr", field: "doble_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "triple_ImpuestoIngr", label: "Triple Impuesto Ingr", field: "triple_ImpuestoIngr", sortable: true },
      { name: "cuadruple_ImpuestoIngr", label: "Cuadruple Impuesto Ingr", field: "cuadruple_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "quintuple_ImpuestoIngr", label: "Quintuple Impuesto Ingr", field: "quintuple_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "sextuple_ImpuestoIngr", label: "Sextuple Impuesto Ingr", field: "sextuple_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "niño_ImpuestoIngr", label: "niño Impuesto Ingr", field: "niño_ImpuestoIngr", sortable: true,format: formatOrNA  },
      { name: "sencilla_Impoconsumo", label: "Sencilla Impoconsumo", field: "sencilla_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "doble_Impoconsumo", label: "Doble Impoconsumo", field: "doble_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "triple_Impoconsumo", label: "Triple Impoconsumo", field: "triple_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "cuadruple_Impoconsumo", label: "Cuadruple Impoconsumo", field: "cuadruple_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "quintuple_Impoconsumo", label: "Quintuple Impoconsumo", field: "quintuple_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "sextuple_Impoconsumo", label: "Sextuple Impoconsumo", field: "sextuple_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "niño_Impoconsumo", label: "niño Impoconsumo", field: "niño_Impoconsumo", sortable: true,format: formatOrNA  },
      { name: "otros", label: "Otros", field: "otros", sortable: true,format: formatOrNA  },
      { name: "total", label: "Total", field: "total", sortable: true,format: formatOrNA  },
      { name: "acciones", label: "Acciones", align: "center" },

    ]

    const tiquetesColumns = [
      { name: "salida", label: "Salida", field: "salida", sortable: true },
      { name: "pertenece", label: "Pertenece", field: "pertenece", sortable: true},
      { name: "neta", label: "Neta", field: "neta", sortable: true, format: formatOrNA },
      { name: "tasas", label: "Tasas", field: "tasas", sortable: true, format: formatOrNA },
      { name: "iva", label: "IVA", field: "iva", sortable: true, format: formatOrNA },
      { name: "total", label: "Total", field: "total", sortable: true, format: formatOrNA },
      { name: "acciones", label: "Acciones", align: "center" },
    ]

    // ====================================================================================== Filtro de las Tablas ============================================================== //
    function useFilteredList(listRef, searchRef, fields) {
      return computed(() => {
        const search = searchRef.value?.toLowerCase().trim();
        if (!search) return listRef.value;

        return listRef.value.filter(item =>
          fields.some(field =>
            (item[field] || "").toString().toLowerCase().includes(search)
          )
        );
      });
    }

    const filteredHoteles = useFilteredList(hoteles, searchHoteles, ['pertenece','hotel', 'destino', 'nombrePrograma', 'plan']);
    const filteredTransportes = useFilteredList(transportes, searchTransportes, ['pertenece', 'destino']);
    const filteredTiquetes = useFilteredList(tiquetes, searchTiquetes, ['salida', 'pertenece']);




    // ====================================================================================== Llamado de datos  =========================================================== //

    const cargarListas = async () => {
      loadingListas.value = true
      try {
        const response = await axios.get('http://localhost:8010/planes/Lista')

        hoteles.value = response.data.hoteles
        transportes.value = response.data.transportes
        tiquetes.value = response.data.tiquetes

      } catch (error) {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar las listas'
        })
      } finally {
        loadingListas.value = false
      }
    }

    // ====================================================================================== Agregar Hotel  =========================================================== //

    const Agregar_Hotel = () => {
      Swal.fire({
        title: '🏨 Agregar Nuevo Hotel',
        html: `
           <style>
          .swal2-popup {
            width: 900px !important;
            max-width: 95vw !important;
            border-radius: 15px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
          }

          .swal2-title {
            color: #2c5aa0 !important;
            font-size: 28px !important;
            font-weight: 700 !important;
            margin-bottom: 25px !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }

          .hotel-form-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            border-radius: 12px;
            margin: 10px 0;
          }

          .form-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-left: 4px solid #3b82f6;
          }

          .section-title {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .section-title::before {
            content: "✈️";
            font-size: 18px;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-label {
            display: block;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .hotel-input {
            width: 100% !important;
            padding: 12px 15px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            background: #fafbfc !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }

          .hotel-input:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            background: white !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            transform: translateY(-1px) !important;
          }

          .hotel-input::placeholder {
            color: #9ca3af !important;
            font-style: italic !important;
          }

          .price-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
          }

          .textarea-field {
            min-height: 80px !important;
            resize: vertical !important;
            font-family: inherit !important;
          }

          .full-width {
            grid-column: 1 / -1;
          }

          .dates-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left-color: #f59e0b;
          }

          .prices-section {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left-color: #10b981;
          }

          .includes-section {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            border-left-color: #6366f1;
          }

          .swal2-confirm {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
            transition: all 0.3s ease !important;
          }

          .swal2-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
          }

          .swal2-cancel {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            margin-right: 15px !important;
          }

          @media (max-width: 768px) {
            .hotel-form-container {
              grid-template-columns: 1fr;
              gap: 15px;
              padding: 15px;
            }

            .price-grid {
              grid-template-columns: 1fr;
            }

            .swal2-popup {
              width: 95vw !important;
            }
          }
        </style>

          <div class="hotel-form-container">
            <!-- Información Básica -->
            <div class="form-section">
              <div class="section-title">Información del Hotel</div>

              <div class="form-group">
                <label class="form-label">Nombre del Pertenece</label>
                <input id="swal-pertenece" class="hotel-input" placeholder="Ej: Bogota">
              </div>

              <div class="form-group">
                <label class="form-label">Nombre del Destino</label>
                <input id="swal-destino" class="hotel-input" placeholder="Ej: Bahia solano">
              </div>

              <div class="form-group">
                <label class="form-label">Nombre del programa</label>
                <input id="swal-nombrePrograma" class="hotel-input" placeholder="Ej: Temporada baja">
              </div>

              <div class="form-group">
                <label class="form-label">Nombre del Hotel</label>
                <input id="swal-hotel" class="hotel-input" placeholder="Ej: Playa de oro">
              </div>

              <div class="form-group">
                <label class="form-label">Tipo de Habitación</label>
                <input id="swal-tipoHabitacion" class="hotel-input" type="text" placeholder="Escribe el tipo de habitación"/>
              </div>

              <div class="form-group">
                <label class="form-label">Plan</label>
                <input id="swal-plan" class="hotel-input" type="text" placeholder="Escribe el tipo de plan"/>
              </div>

              <div class="form-group">
                <label class="form-label">Número de Noches</label>
                <input id="swal-noches" type="number" class="hotel-input" placeholder="Ej: 3" min="1" max="30">
              </div>
            </div>

            <!-- Fechas -->
            <div class="form-section dates-section">
              <div class="section-title">📅 Fechas de Estadía</div>

              <div class="form-group">
                <label class="form-label">Fecha de Entrada</label>
                <input id="swal-FechaInicio" type="date" class="hotel-input">
              </div>

              <div class="form-group">
                <label class="form-label">Fecha de Salida</label>
                <input id="swal-FechaFin" type="date" class="hotel-input">
              </div>
            </div>

            <!-- Precios por Ocupación -->
            <div class="form-section prices-section full-width">
              <div class="section-title">💰 Tarifas por Ocupación (COP)</div>

              <div class="price-grid">
                <div class="form-group">
                  <label class="form-label">Ocupación Sencilla</label>
                  <input id="swal-sencilla" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Ocupación Doble</label>
                  <input id="swal-doble" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Ocupación Triple</label>
                  <input id="swal-triple" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Ocupación Cuádruple</label>
                  <input id="swal-cuadruple" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Tarifa Niño</label>
                  <input id="swal-niño" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Noche Adicional Sencilla</label>
                  <input id="swal-nocheAdicional" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Noche Adicional Doble</label>
                  <input id="swal-nocheAdicional1" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Noche Adicional Triple</label>
                  <input id="swal-nocheAdicional2" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Noche Adicional Cuadruple</label>
                  <input id="swal-nocheAdicional3" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                  <label class="form-label">Noche Adicional Niño</label>
                  <input id="swal-nocheAdicional4" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>
              </div>
            </div>


            <!-- Servicios Incluidos/No Incluidos -->
            <div class="form-section includes-section full-width">
              <div class="section-title">📋 Servicios y Condiciones</div>

              <div class="price-grid">
                <div class="form-group">
                  <label class="form-label">Servicios Incluidos</label>
                  <textarea id="swal-incluye" class="hotel-input textarea-field"
                    placeholder="Ej: Desayuno buffet, WiFi gratuito, Piscina, Gimnasio, Servicio de habitaciones..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">No Incluye / Restricciones</label>
                  <textarea id="swal-noIncluye" class="hotel-input textarea-field"
                    placeholder="Ej: Bebidas alcohólicas, Excursiones, Spa, Llamadas telefónicas..."></textarea>
                </div>
              </div>
            </div>
          </div>
        `,
        width: '900px',
        showCancelButton: true,
        confirmButtonText: '✅ Agregar Hotel',
        cancelButtonText: '❌ Cancelar',
        focusConfirm: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'hotel-popup',
          confirmButton: 'hotel-confirm-btn',
          cancelButton: 'hotel-cancel-btn'
        },
        preConfirm: () => {
          // Validaciones
          const pertenece = document.getElementById('swal-pertenece').value.trim();
          const destino = document.getElementById('swal-destino').value.trim();
          const nombrePrograma = document.getElementById('swal-nombrePrograma').value.trim();
          const hotel = document.getElementById('swal-hotel').value.trim();
          const noches = document.getElementById('swal-noches').value;
          const fechaInicio = document.getElementById('swal-FechaInicio').value;
          const fechaFin = document.getElementById('swal-FechaFin').value;

          if (!pertenece) {
            Swal.showValidationMessage('Por favor ingresa el nombre del hotel');
            return false;
          }

          if (!destino) {
            Swal.showValidationMessage('Por favor ingresa el nombre del hotel');
            return false;
          }

          if (!nombrePrograma) {
            Swal.showValidationMessage('Por favor ingresa el nombre del hotel');
            return false;
          }

          if (!hotel) {
            Swal.showValidationMessage('Por favor ingresa el nombre del hotel');
            return false;
          }

          if (!noches || noches < 1) {
            Swal.showValidationMessage('Por favor ingresa un número válido de noches');
            return false;
          }

          if (!fechaInicio || !fechaFin) {
            Swal.showValidationMessage('Por favor selecciona las fechas de entrada y salida');
            return false;
          }

          if (new Date(fechaInicio) >= new Date(fechaFin)) {
            Swal.showValidationMessage('La fecha de salida debe ser posterior a la fecha de entrada');
            return false;
          }

          return {
            pertenece:document.getElementById('swal-pertenece').value,
            destino:document.getElementById('swal-destino').value,
            nombrePrograma:document.getElementById('swal-nombrePrograma').value,
            hotel: hotel,
            plan: document.getElementById('swal-plan').value,
            noches: Number(noches),
            tipoHabitacion: document.getElementById('swal-tipoHabitacion').value,
            FechaInicio: fechaInicio,
            FechaFin: fechaFin,
            sencilla: Number(document.getElementById('swal-sencilla').value) || 0,
            doble: Number(document.getElementById('swal-doble').value) || 0,
            triple: Number(document.getElementById('swal-triple').value) || 0,
            cuadruple: Number(document.getElementById('swal-cuadruple').value) || 0,
            niño: Number(document.getElementById('swal-niño').value) || 0,
            nocheAdicionalsencilla: Number(document.getElementById('swal-nocheAdicional').value) || 0,
            nocheAdicionaldoble: Number(document.getElementById('swal-nocheAdicional1').value) || 0,
            nocheAdicionaltriple: Number(document.getElementById('swal-nocheAdicional2').value) || 0,
            nocheAdicionalcuadruple: Number(document.getElementById('swal-nocheAdicional3').value) || 0,
            nocheAdicionalniño: Number(document.getElementById('swal-nocheAdicional4').value) || 0,
            incluye: document.getElementById('swal-incluye').value.trim(),
            noIncluye: document.getElementById('swal-noIncluye').value.trim(),
          };
        }
      }).then((result) => {
          if (result.isConfirmed) {
            // Enviar datos al backend con fetch POST
            fetch('http://localhost:8010/planes/Guardar_Hoteles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(result.value)
            })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                // Mostrar resumen con los datos que devolviste (o los mismos ingresados)
                Swal.fire({
                  icon: 'success',
                  title: '¡Hotel Agregado Exitosamente!',
                  html: `
                    <div style="text-align: left; padding: 20px; background: #f8faff; border-radius: 10px; margin: 15px 0;">
                      <h4 style="color: #1e40af; margin-bottom: 15px;">📋 Resumen del Hotel:</h4>
                      <p><strong>🏨 Pertenece:</strong> ${result.value.pertenece}</p>
                      <p><strong>🏨 Destino:</strong> ${result.value.destino}</p>
                      <p><strong>🏨 Nombre del Programa:</strong> ${result.value.nombrePrograma}</p>
                      <p><strong>🏨 Hotel:</strong> ${result.value.hotel}</p>
                      <p><strong>📋 Plan:</strong> ${result.value.plan}</p>
                      <p><strong>🛏️ Tipo de habitación:</strong> ${result.value.tipoHabitacion}</p>
                      <p><strong>🌙 Noches:</strong> ${result.value.noches}</p>
                      <p><strong>📅 Fechas:</strong> ${result.value.FechaInicio} - ${result.value.FechaFin}</p>
                      <hr style="margin: 15px 0;">
                      <p><strong>💰 Sencilla:</strong> $${result.value.sencilla.toLocaleString('es-CO')} COP</p>
                      <p><strong>💰 Doble:</strong> $${result.value.doble.toLocaleString('es-CO')} COP</p>
                      <p><strong>💰 Triple:</strong> $${result.value.triple.toLocaleString('es-CO')} COP</p>
                      <p><strong>💰 Cuádruple:</strong> $${result.value.cuadruple.toLocaleString('es-CO')} COP</p>
                      <p><strong>👶 Niño:</strong> $${result.value.niño.toLocaleString('es-CO')} COP</p>
                      <hr style="margin: 15px 0;">
                      <h5 style="color: #1e40af; margin-bottom: 10px;">➕ Noches adicionales:</h5>
                      <p><strong>Sencilla:</strong> $${result.value.nocheAdicionalsencilla.toLocaleString('es-CO')} COP</p>
                      <p><strong>Doble:</strong> $${result.value.nocheAdicionaldoble.toLocaleString('es-CO')} COP</p>
                      <p><strong>Triple:</strong> $${result.value.nocheAdicionaltriple.toLocaleString('es-CO')} COP</p>
                      <p><strong>Cuádruple:</strong> $${result.value.nocheAdicionalcuadruple.toLocaleString('es-CO')} COP</p>
                      <p><strong>Niño:</strong> $${result.value.nocheAdicionalniño.toLocaleString('es-CO')} COP</p>
                      <hr style="margin: 15px 0;">
                      <p><strong>✅ Incluye:</strong> ${result.value.incluye || 'Sin detalles'}</p>
                      <p><strong>❌ No incluye:</strong> ${result.value.noIncluye || 'Sin detalles'}</p>
                    </div>
                  `,
                  confirmButtonText: '👍 Perfecto',
                  width: '600px',
                  timer: 10000,
                  timerProgressBar: true

                }).then(() => {
                    location.reload(); // ⬅ Aquí recargas la pestaña
                  });
              } else {
                Swal.fire('Error', 'No se pudo guardar el hotel', 'error');
              }
            })
            .catch(() => {
              Swal.fire('Error', 'Error en la conexión al servidor', 'error');
            });
          }
        });
    }

    const closeHotelDialog = () => {
      showHotelDialog.value = false
    }

    // ====================================================================================== Agregar Transporte  =========================================================== //

    const Agregar_Transporte = () => {
      Swal.fire({
        title: '🚌 Agregar Nuevo Transporte',
        html: `
           <style>
           .swal2-popup {
            width: 900px !important;
            max-width: 95vw !important;
            border-radius: 15px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
        }

        .swal2-title {
            color: #2c5aa0 !important;
            font-size: 28px !important;
            font-weight: 700 !important;
            margin-bottom: 25px !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }

        .hotel-form-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            border-radius: 12px;
            margin: 10px 0;
            max-width: 1200px;
            margin: 0 auto;
        }

        .form-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-left: 4px solid #3b82f6;
        }

        .section-title {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title::before {
            content: "✈️";
            font-size: 18px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .hotel-input {
            width: 100% !important;
            padding: 12px 15px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            background: #fafbfc !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        }

        .hotel-input:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            background: white !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            transform: translateY(-1px) !important;
        }

        .hotel-input::placeholder {
            color: #9ca3af !important;
            font-style: italic !important;
        }

        .price-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .hotel-taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .consumption-taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .textarea-field {
            min-height: 80px !important;
            resize: vertical !important;
            font-family: inherit !important;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .dates-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left-color: #f59e0b;
        }

        .prices-section {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left-color: #10b981;
        }

        .includes-section {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            border-left-color: #6366f1;
        }

        .btn-container {
            text-align: center;
            margin-top: 30px;
            grid-column: 1 / -1;
        }

        .btn-submit {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
            transition: all 0.3s ease !important;
            color: white;
            cursor: pointer;
        }

        .btn-submit:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
        }

        .swal2-confirm {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
            transition: all 0.3s ease !important;
        }

        .swal2-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
        }

        .swal2-cancel {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            margin-right: 15px !important;
        }

        .result-container {
            margin-top: 30px;
            padding: 20px;
            background: #e8f5e8;
            border-radius: 10px;
            border-left: 4px solid #28a745;
            display: none;
            grid-column: 1 / -1;
        }

        .result-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #155724;
            margin-bottom: 15px;
        }

        .result-item {
            padding: 5px 0;
            border-bottom: 1px solid #c3e6cb;
        }

        .result-item:last-child {
            border-bottom: none;
        }

        .result-label {
            font-weight: 600;
            color: #155724;
        }

        .result-value {
            color: #155724;
            margin-left: 10px;
        }

        @media (max-width: 768px) {
            .hotel-form-container {
                grid-template-columns: 1fr;
                gap: 15px;
                padding: 15px;
            }

            .price-grid {
                grid-template-columns: 1fr;
            }

            .taxes-grid {
                grid-template-columns: 1fr;
            }

            .hotel-taxes-grid {
                grid-template-columns: 1fr;
            }

            .consumption-taxes-grid {
                grid-template-columns: 1fr;
            }

            .swal2-popup {
                width: 95vw !important;
            }
        }
        </style>

          <div class="hotel-form-container">
        <!-- Información Básica -->
        <div class="form-section">
            <div class="section-title">🏨 Información del Hotel</div>

            <div class="form-group">
                <label class="form-label">Nombre Donde Pertenece</label>
                <input id="swal-pertenece" class="hotel-input" placeholder="Ej: Bogota">
            </div>

            <div class="form-group">
                <label class="form-label">Nombre del Destino</label>
                <input id="swal-destino" class="hotel-input" placeholder="Ej: Bahia solano">
            </div>
        </div>


        <!-- Impuestos y Tasas Generales -->
        <div class="form-section">
            <div class="section-title">📊 Impuestos y Tasas Generales</div>
            <div class="taxes-grid">
                <div class="form-group">
                    <label class="form-label">Combustible</label>
                    <input id="swal-combus" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Tasa</label>
                    <input id="swal-tasa" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">IVA</label>
                    <input id="swal-iva" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">TA (Tasa Aeroportuaria)</label>
                    <input id="swal-ta" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">IVA TA</label>
                    <input id="swal-ivaTa" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Otros</label>
                    <input id="swal-otros" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>
            </div>
        </div>

        <!-- Impuestos de Hotel por Ocupación -->
        <div class="form-section">
            <div class="section-title">🏨 Impuestos de Hotel por Ocupación</div>
            <div class="hotel-taxes-grid">
                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Sencilla</label>
                    <input id="swal-sencilla_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Doble</label>
                    <input id="swal-doble_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Triple</label>
                    <input id="swal-triple_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Cuádruple</label>
                    <input id="swal-cuadruple_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Quíntuple</label>
                    <input id="swal-quintuple_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Séxtuple</label>
                    <input id="swal-sextuple_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Niño</label>
                    <input id="swal-niño_ImpuestoHotel" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>
            </div>
        </div>

         <div class="form-section">
            <div class="section-title">🏨 Impuestos de Hotel por Ingreso</div>
            <div class="hotel-taxes-grid">
              <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Sencilla</label>
                    <input id="swal-sencilla_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Doble</label>
                    <input id="swal-doble_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Triple</label>
                    <input id="swal-triple_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Cuádruple</label>
                    <input id="swal-cuadruple_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Quíntuple</label>
                    <input id="swal-quintuple_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Séxtuple</label>
                    <input id="swal-sextuple_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Hotel - Niño</label>
                    <input id="swal-niño_ImpuestoIngr" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>
          </div>
        </div>

        <!-- Impuestos al Consumo por Ocupación -->
        <div class="form-section">
            <div class="section-title">🛍️ Impuestos al Consumo por Ocupación</div>
            <div class="consumption-taxes-grid">
                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Sencilla</label>
                    <input id="swal-sencilla_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Doble</label>
                    <input id="swal-doble_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Triple</label>
                    <input id="swal-triple_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Cuádruple</label>
                    <input id="swal-cuadruple_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Quíntuple</label>
                    <input id="swal-quintuple_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Séxtuple</label>
                    <input id="swal-sextuple_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>

                <div class="form-group">
                    <label class="form-label">Impuesto Consumo - Niño</label>
                    <input id="swal-niño_Impoconsumo" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                </div>
            </div>
        </div>

        <!-- Total -->
        <div class="form-section">
            <div class="section-title">💯 Total General</div>
            <div class="form-group">
                <label class="form-label">Total Final</label>
                <input id="swal-total" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
            </div>
        </div>
          </div>
        `,
        width: '900px',
        showCancelButton: true,
        confirmButtonText: '✅ Agregar Hotel',
        cancelButtonText: '❌ Cancelar',
        focusConfirm: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'hotel-popup',
          confirmButton: 'hotel-confirm-btn',
          cancelButton: 'hotel-cancel-btn'
        },
        preConfirm: () => {
      // 1. RECOPILAR TODOS LOS DATOS
        const formData = {
          pertenece: document.getElementById('swal-pertenece').value.trim(),
          destino: document.getElementById('swal-destino').value.trim(),
          combus: Number(document.getElementById('swal-combus').value) || 0,
          tasa: Number(document.getElementById('swal-tasa').value) || 0,
          iva: Number(document.getElementById('swal-iva').value) || 0,
          ta: Number(document.getElementById('swal-ta').value) || 0,
          ivaTa: Number(document.getElementById('swal-ivaTa').value) || 0,
          sencilla_ImpuestoHotel: Number(document.getElementById('swal-sencilla_ImpuestoHotel').value) || 0,
          doble_ImpuestoHotel: Number(document.getElementById('swal-doble_ImpuestoHotel').value) || 0,
          triple_ImpuestoHotel: Number(document.getElementById('swal-triple_ImpuestoHotel').value) || 0,
          cuadruple_ImpuestoHotel: Number(document.getElementById('swal-cuadruple_ImpuestoHotel').value) || 0,
          quintuple_ImpuestoHotel: Number(document.getElementById('swal-quintuple_ImpuestoHotel').value) || 0,
          sextuple_ImpuestoHotel: Number(document.getElementById('swal-sextuple_ImpuestoHotel').value) || 0,
          niño_ImpuestoHotel: Number(document.getElementById('swal-niño_ImpuestoHotel').value) || 0,
          sencilla_ImpuestoIngr: Number(document.getElementById('swal-sencilla_ImpuestoIngr').value) || 0,
          doble_ImpuestoIngr: Number(document.getElementById('swal-doble_ImpuestoIngr').value) || 0,
          triple_ImpuestoIngr: Number(document.getElementById('swal-triple_ImpuestoIngr').value) || 0,
          cuadruple_ImpuestoIngr: Number(document.getElementById('swal-cuadruple_ImpuestoIngr').value) || 0,
          quintuple_ImpuestoIngr: Number(document.getElementById('swal-quintuple_ImpuestoIngr').value) || 0,
          sextuple_ImpuestoIngr: Number(document.getElementById('swal-sextuple_ImpuestoIngr').value) || 0,
          niño_ImpuestoIngr: Number(document.getElementById('swal-niño_ImpuestoIngr').value) || 0,
          sencilla_Impoconsumo: Number(document.getElementById('swal-sencilla_Impoconsumo').value) || 0,
          doble_Impoconsumo: Number(document.getElementById('swal-doble_Impoconsumo').value) || 0,
          triple_Impoconsumo: Number(document.getElementById('swal-triple_Impoconsumo').value) || 0,
          cuadruple_Impoconsumo: Number(document.getElementById('swal-cuadruple_Impoconsumo').value) || 0,
          quintuple_Impoconsumo: Number(document.getElementById('swal-quintuple_Impoconsumo').value) || 0,
          sextuple_Impoconsumo: Number(document.getElementById('swal-sextuple_Impoconsumo').value) || 0,
          niño_Impoconsumo: Number(document.getElementById('swal-niño_Impoconsumo').value) || 0,
          otros: Number(document.getElementById('swal-otros').value) || 0,
          total: Number(document.getElementById('swal-total').value) || 0
        };

        // 2. DEBUG: MOSTRAR DATOS EN CONSOLA
        console.log('📊 DATOS DEL FORMULARIO:');
        console.log('========================');
        console.table(formData);

        // 3. DEBUG: MOSTRAR JSON QUE SE ENVIARÁ
        console.log('📤 JSON A ENVIAR:');
        console.log(JSON.stringify(formData, null, 2));

        // 4. VALIDACIONES (las que ya tienes)
        if (!formData.pertenece) {
          console.error('❌ Error: Campo "pertenece" vacío');
          Swal.showValidationMessage('Por favor ingresa el campo "pertenece"');
          return false;
        }

        if (!formData.destino) {
          console.error('❌ Error: Campo "destino" vacío');
          Swal.showValidationMessage('Por favor ingresa el campo "destino"');
          return false;
        }

        // Validaciones numéricas básicas
        const requiredFields = ['combus', 'tasa', 'iva', 'ta', 'ivaTa'];
        for (const field of requiredFields) {
          if (isNaN(formData[field])) {
            console.error(`❌ Error: Campo "${field}" no es un número válido`);
            Swal.showValidationMessage(`Por favor ingresa un valor numérico válido para "${field}"`);
            return false;
          }
        }

        console.log('✅ Validaciones pasadas correctamente');
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('🚀 INICIANDO ENVÍO AL SERVIDOR...');
        console.log('URL:', 'http://localhost:8010/planes/Guardar_Transporte');
        console.log('Método:', 'POST');
        console.log('Headers:', { 'Content-Type': 'application/json' });
        console.log('Body:', JSON.stringify(result.value, null, 2));

        // Mostrar loading
        Swal.fire({
          title: 'Enviando datos...',
          html: 'Por favor espera mientras se procesan los datos',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Enviar datos al backend
        fetch('http://localhost:8010/planes/Guardar_Transporte', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(result.value)
        })
        .then(response => {
          console.log('📨 RESPUESTA DEL SERVIDOR:');
          console.log('Status:', response.status);
          console.log('Status Text:', response.statusText);
          console.log('Headers:', [...response.headers.entries()]);

          // Verificar si la respuesta es exitosa
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          console.log('✅ DATOS RECIBIDOS DEL SERVIDOR:');
          console.log(data);

          if (data.success) {
            // Éxito
            Swal.fire({
              icon: 'success',
              title: '¡Hotel Agregado Exitosamente!',
              html: `
                <div style="text-align: left; padding: 20px; background: #f8faff; border-radius: 10px; margin: 15px 0;">
                  <h4 style="color: #1e40af; margin-bottom: 15px;">📋 Resumen del Hotel:</h4>
                  <p><strong>🏨 Pertenece:</strong> ${result.value.pertenece}</p>
                  <p><strong>📍 Destino:</strong> ${result.value.destino}</p>
                  <hr style="margin: 15px 0;">
                  <p><strong>⛽ Combustible:</strong> $${Number(result.value.combus).toLocaleString('es-CO')} COP</p>
                  <p><strong>💸 Tasa administrativa:</strong> $${Number(result.value.tasa).toLocaleString('es-CO')} COP</p>
                  <p><strong>📊 IVA:</strong> $${Number(result.value.iva).toLocaleString('es-CO')} COP</p>
                  <p><strong>💼 TA:</strong> $${Number(result.value.ta).toLocaleString('es-CO')} COP</p>
                  <p><strong>📈 IVA TA:</strong> $${Number(result.value.ivaTa).toLocaleString('es-CO')} COP</p>
                  <p><strong>🧮 Otros cargos:</strong> $${Number(result.value.otros).toLocaleString('es-CO')} COP</p>
                  <p><strong>💵 Total:</strong> <span style="color: #10b981;">$${Number(result.value.total).toLocaleString('es-CO')} COP</span></p>
                </div>
              `,
              confirmButtonText: '👍 Perfecto',
              width: '600px',
              timer: 10000,
              timerProgressBar: true
            }).then(() => {
              location.reload();
            });
          } else {
            console.error('❌ El servidor respondió con success: false');
            console.error('Mensaje del servidor:', data.message || 'Sin mensaje específico');
            Swal.fire('Error', data.message || 'No se pudo guardar el hotel', 'error');
          }
        })
        .catch(error => {
          console.error('💥 ERROR EN LA PETICIÓN:');
          console.error('Tipo de error:', error.name);
          console.error('Mensaje:', error.message);
          console.error('Stack trace:', error.stack);

          // Mostrar diferentes tipos de errores
          let errorMessage = 'Error desconocido';

          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'No se pudo conectar al servidor. Verifica si el backend está ejecutándose.';
          } else if (error.message.includes('HTTP error')) {
            errorMessage = `Error del servidor: ${error.message}`;
          } else if (error.name === 'SyntaxError') {
            errorMessage = 'La respuesta del servidor no es JSON válido';
          } else {
            errorMessage = error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error en la conexión',
            html: `
              <div style="text-align: left;">
                <p><strong>Mensaje:</strong> ${errorMessage}</p>
                <p><strong>Detalles técnicos:</strong> ${error.message}</p>
                <hr>
                <p><em>Revisa la consola del navegador para más información</em></p>
              </div>
            `,
            width: '500px'
          });
        });
      }
    });
  }

    // ====================================================================================== Agregar tiquete  =========================================================== //

    const Agregar_Tiquete = () => {
      Swal.fire({
        title: '🛫 Agregar Nuevo Tiquete',
        html: `
           <style>
           .swal2-popup {
            width: 900px !important;
            max-width: 95vw !important;
            border-radius: 15px !important;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
        }

        .swal2-title {
            color: #2c5aa0 !important;
            font-size: 28px !important;
            font-weight: 700 !important;
            margin-bottom: 25px !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }

        .hotel-form-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
            background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            border-radius: 12px;
            margin: 10px 0;
            max-width: 1200px;
            margin: 0 auto;
        }

        .form-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-left: 4px solid #3b82f6;
        }

        .section-title {
            color: #1e40af;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .section-title::before {
            content: "✈️";
            font-size: 18px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .hotel-input {
            width: 100% !important;
            padding: 12px 15px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            transition: all 0.3s ease !important;
            background: #fafbfc !important;
            box-sizing: border-box !important;
            margin: 0 !important;
        }

        .hotel-input:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
            background: white !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            transform: translateY(-1px) !important;
        }

        .hotel-input::placeholder {
            color: #9ca3af !important;
            font-style: italic !important;
        }

        .price-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .hotel-taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .consumption-taxes-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
        }

        .textarea-field {
            min-height: 80px !important;
            resize: vertical !important;
            font-family: inherit !important;
        }

        .full-width {
            grid-column: 1 / -1;
        }

        .dates-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left-color: #f59e0b;
        }

        .prices-section {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border-left-color: #10b981;
        }

        .includes-section {
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            border-left-color: #6366f1;
        }

        .btn-container {
            text-align: center;
            margin-top: 30px;
            grid-column: 1 / -1;
        }

        .btn-submit {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
            transition: all 0.3s ease !important;
            color: white;
            cursor: pointer;
        }

        .btn-submit:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
        }

        .swal2-confirm {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important;
            transition: all 0.3s ease !important;
        }

        .swal2-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6) !important;
        }

        .swal2-cancel {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            margin-right: 15px !important;
        }

        .result-container {
            margin-top: 30px;
            padding: 20px;
            background: #e8f5e8;
            border-radius: 10px;
            border-left: 4px solid #28a745;
            display: none;
            grid-column: 1 / -1;
        }

        .result-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #155724;
            margin-bottom: 15px;
        }

        .result-item {
            padding: 5px 0;
            border-bottom: 1px solid #c3e6cb;
        }

        .result-item:last-child {
            border-bottom: none;
        }

        .result-label {
            font-weight: 600;
            color: #155724;
        }

        .result-value {
            color: #155724;
            margin-left: 10px;
        }

        @media (max-width: 768px) {
            .hotel-form-container {
                grid-template-columns: 1fr;
                gap: 15px;
                padding: 15px;
            }

            .price-grid {
                grid-template-columns: 1fr;
            }

            .taxes-grid {
                grid-template-columns: 1fr;
            }

            .hotel-taxes-grid {
                grid-template-columns: 1fr;
            }

            .consumption-taxes-grid {
                grid-template-columns: 1fr;
            }

            .swal2-popup {
                width: 95vw !important;
            }
        }
        </style>

          <div class="hotel-form-container">
        <!-- Información Básica -->
        <div class="form-section">
            <div class="section-title">🏨 Información del Hotel</div>

            <div class="form-group">
                <label class="form-label">Nombre Donde Pertenece</label>
                <input id="swal-salida" class="hotel-input" placeholder="Ej: Bogota">
            </div>

            <div class="form-group">
                <label class="form-label">Nombre del Destino</label>
                <input id="swal-pertenece" class="hotel-input" placeholder="Ej: Bahia solano">
            </div>
        </div>


        <!-- Impuestos y Tasas Generales -->
        <div class="form-section">
            <div class="section-title">📊 Impuestos y Tasas Generales</div>
            <div class="taxes-grid">
                  <div class="form-group">
                      <label class="form-label">Neta</label>
                      <input id="swal-neta" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                  </div>

                  <div class="form-group">
                      <label class="form-label">Tasas</label>
                      <input id="swal-tasas" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                  </div>

                  <div class="form-group">
                      <label class="form-label">IVA </label>
                      <input id="swal-iva" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                  </div>

                  <div class="form-group">
                      <label class="form-label">Total 💯</label>
                      <input id="swal-total" type="number" class="hotel-input" placeholder="$0" step="100" min="0">
                  </div>
              </div>
          </div>
          </div>
        `,
        width: '900px',
        showCancelButton: true,
        confirmButtonText: '✅ Agregar Hotel',
        cancelButtonText: '❌ Cancelar',
        focusConfirm: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'hotel-popup',
          confirmButton: 'hotel-confirm-btn',
          cancelButton: 'hotel-cancel-btn'
        },
        preConfirm: () => {
      // 1. RECOPILAR TODOS LOS DATOS
        const formData = {
          salida: document.getElementById('swal-salida').value.trim(),
          pertenece: document.getElementById('swal-pertenece').value.trim(),
          neta: Number(document.getElementById('swal-neta').value) || 0,
          tasas: Number(document.getElementById('swal-tasas').value) || 0,
          iva: Number(document.getElementById('swal-iva').value) || 0,
          total: Number(document.getElementById('swal-total').value) || 0
        };

        // 2. DEBUG: MOSTRAR DATOS EN CONSOLA
        console.log('📊 DATOS DEL FORMULARIO:');
        console.log('========================');
        console.table(formData);

        // 3. DEBUG: MOSTRAR JSON QUE SE ENVIARÁ
        console.log('📤 JSON A ENVIAR:');
        console.log(JSON.stringify(formData, null, 2));

        // 4. VALIDACIONES (las que ya tienes)
        if (!formData.salida) {
          console.error('❌ Error: Campo "salida" vacío');
          Swal.showValidationMessage('Por favor ingresa el campo "salida"');
          return false;
        }

        if (!formData.pertenece) {
          console.error('❌ Error: Campo "pertenece" vacío');
          Swal.showValidationMessage('Por favor ingresa el campo "pertenece"');
          return false;
        }

        // Validaciones numéricas básicas
       const requiredFields = ['neta', 'tasas', 'iva', 'total'];
        for (const field of requiredFields) {
          if (isNaN(formData[field])) {
            console.error(`❌ Error: Campo "${field}" no es un número válido`);
            Swal.showValidationMessage(`Por favor ingresa un valor numérico válido para "${field}"`);
            return false;
          }
        }


        console.log('✅ Validaciones pasadas correctamente');
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('🚀 INICIANDO ENVÍO AL SERVIDOR...');
        console.log('URL:', 'http://localhost:8010/planes/Guardar_Tiquete');
        console.log('Método:', 'POST');
        console.log('Headers:', { 'Content-Type': 'application/json' });
        console.log('Body:', JSON.stringify(result.value, null, 2));

        // Mostrar loading
        Swal.fire({
          title: 'Enviando datos...',
          html: 'Por favor espera mientras se procesan los datos',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Enviar datos al backend
        fetch('http://localhost:8010/planes/Guardar_Tiquete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(result.value)
        })
        .then(response => {
          console.log('📨 RESPUESTA DEL SERVIDOR:');
          console.log('Status:', response.status);
          console.log('Status Text:', response.statusText);
          console.log('Headers:', [...response.headers.entries()]);

          // Verificar si la respuesta es exitosa
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          console.log('✅ DATOS RECIBIDOS DEL SERVIDOR:');
          console.log(data);

          if (data.success) {
            // Éxito
            Swal.fire({
              icon: 'success',
              title: '¡Hotel Agregado Exitosamente!',
              html: `
                <div style="text-align: left; padding: 20px; background: #f8faff; border-radius: 10px; margin: 15px 0;">
                  <h4 style="color: #1e40af; margin-bottom: 15px;">📋 Resumen del Hotel:</h4>
                  <p><strong>🚌 Salida:</strong> ${result.value.salida}</p>
                  <p><strong>🏨 Pertenece:</strong> ${result.value.pertenece}</p>
                  <hr style="margin: 15px 0;">
                  <p><strong>💵 Neta:</strong> $${Number(result.value.neta).toLocaleString('es-CO')} COP</p>
                  <p><strong>💸 Tasas:</strong> $${Number(result.value.tasas).toLocaleString('es-CO')} COP</p>
                  <p><strong>📊 IVA:</strong> $${Number(result.value.iva).toLocaleString('es-CO')} COP</p>
                  <p><strong>🧮 Total:</strong> <span style="color: #10b981;">$${Number(result.value.total).toLocaleString('es-CO')} COP</span></p>
                </div>
              `,
              confirmButtonText: '👍 Perfecto',
              width: '600px',
              timer: 10000,
              timerProgressBar: true
            }).then(() => {
              location.reload();
            });
          } else {
            console.error('❌ El servidor respondió con success: false');
            console.error('Mensaje del servidor:', data.message || 'Sin mensaje específico');
            Swal.fire('Error', data.message || 'No se pudo guardar el hotel', 'error');
          }
        })
        .catch(error => {
          console.error('💥 ERROR EN LA PETICIÓN:');
          console.error('Tipo de error:', error.name);
          console.error('Mensaje:', error.message);
          console.error('Stack trace:', error.stack);

          // Mostrar diferentes tipos de errores
          let errorMessage = 'Error desconocido';

          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'No se pudo conectar al servidor. Verifica si el backend está ejecutándose.';
          } else if (error.message.includes('HTTP error')) {
            errorMessage = `Error del servidor: ${error.message}`;
          } else if (error.name === 'SyntaxError') {
            errorMessage = 'La respuesta del servidor no es JSON válido';
          } else {
            errorMessage = error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Error en la conexión',
            html: `
              <div style="text-align: left;">
                <p><strong>Mensaje:</strong> ${errorMessage}</p>
                <p><strong>Detalles técnicos:</strong> ${error.message}</p>
                <hr>
                <p><em>Revisa la consola del navegador para más información</em></p>
              </div>
            `,
            width: '500px'
          });
        });
      }
    });
  }

    // ============================================================================= Eliminar un Item dependiendo el tipo ======================================================================= //

    const EliminarItem = async (tipo, id) => {
      const nombres = {
        hotel: 'Hotel',
        transporte: 'Transporte',
        tiquete: 'Tiquete'
      }

      if (!nombres[tipo]) {
        $q.notify({
          type: 'warning',
          message: 'Tipo inválido para eliminar'
        })
        return
      }

      const result = await Swal.fire({
        title: `¿Estás seguro de eliminar el ${nombres[tipo]}?`,
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (!result.isConfirmed) return

      // ⚠️ Agregamos logs de depuración
      console.log('🧪 Eliminando tipo:', tipo)
      console.log('🆔 ID a eliminar:', id)

      const url = `http://localhost:8010/planes/eliminar/${tipo}/${id}`
      console.log('📡 Enviando DELETE a:', url)

      try {
        await axios.delete(url)

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: `${nombres[tipo]} eliminado correctamente`,
          timer: 2000,
          showConfirmButton: false
        })

        cargarListas() // refresca la lista después de eliminar
      } catch (error) {
        console.error('❌ Error en la solicitud DELETE:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al eliminar el ${nombres[tipo]}`
        })
      }
    }


    // ==============================================================================Importar los Datos de los Exceles  ========================================================================== //


   const importarDatos = (tipo) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.xlsx,.xls'
      input.style.display = 'none'

      input.addEventListener('change', async (event) => {
        const archivo = event.target.files[0]
        if (!archivo) return

        const tiposValidos = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ]

        if (!tiposValidos.includes(archivo.type)) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Solo se permiten archivos Excel (.xlsx, .xls)'
          })
          return
        }

        const formData = new FormData()
        formData.append('archivo', archivo)
        formData.append('tipo', tipo)

        try {
          Swal.fire({
            title: `Importando ${tipo}...`,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          })

          const response = await axios.post('http://localhost:8010/planes/importarDatos', formData)
          const resultado = response.data

          if (!resultado.success) {
            throw new Error(resultado.message || 'Error en la importación')
          }

          const { insertados, actualizados, eliminados, errores } = resultado.resultados

          // Mensaje más detallado
          let mensaje = `Procesamiento completado:\n`
          mensaje += `• ${insertados} registros insertados\n`
          mensaje += `• ${actualizados} registros actualizados\n`
          mensaje += `• ${eliminados} registros eliminados`

          if (errores?.length) {
            mensaje += `\n• ${errores.length} filas con errores (ver consola)`
            console.warn('Errores de importación:', errores)
          }

          Swal.fire({
            icon: 'success',
            title: 'Importación Exitosa',
            text: mensaje,
            width: 400
          })

        } catch (error) {
          console.error('Error en importación:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error en la Importación',
            text: error.response?.data?.message || error.message
          })
        }
      })

      document.body.appendChild(input)
      input.click()
      document.body.removeChild(input)
    }






       // =========================================================================================================================================================== //

    const ExportarExcel = (tipo) => {
      const url = `http://localhost:8010/planes/exportarDatos?tipo=${tipo}`;
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tipo}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

     //========================================================================================================================================== //


    //=========================================================== Editar dependiendo la tabla en la que estes  ============================== //

    const EditarItem = async (tipo, data = null) => {
      if (!data || !data.id) {
        Swal.fire('Error', 'ID no válido para editar', 'error');
        return;
      }

      try {
        // 1. Obtener datos del backend por ID
        const res = await fetch(`http://localhost:8010/planes/${tipo}/${data.id}`);
        const resultado = await res.json();

        if (!resultado.success) throw new Error('No se pudo obtener el item');

        const item = resultado.data;

        // 2. Mostrar formulario con los datos cargados
        const { value: formData } = await Swal.fire({
          title: `Editar ${tipo}`,
          html: getFormHtml(tipo, item),
          focusConfirm: false,
          width: '600px',
          confirmButtonText: 'Guardar',
          preConfirm: () => {
            if (tipo === 'hotel') {
              return {
                pertenece: document.getElementById('pertenece')?.value,
                destino: document.getElementById('destino')?.value,
                nombrePrograma: document.getElementById('nombrePrograma')?.value,
                hotel: document.getElementById('hotel')?.value,
                plan: document.getElementById('plan')?.value,
                noches: parseInt(document.getElementById('noches')?.value),
                tipoHabitacion: document.getElementById('tipoHabitacion')?.value,
                sencilla: parseFloat(document.getElementById('sencilla')?.value),
                doble: parseFloat(document.getElementById('doble')?.value),
                triple: parseFloat(document.getElementById('triple')?.value),
                cuadruple: parseFloat(document.getElementById('cuadruple')?.value),
                quintuple: parseFloat(document.getElementById('quintuple')?.value),
                sextuple: parseFloat(document.getElementById('sextuple')?.value),
                niño: parseFloat(document.getElementById('niño')?.value),
                nocheAdicionalsencilla: parseFloat(document.getElementById('nocheAdicionalsencilla')?.value),
                nocheAdicionaldoble: parseFloat(document.getElementById('nocheAdicionaldoble')?.value),
                nocheAdicionaltriple: parseFloat(document.getElementById('nocheAdicionaltriple')?.value),
                nocheAdicionalcuadruple: parseFloat(document.getElementById('nocheAdicionalcuadruple')?.value),
                nocheAdicionalniño: parseFloat(document.getElementById('nocheAdicionalniño')?.value),
                incluye: document.getElementById('incluye')?.value,
                noIncluye: document.getElementById('noIncluye')?.value,
                FechaInicio: document.getElementById('FechaInicio')?.value,
                FechaFin: document.getElementById('FechaFin')?.value
              };
            }

            if (tipo === 'tiquete') {
              return {
                salida: document.getElementById('salida')?.value,
                pertenece: document.getElementById('pertenece')?.value,
                neta: parseFloat(document.getElementById('neta')?.value),
                tasas: parseFloat(document.getElementById('tasas')?.value),
                iva: parseFloat(document.getElementById('iva')?.value),
                total: parseFloat(document.getElementById('total')?.value)
              };
            }

            if (tipo === 'transporte') {
              return {
                pertenece: document.getElementById('pertenece')?.value,
                destino: document.getElementById('destino')?.value,
                combus: parseFloat(document.getElementById('combus')?.value),
                tasa: parseFloat(document.getElementById('tasa')?.value),
                iva: parseFloat(document.getElementById('iva')?.value),
                ta: parseFloat(document.getElementById('ta')?.value),
                ivaTa: parseFloat(document.getElementById('ivaTa')?.value),
                sencilla_ImpuestoHotel: parseFloat(document.getElementById('sencilla_ImpuestoHotel')?.value),
                doble_ImpuestoHotel: parseFloat(document.getElementById('doble_ImpuestoHotel')?.value),
                triple_ImpuestoHotel: parseFloat(document.getElementById('triple_ImpuestoHotel')?.value),
                cuadruple_ImpuestoHotel: parseFloat(document.getElementById('cuadruple_ImpuestoHotel')?.value),
                quintuple_ImpuestoHotel: parseFloat(document.getElementById('quintuple_ImpuestoHotel')?.value),
                sextuple_ImpuestoHotel: parseFloat(document.getElementById('sextuple_ImpuestoHotel')?.value),
                niño_ImpuestoIngr: parseFloat(document.getElementById('niño_ImpuestoIngr')?.value),
                sencilla_Impoconsumo: parseFloat(document.getElementById('sencilla_Impoconsumo')?.value),
                doble_Impoconsumo: parseFloat(document.getElementById('doble_Impoconsumo')?.value),
                triple_Impoconsumo: parseFloat(document.getElementById('triple_Impoconsumo')?.value),
                cuadruple_Impoconsumo: parseFloat(document.getElementById('cuadruple_Impoconsumo')?.value),
                quintuple_Impoconsumo: parseFloat(document.getElementById('quintuple_Impoconsumo')?.value),
                sextuple_Impoconsumo: parseFloat(document.getElementById('sextuple_Impoconsumo')?.value),
                niño_Impoconsumo: parseFloat(document.getElementById('niño_Impoconsumo')?.value),
                otros: document.getElementById('otros')?.value,
                total: parseFloat(document.getElementById('total')?.value)
              };
            }

            return null;
          }
        });

        // 3. Enviar los cambios al backend
        if (formData) {
          const updateRes = await fetch(`http://localhost:8010/planes/${tipo}/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });

          const updateResult = await updateRes.json();

         if (updateResult.success) {
            Swal.fire('Actualizado', `${tipo} actualizado correctamente`, 'success').then(() => {
              location.reload(); // recarga la página después de cerrar la alerta
            });
          } else {
            Swal.fire('Error', 'No se pudo actualizar', 'error');
          }
        }
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    };


    function getFormHtml(tipo, item) {
      const baseStyles = `
        <style>
          .travel-form {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: auto;
            padding: 30px;
            background: linear-gradient(135deg, #1fa2ff 0%, #12d8fa 50%, #a6ffcb 100%);
            border-radius: 16px;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow-y: auto;
          }

          .form-header {
            text-align: center;
            margin-bottom: 35px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4);
          }

          .form-header h3 {
            margin: 0;
            font-size: 30px;
            font-weight: 700;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
          }

          .form-header .icon {
            font-size: 40px;
            margin-bottom: 10px;
            display: block;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
          }

          .form-section {
            background: rgba(255, 255, 255, 0.15);
            padding: 20px;
            border-radius: 12px;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }

          .section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 18px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 3px solid #ffd700;
            padding-bottom: 8px;
          }

          .input-group {
            margin-bottom: 16px;
          }

          .input-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #f9f9f9;
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }

          .travel-input,
          .travel-textarea,
          .travel-select {
            width: 100%;
            padding: 14px 16px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            font-size: 15px;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }

          .travel-input:focus,
          .travel-textarea:focus,
          .travel-select:focus {
            background: #fff;
            transform: translateY(-2px);
            box-shadow: 0 0 10px #ffd700, 0 5px 20px rgba(0, 0, 0, 0.3);
            outline: 2px solid #ffd700;
          }

          .travel-textarea {
            min-height: 100px;
            resize: vertical;
          }

          .full-width {
            grid-column: 1 / -1;
          }

          .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .three-col {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }

          .price-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 15px;
          }

          .currency-symbol {
            position: relative;
          }

          .currency-symbol::before {
            content: '$';
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            font-weight: bold;
            font-size: 16px;
          }

          .currency-symbol input {
            padding-left: 36px !important;
          }

          @media (max-width: 992px) {
            .form-grid {
              grid-template-columns: 1fr;
            }

            .two-col, .three-col, .price-grid {
              grid-template-columns: 1fr;
            }
          }

        </style>
      `;

      if (tipo === 'hotel') {
        return baseStyles + `
          <div class="travel-form">
            <div class="form-header">
              <span class="icon">🏨</span>
              <h3>Editar Hotel</h3>
            </div>

            <div class="form-grid">
              <div class="form-section">
                <div class="section-title">📋 Información General</div>
                <div class="input-group">
                  <label class="input-label">Pertenece a</label>
                  <input id="pertenece" class="travel-input" value="${item.pertenece || ''}">
                </div>
                <div class="two-col">
                  <div class="input-group">
                    <label class="input-label">Destino</label>
                    <input id="destino" class="travel-input" value="${item.destino || ''}">
                  </div>
                  <div class="input-group">
                    <label class="input-label">Noches</label>
                    <input id="noches" class="travel-input" type="number" min="1" value="${item.noches || 1}">
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Nombre del Programa</label>
                  <input id="nombrePrograma" class="travel-input" value="${item.nombrePrograma || ''}">
                </div>
                <div class="two-col">
                  <div class="input-group">
                    <label class="input-label">Hotel</label>
                    <input id="hotel" class="travel-input" value="${item.hotel || ''}">
                  </div>
                  <div class="input-group">
                    <label class="input-label">Plan</label>
                    <input id="plan" class="travel-input" value="${item.plan || ''}">
                  </div>
                </div>
                <div class="input-group">
                  <label class="input-label">Tipo de Habitación</label>
                  <input id="tipoHabitacion" class="travel-input" value="${item.tipoHabitacion || ''}">
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">💰 Tarifas por Habitación</div>
                <div class="price-grid">
                  <div class="input-group currency-symbol">
                    <label class="input-label">Sencilla</label>
                    <input id="sencilla" class="travel-input" type="number" min="0" step="0.01" value="${item.sencilla || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Doble</label>
                    <input id="doble" class="travel-input" type="number" min="0" step="0.01" value="${item.doble || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Triple</label>
                    <input id="triple" class="travel-input" type="number" min="0" step="0.01" value="${item.triple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Cuádruple</label>
                    <input id="cuadruple" class="travel-input" type="number" min="0" step="0.01" value="${item.cuadruple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Quíntuple</label>
                    <input id="quintuple" class="travel-input" type="number" min="0" step="0.01" value="${item.quintuple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Séxtuple</label>
                    <input id="sextuple" class="travel-input" type="number" min="0" step="0.01" value="${item.sextuple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Niño</label>
                    <input id="niño" class="travel-input" type="number" min="0" step="0.01" value="${item.niño || 0}">
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">🌙 Noches Adicionales</div>
                <div class="price-grid">
                  <div class="input-group currency-symbol">
                    <label class="input-label">Sencilla</label>
                    <input id="nocheAdicionalsencilla" class="travel-input" type="number" min="0" step="0.01" value="${item.nocheAdicionalsencilla || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Doble</label>
                    <input id="nocheAdicionaldoble" class="travel-input" type="number" min="0" step="0.01" value="${item.nocheAdicionaldoble || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Triple</label>
                    <input id="nocheAdicionaltriple" class="travel-input" type="number" min="0" step="0.01" value="${item.nocheAdicionaltriple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Cuádruple</label>
                    <input id="nocheAdicionalcuadruple" class="travel-input" type="number" min="0" step="0.01" value="${item.nocheAdicionalcuadruple || 0}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Niño</label>
                    <input id="nocheAdicionalniño" class="travel-input" type="number" min="0" step="0.01" value="${item.nocheAdicionalniño || 0}">
                  </div>
                </div>
              </div>

              <div class="form-section full-width">
                <div class="section-title">📅 Fechas del Programa</div>
                <div class="two-col">
                  <div class="input-group">
                    <label class="input-label">Fecha de Inicio</label>
                    <input id="FechaInicio" class="travel-input" type="date" value="${item.FechaInicio || ''}">
                  </div>
                  <div class="input-group">
                    <label class="input-label">Fecha de Fin</label>
                    <input id="FechaFin" class="travel-input" type="date" value="${item.FechaFin || ''}">
                  </div>
                </div>
              </div>

              <div class="form-section full-width">
                <div class="section-title">📝 Detalles del Paquete</div>
                <div class="two-col">
                  <div class="input-group">
                    <label class="input-label">Incluye</label>
                    <textarea id="incluye" class="travel-textarea" placeholder="Especifica qué incluye el paquete...">${item.incluye || ''}</textarea>
                  </div>
                  <div class="input-group">
                    <label class="input-label">No Incluye</label>
                    <textarea id="noIncluye" class="travel-textarea" placeholder="Especifica qué NO incluye el paquete...">${item.noIncluye || ''}</textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (tipo === 'tiquete') {
        return baseStyles + `
          <div class="travel-form">
            <div class="form-header">
              <span class="icon">✈️</span>
              <h3>Editar Tiquete Aéreo</h3>
            </div>

            <div class="form-grid">
              <div class="form-section">
                <div class="section-title">🛫 Información del Vuelo</div>
                <div class="input-group">
                  <label class="input-label">Ciudad de Salida</label>
                  <input id="salida" class="travel-input" value="${item.salida || ''}" placeholder="Ej: Bogotá, Medellín, Cali...">
                </div>
                <div class="input-group">
                  <label class="input-label">Pertenece a</label>
                  <input id="pertenece" class="travel-input" value="${item.pertenece || ''}" placeholder="Paquete o programa asociado">
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">💳 Desglose de Costos</div>
                <div class="input-group currency-symbol">
                  <label class="input-label">Tarifa Neta</label>
                  <input id="neta" class="travel-input" type="number" min="0" step="0.01" value="${item.neta || ''}">
                </div>
                <div class="input-group currency-symbol">
                  <label class="input-label">Tasas Aeroportuarias</label>
                  <input id="tasas" class="travel-input" type="number" min="0" step="0.01" value="${item.tasas || ''}">
                </div>
                <div class="input-group currency-symbol">
                  <label class="input-label">IVA</label>
                  <input id="iva" class="travel-input" type="number" min="0" step="0.01" value="${item.iva || ''}">
                </div>
                <div class="input-group currency-symbol" style="border-top: 2px solid #ffd700; padding-top: 15px; margin-top: 15px;">
                  <label class="input-label" style="color: #ffd700; font-size: 14px;">Total Final</label>
                  <input id="total" class="travel-input" type="number" min="0" step="0.01" value="${item.total || ''}" style="font-weight: bold; font-size: 16px;">
                </div>
              </div>
            </div>
          </div>
        `;
      }

      if (tipo === 'transporte') {
        return baseStyles + `
          <div class="travel-form">
            <div class="form-header">
              <span class="icon">🚌</span>
              <h3>Editar Transporte</h3>
            </div>

            <div class="form-grid">
              <div class="form-section">
                <div class="section-title">🚗 Información General</div>
                <div class="input-group">
                  <label class="input-label">Pertenece a</label>
                  <input id="pertenece" class="travel-input" value="${item.pertenece || ''}">
                </div>
                <div class="input-group">
                  <label class="input-label">Destino</label>
                  <input id="destino" class="travel-input" value="${item.destino || ''}">
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">⛽ Costos Base</div>
                <div class="two-col">
                  <div class="input-group currency-symbol">
                    <label class="input-label">Combustible</label>
                    <input id="combus" class="travel-input" type="number" min="0" step="0.01" value="${item.combus || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Tasa</label>
                    <input id="tasa" class="travel-input" type="number" min="0" step="0.01" value="${item.tasa || ''}">
                  </div>
                </div>
                <div class="two-col">
                  <div class="input-group currency-symbol">
                    <label class="input-label">IVA</label>
                    <input id="iva" class="travel-input" type="number" min="0" step="0.01" value="${item.iva || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">TA</label>
                    <input id="ta" class="travel-input" type="number" min="0" step="0.01" value="${item.ta || ''}">
                  </div>
                </div>
                <div class="input-group currency-symbol">
                  <label class="input-label">IVA TA</label>
                  <input id="ivaTa" class="travel-input" type="number" min="0" step="0.01" value="${item.ivaTa || ''}">
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">🏨 Impuesto Hotelero</div>
                <div class="price-grid">
                  <div class="input-group currency-symbol">
                    <label class="input-label">Sencilla</label>
                    <input id="sencilla_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.sencilla_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Doble</label>
                    <input id="doble_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.doble_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Triple</label>
                    <input id="triple_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.triple_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Cuádruple</label>
                    <input id="cuadruple_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.cuadruple_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Quíntuple</label>
                    <input id="quintuple_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.quintuple_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Séxtuple</label>
                    <input id="sextuple_ImpuestoHotel" class="travel-input" type="number" min="0" step="0.01" value="${item.sextuple_ImpuestoHotel || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Niño (Ing.)</label>
                    <input id="niño_ImpuestoIngr" class="travel-input" type="number" min="0" step="0.01" value="${item.niño_ImpuestoIngr || ''}">
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">🛍️ Impuesto al Consumo</div>
                <div class="price-grid">
                  <div class="input-group currency-symbol">
                    <label class="input-label">Sencilla</label>
                    <input id="sencilla_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.sencilla_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Doble</label>
                    <input id="doble_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.doble_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Triple</label>
                    <input id="triple_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.triple_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Cuádruple</label>
                    <input id="cuadruple_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.cuadruple_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Quíntuple</label>
                    <input id="quintuple_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.quintuple_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Séxtuple</label>
                    <input id="sextuple_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.sextuple_Impoconsumo || ''}">
                  </div>
                  <div class="input-group currency-symbol">
                    <label class="input-label">Niño</label>
                    <input id="niño_Impoconsumo" class="travel-input" type="number" min="0" step="0.01" value="${item.niño_Impoconsumo || ''}">
                  </div>
                </div>
              </div>

              <div class="form-section full-width">
                <div class="section-title">📋 Información Adicional</div>
                <div class="two-col">
                  <div class="input-group">
                    <label class="input-label">Otros Conceptos</label>
                    <textarea id="otros" class="travel-textarea" placeholder="Describe otros costos o servicios incluidos...">${item.otros || ''}</textarea>
                  </div>
                  <div class="input-group currency-symbol" style="display: flex; flex-direction: column; justify-content: center;">
                    <label class="input-label" style="color: #ffd700; font-size: 16px;">Total General</label>
                    <input id="total" class="travel-input" type="number" min="0" step="0.01" value="${item.total || ''}" style="font-weight: bold; font-size: 18px; border: 2px solid #ffd700;">
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="travel-form">
          <div class="form-header">
            <span class="icon">❓</span>
            <h3>Formulario no disponible</h3>
          </div>
          <p style="text-align: center; padding: 40px;">El formulario para "${tipo}" aún no está disponible.</p>
        </div>
      `;
    }

    //========================================================================================================================================== //






    // Lifecycle
    onMounted(() => {
      cargarListas ()
    })

    return {
      activeTab,
      searchHoteles,
      searchTransportes,
      searchTiquetes,
      loadingListas,
      savingHotel,
      hoteles,
      transportes,
      tiquetes,
      showHotelDialog,
      hotelesColumns,
      transportesColumns,
      tiquetesColumns,
      filteredHoteles,
      filteredTransportes,
      filteredTiquetes,





      Agregar_Hotel,
      EditarItem,
      closeHotelDialog,
      EliminarItem,
      importarDatos,
      ExportarExcel,
      Agregar_Transporte,
      Agregar_Tiquete,

    }
  }
}
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
  filter: brightness(0.9) contrast(1.2); /* Video más brillante y visible */
}


.travel-header {
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.08); /* Mucho más transparente */

  border: 1px solid rgba(255, 255, 255, 0.15);
}

.travel-header .text-h4 {
  color: rgb(55, 0, 253) !important;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0); /* Sombra más fuerte para mejor legibilidad */
}

.travel-header .text-subtitle1 {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.main-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.25); /* Mucho más transparente */

  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-tabs {
  background: rgba(248, 249, 255, 0.15); /* Mucho más transparente */

  border-bottom: 1px solid rgba(224, 231, 255, 0.3);
}

.custom-tabs .q-tab {
  font-weight: 500;
  padding: 16px 24px;
  transition: all 0.3s ease;
}

.custom-tabs .q-tab:hover {
  background: rgba(102, 126, 234, 0.1);
}

.tab-content {
  padding: 24px;
  background: rgba(250, 251, 255, 0.1); /* Casi transparente */

}

.search-section {
  background: rgba(255, 255, 255, 0.2); /* Más transparente */

  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.action-buttons .q-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  padding: 8px 16px;

}

.data-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.2); /* Mucho más transparente */

  border: 1px solid rgba(255, 255, 255, 0.25);
}

.data-table .q-table__top {
  background: rgba(248, 249, 255, 0.15);

  border-bottom: 2px solid rgba(224, 231, 255, 0.4);
}

.data-table thead th {
  background: rgba(248, 249, 255, 0.15);

  font-weight: 600;
  color: #4c63d2;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8); /* Sombra blanca para mejor legibilidad */
  border-bottom: 2px solid rgba(224, 231, 255, 0.4);
}

.data-table tbody tr {
  background: rgba(255, 255, 255, 0.1); /* Muy transparente */

}

.data-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.15);

}

.data-table tbody td {
  border-bottom: 1px solid rgba(240, 244, 255, 0.3);
  color: #1a202c;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); /* Sombra para mejor legibilidad */
}

.rating-stars {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.avatar-client {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-card {
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.98);

  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dialog-header {
  background: rgba(251, 251, 251, 0.95);

  border-bottom: 1px solid rgba(224, 231, 255, 0.8);
}

.form-input {
  border-radius: 8px;
}

.form-input .q-field__control {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3); /* Más transparente */

  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Animaciones suaves */
.q-tab-panel {
  transition: all 0.3s ease;
}

.q-btn {
  transition: all 0.2s ease;
}

.q-card {
  transition: box-shadow 0.3s ease;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .travel-header {
    padding: 16px;
    margin-bottom: 16px;
  }

  .tab-content {
    padding: 16px;
  }

  .search-section {
    padding: 16px;
  }
}

/* Status indicators */
.status-active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);

  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-inactive {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.15);

  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* Icon improvements */
.q-icon {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

/* Custom scrollbar for tables */
.q-table__container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.q-table__container::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.7);
  border-radius: 3px;
}

.q-table__container::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.8);
  border-radius: 3px;
}

.q-table__container::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.9);
}

/* Efecto adicional para mejorar la visibilidad del video */
.q-page {
  position: relative;
}

/* Overlay sutil para mejorar el contraste cuando sea necesario */
.q-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05); /* Overlay muy muy sutil */
  z-index: -1;
  pointer-events: none;
}
.my-sticky-header-table {
  border: 5px solid black;
  border-radius: 8px;
  overflow: hidden; /* para evitar que el contenido sobresalga */
}



</style>
