<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h5">Bienvenido, {{ nombre }}</div>
            <div class="text-subtitle2">¡Que tengas un buen día!</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Menú de pestañas para las gráficas -->
      <div class="col-12">
        <q-tabs
          v-model="activeTab"
          class="text-teal"
          active-color="primary"
          align="justify"
          dense
        >
          <q-tab name="grafica1" label="Cotizaciones por Usuario" />
          <q-tab
            v-if="rol === 'administrador'"
            name="grafica2"
            label="Totales Generales"
          />
          <q-tab
            v-if="rol === 'administrador'"
            name="grafica3"
            label="Gráfica por Clientes"
          />
        </q-tabs>

        <q-separator />

        <!-- Contenido de las gráficas -->
        <q-card v-if="activeTab === 'grafica1'">
          <q-card-section>
            <div class="text-h6">Cotizaciones por Usuario</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaInicio"
                  type="date"
                  label="Fecha Inicio"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaFin"
                  type="date"
                  label="Fecha Fin"
                />
              </div>
            </div>
            <div class="row justify-center q-mt-md">
              <q-btn
                label="Graficar"
                color="primary"
                @click="actualizarGrafica1"
              />
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <div v-if="hayDatos1" class="chart-container">
              <canvas id="chart-grafica1"></canvas>
            </div>
            <div v-if="!hayDatos1" class="flex flex-center text-grey">
              No hay datos para graficar en este rango de fechas.
            </div>
          </q-card-section>
        </q-card>
        <!-- Gráfica 2: Totales Generales (solo administradores) -->
        <q-card v-if="activeTab === 'grafica2' && rol === 'administrador'">
          <q-card-section>
            <div class="text-h6">Totales Generales</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaInicio"
                  type="date"
                  label="Fecha Inicio"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaFin"
                  type="date"
                  label="Fecha Fin"
                />
              </div>
            </div>
            <div class="row justify-center q-mt-md">
              <q-btn
                label="Graficar"
                color="primary"
                @click="actualizarGrafica2"
              />
            </div>
          </q-card-section>
          <!-- Gráfica 3: -->

          <q-card-section class="q-pa-none">
            <div v-if="hayDatos2" class="chart-container">
              <canvas id="chart-grafica2"></canvas>
            </div>
            <div v-if="!hayDatos2" class="flex flex-center text-grey">
              No hay datos para graficar en este rango de fechas.
            </div>
          </q-card-section>
        </q-card>

        <q-card v-if="activeTab === 'grafica3' && rol === 'administrador'">
          <q-card-section>
            <div class="text-h6">Cotizaciones por clientes</div>
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaInicio"
                  type="date"
                  label="Fecha Inicio"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  filled
                  v-model="fechaFin"
                  type="date"
                  label="Fecha Fin"
                />
              </div>
            </div>
            <div class="row justify-center q-mt-md">
              <q-btn
                label="Graficar"
                color="primary"
                @click="actualizarGrafica3"
              />
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <div v-if="hayDatos3" class="chart-container">
              <canvas id="chart-grafica3"></canvas>
            </div>
            <div v-if="!hayDatos3" class="flex flex-center text-grey">
              No hay datos para graficar en este rango de fechas.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
.chart-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

<script>
import { onMounted, ref, nextTick, reactive } from "vue";
import { LocalStorage } from "quasar";
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  setup() {
    const seriesVisiblesCliente = reactive({});
    const nombre = ref("");
    const activeTab = ref("grafica1"); // Controla las pestañas activas
    const chart1 = ref(null);
    const chart2 = ref(null);
    const chart3 = ref(null);
    const fechaInicio = ref(null);
    const fechaFin = ref(null);
    const usersMap = ref({});
    const hayDatos1 = ref(false);
    const hayDatos2 = ref(false);
    const hayDatos3 = ref(false);
    const seriesVisibles = reactive({});
    const rol = ref(LocalStorage.getItem("userData").rol || "usuario");

    onMounted(async () => {
      const userData = LocalStorage.getItem("userData");
      if (userData && userData.nombreCompleto) {
        nombre.value = userData.nombreCompleto;
        console.log("rol", LocalStorage.getItem("userData").rol);
      } else {
        nombre.value = "invitado";
      }

      fechaInicio.value = "2023-01-01";
      fechaFin.value = "2024-12-31";
      await fetchUsers();
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backmultidestinos.onrender.com/user/"
        );
        const users = response.data;
        users.forEach((user) => {
          usersMap.value[user.id] = user.nombreCompleto;
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const actualizarGrafica1 = async () => {
      // Código para actualizar la primera gráfica
      await generarGrafica1();
    };

    const actualizarGrafica2 = async () => {
      await generarGrafica2(); // Sin filtrar por usuario
    };

    const actualizarGrafica3 = async () => {
      // Código para actualizar la tercera gráfica
      await generarGrafica3();
    };

    const generarGrafica1 = async () => {
      try {
        const response = await axios.post(
          "https://backmultidestinos.onrender.com/cotizacion/totales-por-usuario",
          {
            fechaInicio: fechaInicio.value,
            fechaFin: fechaFin.value,
          }
        );
        let data = response.data;

        // Filtrar datos si el rol no es admin
        if (rol.value !== "administrador") {
          const userId = LocalStorage.getItem("userData").id;
          data = data.filter((item) => item.usuario == userId);
        }

        const dataConNombres = data.map((item) => ({
          usuario: usersMap.value[item.usuario] || item.usuario,
          datos: item.datos,
        }));

        hayDatos1.value = dataConNombres.length > 0;

        if (hayDatos1.value) {
          await nextTick();

          if (chart1.value) {
            chart1.value.destroy();
          }

          const totalesPorUsuario = {};
          dataConNombres.forEach((item) => {
            totalesPorUsuario[item.usuario] = item.datos.reduce(
              (sum, dato) => sum + dato.total,
              0
            );
          });

          dataConNombres.forEach((item) => {
            seriesVisibles[item.usuario] = true;
          });

          const dataCompleta = dataConNombres.map((item) => {
            const datosCompletos = {};
            const mesesUnicos = [
              ...new Set(
                dataConNombres.flatMap((item) =>
                  item.datos.map((dato) => dato.mes)
                )
              ),
            ];
            mesesUnicos.forEach((mes) => {
              const datoMes = item.datos.find((dato) => dato.mes === mes);
              datosCompletos[mes] = datoMes ? datoMes.total : 0;
            });
            return {
              usuario: item.usuario,
              datos: Object.entries(datosCompletos).map(([mes, total]) => ({
                mes,
                total,
              })),
            };
          });

          // Cambiar el formato de los meses (mostrar nombres en vez de números)
          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];

          chart1.value = new Chart(document.getElementById("chart-grafica1"), {
            type: "bar",
            data: {
              labels: dataCompleta[0].datos.map(
                (dato) => meses[parseInt(dato.mes) - 1]
              ), // Mostrar nombres de meses
              datasets: dataCompleta.map((item) => ({
                label: item.usuario,
                data: item.datos.map((dato) => dato.total),
                backgroundColor: getRandomColor(),
                hidden: !seriesVisibles[item.usuario],
              })),
            },
            options: {
              scales: {
                x: {
                  stacked: false,
                  title: {
                    display: false,
                    text: "Mes",
                  },
                },
                y: {
                  stacked: false,
                  title: {
                    display: true,
                    text: "Total de Cotizaciones",
                  },
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const usuario = context.dataset.label;
                      const total = totalesPorUsuario[usuario];
                      return `${usuario}: ${context.parsed.y} cotizaciones (Total: ${total})`;
                    },
                  },
                },
                legend: {
                  onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const ci = legend.chart;
                    const meta = ci.getDatasetMeta(index);
                    meta.hidden =
                      meta.hidden === null
                        ? !ci.data.datasets[index].hidden
                        : null;
                    ci.update();
                    seriesVisibles[legendItem.text] = !meta.hidden;
                  },
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        hayDatos1.value = false;
      }
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    // Función para la gráfica 2 (Totales Generales)
    const generarGrafica2 = async () => {
      try {
        const response = await axios.post(
          "https://backmultidestinos.onrender.com/cotizacion/totales-por-usuario",
          {
            fechaInicio: fechaInicio.value,
            fechaFin: fechaFin.value,
          }
        );
        const data = response.data; // Totales generales sin filtrar por usuario

        const dataConTotales = data.map((item) => ({
          usuario: item.usuario,
          datos: item.datos,
        }));

        hayDatos2.value = dataConTotales.length > 0;

        if (hayDatos2.value) {
          await nextTick();

          if (chart2.value) {
            chart2.value.destroy();
          }

          const totalesPorMes = {};
          dataConTotales.forEach((item) => {
            item.datos.forEach((dato) => {
              if (!totalesPorMes[dato.mes]) {
                totalesPorMes[dato.mes] = 0;
              }
              totalesPorMes[dato.mes] += dato.total;
            });
          });

          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];

          chart2.value = new Chart(document.getElementById("chart-grafica2"), {
            type: "bar",
            data: {
              labels: Object.keys(totalesPorMes).map(
                (mes) => meses[parseInt(mes) - 1]
              ),
              datasets: [
                {
                  label: "Total de Cotizaciones",
                  data: Object.values(totalesPorMes),
                  backgroundColor: getRandomColor(),
                },
              ],
            },
            options: {
              scales: {
                x: { stacked: false, title: { display: false, text: "Mes" } },
                y: {
                  stacked: false,
                  title: { display: true, text: "Total" },
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `Total: ${context.parsed.y} cotizaciones`,
                  },
                },
              },
            },
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        hayDatos2.value = false;
      }
    };
    const generarGrafica3 = async () => {
      try {
        console.log("Iniciando generarGrafica3");
        const response = await axios.post(
          "https://backmultidestinos.onrender.com/cotizacion/totales-por-cliente",
          {
            fechaInicio: fechaInicio.value,
            fechaFin: fechaFin.value,
          }
        );

        console.log("Datos recibidos:", response.data);

        let data = response.data;
        hayDatos3.value = data.length > 0;

        console.log("¿Hay datos?", hayDatos3.value);

        if (hayDatos3.value) {
          await nextTick(); // Esperar a que el DOM esté listo

          // Verificar si el canvas está presente
          const canvas = document.getElementById("chart-grafica3");
          console.log("Canvas chart-grafica3:", canvas);

          if (!canvas) {
            console.error(
              "El elemento canvas no está en el DOM o el ID es incorrecto."
            );
            return;
          }

          if (chart3.value) {
            console.log("Destruyendo gráfica anterior");
            chart3.value.destroy();
          }

          const totalesPorCliente = {};
          data.forEach((item) => {
            totalesPorCliente[item.cliente] = item.datos.reduce(
              (sum, dato) => sum + dato.total,
              0
            );
          });

          data.forEach((item) => {
            seriesVisiblesCliente[item.cliente] = true;
          });

          const dataCompleta = data.map((item) => {
            const datosCompletos = {};
            const mesesUnicos = [
              ...new Set(
                data.flatMap((item) => item.datos.map((dato) => dato.mes))
              ),
            ];
            mesesUnicos.forEach((mes) => {
              const datoMes = item.datos.find((dato) => dato.mes === mes);
              datosCompletos[mes] = datoMes ? datoMes.total : 0;
            });
            return {
              cliente: item.cliente,
              datos: Object.entries(datosCompletos).map(([mes, total]) => ({
                mes,
                total,
              })),
            };
          });

          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];

          console.log("Datos para el gráfico:", dataCompleta);

          chart3.value = new Chart(canvas, {
            type: "bar",
            data: {
              labels: dataCompleta[0].datos.map(
                (dato) => meses[parseInt(dato.mes) - 1]
              ),
              datasets: dataCompleta.map((item) => ({
                label: item.cliente,
                data: item.datos.map((dato) => dato.total),
                backgroundColor: getRandomColor(),
                hidden: !seriesVisiblesCliente[item.cliente],
              })),
            },
            options: {
              scales: {
                x: {
                  stacked: false,
                  title: {
                    display: false,
                    text: "Mes",
                  },
                },
                y: {
                  stacked: false,
                  title: {
                    display: true,
                    text: "Total de Cotizaciones",
                  },
                  beginAtZero: true,
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const cliente = context.dataset.label;
                      const total = totalesPorCliente[cliente];
                      return `${cliente}: ${context.parsed.y} cotizaciones (Total: ${total})`;
                    },
                  },
                },
                legend: {
                  onClick: (e, legendItem, legend) => {
                    const index = legendItem.datasetIndex;
                    const ci = legend.chart;
                    const meta = ci.getDatasetMeta(index);
                    meta.hidden =
                      meta.hidden === null
                        ? !ci.data.datasets[index].hidden
                        : null;
                    ci.update();
                    seriesVisiblesCliente[legendItem.text] = !meta.hidden;
                  },
                },
              },
            },
          });

          console.log("Gráfica generada con éxito.");
        } else {
          console.log("No hay datos para graficar.");
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        hayDatos3.value = false;
      }
    };

    return {
      seriesVisiblesCliente,
      nombre,
      activeTab,
      chart1,
      chart2,
      chart3,
      fechaInicio,
      fechaFin,
      actualizarGrafica1,
      actualizarGrafica2,
      actualizarGrafica3,
      hayDatos1,
      hayDatos2,
      hayDatos3,
      fetchUsers,
      seriesVisibles,
      rol,
    };
  },
};
</script>
