<template>
  <q-page class="cotizaciones-page">
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
    <!-- Header Principal -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">Módulo de Cotizaciones</h1>
            <p class="page-subtitle">Gestión integral de cotizaciones empresarial</p>
          </div>
          <div class="header-stats">
            <div class="stat-card">
              <div class="stat-number">{{ totalCotizaciones }}</div>
              <div class="stat-label">Total Cotizaciones</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ formatearMonto(montoTotal) }}</div>
              <div class="stat-label">Valor Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs de Cotizaciones -->
    <div class="container">
      <q-tabs
        v-model="tabActual"
        class="cotizaciones-tabs"
        indicator-color="primary"
        active-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="normales" label="Cotizaciones Normales" icon="receipt_long" />
        <q-tab name="cristal" label="Caño Cristal" icon="window" />
        <q-tab name="personalizadas" label="Personalizadas" icon="tune" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tabActual" animated class="tab-panels">

        <!-- Panel Cotizaciones Normales -->
        <q-tab-panel name="normales" class="tab-panel">
          <div class="section-header">
            <div class="section-title">
              <q-icon name="receipt_long" size="md" color="primary" />
              <h2>Cotizaciones Normales</h2>
            </div>
            <q-btn
              @click="abrirFormularioNormal"
              color="primary"
              icon="add"
              label="Nueva Cotización"
              unelevated
              class="action-btn"
            />
          </div>

          <q-card class="data-card">
            <q-card-section class="card-header">
              <div class="card-title">
                <q-icon name="list" />
                <span>Listado de Cotizaciones Normales</span>
              </div>
              <q-btn
                @click="() => cargarCotizaciones('normales')"
                icon="refresh"
                flat
                round
                color="primary"
                :loading="loading.normales"
              />
            </q-card-section>

            <q-separator />

            <q-table
              :rows="cotizacionesNormales"
              :columns="columnasNormales"
              row-key="id"
              :loading="loading.normales"
              :pagination="paginacion"
              class="cotizaciones-table"
              flat
              :bordered="false"
            >
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getEstadoColor(props.value)"
                    text-color="white"
                    :label="props.value"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-total="props">
                <q-td :props="props" class="text-right">
                  <span class="total-amount">${{ formatearMonto(props.value) }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <div class="action-buttons">
                    <q-btn
                      @click="verDetalle(props.row, 'normal')"
                      icon="visibility"
                      color="primary"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Ver detalle</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="editarCotizacion(props.row, 'normal')"
                      icon="edit"
                      color="warning"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="eliminarCotizacion(props.row.id, 'normal')"
                      icon="delete"
                      color="negative"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="no-data">
                  <q-icon name="receipt_long" size="4em" color="grey-4" />
                  <div class="no-data-text">No hay cotizaciones normales registradas</div>
                  <q-btn
                    @click="abrirFormularioNormal"
                    color="primary"
                    label="Crear primera cotización"
                    outline
                    class="q-mt-md"
                  />
                </div>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- Panel Caño Cristal -->
        <q-tab-panel name="cristal" class="tab-panel">
          <div class="section-header">
            <div class="section-title">
              <q-icon name="window" size="md" color="secondary" />
              <h2>Cotizaciones Caño Cristal</h2>
            </div>
            <q-btn
              @click="abrirFormularioCristal"
              color="secondary"
              icon="add"
              label="Nueva Cotización"
              unelevated
              class="action-btn"
            />
          </div>

          <q-card class="data-card">
            <q-card-section class="card-header">
              <div class="card-title">
                <q-icon name="list" />
                <span>Listado de Cotizaciones Caño Cristal</span>
              </div>
              <q-btn
                @click="() => cargarCotizaciones('cristal')"
                icon="refresh"
                flat
                round
                color="secondary"
                :loading="loading.cristal"
              />
            </q-card-section>

            <q-separator />

            <q-table
              :rows="cotizacionesCristal"
              :columns="columnasCristal"
              row-key="id"
              :loading="loading.cristal"
              :pagination="paginacion"
              class="cotizaciones-table"
              flat
            >
              <template v-slot:body-cell-dimensiones="props">
                <q-td :props="props">
                  {{ props.row.alto }}cm x {{ props.row.ancho }}cm
                </q-td>
              </template>

              <template v-slot:body-cell-grosor="props">
                <q-td :props="props">
                  <q-chip
                    color="info"
                    text-color="white"
                    :label="`${props.value}mm`"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getEstadoColor(props.value)"
                    text-color="white"
                    :label="props.value"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-total="props">
                <q-td :props="props" class="text-right">
                  <span class="total-amount">${{ formatearMonto(props.value) }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <div class="action-buttons">
                    <q-btn
                      @click="verDetalle(props.row, 'cristal')"
                      icon="visibility"
                      color="primary"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Ver detalle</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="editarCotizacion(props.row, 'cristal')"
                      icon="edit"
                      color="warning"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="eliminarCotizacion(props.row.id, 'cristal')"
                      icon="delete"
                      color="negative"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="no-data">
                  <q-icon name="window" size="4em" color="grey-4" />
                  <div class="no-data-text">No hay cotizaciones de caño cristal registradas</div>
                  <q-btn
                    @click="abrirFormularioCristal"
                    color="secondary"
                    label="Crear primera cotización"
                    outline
                    class="q-mt-md"
                  />
                </div>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>

        <!-- Panel Personalizadas -->
        <q-tab-panel name="personalizadas" class="tab-panel">
          <div class="section-header">
            <div class="section-title">
              <q-icon name="tune" size="md" color="accent" />
              <h2>Cotizaciones Personalizadas</h2>
            </div>
            <q-btn
              @click="abrirFormularioPersonalizada"
              color="accent"
              icon="add"
              label="Nueva Cotización"
              unelevated
              class="action-btn"
            />
          </div>

          <q-card class="data-card">
            <q-card-section class="card-header">
              <div class="card-title">
                <q-icon name="list" />
                <span>Listado de Cotizaciones Personalizadas</span>
              </div>
              <q-btn
                @click="() => cargarCotizaciones('personalizadas')"
                icon="refresh"
                flat
                round
                color="accent"
                :loading="loading.personalizadas"
              />
            </q-card-section>

            <q-separator />

            <q-table
              :rows="cotizacionesPersonalizadas"
              :columns="columnasPersonalizadas"
              row-key="id"
              :loading="loading.personalizadas"
              :pagination="paginacion"
              class="cotizaciones-table"
              flat
            >
              <template v-slot:body-cell-categoria="props">
                <q-td :props="props">
                  <q-chip
                    color="purple"
                    text-color="white"
                    :label="props.value"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="getEstadoColor(props.value)"
                    text-color="white"
                    :label="props.value"
                    size="sm"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-total="props">
                <q-td :props="props" class="text-right">
                  <span class="total-amount">${{ formatearMonto(props.value) }}</span>
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <div class="action-buttons">
                    <q-btn
                      @click="verDetalle(props.row, 'personalizada')"
                      icon="visibility"
                      color="primary"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Ver detalle</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="editarCotizacion(props.row, 'personalizada')"
                      icon="edit"
                      color="warning"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      @click="eliminarCotizacion(props.row.id, 'personalizada')"
                      icon="delete"
                      color="negative"
                      flat
                      round
                      size="sm"
                      dense
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="no-data">
                  <q-icon name="tune" size="4em" color="grey-4" />
                  <div class="no-data-text">No hay cotizaciones personalizadas registradas</div>
                  <q-btn
                    @click="abrirFormularioPersonalizada"
                    color="accent"
                    label="Crear primera cotización"
                    outline
                    class="q-mt-md"
                  />
                </div>
              </template>
            </q-table>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import Swal from 'sweetalert2'


export default {
  setup() {
    const $q = useQuasar()

    const tabActual = ref('normales')
    const cotizacionesNormales = ref([])
    const cotizacionesCristal = ref([])
    const cotizacionesPersonalizadas = ref([])

    const loading = ref({
      normales: false,
      cristal: false,
      personalizadas: false
    })

    const paginacion = ref({
      page: 1,
      rowsPerPage: 10,
      sortBy: 'fechaCreacion',
      descending: true
    })

    const totalCotizaciones = computed(() => {
      if (tabActual.value === 'normales') return cotizacionesNormales.value.length
      if (tabActual.value === 'cristal') return cotizacionesCristal.value.length
      if (tabActual.value === 'personalizadas') return cotizacionesPersonalizadas.value.length
      return 0
    })

    const montoTotal = computed(() => {
      let array = []
      let campo = ''

      if (tabActual.value === 'normales') {
        array = cotizacionesNormales.value
        campo = 'totalPrecioCliente'
      }

      if (tabActual.value === 'cristal') {
        array = cotizacionesCristal.value
        campo = 'total'
      }

      if (tabActual.value === 'personalizadas') {
        array = cotizacionesPersonalizadas.value
        campo = 'precioFinal'
      }

      return array.reduce((sum, item) => sum + (item[campo] || 0), 0)
    })

    const columnasNormales = [
      { name: 'status', label: 'Estado', field: 'status', align: 'left', sortable: true },
      { name: 'idCotizacion', label: 'ID De La Cotizacion', field: 'idCotizacion', align: 'left', sortable: true },
      { name: 'fechaCreacion', label: 'Fecha De Creacion', field: 'fechaCreacion', align: 'left', sortable: true, format: val => val ? val.split('T')[0] : '' },
      { name: 'area', label: 'Area', field: 'area', align: 'left', sortable: true },
      { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'center', sortable: true },
      { name: 'precioBrutoTotal', label: 'Precio Bruto Total', field: 'precioBrutoTotal', align: 'center', sortable: true, format: val => Number(val).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' COP'},
      { name: 'totalPrecioCliente', label: 'Precio al Cliente', field: 'totalPrecioCliente', align: 'right', sortable: true, format: val => Number(val).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' COP'},
      { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
    ]

    const columnasCristal = [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'cliente', label: 'Cliente', field: 'cliente_nombre', align: 'left', sortable: true },
      { name: 'tipo_cristal', label: 'Tipo Cristal', field: 'tipo_cristal', align: 'left', sortable: true },
      { name: 'dimensiones', label: 'Dimensiones', field: 'dimensiones', align: 'center' },
      { name: 'grosor', label: 'Grosor', field: 'grosor', align: 'center', sortable: true },
      { name: 'cantidad', label: 'Piezas', field: 'cantidad', align: 'center', sortable: true },
      { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
      { name: 'fecha', label: 'Fecha', field: 'fecha_creacion', align: 'center', sortable: true, format: val => new Date(val).toLocaleDateString() },
      { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
      { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
    ]

    const columnasPersonalizadas = [
      { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
      { name: 'cliente', label: 'Cliente', field: 'cliente_nombre', align: 'left', sortable: true },
      { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
      { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'center', sortable: true },
      { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
      { name: 'fecha', label: 'Fecha', field: 'fecha_creacion', align: 'center', sortable: true, format: val => new Date(val).toLocaleDateString() },
      { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true },
      { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
    ]

    const formatearMonto = (val) =>
      Number(val).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }) + ' COP'

    const getEstadoColor = (status) => {
      const colores = {
        'Pendiente': 'orange',
        'Aprobado': 'green',
        'Rechazada': 'red',
        'En Proceso': 'blue',
        'Completada': 'positive'
      }
      return colores[status] || 'grey'
    }

    const cargarCotizaciones = async (tipo) => {
      loading.value[tipo] = true
      try {
        const response = await api.post('https://backmultidestinos.onrender.com/cotizacion/cotizaciones', { tipo })
        if (tipo === 'normales') cotizacionesNormales.value = response.data
        if (tipo === 'cristal') cotizacionesCristal.value = response.data
        if (tipo === 'personalizadas') cotizacionesPersonalizadas.value = response.data
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Error al cargar cotizaciones ${tipo}`,
          position: 'top'
        })
        console.error(error)
      } finally {
        loading.value[tipo] = false
      }
    }


    const Cargar_Datos_Backend = async ({ destino = '', hotel = '', cliente = false, asesor = false, start = '', end = '', soloNoches = false } = {}) => {
          try {
            const body = {};

            if (cliente === true) {
              body.cliente = true; // para obtener lista de clientes
            } else if (typeof cliente === 'string') {
              body.cliente = cliente; // para obtener correo de un cliente
            }

            if (asesor === true) {
              body.asesor = true;
            }

            if (hotel) {
              body.hotel = hotel;
            }

            if (soloNoches && hotel) {
              body.hotel = hotel;
              body.soloNoches = true;
            }

            if (destino) {
              body.destino = destino;
            }

            if (start && end) {
              body.start = start;
              body.end = end;
            }

            const response = await api.post('https://backmultidestinos.onrender.com/cotizacion/lista', body);
            return response.data;
          } catch (error) {
            console.error('Error al cargar datos:', error);
            return {};
          }
    };






    const abrirFormularioNormal = async () => {
      const { value: formValues } = await Swal.fire({
        title: '<div style="color: #4A5568; font-size: 24px; font-weight: 600; margin-bottom: 10px;">✈️ Nueva Cotización</div>',
        html: `
          <style>
            .cotizacion-container {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              max-height: 80vh;
              overflow-y: auto;
              padding: 0;
              margin: 0;
            }

            .header-gradient {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
              padding: 25px;
              border-radius: 15px 15px 0 0;
              color: white;
              text-align: center;
              position: relative;
              overflow: hidden;
            }

            .header-gradient::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="90" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
              animation: float 20s ease-in-out infinite;
            }

            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }

            .header-content {
              position: relative;
              z-index: 1;
            }

            .company-title {
              font-size: 26px;
              font-weight: 700;
              margin: 0;
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
              letter-spacing: -0.5px;
            }

            .company-subtitle {
              font-size: 16px;
              margin: 8px 0 0 0;
              opacity: 0.95;
              font-weight: 400;
            }

            .form-content {
              padding: 30px;
              background: #fafbfc;
            }

            .section-card {
              background: white;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 20px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              border: 1px solid rgba(0, 0, 0, 0.04);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            .section-card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              background: linear-gradient(180deg, #667eea, #764ba2);
              border-radius: 0 2px 2px 0;
            }

            .section-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            }

            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #2d3748;
              margin: 0 0 20px 0;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .section-icon {
              width: 24px;
              height: 24px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
            }

            .icon-general { background: linear-gradient(135deg, #667eea, #764ba2); }
            .icon-hotel { background: linear-gradient(135deg, #48bb78, #38a169); }
            .icon-flight { background: linear-gradient(135deg, #ed8936, #dd6b20); }
            .icon-client { background: linear-gradient(135deg, #9f7aea, #805ad5); }
            .icon-money { background: linear-gradient(135deg, #38b2ac, #319795); }

            .form-grid {
              display: grid;
              gap: 20px;
            }

            .grid-2 { grid-template-columns: 1fr 1fr; }
            .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
            .grid-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

            .form-group {
              position: relative;
            }

            .form-label {
              display: block;
              font-size: 14px;
              font-weight: 500;
              color: #4a5568;
              margin-bottom: 8px;
              transition: color 0.2s ease;
            }

            .form-input, .form-select {
              width: 100%;
              padding: 12px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 14px;
              transition: all 0.3s ease;
              background: white;
              color: #2d3748;
              box-sizing: border-box;
            }

            .form-input:focus, .form-select:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              transform: translateY(-1px);
            }

            .form-input::placeholder {
              color: #a0aec0;
              font-style: italic;
            }

            .form-textarea {
              width: 100%;
              padding: 12px 16px;
              border: 2px solid #e2e8f0;
              border-radius: 10px;
              font-size: 14px;
              transition: all 0.3s ease;
              background: white;
              color: #2d3748;
              min-height: 80px;
              resize: vertical;
              font-family: inherit;
              box-sizing: border-box;
            }

            .form-textarea:focus {
              outline: none;
              border-color: #667eea;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .checkbox-group {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
            }

            .checkbox-custom {
              width: 20px;
              height: 20px;
              border: 2px solid #e2e8f0;
              border-radius: 6px;
              position: relative;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .checkbox-custom input {
              opacity: 0;
              position: absolute;
              width: 100%;
              height: 100%;
              margin: 0;
              cursor: pointer;
            }

            .checkbox-custom input:checked + .checkmark {
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-color: #667eea;
            }

            .checkmark {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              border-radius: 4px;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
            }

            .checkbox-custom input:checked + .checkmark::after {
              content: '✓';
              font-weight: bold;
            }

            .checkbox-label {
              font-size: 14px;
              font-weight: 500;
              color: #4a5568;
              cursor: pointer;
              user-select: none;
            }

            .flight-section {
              background: #f8fafc;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 16px;
              border-left: 4px solid #ed8936;
            }

            .flight-title {
              font-size: 16px;
              font-weight: 600;
              color: #2d3748;
              margin: 0 0 16px 0;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .escala-section {
              background: linear-gradient(135deg, #fff5f5, #fed7d7);
              border-radius: 12px;
              padding: 20px;
              margin-top: 16px;
              border: 2px dashed #fc8181;
              display: none;
            }

            .escala-section.show {
              display: block;
              animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                max-height: 0;
              }
              to {
                opacity: 1;
                max-height: 500px;
              }
            }

            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
              margin: 20px 0;
            }

            .highlight-box {
              background: linear-gradient(135deg, #667eea10, #764ba210);
              border: 1px solid #667eea30;
              border-radius: 10px;
              padding: 16px;
              margin: 16px 0;
            }

            /* Scrollbar personalizado */
            .cotizacion-container::-webkit-scrollbar {
              width: 6px;
            }

            .cotizacion-container::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }

            .cotizacion-container::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 3px;
            }

            /* Animaciones de entrada */
            .section-card {
              animation: fadeInUp 0.5s ease forwards;
              opacity: 0;
              transform: translateY(20px);
            }

            .section-card:nth-child(1) { animation-delay: 0.1s; }
            .section-card:nth-child(2) { animation-delay: 0.2s; }
            .section-card:nth-child(3) { animation-delay: 0.3s; }
            .section-card:nth-child(4) { animation-delay: 0.4s; }
            .section-card:nth-child(5) { animation-delay: 0.5s; }

            @keyframes fadeInUp {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          </style>

          <div class="cotizacion-container">
            <!-- Header con gradiente -->
            <div class="header-gradient">
              <div class="header-content">
                <h1 class="company-title">✈️ Multidestinos Express</h1>
                <p class="company-subtitle">Gestión integral de cotizaciones empresarial</p>
              </div>
            </div>

            <div class="form-content">
              <!-- Sección: Información General -->
              <div class="section-card">
                <h3 class="section-title">
                  <span class="section-icon icon-general">📋</span>
                  Información General del Viaje
                </h3>

                <div class="form-grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Fecha de Inicio</label>
                    <input type="date" id="fechaInicio" class="form-input">
                  </div>

                  <div class="form-group">
                    <label class="form-label">Fecha de Finalización</label>
                    <input type="date" id="fechaFin" class="form-input">
                  </div>
                </div>

                <div class="divider"></div>

                <div class="form-grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Ciudad de Salida</label>
                    <select id="ciudadSalida" class="form-select" style="width: 100%; padding: 8px;">
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Destino Principal</label>
                    <select id="destino" class="form-select"></select>
                  </div>
                </div>
              </div>

              <!-- Sección: Alojamiento -->
              <div class="section-card">
                <h3 class="section-title">
                  <span class="section-icon icon-hotel">🏨</span>
                  Información de Alojamiento
                </h3>

                <div class="form-grid grid-2">
                  <div class="form-group">
                    <label class="form-label" for="hotel">Selecciona un Hotel</label>
                    <select id="hotel" class="form-input"></select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Número de Habitaciones</label>
                    <input type="number" id="habitaciones" class="form-input" value="1" min="1" max="10">
                  </div>
                </div>

                <div class="divider"></div>

                <div class="form-grid grid-3">
                   <div class="form-group">
                    <label class="form-label"></label>
                  </div>
                  <div class="form-group">
                    <label class="form-label"></label>

                  </div>
                  <div class="form-group">
                    <label class="form-label"></label>
                  </div>
                </div>
                  <div id="habitaciones-container"></div>
                </div>

               <!-- Sección: Cliente y Opciones -->
              <div class="section-card">
                <h3 class="section-title">
                  <span class="section-icon icon-client">👤</span>
                  Información del Cliente
                </h3>

                <div class="form-grid grid-2">
                  <div class="form-group">
                    <label class="form-label">Cliente</label>
                    <select id="cliente" class="form-select">
                      <option value="" disabled selected>👤 Seleccionar cliente...</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Duración del Viaje (noches)</label>
                    <select id="selectNoches" class="form-input" disabled>
                      <option value="" disabled selected>Seleccione noches</option>
                    </select>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="form-grid grid-2">
                  <div class="form-group" style="position: relative;">
                    <label class="form-label">Correo Electrónico del Cliente</label>
                    <input type="email" id="correoCliente" class="form-input" placeholder="cliente@ejemplo.com">
                    <span id="iconoBloqueado" style="position: absolute; right: 10px; top: 35px; font-size: 18px; color: #888; display: none;">🔒</span>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="programaSelect">✈️ Selecciona el Programa</label>
                    <select id="programaSelect" class="form-input">
                      <option value="">🌍 Seleccione un programa</option>
                    </select>
                  </div>

                </div>

                <div class="divider"></div>

                <div class="highlight-box">
                  <div class="form-grid grid-3">
                    <div class="checkbox-group">
                      <div class="checkbox-custom">
                        <input type="checkbox" id="asesorExterno">
                        <span class="checkmark"></span>
                      </div>
                      <label for="asesorExterno" class="checkbox-label">Asesor Externo</label>
                    </div>
                    <div class="checkbox-group">
                      <div class="checkbox-custom">
                        <input type="checkbox" id="nocheAdicional">
                        <span class="checkmark"></span>
                      </div>
                      <label for="nocheAdicional" class="checkbox-label">Noche Adicional</label>
                    </div>
                    <div class="checkbox-group">
                      <div class="checkbox-custom">
                        <input type="checkbox" id="suplemento">
                        <span class="checkmark"></span>
                      </div>
                      <label for="suplemento" class="checkbox-label">Suplemento</label>
                    </div>
                  </div>
                </div>


                 <!-- Información de Asesor Externo -->
                  <div id="infoAsesorExterno" class="escala-section" style="display: none;">
                    <h4 class="flight-title">👤 Información de Asesor Externo</h4>
                    <div class="form-grid grid-4">
                      <div class="form-group">
                        <label class="form-label">Seleccionar un Asesor</label>
                        <select id="asesor" class="form-select" style="width: 250px;">
                          <option value="" disabled selected>👤 Seleccionar un Asesor...</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Información de Noche Adicional -->
                  <div id="infoNocheAdicional" class="escala-section">
                      <h4 class="flight-title">🌙 Información de Noche Adicional</h4>
                      <div class="form-grid grid-4">
                          <div class="form-group">
                              <label class="form-label">Motivo</label>
                              <input type="text" id="motivoNoche" class="form-input" style="width: 250px;" placeholder="Ej: Llegada tardía">
                          </div>
                      </div>
                  </div>

                  <!-- Información de Suplemento -->
                  <div id="infoSuplemento" class="escala-section">
                      <h4 class="flight-title">💼 Información de Suplemento</h4>
                      <div class="form-grid grid-4">
                          <div class="form-group">
                              <label class="form-label">Tipo de Suplemento</label>
                              <input type="text" id="tipoSuplemento" class="form-input" style="width: 250px;" placeholder="Ej: Alimentación, Tour opcional">
                          </div>
                      </div>
                  </div>

              </div>

              <!-- Sección: Vuelos -->
              <div class="section-card">
                <h3 class="section-title">
                  <span class="section-icon icon-flight">✈️</span>
                  Información de Vuelos
                </h3>

                <!-- Vuelo de Ida -->
                <div class="flight-section">
                  <h4 class="flight-title">🛫 Vuelo de Ida</h4>
                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaIda" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloIda" class="form-input" placeholder="Ej: AV123">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaIda" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaIda" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseIda" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>
                </div>

                <!-- Vuelo de Vuelta -->
                <div class="flight-section">
                  <h4 class="flight-title">🛬 Vuelo de Regreso</h4>
                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaVuelta" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloVuelta" class="form-input" placeholder="Ej: AV456">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaVuelta" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaVuelta" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseVuelta" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>
                </div>

                <!-- Checkbox para escala -->
                <div class="highlight-box">
                  <div class="form-grid grid-3">
                  <div class="checkbox-group">
                    <div class="checkbox-custom">
                      <input type="checkbox" id="tieneEscala_Ida">
                      <span class="checkmark"></span>
                    </div>
                    <label for="tieneEscala_Ida" class="checkbox-label">¿El vuelo incluye escalas de Ida?</label>
                  </div>

                  <div class="checkbox-group">
                    <div class="checkbox-custom">
                      <input type="checkbox" id="tieneEscala_Regreso">
                      <span class="checkmark"></span>
                    </div>
                    <label for="tieneEscala_Regreso" class="checkbox-label">¿El vuelo incluye escalas de Regreso?</label>
                  </div>

                  <div class="checkbox-group">
                    <div class="checkbox-custom">
                      <input type="checkbox" id="tieneEscala_Ida_y_Regreso">
                      <span class="checkmark"></span>
                    </div>
                    <label for="tieneEscala_Ida_y_Regreso" class="checkbox-label">¿El vuelo incluye escalas de Ida y Regreso?</label>
                  </div>
                  </div>
                </div>

                <!-- Información de Escala  Ida-->
                <div id="infoEscala" class="escala-section">
                  <h4 class="flight-title">🔄 Información de Escala de Ida</h4>
                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaEscala1" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloEscala" class="form-input" placeholder="Ej: CM789">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaEscala" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaEscala" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseEscala" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>
                </div>

                <!-- Información de Escala Regreso -->
                <div id="infoEscala_1" class="escala-section">
                  <h4 class="flight-title">🔄 Información de Escala de Regreso</h4>
                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaEscala2" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloEscala" class="form-input" placeholder="Ej: CM789">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaEscala" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaEscala" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseEscala" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>
                </div>

                <!-- Información de Escala Ida y Regreso -->
                <div id="infoEscala_2" class="escala-section">
                  <h4 class="flight-title">🔄 Información de Escala de Ida y Regreso </h4>
                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaEscala3" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloEscala" class="form-input" placeholder="Ej: CM789">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaEscala" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaEscala" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseEscala" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>

                  <div class="divider"></div>

                  <div class="form-grid grid-4">
                    <div class="form-group">
                      <label class="form-label">Aerolínea</label>
                      <select id="aerolineaEscala4" class="form-input"></select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Número de Vuelo</label>
                      <input type="text" id="vueloEscala" class="form-input" placeholder="Ej: CM789">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Salida</label>
                      <input type="time" id="horaSalidaEscala" class="form-input">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Hora de Llegada</label>
                      <input type="time" id="horaLlegadaEscala" class="form-input">
                    </div>
                  </div>
                  <div class="divider"></div>
                  <div class="form-group">
                    <label class="form-label">Clase de Vuelo</label>
                    <input type="text" id="claseEscala" class="form-input" placeholder="Ej: Económica, Ejecutiva, Primera Clase">
                  </div>

                </div>

              </div>

              <!-- Sección: Información Adicional -->
              <div class="section-card">
                <h3 class="section-title">
                  <span class="section-icon icon-money">💰</span>
                  Información Adicional y Valores
                </h3>

                <div class="form-group">
                  <label class="form-label">¿Cuántos valores extra necesita agregar? (máximo 2)</label>
                  <input type="number" id="valoresExtra" class="form-input" value="0" min="0" max="2">
                </div>

                <div class="form-group">
                  <label class="form-label">Información de Transferencias</label>
                  <textarea id="transferencia" class="form-textarea" placeholder="Describa los detalles de transferencias, traslados aeropuerto-hotel, tours adicionales, etc."></textarea>
                </div>
              </div>
            </div>
          </div>
        `,
        width: '900px',
        showCancelButton: true,
        confirmButtonText: '💾 Guardar Cotización',
        cancelButtonText: '❌ Cancelar',
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#e53e3e',
        didOpen: async () => {

          // ============================ Fecha de inicio y fin ============================ //
          const fechaInicio = document.getElementById('fechaInicio');
          const fechaFin = document.getElementById('fechaFin');

          // Obtener la fecha actual en formato YYYY-MM-DD
          const hoy = new Date().toISOString().split('T')[0];

          // Configurar mínimo en fecha de inicio y valor por defecto
          fechaInicio.min = hoy;
          fechaInicio.value = hoy;

          // Configurar mínimo en fecha de fin (igual que inicio al principio)
          fechaFin.min = hoy;
          fechaFin.value = hoy;

          // Cuando cambia la fecha de inicio, actualizamos el mínimo de fechaFin
          fechaInicio.addEventListener('change', () => {
            const nuevaFechaInicio = fechaInicio.value;
            fechaFin.min = nuevaFechaInicio;

            // Si la fecha de fin es menor que la nueva fecha de inicio, ajustarla
            if (fechaFin.value < nuevaFechaInicio) {
              fechaFin.value = nuevaFechaInicio;
            }
          });

          // ============================ Validacion de Hora  ida ============================ //

          const salida = document.getElementById('horaSalidaIda');
          const llegada = document.getElementById('horaLlegadaIda');

          function validarHoras() {
            const hs = salida.value;
            const hl = llegada.value;

            if (hs && hl && hl <= hs) {
              Swal.showValidationMessage('⚠️ La hora de llegada no puede ser menor o igual a la hora de salida.');
              llegada.value = ''; // Limpia el valor incorrecto
            } else {
              Swal.resetValidationMessage(); // Limpia el mensaje si es válido
            }
          }

          salida.addEventListener('change', validarHoras);
          llegada.addEventListener('change', validarHoras);

          // ============================ Validacion de Hora regreso  ============================ //


          const salidaVuelta = document.getElementById('horaSalidaVuelta');
          const llegadaVuelta = document.getElementById('horaLlegadaVuelta');

          function validarHorasVuelta() {
            const hs = salidaVuelta.value;
            const hl = llegadaVuelta.value;

            if (hs && hl && hl <= hs) {
              Swal.showValidationMessage('⚠️ La hora de llegada de vuelta no puede ser menor o igual a la hora de salida.');
              llegadaVuelta.value = '';
            } else {
              Swal.resetValidationMessage();
            }
          }

          salidaVuelta.addEventListener('change', validarHorasVuelta);
          llegadaVuelta.addEventListener('change', validarHorasVuelta);

          // ============================ Validacion de Hora escalas  ============================ //


        const salidas = document.querySelectorAll('#horaSalidaEscala');
        const llegadas = document.querySelectorAll('#horaLlegadaEscala');

        salidas.forEach((salida, i) => {
          const llegada = llegadas[i];

          const validar = () => {
            const hs = salida.value;
            const hl = llegada.value;

            if (hs && hl && hl <= hs) {
              Swal.showValidationMessage(`⚠️ En la Escala ${i + 1}, la hora de llegada debe ser mayor a la de salida.`);
              llegada.value = '';
            } else {
              Swal.resetValidationMessage();
            }
          };

          salida.addEventListener('change', validar);
          llegada.addEventListener('change', validar);

          });

          // ============================ Aerolineas ============================ //

          const aerolineasDisponibles = [
            "Avianca", "LATAM", "Satena", "JetSmart", "Clic", "Wingo",
            "Plus ultra",
          ];

          const idsAerolineas = [
            "aerolineaIda",
            "aerolineaVuelta",
            "aerolineaEscala1",
            "aerolineaEscala2",
            "aerolineaEscala3",
            "aerolineaEscala4"
          ];

          idsAerolineas.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
              // Limpiar contenido previo
              select.innerHTML = '';

              // Opción por defecto (placeholder)
              const defaultOption = document.createElement("option");
              defaultOption.value = "";
              defaultOption.textContent = "✈️ Ej: Satena";
              defaultOption.disabled = true;
              defaultOption.selected = true;
              select.appendChild(defaultOption);

              // Agregar aerolíneas disponibles
              aerolineasDisponibles.forEach(aerolinea => {
                const option = document.createElement("option");
                option.value = aerolinea;
                option.textContent = aerolinea;
                select.appendChild(option);
              });
            }
          });






          // ============================ ESCALA OPCIONAL ============================ //

          const checkboxConfig = [
            { checkboxId: 'tieneEscala_Ida', sectionId: 'infoEscala' },
            { checkboxId: 'tieneEscala_Regreso', sectionId: 'infoEscala_1' },
            { checkboxId: 'tieneEscala_Ida_y_Regreso', sectionId: 'infoEscala_2' },
            { checkboxId: 'asesorExterno', sectionId: 'infoAsesorExterno' },
            { checkboxId: 'nocheAdicional', sectionId: 'infoNocheAdicional' },
            { checkboxId: 'suplemento', sectionId: 'infoSuplemento' }
          ];

          // Referencias a checkboxes y secciones
          const checkboxes = {};
          const sections = {};

          checkboxConfig.forEach(({ checkboxId, sectionId }) => {
            checkboxes[checkboxId] = document.getElementById(checkboxId);
            sections[sectionId] = document.getElementById(sectionId);
          });

          function actualizarEscalas() {
            // Captura el estado actual (si están marcadas o no)
            const ida = checkboxes['tieneEscala_Ida'].checked;
            const regreso = checkboxes['tieneEscala_Regreso'].checked;
            const idaYRegreso = checkboxes['tieneEscala_Ida_y_Regreso'].checked;

            // PASO 1: Reiniciar todo al estado base
            // Esto asegura que:
            // - todos los checkboxes estén habilitados
            // - todas las secciones ocultas
            ['tieneEscala_Ida', 'tieneEscala_Regreso', 'tieneEscala_Ida_y_Regreso'].forEach(id => {
              checkboxes[id].disabled = false;  // Habilita el checkbox
              const sectionId = checkboxConfig.find(c => c.checkboxId === id).sectionId;
              sections[sectionId].style.display = 'none'; // Oculta la sección
            });

            // PASO 2: Aplicar lógica dependiendo de qué opción está seleccionada

            if (idaYRegreso) {
              // Si se selecciona "ida y regreso":
              // - Desmarcar las otras dos
              checkboxes['tieneEscala_Ida'].checked = false;
              checkboxes['tieneEscala_Regreso'].checked = false;

              // - Deshabilitarlas
              checkboxes['tieneEscala_Ida'].disabled = true;
              checkboxes['tieneEscala_Regreso'].disabled = true;

              // - Mostrar solo la sección de "ida y regreso"
              sections['infoEscala_2'].style.display = 'block';

            } else if (ida) {
              // Si se selecciona solo "ida":
              // - Desmarcar las otras dos
              checkboxes['tieneEscala_Regreso'].checked = false;
              checkboxes['tieneEscala_Ida_y_Regreso'].checked = false;

              // - Deshabilitarlas
              checkboxes['tieneEscala_Regreso'].disabled = true;
              checkboxes['tieneEscala_Ida_y_Regreso'].disabled = true;

              // - Mostrar solo la sección de "ida"
              sections['infoEscala'].style.display = 'block';

            } else if (regreso) {
              // Si se selecciona solo "regreso":
              // - Desmarcar las otras dos
              checkboxes['tieneEscala_Ida'].checked = false;
              checkboxes['tieneEscala_Ida_y_Regreso'].checked = false;

              // - Deshabilitarlas
              checkboxes['tieneEscala_Ida'].disabled = true;
              checkboxes['tieneEscala_Ida_y_Regreso'].disabled = true;

              // - Mostrar solo la sección de "regreso"
              sections['infoEscala_1'].style.display = 'block';
            }
          }



          // Escuchar cambios en todos los checkboxes relevantes
          ['tieneEscala_Ida', 'tieneEscala_Regreso', 'tieneEscala_Ida_y_Regreso'].forEach(id => {
            checkboxes[id].addEventListener('change', actualizarEscalas);
          });

          // Resto de checkboxes normales
          ['asesorExterno', 'nocheAdicional', 'suplemento'].forEach(id => {
            checkboxes[id].addEventListener('change', function () {
              const sectionId = checkboxConfig.find(item => item.checkboxId === id).sectionId;
              sections[sectionId].style.display = this.checked ? 'block' : 'none';
            });
          });




          // ============================ CIUDADES DE SALIDA ============================ //
          const ciudadesConAeropuerto = [
            "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Pereira",
            "Cúcuta", "Bucaramanga", "Santa Marta", "Montería", "Villavicencio",
            "Armenia", "Manizales", "Neiva", "Ibagué", "Leticia", "San Andrés",
            "Riohacha", "Yopal", "Valledupar", "Quibdó", "Pasto", "Florencia",
            "Tumaco", "Popayán", "Apartadó", "Corozal", "Rionegro", "Sincelejo",
            "Guapi", "Puerto Carreño", "Inírida", "Mitú", "Turbo"
          ];

          const selectCiudadSalida = document.getElementById("ciudadSalida");
          // Limpiar y agregar opción por defecto
          selectCiudadSalida.innerHTML = '';
          const defaultOptionSalida = document.createElement("option");
          defaultOptionSalida.value = "";
          defaultOptionSalida.textContent = "✈️ Seleccione ciudad de salida";
          defaultOptionSalida.disabled = true;
          defaultOptionSalida.selected = true;
          selectCiudadSalida.appendChild(defaultOptionSalida);

          ciudadesConAeropuerto.forEach(ciudad => {
            const option = document.createElement("option");
            option.value = ciudad;
            option.textContent = ciudad;
            selectCiudadSalida.appendChild(option);
          });

          // ============================ DESTINOS ============================ //
          const data = await Cargar_Datos_Backend();
          const destinos = data.destinos || [];

          const selectDestino = document.getElementById("destino");
          selectDestino.innerHTML = '';
          const defaultOptionDestino = document.createElement("option");
          defaultOptionDestino.value = '';
          defaultOptionDestino.textContent = '🌍 Seleccionar destino...';
          defaultOptionDestino.disabled = true;
          defaultOptionDestino.selected = true;
          selectDestino.appendChild(defaultOptionDestino);

          destinos.forEach(destino => {
            const option = document.createElement("option");
            option.value = destino.nombre;
            option.textContent = `${destino.emoji || ''} ${destino.nombre}`;
            selectDestino.appendChild(option);
          });

          // ============================ HOTELES ============================  //
          const selectHotel = document.getElementById("hotel");
          selectHotel.innerHTML = '';
          const defaultOptionHotel = document.createElement('option');
          defaultOptionHotel.value = '';
          defaultOptionHotel.textContent = '🏨 Seleccionar hotel...';
          defaultOptionHotel.disabled = true;
          defaultOptionHotel.selected = true;
          selectHotel.appendChild(defaultOptionHotel);

          let tiposHabitacionDisponibles = [];

          selectDestino.addEventListener('change', async () => {
            const destinoSeleccionado = selectDestino.value;

            // Limpiar selectHotel y reset tipos habitación
            selectHotel.innerHTML = '';
            selectHotel.appendChild(defaultOptionHotel.cloneNode(true));
            tiposHabitacionDisponibles = [];
            actualizarHabitaciones();

            if (!destinoSeleccionado) return;

            // Cargar hoteles según destino
            const dataHoteles = await Cargar_Datos_Backend({ destino: destinoSeleccionado });
            const hoteles = dataHoteles.hoteles || [];

            hoteles.forEach(hotel => {
              // Si hotel es objeto con propiedad 'hotel' o solo string, adaptamos:
              const nombreHotel = typeof hotel === 'string' ? hotel : hotel.hotel || '';
              if (nombreHotel) {
                const option = document.createElement('option');
                option.value = nombreHotel;
                option.textContent = nombreHotel;
                selectHotel.appendChild(option);
              }
            });
          });

          // ============================ TIPOS DE HABITACIÓN SEGÚN HOTEL ============================  //
          selectHotel.addEventListener('change', async () => {
            const hotelSeleccionado = selectHotel.value;
            if (!hotelSeleccionado) {
              tiposHabitacionDisponibles = [];
              actualizarHabitaciones();
              return;
            }

            const dataHotel = await Cargar_Datos_Backend({ hotel: hotelSeleccionado });
            tiposHabitacionDisponibles = dataHotel.tiposHabitacion || [];
            actualizarHabitaciones();
          });

          // ============================ CONFIGURACIÓN DE HABITACIONES ============================  //
          const inputHabitaciones = document.getElementById('habitaciones');
          const contenedorHabitaciones = document.getElementById('habitaciones-container');

          function crearBloqueHabitacion(index) {
            const divGrid = document.createElement('div');
            divGrid.className = 'form-grid grid-3';
            divGrid.id = `habitacion-${index + 1}`;

            const opcionesTipo = tiposHabitacionDisponibles.length > 0
              ? tiposHabitacionDisponibles.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')
              : `<option value="" disabled selected>❓ Sin tipos disponibles</option>`;

            divGrid.innerHTML = `
              <div class="form-group">
                <label class="form-label">Tipo de Habitación</label>
                <select class="form-select" name="tipoHabitacion-${index + 1}">
                  ${opcionesTipo}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Adultos</label>
                <input type="number" name="adultos-${index + 1}" class="form-input adultos-input" value="2" min="1" max="13">
              </div>
              <div class="form-group">
                <label class="form-label">Niños</label>
                <input type="number" name="ninos-${index + 1}" class="form-input" value="0" min="0">
              </div>
            `;

            // Evento para limitar el maximo de adultos
             const inputAdultos = divGrid.querySelector('.adultos-input');
              inputAdultos.addEventListener('blur', () => {
                let val = parseInt(inputAdultos.value);
                if (isNaN(val) || val < 1) {
                  inputAdultos.value = 1;
                } else if (val > 13) {
                  inputAdultos.value = 13;
                }
              });

            return divGrid;
          }

          function actualizarHabitaciones() {
            const cantidad = Math.min(Math.max(parseInt(inputHabitaciones.value) || 1, 1), 10);
            contenedorHabitaciones.innerHTML = '';

            for (let i = 0; i < cantidad; i++) {
              if (i > 0) {
                const divider = document.createElement('div');
                divider.className = 'divider';
                contenedorHabitaciones.appendChild(divider);
              }
              contenedorHabitaciones.appendChild(crearBloqueHabitacion(i));
            }
          }

          // Inicializar habitaciones
          actualizarHabitaciones();

          // Actualizar habitaciones al cambiar cantidad
          inputHabitaciones.addEventListener('input', actualizarHabitaciones);

          // ====================================================================== Informacion del Cliente =================================================== //
          const selectCliente = document.getElementById('cliente');
          const inputCorreoCliente = document.getElementById('correoCliente');
          const iconoBloqueado = document.getElementById('iconoBloqueado');

          // Cargar lista de clientes
          const dataClientes = await Cargar_Datos_Backend({ cliente: true });
          const clientes = dataClientes.clientes || [];

          // Limpiar y agregar opción por defecto
          selectCliente.innerHTML = '<option value="" disabled selected>👤 Seleccionar cliente...</option>';

          // Agregar clientes al select
          clientes.forEach(nombre => {
            const option = document.createElement('option');
            option.value = nombre;
            option.textContent = nombre;
            selectCliente.appendChild(option);
          });

          // Evento al cambiar el cliente
          selectCliente.addEventListener('change', async () => {
            const clienteSeleccionado = selectCliente.value;

            if (!clienteSeleccionado) {
              inputCorreoCliente.value = '';
              inputCorreoCliente.disabled = false;
              iconoBloqueado.style.display = 'none';
              return;
            }

            const dataCliente = await Cargar_Datos_Backend({ cliente: clienteSeleccionado });
            const correo = dataCliente.correo;

            if (correo) {
              inputCorreoCliente.value = correo;
              inputCorreoCliente.disabled = true;
              iconoBloqueado.style.display = 'inline-block';
              iconoBloqueado.title = 'Correo asignado automáticamente';
            } else {
              inputCorreoCliente.value = '';
              inputCorreoCliente.disabled = false;
              iconoBloqueado.style.display = 'none';
            }
          });


          // ======================================================================== PROGRAMAS =========================================================================================== //
          const selectPrograma = document.getElementById("programaSelect");

          // Opción por defecto
          const defaultOptionPrograma = document.createElement("option");
          defaultOptionPrograma.value = '';
          defaultOptionPrograma.textContent = '🌍 Seleccione un programa';
          defaultOptionPrograma.disabled = true;
          defaultOptionPrograma.selected = true;

          // Función para actualizar los programas disponibles
          const actualizarProgramas = async () => {
            const destino = document.getElementById("destino").value;
            const fechaInicio = document.getElementById("fechaInicio").value;
            const fechaFin = document.getElementById("fechaFin").value;

            // Validar que haya datos
            if (!destino || !fechaInicio || !fechaFin) {
              resetProgramaSelect();
              return;
            }

            try {
              // Llamar al backend
              const data = await Cargar_Datos_Backend({
                destino,
                start: fechaInicio,
                end: fechaFin
              });

              const programas = data.programas || [];

              // Resetear el select antes de agregar nuevos programas
              resetProgramaSelect();

              if (programas.length === 0) {
                const noOption = document.createElement("option");
                noOption.value = "";
                noOption.textContent = "❌ No hay programas disponibles";
                noOption.disabled = true;
                selectPrograma.appendChild(noOption);
                return;
              }

              // Agregar opciones de programas válidas
              programas.forEach((programa) => {
                const option = document.createElement("option");
                option.value = programa.nombrePrograma;
                option.textContent = `📘 ${programa.nombrePrograma}`;
                selectPrograma.appendChild(option);
              });

            } catch (error) {
              console.error("Error al cargar programas:", error);
              resetProgramaSelect();
            }
          };

          // Función para resetear el select del programa
          const resetProgramaSelect = () => {
            selectPrograma.innerHTML = '';
            selectPrograma.appendChild(defaultOptionPrograma.cloneNode(true));
          };

          // Eventos para cargar los programas cuando cambian filtros
          document.getElementById("destino").addEventListener("change", actualizarProgramas);
          document.getElementById("fechaInicio").addEventListener("change", actualizarProgramas);
          document.getElementById("fechaFin").addEventListener("change", actualizarProgramas);


          // ========================================================== Noches =================================================== //
          const selectNoches = document.getElementById('selectNoches');

          selectHotel.addEventListener('change', async () => {
            const hotelSeleccionado = selectHotel.value;

            // Reiniciar selectNoches
            selectNoches.innerHTML = '<option value="" disabled selected>Seleccione noches</option>';
            selectNoches.disabled = true;

            if (!hotelSeleccionado) return;

            // Traer noches según hotel (solo depende de hotel)
            const dataHotel = await Cargar_Datos_Backend({ hotel: hotelSeleccionado, soloNoches: true });

            const nochesDisponibles = dataHotel.noches;

            // Validar si recibiste un array válido
            if (!Array.isArray(nochesDisponibles) || nochesDisponibles.length === 0) {
              selectNoches.innerHTML = '<option value="" disabled selected>No hay noches disponibles</option>';
              selectNoches.disabled = true;
              return;
            }

            // Llenar selectNoches con cada noche disponible
            for (const noche of nochesDisponibles) {
              const option = document.createElement('option');
              option.value = noche;
              option.textContent = `${noche} noche${noche !== 1 ? 's' : ''}`;
              selectNoches.appendChild(option);
            }

            selectNoches.disabled = false;
          });


          // ===================================================================== Seleccion del Asesor =================================================== //

          // Referencias a elementos
          const asesorExternoCheckbox = document.getElementById('asesorExterno');
          const selectAsesor = document.getElementById('asesor');
          const infoAsesorExterno = document.getElementById('infoAsesorExterno');

          asesorExternoCheckbox.addEventListener('change', async function () {
            const mostrar = this.checked;
            infoAsesorExterno.style.display = mostrar ? 'block' : 'none';

            if (mostrar) {
              // Limpiar el select antes de cargar
              selectAsesor.innerHTML = '<option value="" disabled selected>👤 Seleccionar un Asesor...</option>';

              try {
                // Llamada al backend para obtener asesores
                const data = await Cargar_Datos_Backend({ asesor: true });
                const asesores = data.asesores || [];

                if (asesores.length === 0) {
                  const option = document.createElement('option');
                  option.value = '';
                  option.textContent = '⚠️ No hay asesores disponibles';
                  selectAsesor.appendChild(option);
                } else {
                  asesores.forEach(nombre => {
                    const option = document.createElement('option');
                    option.value = nombre;
                    option.textContent = nombre;
                    selectAsesor.appendChild(option);
                  });
                }
              } catch (error) {
                console.error('Error al cargar asesores:', error);
                // Opcional: muestra un mensaje de error en el select
                selectAsesor.innerHTML = '<option value="" disabled>❌ Error al cargar asesores</option>';
              }
            } else {
              // Si se oculta, limpiar el select
              selectAsesor.innerHTML = '<option value="" disabled selected>👤 Seleccionar un Asesor...</option>';
            }
          });

        },


        preConfirm: () => {
          // Función auxiliar para obtener valor de input de forma segura
          const getInputValue = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.value.trim() : '';
          };

          // Función auxiliar para obtener valor numérico
          const getNumericValue = (selector) => {
            const value = getInputValue(selector);
            return parseInt(value) || 0;
          };

          // Función auxiliar para verificar si un checkbox está marcado
          const isChecked = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.checked : false;
          };

          // Función auxiliar para recopilar datos de habitaciones
          const recopilarHabitaciones = () => {
            const habitaciones = [];
            const cantidad = getNumericValue('#habitaciones') || 1;

            for (let i = 1; i <= cantidad; i++) {
              const tipoHabitacion = getInputValue(`[name="tipoHabitacion-${i}"]`);
              const adultos = getNumericValue(`[name="adultos-${i}"]`);
              const ninos = getNumericValue(`[name="ninos-${i}"]`);

              habitaciones.push({
                numero: i,
                tipoHabitacion,
                adultos,
                ninos,
                total: adultos + ninos
              });
            }

            return habitaciones;
          };

          // Función auxiliar para recopilar datos de escalas
          const recopilarEscalas = () => {
            const escalas = {
              ida: null,
              regreso: null,
              idaYRegreso: null
            };

            // Escala de Ida
            if (isChecked('#tieneEscala_Ida')) {
              const seccionIda = document.querySelector('#infoEscala');
              if (seccionIda) {
                escalas.ida = {
                  aerolinea: seccionIda.querySelector('#aerolineaEscala')?.value || '',
                  numeroVuelo: seccionIda.querySelector('#vueloEscala')?.value || '',
                  horaSalida: seccionIda.querySelector('#horaSalidaEscala')?.value || '',
                  horaLlegada: seccionIda.querySelector('#horaLlegadaEscala')?.value || '',
                  clase: seccionIda.querySelector('#claseEscala')?.value || ''
                };
              }
            }

            // Escala de Regreso
            if (isChecked('#tieneEscala_Regreso')) {
              const seccionRegreso = document.querySelector('#infoEscala_1');
              if (seccionRegreso) {
                const inputs = seccionRegreso.querySelectorAll('input');
                escalas.regreso = {
                  aerolinea: inputs[0]?.value || '',
                  numeroVuelo: inputs[1]?.value || '',
                  horaSalida: inputs[2]?.value || '',
                  horaLlegada: inputs[3]?.value || '',
                  clase: inputs[4]?.value || ''
                };
              }
            }

            // Escala de Ida y Regreso
            if (isChecked('#tieneEscala_Ida_y_Regreso')) {
              const seccionIdaRegreso = document.querySelector('#infoEscala_2');
              if (seccionIdaRegreso) {
                const inputs = seccionIdaRegreso.querySelectorAll('input');
                escalas.idaYRegreso = {
                  vuelo1: {
                    aerolinea: inputs[0]?.value || '',
                    numeroVuelo: inputs[1]?.value || '',
                    horaSalida: inputs[2]?.value || '',
                    horaLlegada: inputs[3]?.value || '',
                    clase: inputs[4]?.value || ''
                  },
                  vuelo2: {
                    aerolinea: inputs[5]?.value || '',
                    numeroVuelo: inputs[6]?.value || '',
                    horaSalida: inputs[7]?.value || '',
                    horaLlegada: inputs[8]?.value || '',
                    clase: inputs[9]?.value || ''
                  }
                };
              }
            }

            return escalas;
          };

          // Recopilar habitaciones
          const habitaciones = recopilarHabitaciones();

          // Calcular totales
          const totalAdultos = habitaciones.reduce((total, h) => total + h.adultos, 0);
          const totalNinos = habitaciones.reduce((total, h) => total + h.ninos, 0);
          const totalPasajeros = totalAdultos + totalNinos;

          // Recopilar todos los datos del formulario
          const formData = {
            // Información General
            fechaInicio: getInputValue('#fechaInicio'),
            fechaFin: getInputValue('#fechaFin'),
            ciudadSalida: getInputValue('#ciudadSalida'),
            destino: getInputValue('#destino'),

            // Alojamiento
            hotel: getInputValue('#hotel'),
            habitaciones: habitaciones,
            numeroHabitaciones: habitaciones.length,

            // Totales de pasajeros
            totalAdultos: totalAdultos,
            totalNinos: totalNinos,
            totalPasajeros: totalPasajeros,

            // Cliente y opciones
            cliente: getInputValue('#cliente'),
            correoCliente: getInputValue('#correoCliente'),
            telefono: getInputValue('#telefono'),
            programa: getInputValue('#programaSelect'),
            duracionNoches: getInputValue('#selectNoches'),

            // Vuelos
            vueloIda: {
              aerolinea: getInputValue('#aerolineaIda'),
              numeroVuelo: getInputValue('#vueloIda'),
              horaSalida: getInputValue('#horaSalidaIda'),
              horaLlegada: getInputValue('#horaLlegadaIda'),
              clase: getInputValue('#claseIda')
            },
            vueloVuelta: {
              aerolinea: getInputValue('#aerolineaVuelta'),
              numeroVuelo: getInputValue('#vueloVuelta'),
              horaSalida: getInputValue('#horaSalidaVuelta'),
              horaLlegada: getInputValue('#horaLlegadaVuelta'),
              clase: getInputValue('#claseVuelta')
            },

            // Escalas
            escalas: recopilarEscalas(),

            // Opciones adicionales
            opciones: {
              asesorExterno: {
                activo: isChecked('#asesorExterno'),
                asesor: isChecked('#asesorExterno') ? getInputValue('#asesor') : null
              },
              nocheAdicional: {
                activo: isChecked('#nocheAdicional'),
                motivo: isChecked('#nocheAdicional') ? getInputValue('#motivoNoche') : null
              },
              suplemento: {
                activo: isChecked('#suplemento'),
                tipo: isChecked('#suplemento') ? getInputValue('#tipoSuplemento') : null
              }
            },

            // Valores adicionales
            valoresExtra: getNumericValue('#valoresExtra'),
            transferencia: getInputValue('#transferencia'),
            precioTransferencia: getNumericValue('#precioTransferencia'),

            // Información adicional del paquete
            incluye: getInputValue('#incluye'),
            noIncluye: getInputValue('#noIncluye'),
            observaciones: getInputValue('#observaciones'),
            descuentos: getNumericValue('#descuentos'),
            impuestos: getNumericValue('#impuestos'),
            total: getNumericValue('#total'),
            moneda: getInputValue('#moneda') || 'USD',

            // Metadatos
            tipo: 'normales',
            fechaCreacion: new Date().toISOString(),
            estado: 'pendiente',
            creadorCotizacion: getInputValue('#creadorCotizacion') || 'Sistema'
          };

          // Validaciones básicas
          const validaciones = [
            { campo: 'destino', mensaje: 'Por favor selecciona un destino' },
            { campo: 'hotel', mensaje: 'Por favor selecciona un hotel' },
            { campo: 'cliente', mensaje: 'Por favor selecciona un cliente' },
            { campo: 'correoCliente', mensaje: 'Por favor ingresa el correo del cliente' },
            { campo: 'programa', mensaje: 'Por favor selecciona un programa' },
            { campo: 'duracionNoches', mensaje: 'Por favor selecciona la duración en noches' },
            { campo: 'fechaInicio', mensaje: 'Por favor selecciona la fecha de inicio' },
            { campo: 'fechaFin', mensaje: 'Por favor selecciona la fecha de fin' }
          ];

          // Verificar validaciones básicas
          for (const validacion of validaciones) {
            if (!formData[validacion.campo]) {
              Swal.showValidationMessage(validacion.mensaje);
              return false;
            }
          }

          // Validar email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.correoCliente)) {
            Swal.showValidationMessage('Por favor ingresa un correo electrónico válido');
            return false;
          }

          // Validar que al menos una habitación tenga datos válidos
          const habitacionesValidas = formData.habitaciones.filter(hab =>
            hab.tipoHabitacion && hab.adultos > 0
          );

          if (habitacionesValidas.length === 0) {
            Swal.showValidationMessage('Por favor configura al menos una habitación con tipo y número de adultos');
            return false;
          }

          // Validar fechas
          const fechaInicio = new Date(formData.fechaInicio);
          const fechaFin = new Date(formData.fechaFin);
          if (fechaFin <= fechaInicio) {
            Swal.showValidationMessage('La fecha de fin debe ser posterior a la fecha de inicio');
            return false;
          }

          console.log('Datos del formulario recopilados:', formData);
          return formData;
        }
      });

      if (formValues) {
        try {
          // Mostrar ventana con datos para confirmación manual
          await Swal.fire({
            title: '📋 ¿Deseas guardar esta cotización?',
            html: `<pre style="text-align:left;max-height:300px;overflow:auto;background:#f7f7f7;padding:1em;border-radius:6px">${JSON.stringify(formValues, null, 2)}</pre>`,
            width: 600,
            confirmButtonText: 'Sí, guardar',
            confirmButtonColor: '#48bb78',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#e53e3e'
          }).then(result => {
            if (!result.isConfirmed) {
              throw new Error('Cancelado por el usuario');
            }
          });

          // Mostrar loading
          Swal.fire({
            title: '⏳ Guardando cotización...',
            text: 'Por favor espera mientras procesamos la información',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const response = await api.post('https://backmultidestinos.onrender.com/cotizacion/Guardar_Cotizacion', formValues);

          if (response.data.success) {
            await Swal.fire({
              icon: 'success',
              title: '🎉 ¡Cotización guardada exitosamente!',
              text: `ID de cotización: ${response.data.id}`,
              confirmButtonText: 'Perfecto',
              confirmButtonColor: '#48bb78'
            });

            await cargarCotizaciones('normales');
          } else {
            throw new Error(response.data.message || 'Error al guardar');
          }

        } catch (error) {
          console.error('Error al guardar cotización:', error);

          await Swal.fire({
            icon: 'error',
            title: '❌ Error al guardar',
            text: error.message || 'Hubo un problema al guardar la cotización. Por favor intenta nuevamente.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#e53e3e'
          });
        }
      }

    };
    const abrirFormularioCristal = () => console.log('Abrir formulario cristal')
    const abrirFormularioPersonalizada = () => console.log('Abrir formulario personalizada')


    // ============================= Descargar Formato dependiendo la tabla en la que este ===================== //

    const verDetalle = async (cotizacion, tipo) => {
      console.log('Ver detalle:', cotizacion, tipo)

      try {
        const response = await fetch('https://backmultidestinos.onrender.com/api/generar-pdf/solicitud-reserva', { // Cambié el puerto a 8010
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            numeroCotizacion: cotizacion.numero || cotizacion.id,
            razonSocial: cotizacion.cliente?.razonSocial || cotizacion.razonSocial,
            nit: cotizacion.cliente?.nit || cotizacion.nit,
            domicilio: cotizacion.cliente?.domicilio || cotizacion.domicilio,
            vuelos: cotizacion.vuelos || [],
            incluye: cotizacion.incluye,
            noIncluye: cotizacion.noIncluye,
            liquidacion: cotizacion.liquidacion || [],
            observaciones: cotizacion.observaciones,
            aerolinea: cotizacion.aerolinea || 'MULTISERVICIOS EXPRESS',
            adultos: cotizacion.pasajeros?.adultos || 2,
            niños: cotizacion.pasajeros?.niños || 1,
            vehiculos: cotizacion.vehiculos || '1+1'
          })
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `solicitud-reserva-${Date.now()}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Error generando PDF:', error)
      }
    }
    const editarCotizacion = (cotizacion, tipo) => console.log('Editar:', cotizacion, tipo)

    const eliminarCotizacion = async (id, tipo) => {
      const result = await Swal.fire({
        title: '¿Eliminar cotización?',
        text: 'Esta acción no se puede deshacer. ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#00bcd4',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#ffffff',
        color: '#333',
        backdrop: `
          rgba(0,0,0,0.5)
          url("https://i.imgur.com/UC2vXfT.gif")
          center top
          no-repeat
        `,
        customClass: {
          popup: 'swal2-elegante'
        }
      });

      if (result.isConfirmed) {
        try {
          await api.delete(`https://backmultidestinos.onrender.com/cotizacion/${tipo}/${id}`);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'La cotización ha sido eliminada correctamente.',
            background: '#ffffff',
            color: '#333',
            iconColor: '#4caf50',
            confirmButtonColor: '#4caf50',
            customClass: {
              popup: 'swal2-elegante'
            }
          });
          cargarCotizaciones(tipo);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al eliminar la cotización.',
            background: '#ffffff',
            color: '#333',
            iconColor: '#f44336',
            confirmButtonColor: '#f44336',
            customClass: {
              popup: 'swal2-elegante'
            }
          });
        }
      }
    };





    onMounted(() => {
      cargarCotizaciones('normales')
      cargarCotizaciones('cristal')
      cargarCotizaciones('personalizadas')
    })

    return {
      tabActual,
      cotizacionesNormales,
      cotizacionesCristal,
      cotizacionesPersonalizadas,
      loading,
      paginacion,
      totalCotizaciones,
      montoTotal,
      columnasNormales,
      columnasCristal,
      columnasPersonalizadas,
      formatearMonto,
      getEstadoColor,
      cargarCotizaciones,
      abrirFormularioNormal,
      abrirFormularioCristal,
      abrirFormularioPersonalizada,
      verDetalle,
      editarCotizacion,
      eliminarCotizacion

    }
  }
}
</script>


<style lang="scss" scoped>
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

.dashboard-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  overflow: auto;
  color: white;
}


.page-header {
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  .page-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0 0 0;
  }

  .header-stats {
    display: flex;
    gap: 1rem;
  }

  .stat-card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.2);

    .stat-number {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cotizaciones-tabs {
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  .q-tab {
    font-weight: 600;
    text-transform: none;
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }
}

.tab-panels {
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  min-height: 600px;
}

.tab-panel {
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 500;
      color: #333;
    }
  }

  .action-btn {
    font-weight: 600;
    text-transform: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
  }
}

.data-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: none;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 1.1rem;
      color: #555;
    }
  }
}

.cotizaciones-table {
  .total-amount {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2e7d32;
  }

  .action-buttons {
    display: flex;
    gap: 0.25rem;
    justify-content: center;
  }

  .q-td {
    padding: 1rem 0.75rem;
    vertical-align: middle;
  }

  .q-th {
    font-weight: 600;
    color: #555;
    background: #f8f9fa;
  }
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #666;

  .no-data-text {
    font-size: 1.1rem;
    margin: 1rem 0;
  }
}

// Responsive
@media (max-width: 768px) {
 .page-header {
   padding: 1.5rem 0;

   .header-content {
     flex-direction: column;
     text-align: center;
     gap: 1.5rem;
   }

   .page-title {
     font-size: 2rem;
   }

   .header-stats {
     justify-content: center;
     flex-wrap: wrap;
   }

   .stat-card {
     min-width: 120px;
   }
 }

 .section-header {
   flex-direction: column;
   align-items: stretch;

   .section-title {
     justify-content: center;

     h2 {
       font-size: 1.5rem;
     }
   }

   .action-btn {
     align-self: center;
   }
 }

 .tab-panel {
   padding: 1rem;
 }

 .cotizaciones-table {
   .q-td,
   .q-th {
     padding: 0.5rem 0.25rem;
     font-size: 0.9rem;
   }

   .action-buttons {
     flex-direction: column;
     gap: 0.125rem;
   }
 }

 .data-card {
   .card-header {
     padding: 1rem;
     flex-direction: column;
     gap: 1rem;

     .card-title {
       justify-content: center;
     }
   }
 }
}

@media (max-width: 480px) {
 .header-stats {
   flex-direction: column;
   width: 100%;
 }

 .stat-card {
   width: 100%;
 }

 .cotizaciones-tabs {
   .q-tab {
     font-size: 0.9rem;
     padding: 0.75rem 1rem;
   }
 }

 .no-data {
   padding: 2rem 1rem;

   .q-icon {
     font-size: 3em !important;
   }
 }
}

</style>
