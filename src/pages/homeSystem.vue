<template>
  <q-page class="dashboard-page">
    <video
      autoplay
      muted
      loop
      playsinline
      class="video-background"
    >
      <source src="../vid/home.mp4" type="video/mp4" />
      Tu navegador no soporta video HTML5.
    </video>

    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-section">
          <q-avatar size="64px" class="header-avatar">
            <img :src="imagenPerfil || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
          </q-avatar>
          <div class="welcome-text">
            <h4 class="welcome-title">¡Bienvenido, {{ nombre }}!</h4>
            <p class="welcome-subtitle">Análisis de Ventas - {{ empresaNombre }}</p>
          </div>
        </div>
        <div class="header-actions">
          <q-btn
            flat
            round
            icon="refresh"
            color="white"
            @click="refreshAllData"
            :loading="isRefreshing"
          >
            <q-tooltip>Actualizar datos</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="download"
            color="white"
            @click="exportData1"
          >
            <q-tooltip>Exportar reportes</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Date Range Selector -->
    <div class="date-selector-section">
      <q-card class="date-card">
        <q-card-section class="row items-center q-gutter-md">
          <q-icon name="date_range" size="24px" color="primary" />
          <div class="col">
            <div class="row q-gutter-md">
              <q-input
                v-model="dateRange.start"
                type="date"
                label="Fecha Inicio"
                outlined
                dense
                class="date-input"
              />
              <q-input
                v-model="dateRange.end"
                type="date"
                label="Fecha Fin"
                outlined
                dense
                class="date-input"
              />
              <q-btn
                color="primary"
                label="Aplicar"
                @click="applyDateRange"
                :loading="isLoadingData"
                no-caps
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Main Content -->
    <div class="dashboard-content">

      <!-- KPI Cards -->
      <div class="kpi-section">
        <div class="row q-gutter-lg">
          <div class="col-12 col-md-3">
            <q-card class="kpi-card kpi-primary">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="assessment" size="32px" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ kpiData.Cotizaciones }}</div>
                  <div class="kpi-label">Total Cotizaciones</div>
                  <div class="kpi-change positive">
                    <q-icon name="trending_up" size="16px" />
                    +{{ kpiData.cotizacionesChange }}% vs mes anterior
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-3">
            <q-card class="kpi-card kpi-success">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="monetization_on" size="32px" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ formatNumber(kpiData.liquidaciones) }}</div>
                  <div class="kpi-label">Total Liquidaciones</div>
                  <div class="kpi-change positive">
                    <q-icon name="trending_up" size="16px" />
                    +{{ kpiData.ingresosChange }}% vs mes anterior
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-3">
            <q-card class="kpi-card kpi-info">
              <q-card-section class="kpi-content">
                <div class="kpi-icon">
                  <q-icon name="people" size="32px" />
                </div>
                <div class="kpi-info">
                  <div class="kpi-value">{{ kpiData.totalUsuarios }}</div>
                  <div class="kpi-label">Clientes Activos</div>
                  <div class="kpi-change neutral">
                    <q-icon name="trending_flat" size="16px" />
                    {{ kpiData.clientesChange }}% vs mes anterior
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="row q-gutter-lg">

          <!-- Main Chart -->
          <div class="col-12 col-lg-6">
            <q-card class="chart-card">
              <q-card-section class="chart-header">
                <div class="chart-title">
                  <h6>Resumen de Liquidacion</h6>
                  <p>Análisis mensual de Liquidacion e ingresos</p>
                </div>
              </q-card-section>
              <q-card-section class="chart-content">
                <div class="chart-container">
                  <canvas ref="mainChart" class="main-chart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-5">
            <q-card class="chart-card">
              <q-card-section class="chart-header">
                <div class="chart-title">
                  <h6>Resumen de Cotizacion</h6>
                  <p>Análisis mensual de Cotizacion e ingresos</p>
                </div>
              </q-card-section>
              <q-card-section class="chart-content">
                <div class="chart-container">
                  <canvas ref="mainChart1" class="main-chart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Pie Chart -->
          <div class="col-12 col-lg-11">
            <q-card class="chart-card">
              <q-card-section class="chart-header">
                <div class="chart-title">
                  <h6>Distribución por Usuario</h6>
                  <p>Participación en ventas</p>
                </div>
              </q-card-section>
              <q-card-section class="chart-content">
                <div class="chart-container pie-container">
                  <canvas ref="pieChart" class="pie-chart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>

        <!-- Secondary Charts Row -->
        <div class="row q-gutter-lg q-mt-lg" v-if="rol === 'administrador'">

          <!-- Clients Chart -->
          <div class="col-12 col-lg-6">
            <q-card class="chart-card">
              <q-card-section class="chart-header">
                <div class="chart-title">
                  <h6>Top Clientes</h6>
                  <p>Clientes con más cotizaciones</p>
                </div>
              </q-card-section>
              <q-card-section class="chart-content">
                <div class="chart-container">
                  <canvas ref="clientsChart" class="clients-chart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Performance Chart -->
          <div class="col-12 col-lg-5">
            <q-card class="chart-card">
              <q-card-section class="chart-header">
                <div class="chart-title">
                  <h6>Tendencias</h6>
                  <p>Evolución temporal</p>
                </div>
              </q-card-section>
              <q-card-section class="chart-content">
                <div class="chart-container">
                  <canvas ref="trendChart" class="trend-chart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </div>

    </div>

    <!-- Loading Overlay -->
    <q-inner-loading :showing="isLoadingData">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>

  </q-page>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { LocalStorage } from 'quasar'
import axios from 'axios'
import { useQuasar } from 'quasar'
import Chart from 'chart.js/auto'

export default {

  setup() {
    // ================== DATOS REACTIVOS ==================
    const nombre = ref('')
    const rol = ref('usuario')
    const empresaNombre = ref('Multidestinos Express')
    const imagenPerfil = ref("https://imgs.search.brave.com/-pUIVTqW8I-PGNqZNvfunzlQC_Gl8kxUWz05wrmd-aM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hbmF0/by5vcmcvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDUvbXVs/dGlkZXN0aW5vcy5q/cGc")
    const $q = useQuasar()

    // Rango de fechas
    const dateRange = ref({
      start: '',
      end: ''
    })

    // Estados de carga
    const isLoadingData = ref(false)
    const isRefreshing = ref(false)

    // Pestañas de gráficos
    const mainChartTab = ref('ventas')
    const mainChartTab1 = ref('Cotizacion')

    // Referencias de gráficos
    const mainChart = ref(null)
    const mainChart1 = ref(null)
    const pieChart = ref(null)
    const clientsChart = ref(null)
    const trendChart = ref(null)

    // Instancias de gráficos
    const chartInstances = ref({
      main: null,
      main1: null,
      pie: null,
      clients: null,
      trend: null
    })

    // Datos KPI
    const kpiData = ref({
      Cotizaciones: 0,
      cotizacionesChange: 0,
      liquidaciones: 0,
      ingresosChange: 0,
      totalUsuarios: 0,
      clientesChange: 0,
      reservas: 0,
      ticketsChange: 0
    })

    // Datos de gráficos
    const chartData = ref({
      ventas: null,
      Cotizacion: null,
      usuarios: null,
      clientes: null,
      tendencias: null
    })


    // ================== FUNCIONES DE INICIALIZACIÓN ==================

    const initializeUser = () => {
      const userData = LocalStorage.getItem('userData')

      if (userData) {
        try {
          const usuario = typeof userData === "string" ? JSON.parse(userData) : userData

          nombre.value = usuario.nombreCompleto || "Invitado"
          rol.value = usuario.rol || "usuario"
          imagenPerfil.value = usuario.imagenPerfil || "https://imgs.search.brave.com/-pUIVTqW8I-PGNqZNvfunzlQC_Gl8kxUWz05wrmd-aM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hbmF0/by5vcmcvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDUvbXVs/dGlkZXN0aW5vcy5q/cGc"

        } catch (error) {
          console.error("Error al analizar los datos del usuario:", error)
          setDefaultUserData()
        }
      } else {
        setDefaultUserData()
      }
    }

    const setDefaultUserData = () => {
      nombre.value = "Invitado"
      rol.value = "usuario"
      imagenPerfil.value = "https://imgs.search.brave.com/-pUIVTqW8I-PGNqZNvfunzlQC_Gl8kxUWz05wrmd-aM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hbmF0/by5vcmcvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDUvbXVs/dGlkZXN0aW5vcy5q/cGc"
    }

    const initializeDateRange = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      dateRange.value = {
        start: `${currentYear}-01-01`,
        end: `${currentYear}-12-31`
      }
    }

    // ================== FUNCIONES DE API ==================

    const loadDashboardData = async () => {
      isLoadingData.value = true
      try {
        const userData = LocalStorage.getItem('userData')
        if (!userData) {
          throw new Error('No hay datos de usuario')
        }

        // Parsear userData si es string
        const { id, rol: userRole } = typeof userData === "string" ? JSON.parse(userData) : userData

        // Llamada POST al backend con filtros y usuario
        const response = await axios.post('http://localhost:8010/Home/data', {
          start: dateRange.value.start,
          end: dateRange.value.end,
          userId: id,
          rol: userRole
        })

        // Actualiza kpiData con la data recibida del backend
        kpiData.value = response.data.kpiData


      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al cargar los datos del dashboard'
        })
      } finally {
        isLoadingData.value = false
      }
    }


    // ================== FUNCIONES DE GRÁFICOS ==================

    const updateAllCharts = () => {
      updateMainChart()
      updateMainChart1()
      updatePieChart()
      if (rol.value === 'administrador') {
        updateClientsChart()
        updateTrendChart()
      }
    }

    const createMainChart = (ctx, ventas, tab) => {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      // Inicializa arrays con 0 para cada mes (12 meses)
      const dataSur = Array(12).fill(0);
      const dataNorte = Array(12).fill(0);

      // Llena los arrays según área y mes
      ventas.forEach(v => {
        const mesIndex = Number(v.mes) - 1;
        const area = (v.area || '').toLowerCase();
        if (area === 'sur') {
          dataSur[mesIndex] = v.total;
        } else if (area === 'norte') {
          dataNorte[mesIndex] = v.total;
        }
      });



      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Sur',
              data: dataSur,
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            },
            {
              label: 'Norte',
              data: dataNorte,
              backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Ventas por mes y área' }
          }
        }
      });
    }

    const createMainChart1 = (ctx, Cotizacion, tab) => {
      const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      // Inicializa arrays con 0 para cada mes (12 meses)
      const dataSur = Array(12).fill(0);
      const dataNorte = Array(12).fill(0);

      // Llena los arrays según área y mes
      Cotizacion.forEach(v => {
        const mesIndex = Number(v.mes) - 1;
        const area = (v.area || '').toLowerCase();
        if (area === 'sur') {
          dataSur[mesIndex] = v.total;
        } else if (area === 'norte') {
          dataNorte[mesIndex] = v.total;
        }
      });



      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Sur',
              data: dataSur,
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            },
            {
              label: 'Norte',
              data: dataNorte,
              backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Ventas por mes y área' }
          }
        }
      });
    }



    const createPieChart = (ctx, usuarios) => {
      const labels = usuarios.map(u => u.rol)
      const data = usuarios.map(u => u.total)
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

      return new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' }
          }
        }
      })
    }

    const createClientsChart = (ctx, clientes) => {
      const labels = clientes.map(c => c.zona)
      const data = clientes.map(c => c.total)
      const colors = ['#FF9F40', '#FF6384', '#36A2EB', '#FFCE56']

      return new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      })
    }

    const createTrendChart = (ctx, tendencias) => {
      const labels = tendencias.map(t => t.nombrePrograma)
      const data = tendencias.map(t => t.total)
      const colors = ['#4BC0C0', '#9966FF', '#FF6384', '#36A2EB', '#FFCE56']

      return new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Tendencias',
            data,
            backgroundColor: colors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Top 5 Programas' }
          }
        }
      })
    }

    // === Reemplaza chartHelpers con estas funciones ===

    const updateMainChart = () => {
      if (!mainChart.value || !chartData.value.ventas) return

      if (chartInstances.value.main) {
        chartInstances.value.main.destroy()
      }

      const ctx = mainChart.value.getContext('2d')
      chartInstances.value.main = createMainChart(
        ctx,
        chartData.value.ventas,
        mainChartTab.value
      )
    }

    const updateMainChart1 = () => {
      if (!mainChart1.value || !chartData.value.Cotizacion) return;

      if (chartInstances.value.main1) {
        chartInstances.value.main1.destroy();
      }

      const ctx = mainChart1.value.getContext('2d');
      chartInstances.value.main1 = createMainChart1(
        ctx,
        chartData.value.Cotizacion,
        mainChartTab1.value // si no lo usas, puedes quitarlo
      );
    };


    const updatePieChart = () => {
      if (!pieChart.value || !chartData.value.usuarios) return

      if (chartInstances.value.pie) {
        chartInstances.value.pie.destroy()
      }

      const ctx = pieChart.value.getContext('2d')
      chartInstances.value.pie = createPieChart(ctx, chartData.value.usuarios)
    }

    const updateClientsChart = () => {
      if (!clientsChart.value || !chartData.value.clientes || rol.value !== 'administrador') return

      if (chartInstances.value.clients) {
        chartInstances.value.clients.destroy()
      }

      const ctx = clientsChart.value.getContext('2d')
      chartInstances.value.clients = createClientsChart(ctx, chartData.value.clientes)
    }

    const updateTrendChart = () => {
      if (!trendChart.value || !chartData.value.tendencias || rol.value !== 'administrador') return

      if (chartInstances.value.trend) {
        chartInstances.value.trend.destroy()
      }

      const ctx = trendChart.value.getContext('2d')
      chartInstances.value.trend = createTrendChart(ctx, chartData.value.tendencias)
    }

    // ================== FUNCIONES DE ACCIONES ==================

    const applyDateRange = async () => {
      await loadDashboardData()
      await exportData()
    }


    const refreshAllData = async () => {
      isRefreshing.value = true
      await loadDashboardData()
      await exportData()
      isRefreshing.value = false
    }


    const exportData = async () => {
      try {
        const userData = LocalStorage.getItem('userData');
        if (!userData) throw new Error('No hay datos de usuario');

        const { id, rol: userRole } = typeof userData === "string" ? JSON.parse(userData) : userData;

        const response = await axios.post('http://localhost:8010/Home/export', {
          start: dateRange.value.start,
          end: dateRange.value.end,
          userId: id,
          rol: userRole,
          format: 'json'
        });

        if (!response.data || !response.data.chartData) throw new Error('chartData no está definido');

        chartData.value = response.data.chartData;
        rol.value = userRole;

        // Actualizar gráficas solo cuando tengas datos para ellas
         await nextTick()
        updateAllCharts()

        $q.notify({ type: 'positive', message: 'Datos de gráficas cargados correctamente' });
      } catch (error) {
        console.error('Error al exportar datos:', error);
        $q.notify({ type: 'negative', message: 'Error al cargar los datos de las gráficas' });
      }
    };

    const exportData1 = async () => {
      try {
        isLoadingData.value = true;

        const userData = LocalStorage.getItem('userData');
        if (!userData) throw new Error('No hay datos de usuario');

        const { id, rol: userRole } = typeof userData === "string" ? JSON.parse(userData) : userData;

        // Llamar al endpoint para generar PDF
        const response = await axios.post('http://localhost:8010/Home/export-pdf', {
          start: dateRange.value.start,
          end: dateRange.value.end,
          userId: id,
          rol: userRole
        }, {
          responseType: 'blob' // Importante para recibir el archivo PDF
        });

        // Crear URL del blob y descargar automáticamente
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `reporte_${dateRange.value.start}_${dateRange.value.end}.pdf`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        $q.notify({
          type: 'positive',
          message: 'Reporte PDF descargado exitosamente'
        });

      } catch (error) {
        console.error('Error al exportar PDF:', error);

        let errorMessage = 'Error al generar el reporte PDF';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        $q.notify({
          type: 'negative',
          message: errorMessage
        });
      } finally {
        isLoadingData.value = false;
      }
    };






    // ================== FUNCIONES AUXILIARES ==================

    const formatNumber = (num) => {
      return new Intl.NumberFormat('es-MX').format(num)
    }

    // ================== WATCHERS ==================

    watch([mainChartTab, mainChartTab1], () => {
      updateMainChart()
      updateMainChart1()
    })


    // ================== LIFECYCLE ==================

    onMounted(async () => {
      initializeUser()
      initializeDateRange()
      await loadDashboardData()
      await exportData()
    })


    // ================== RETURN ==================

    return {
      // Datos
        nombre,
        imagenPerfil,
        rol,
        empresaNombre,
        dateRange,
        isLoadingData,
        isRefreshing,
        mainChartTab,
        mainChartTab1,
        kpiData,

        // Referencias de gráficos
        mainChart,
        mainChart1,
        pieChart,
        clientsChart,
        trendChart,

        // Métodos
        applyDateRange,
        refreshAllData,
        exportData,
        exportData1,
        formatNumber
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
}

.dashboard-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  overflow: auto;
  color: white;
}



.dashboard-header {
  color: white;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0);

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .welcome-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-avatar {
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
  }

  .welcome-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .welcome-subtitle {
    margin: 0.25rem 0 0 0;
    opacity: 0.9;
    font-size: 1rem;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.date-selector-section {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  .date-card {
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  .date-input {
    min-width: 150px;
  }
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem 1.5rem;
}

.kpi-section {
  margin-bottom: 2rem;
}

.kpi-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }

  &.kpi-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  &.kpi-success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
  }

  &.kpi-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }

  &.kpi-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
  }

  .kpi-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .kpi-icon {
    background: rgba(255,255,255,0.2);
    border-radius: 12px;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .kpi-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .kpi-label {
    font-size: 0.875rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
  }

  .kpi-change {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.8;

    &.positive {
      color: #ffffff;
    }

    &.negative {
      color: #ef4444;
    }

    &.neutral {
      color: #000000;
    }
  }
}

.charts-section {
  .chart-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(10px);
  }

  .chart-header {
    border-bottom: 1px solid rgba(0,0,0,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;

    .chart-title {
      h6 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #006aff;
      }

      p {
        margin: 0.25rem 0 0 0;
        color: #000000;
        font-size: 0.875rem;
      }
    }

    .chart-tabs {
      .q-tab {
        min-height: 32px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        color: black !important;
      }
    }
  }

  .chart-content {
    padding: 1.5rem;
  }

  .chart-container {
    position: relative;
    height: 350px;

    &.pie-container {
      height: 300px;
    }

    canvas {
      max-height: 100%;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 1.5rem 1rem;

    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  .dashboard-content {
    padding: 0 1rem 2rem 1rem;
  }

  .date-selector-section {
    padding: 1rem;

    .date-input {
      min-width: 120px;
    }
  }

  .kpi-card .kpi-content {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .chart-container {
    height: 250px !important;
  }
}
</style>

