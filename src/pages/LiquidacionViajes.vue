
<template>
  <q-page padding class="liquidaciones-page bg-grey-1">
    <!-- Cabecera mejorada con diseño más moderno -->
    <div class="q-pb-lg">
      <div class="bg-primary rounded-borders q-pa-md text-white shadow-2">
        <div class="row items-center">
          <div class="col-auto">
            <q-avatar color="white" text-color="primary" size="56px">
              <q-icon name="monetization_on" size="32px" />
            </q-avatar>
          </div>
          <div class="col q-pl-md">
            <h4 class="q-ma-none text-weight-bold">Sistema de Liquidaciones</h4>
            <p class="q-ma-none q-mt-xs opacity-8">Gestión de liquidaciones y facturas</p>
          </div>
          <div class="col-auto">
            <q-btn round flat icon="refresh" size="md" @click="actualizarTabla">
              <q-tooltip>Actualizar datos</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel principal con diseño mejorado -->
    <div class="row q-col-gutter-md">
      <!-- Tarjeta de filtros mejorada -->
      <div class="col-12 col-md-4">
        <q-card class="filtros-card shadow-2">
          <q-card-section class="bg-primary text-white">
            <div class="row items-center no-wrap">
              <q-icon name="filter_list" size="md" class="q-mr-sm" />
              <div class="text-h6">Filtros</div>
              <q-space />
              <q-btn flat round icon="help_outline" size="sm">
                <q-tooltip>Ayuda con los filtros</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-input
              v-model="filterId"
              label="ID de Cotización"
              filled
              dense
              clearable
              class="q-mb-md"
              :debounce="300"
              placeholder="Buscar por ID..."
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="filterId = ''"
                  class="cursor-pointer"
                  v-if="filterId"
                  color="grey-6"
                />
              </template>
            </q-input>

            <q-select
              v-model="filterStatus"
              :options="[{ label: 'Todos los estados', value: null }, ...statusOptions]"
              label="Estado"
              filled
              dense
              clearable
              emit-value
              map-options
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="label" color="primary" />
              </template>
              <template v-slot:selected>
                <div class="flex items-center">
                  <q-icon
                    :name="filterStatus ? 'circle' : 'label'"
                    :color="chipColor(filterStatus)"
                    size="xs"
                    class="q-mr-xs"
                    v-if="filterStatus"
                  />
                  <span>{{ filterStatus || 'Todos los estados' }}</span>
                </div>
              </template>
            </q-select>

            <q-separator class="q-my-md" />

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-btn
                  color="primary"
                  label="Aplicar"
                  icon="check"
                  class="full-width"
                  unelevated
                   @click="applyFilter"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Nueva sección de estadísticas -->
        <q-card class="q-mt-md shadow-1">
          <q-card-section class="bg-secondary text-white">
            <div class="row items-center no-wrap">
              <q-icon name="insights" size="md" class="q-mr-sm" />
              <div class="text-h6">Resumen</div>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-subtitle2 text-grey-8">Liquidaciones</div>
                <div class="text-h5 text-primary">{{ filteredRows.length }}</div>
              </div>
              <div class="col-6">
                <div class="text-subtitle2 text-grey-8">Pendientes</div>
                <div class="text-h5 text-orange">{{ countPendientes }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabla principal mejorada -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-2">
          <q-card-section class="bg-primary text-white">
            <div class="row items-center no-wrap">
              <q-icon name="receipt_long" size="md" class="q-mr-sm" />
              <div class="text-h6">Lista de Liquidaciones</div>
              <q-space />
              <q-input
                v-model="globalFilter"
                dense
                filled
                placeholder="Buscar..."
                class="search-input"
                style="width: 200px"
                dark
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:append>
                  <q-icon name="clear" @click="globalFilter = ''" class="cursor-pointer" v-if="globalFilter" />
                </template>
              </q-input>
              <q-btn flat round icon="download" class="q-ml-sm" @click="exportToPDF">
                <q-tooltip>Exportar tabla</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-table
              :rows="filteredRows"
              :columns="columns"
              row-key="id"
              v-model:pagination="pagination"
              :loading="loading"
              :filter="globalFilter"
              binary-state-sort
              flat
              bordered
              separator="cell"
              class="liquidaciones-table"
            >
              <!-- Personalización de celdas -->
              <template v-slot:loading>
                <q-inner-loading showing color="primary">
                  <q-spinner-dots size="50px" color="primary" />
                </q-inner-loading>
              </template>

              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-grey-2">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body-cell-tieneImpuestos="props">
                <q-td :props="props">
                  <q-badge :color="props.row.impuestosLiq === '1' ? 'positive' : 'grey'" class="text-white">
                    {{ props.row.impuestosLiq === "1" ? "Sí" : "No" }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-chip
                    :color="chipColor(props.row.status)"
                    text-color="white"
                    size="sm"
                    class="shadow-1"
                  >
                    <q-icon name="circle" size="xs" class="q-mr-xs" />
                    {{ props.row.status }}
                  </q-chip>
                </q-td>
              </template>

              <template v-slot:body-cell-acciones="props">
                <q-td :props="props" class="text-center">
                  <q-btn
                    @click="mostrarDialogoFactura(props.row)"
                    color="primary"
                    label="Descargar"
                    icon="download"
                    size="sm"
                    unelevated
                    class="q-px-sm"
                  />
                  <q-btn
                    flat
                    round
                    color="grey-7"
                    icon="more_vert"
                    size="sm"
                    class="q-ml-xs"
                  >
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:bottom="props">
                <div class="row items-center justify-between full-width q-pa-sm">
                  <div>
                    <span class="text-body2">Total: {{ filteredRows.length }} liquidaciones</span>
                  </div>
                  <div>
                    <q-pagination
                      v-model="props.pagination.page"
                      :max="Math.ceil(props.pagination.rowsNumber / props.pagination.rowsPerPage)"
                      :max-pages="6"
                      boundary-links
                      direction-links
                      icon-first="first_page"
                      icon-last="last_page"
                      icon-prev="chevron_left"
                      icon-next="chevron_right"
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              </template>

              <!-- No hay resultados -->
              <template v-slot:no-data>
                <div class="full-width row flex-center q-py-lg">
                  <q-icon
                    name="search_off"
                    size="lg"
                    color="grey-7"
                    class="q-mb-md"
                  />
                  <div class="text-h6 text-grey-7">
                    No se encontraron liquidaciones
                  </div>
                  <div class="text-caption text-grey-7 q-mt-sm">
                    Intenta modificar los filtros de búsqueda
                  </div>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogos -->
    <!-- Diálogo para descargar factura -->
    <q-dialog v-model="mostrarDialogo" persistent>
      <q-card style="min-width: 400px" class="rounded-borders">
        <q-card-section class="bg-primary text-white">
          <div class="row items-center no-wrap">
            <q-icon name="description" size="md" class="q-mr-sm" />
            <div class="text-h6">Opciones de Facturación</div>
            <q-space />
            <q-btn flat round icon="close" v-close-popup>
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md q-pt-lg">
          <div class="text-subtitle2 q-mb-sm">Información de facturación</div>
          <q-input
            v-model="nombreFactura"
            label="Nombre para la factura"
            filled
            class="q-mb-sm"
            ref="nombreInput"
            bottom-slots
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
            <template v-slot:hint>Ingrese el nombre como aparecerá en la factura</template>
          </q-input>

          <q-select
            v-model="tipoDocumento"
            :options="['Factura', 'Recibo', 'Comprobante']"
            label="Tipo de documento"
            filled
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="receipt" color="primary" />
            </template>
          </q-select>
        </q-card-section>

        <q-card-section class="bg-grey-2 text-grey-8 q-pa-sm">
          <div class="row items-center">
            <q-icon name="info" size="sm" class="q-mr-xs" />
            <div class="text-caption">
              El documento se generará en formato PDF
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-py-md q-px-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-7"
            v-close-popup
            icon="close"
          />
          <q-btn
            label="Descargar"
            color="primary"
            @click="procesarDescarga"
            icon="download"
            :loading="descargando"
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Toast para notificaciones -->
    <q-toast
      position="bottom-right"
      timeout="2500"
      color="positive"
      class="shadow-3"
    ></q-toast>
  </q-page>
</template>
<script>
import numeral from "numeral";
import { Notify } from "quasar";
import { QChip } from "quasar";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
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
  data() {
    return {
      mostrarDialogo: false,
      facturaOtroNombre: false,
      loading: false,
      nombreFactura: "",
      liquidacionSeleccionada: null,
      filterId: "",
      filterStatus: null, // Valor nulo inicialmente para mostrar todas las filas
      globalFilter: '',
      statusOptions: [
        { label: "Aprobado", value: "Aprobado" },
        { label: "Rechazado", value: "Rechazado" },
        { label: "Pendiente", value: "Pendiente" },
      ],
      filter: "",
      rows: [],
      columns: [
        { name: "status", label: "Status", field: "status" }, // Columna status

        {
          name: "idLiquidacion",
          label: "ID Liquidación",
          field: "idLiquidacion",
          sortable: true,
        },
        {
          name: "idCotizacion",
          label: "ID Cotización",
          field: "idCotizacion",
          sortable: true,
        },
        { name: "salida", label: "Salida", field: "salida" },
        { name: "destino", label: "Destino", field: "destino" },
        {
          name: "nombrePrograma",
          label: "Nombre del Programa",
          field: "nombrePrograma",
        },
        { name: "hotel", label: "Hotel", field: "hotel" },
        {
          name: "totalPasajeros",
          label: "Total Pasajeros",
          field: "totalPasajeros",
        },
        {
          name: "precioBrutoTotal",
          label: "Precio Bruto Total",
          field: "precioBrutoTotal",
        },
        {
          name: "totalPrecioCliente",
          label: "Total Precio Cliente",
          field: "totalPrecioCliente",
        },
        {
          name: "fechaCreacion", // Usamos fechaCreacion en lugar de fechaLiquidacion
          label: "Fecha de Creación",
          field: (row) => new Date(row.fechaCreacion).toLocaleDateString(),
          sortable: true,
        },

        { name: "acciones", label: "Acciones" },
      ],
    };
  },
  computed: {
    filteredRows() {
      const filterIdLower = (this.filterId || '').toLowerCase();  // Asegúrate de que filterId no sea null o undefined
      return this.rows.filter((row) => {
        const idMatch = row.idCotizacion.toLowerCase().includes(filterIdLower); // Filtrado por idCotizacion
        const statusMatch = this.filterStatus === null || row.status === this.filterStatus; // Filtrado por status
        return idMatch && statusMatch; // Solo retorna las filas que cumplan con ambos filtros
      });
    },

    countPendientes() {
      return this.rows.filter(row => row.status === "Pendiente").length;
    },
  },
  methods: {
    mostrarDialogoFactura(row) {
      this.liquidacionSeleccionada = row;
      this.mostrarDialogo = true;
    },
    async procesarDescarga() {
      this.mostrarDialogo = false;

      try {
        // Actualizar la liquidación con el nombre de la factura (si se proporcionó)
        await axios.put(
          `https://backmultidestinos.onrender.com/liquidacion/${this.liquidacionSeleccionada.idLiquidacion}`,
          {
            // ...otros campos de la liquidación,
            facturaPara: this.nombreFactura ? this.nombreFactura : null, // Enviar null si no hay nombre
          }
        );
      } catch (error) {
        console.error("Error al actualizar la liquidación:", error);
        Notify.create({
          message: "Error al actualizar la liquidación.",
          color: "negative",
        });
        return; // Detener la ejecución si hay un error
      }

      // Descargar la liquidación
      if (this.liquidacionSeleccionada.idCotizacion.includes("-C")) {
        this.descargarLiquidacionCano(
          this.liquidacionSeleccionada.idCotizacion,
          this.liquidacionSeleccionada.idLiquidacion
        );
      } else {
        this.descargarLiquidacion(
          this.liquidacionSeleccionada.idCotizacion,
          this.liquidacionSeleccionada.idLiquidacion
        );
      }

      // Limpiar el campo del diálogo
      this.nombreFactura = "";
    },
    chipColor(status) {
      // Lógica para asignar colores a los chips según el estado
      switch (status) {
        case "Aprobado":
          return "green";
        case "Rechazado":
          return "red";
        case "Pendiente":
          return "orange";
        default:
          return "grey";
      }
    },
    verDetalles(row) {
      this.$router.push({
        name: "LiquidacionDetalles",
        params: {
          idLiquidacion: row.idLiquidacion,
          liquidacionData: row,
        },
      });
    },

    // para saber tipo de descarga
    descargarLiquidacionN(row) {
      if (row.idCotizacion.includes("-C")) {
        this.descargarLiquidacionCano(row.idCotizacion, row.idLiquidacion);
      } else {
        this.descargarLiquidacion(row.idCotizacion, row.idLiquidacion);
      }
    },
    //-------------------------------------------------------------- LiquidacionNormal -------------------------------------------------------------------------//

    async descargarLiquidacion(idCotizacion, idLiquidacion) {
      try {
        // Realizar las solicitudes HTTP para obtener los datos
        // Función para verificar el espacio disponible en la página
        // Función para verificar el espacio disponible en la página
        function checkPageOverflow(
          doc,
          currentY,
          elementHeight,
          marginBottom = 10
        ) {
          if (currentY + elementHeight > pageHeight - marginBottom) {
            doc.addPage();
            return margins.top; // Reiniciar currentY en la nueva página
          }
          return currentY;
        }

        const [
          habitacionResponse,
          cotizacionResponse,
          impuestoResponse,
          liquidacionResponse,
          pasajeroResponse,
        ] = await Promise.all([
          axios.get(
            `https://backmultidestinos.onrender.com/habitacionCotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/cotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/ImpuestoCot/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/liquidacion/${idLiquidacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/pasajero/${idLiquidacion}`
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
        const impuesto = impuestoResponse.data[0];
        console.log("impuesto", impuesto);
        const habitacion = habitacionResponse.data;
        console.log("habitacion", habitacion);
        const liquidacion = liquidacionResponse.data;
        console.log("liquidacion", liquidacion);
        const telefono = liquidacion[0].telefono;
        console.log(telefono);
        const pasajero = pasajeroResponse.data;
        console.log("pasajero", pasajero);
        //clientes porcentaje
        const clienteResponse = await axios.get(
          `https://backmultidestinos.onrender.com/cliente/buscar/${cotizacion.cliente}`
        );
        console.log("clienteResponse", clienteResponse);
        const clienteData = clienteResponse.data[0];
        console.log("clienteData", clienteData);
        const tipoBase = clienteData?.tipoBase ?? "Valor por defecto";

        const vendedorResponse = await axios.get(
          `https://backmultidestinos.onrender.com/user/${cotizacion.CreadorCotizacion}`
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
          "https://backmultidestinos.onrender.com/hoteles/buscar",
          params
        );
        const hotelincluye = cotizacion.incluye
          ? cotizacion.incluye
          : hotelesResponse.data[0].incluye;
        const hotelnoincluye = cotizacion.noIncluye
          ? cotizacion.noIncluye
          : hotelesResponse.data[0].noIncluye;

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
        const headerTextGeneral = `PBX(601)7621133\nCALLE 64 No. 11-37 LOC 301\nEMAIL: MULTIDESTINOS_EXPRESS@YAHOO.COM`;
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
          new Date(
            new Date(cotizacion.fechaCreacion).getTime() +
              new Date(cotizacion.fechaCreacion).getTimezoneOffset() * 60000
          ).toLocaleDateString(),
          cotizacion.cliente.toString(),
          clienteData?.telefono ? clienteData.telefono.toString() : "N/A",
          "N/A",
          clienteData?.nit ? clienteData.nit.toString() : "N/A",
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
        // SECCIÓN: PASAJEROS (Nuevo título)
        currentY += 1;
        doc.setFontSize(10);
        doc.text("PASAJEROS: ", margins.left, currentY + 12);

        // Mover a la posición donde se empezará a dibujar la tabla de pasajeros
        currentY += 20;
        // Configuración de la tabla de pasajeros
        const columnsPasajeros = [
          "NOMBRE",
          "DOCUMENTO",
          "F. NACIMIENTO",
          "EDAD",
          "TELEFONO RESERVA",
        ];

        const dataPasajeros = pasajero.map((p) => {
          // Calcular la edad
          const fechaNacimiento = new Date(p.fechaNacimiento);
          const hoy = new Date();
          let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
          const m = hoy.getMonth() - fechaNacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
          }
          return [
            p.nombre,
            p.numeroDocumento,
            fechaNacimiento.toLocaleDateString(),
            edad,
            liquidacion[0].telefono
              ? liquidacion[0].telefono.toString()
              : "N/A",
          ];
        });

        // Calcular el ancho de cada columna de la tabla de pasajeros
        const columnWidthPasajeros =
          (pageWidth - margins.left - margins.right) / columnsPasajeros.length;

        // Calcular las dimensiones del recuadro de pasajeros DESPUÉS de agregar los datos
        const tablePasajerosWidth = pageWidth - margins.left - margins.right;
        const tablePasajerosHeight = 10 + 8 * dataPasajeros.length;

        // Dibujar el recuadro alrededor de la tabla de pasajeros
        doc.rect(
          margins.left,
          currentY,
          tablePasajerosWidth,
          tablePasajerosHeight,
          "S"
        );

        // Dibujar encabezados de la tabla de pasajeros
        doc.setFontSize(8);
        columnsPasajeros.forEach((column, index) => {
          doc.text(
            column,
            margins.left + 5 + index * columnWidthPasajeros,
            currentY + 5
          );
        });

        // Pequeño espacio antes de las filas de datos de pasajeros
        currentY += 10;

        // Dibujar contenido de la tabla de pasajeros
        dataPasajeros.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell.toString(),
              margins.left + 5 + cellIndex * columnWidthPasajeros,
              currentY + rowIndex * 8
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección (ajustado)
        currentY += tablePasajerosHeight - 15;

        // ... (código del itinerario) ...

        // SECCIÓN: ITINERARIO (Nuevo título)
        currentY += 22; // Incrementar este valor para desplazar todo el itinerario hacia abajo

        // Dibujar el título ANTES de calcular las dimensiones del recuadro
        doc.setFontSize(10);
        doc.text("ITINERARIO: ", margins.left, currentY - 10); // Ajustar la posición vertical

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
            cotizacion.aerolineaIda || "N/A",
            cotizacion.vueloIda || "N/A",
            cotizacion.fechaInicio
              ? new Date(
                  new Date(cotizacion.fechaInicio).getTime() +
                    new Date(cotizacion.fechaInicio).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            cotizacion.ruta1 || "N/A",
            cotizacion.claseIda || "N/A",
            cotizacion.horaSalidaIda || "N/A",
            cotizacion.horaLlegadaIda || "N/A",
            cotizacion.recordIda || "N/A",
          ],
        ];

        if (cotizacion.aerolineaEscalaIda != null) {
          data.push([
            cotizacion.aerolineaEscalaIda || "N/A",
            cotizacion.vueloEscalaIda || "N/A",
            cotizacion.fechaInicio
              ? new Date(
                  new Date(cotizacion.fechaInicio).getTime() +
                    new Date(cotizacion.fechaInicio).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            "Escala Ida", // Puedes ajustar esto según tu lógica
            cotizacion.claseEscalaIda || "N/A",
            cotizacion.horaSalidaEscalaIda || "N/A",
            cotizacion.horaLlegadaEscalaIda || "N/A",
            "", // No hay record para escalas
          ]);

          data.push([
            cotizacion.aerolineaEscalaVuelta || "N/A",
            cotizacion.vueloEscalaVuelta || "N/A",
            cotizacion.fechaFin
              ? new Date(
                  new Date(cotizacion.fechaFin).getTime() +
                    new Date(cotizacion.fechaFin).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            "Escala Vuelta", // Puedes ajustar esto según tu lógica
            cotizacion.claseEscalaVuelta || "N/A",
            cotizacion.horaSalidaEscalaVuelta || "N/A",
            cotizacion.horaLlegadaEscalaVuelta || "N/A",
            "", // No hay record para escalas
          ]);
        }

        data.push([
          cotizacion.aerolineaVuelta || "N/A",
          cotizacion.vueloVuelta || "N/A",
          cotizacion.fechaFin
            ? new Date(
                new Date(cotizacion.fechaFin).getTime() +
                  new Date(cotizacion.fechaFin).getTimezoneOffset() * 60000
              ).toLocaleDateString()
            : "N/A",
          cotizacion.ruta2 || "N/A",
          cotizacion.claseVuelta || "N/A",
          cotizacion.horaSalidaVuelta || "N/A",
          cotizacion.horaLlegadaVuelta || "N/A",
          cotizacion.recordVuelta || "N/A",
        ]);

        // Calcular el ancho de cada columna
        const columnWidth =
          (pageWidth - margins.left - margins.right) / columns.length;

        // Calcular las dimensiones del recuadro del itinerario DESPUÉS de agregar los datos
        const tableItinerarioWidth = pageWidth - margins.left - margins.right;
        const tableItinerarioHeight = 12 + 8 * data.length; // Altura de fila reducida a 8

        // Ajustar la posición vertical del recuadro (reducir aún más el valor sumado)
        currentY += 5; // Puedes seguir ajustando este valor si es necesario

        // Dibujar el recuadro alrededor de la tabla
        doc.rect(
          margins.left,
          currentY - 5,
          tableItinerarioWidth,
          tableItinerarioHeight,
          "S"
        );

        // Dibujar encabezados de la tabla
        doc.setFontSize(8);
        columns.forEach((column, index) => {
          doc.text(column, margins.left + index * columnWidth, currentY);
        });

        // Pequeño espacio antes de las filas de datos
        currentY += 5;

        // Dibujar contenido de la tabla
        data.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell,
              margins.left + cellIndex * columnWidth,
              currentY + (rowIndex + 1) * 8 // Altura de fila reducida a 8
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección (ajustado)
        currentY += tableItinerarioHeight - 5;
        let currentLineY;

        // ... (resto del código)
        //-----------------------------------------------------------------------------------------------------------
        // SECCIÓN: OBSERVACIONES
        const observationsText =
          "Esta cotización está sujeta a cambio y disponibilidad al momento de reservar (Sin servicio confirmado)";
        const observationsTop = currentY;
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

        currentY = observationsTop + observationsHeight;
        //------------------------------------------------------------------
        //------------------------------------------------------------------
        //------------------------------------------------------------------
        // SECCIÓN: PLAZO DE PAGO (nueva sección)

        const plazoPagoTop = currentY + 10; // Espacio entre recuadros
        doc.setFontSize(8);

        const plazoPagoText = `El pago de su plan se realizará conforme a las siguientes condiciones:

Planes con inicio dentro de los 30 días:  El pago total deberá efectuarse dentro de un día hábil a partir de la fecha de envío de este documento.
Planes con inicio posterior a los 30 días: El pago se realizará en dos cuotas:
  * Primera cuota: 50% del valor total del plan, pagadero dentro de un día hábil a partir de la fecha de envío de este documento.
  * Segunda cuota: 50% restante del valor total del plan, pagadero 30 días antes de la fecha de inicio del plan.`;

        // Dividir el texto de plazoPagoText en líneas que se ajusten al ancho
        const plazoPagoLines = doc.splitTextToSize(
          plazoPagoText,
          pageWidth - margins.left - margins.right - 4
        );

        // Calcular la altura del recuadro de PLAZO DE PAGO dinámicamente
        let plazoPagoHeight = 18; // Espacio para el título y margen superior
        plazoPagoLines.forEach((line) => {
          plazoPagoHeight += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        // Verificar si hay suficiente espacio para el recuadro de PLAZO DE PAGO
        currentY = checkPageOverflow(doc, currentY, plazoPagoHeight);

        // Dibujar el recuadro de PLAZO DE PAGO
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          plazoPagoTop,
          pageWidth - margins.left - margins.right,
          plazoPagoHeight
        );
        doc.setFontSize(12);
        doc.text("PLAZO DE PAGO:", margins.left + 2, plazoPagoTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de PLAZO DE PAGO
        currentLineY = plazoPagoTop + 15; // Empezar debajo del título
        plazoPagoLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = plazoPagoTop + plazoPagoHeight; // Actualizar currentY
        let saltoDePagina = false;
        //------------------------------------------------------------------
        //------------------------------------------------------------------
        // INCLUYE (con ajuste de espacio y saltos de línea)
        // ... código anterior ...

        //------------------------------------------------------------------
        // INCLUYE (con ajuste de espacio, saltos de línea y control de salto de página)

        doc.setFontSize(8);

        // Dividir el texto de hotelincluye usando "**¿**" como separador
        const incluyeLineas = hotelincluye.split("¿");

        // Dividir cada línea en sublíneas que se ajusten al ancho y agregarlas a incluyeLines
        let incluyeLines = [];
        incluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );
          incluyeLines = incluyeLines.concat(subLineas);
        });

        // Calcular la altura del recuadro de INCLUYE dinámicamente (incluyendo saltos de línea)
        let incluyeHeight = 18; // Espacio para el título y margen superior
        incluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );

          // Sumar la altura de cada sublínea (sin forEach anidado)
          for (let i = 0; i < subLineas.length; i++) {
            const subLinea = subLineas[i];
            incluyeHeight += doc.getTextDimensions(subLinea, { fontSize: 8 }).h;

            // Sumar la altura de un salto de línea adicional solo si la sublínea NO termina con salto de línea
            if (!subLinea.endsWith("\n") && i < subLineas.length - 1) {
              incluyeHeight += doc.getTextDimensions(" ", { fontSize: 8 }).h;
            }
          }
        });

        // Verificar si hay suficiente espacio para el recuadro de INCLUYE
        currentY = checkPageOverflow(doc, currentY, incluyeHeight);

        // Actualizar currentY y la variable saltoDePagina si se agrega una nueva página
        if (currentY === margins.top) {
          saltoDePagina = true;
        }

        // Calcular la posición vertical del recuadro "INCLUYE"
        const incluyeTop = currentY + 10; // Espacio entre recuadros

        // Dibujar el recuadro de INCLUYE
        doc.setDrawColor(0);
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
        currentLineY = incluyeTop + 15; // Empezar debajo del título
        incluyeLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = incluyeTop + incluyeHeight; // Actualizar currentY

        //------------------------------------------------------------------
        // NO INCLUYE (con ajuste de espacios, control de salto de página y
        //                  corrección del cálculo de noIncluyeHeight)

        // Dividir el texto de hotelnoincluye en líneas usando "**¿**" como separador
        const noIncluyeLineas = hotelnoincluye.split("¿");

        // Dividir cada línea en sublíneas que se ajusten al ancho y agregarlas a noIncluyeLines
        let noIncluyeLines = [];
        noIncluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );
          noIncluyeLines = noIncluyeLines.concat(subLineas);
        });

        // Calcular la altura del recuadro de NO INCLUYE dinámicamente (incluyendo saltos de línea)
        let noIncluyeHeight = 18; // Espacio para el título y margen superior
        noIncluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );

          // Sumar la altura de cada sublínea (sin forEach anidado)
          for (let i = 0; i < subLineas.length; i++) {
            const subLinea = subLineas[i];
            noIncluyeHeight += doc.getTextDimensions(subLinea, {
              fontSize: 8,
            }).h;

            // Sumar la altura de un salto de línea adicional solo si la sublínea NO termina con salto de línea
            if (!subLinea.endsWith("\n") && i < subLineas.length - 1) {
              noIncluyeHeight += doc.getTextDimensions(" ", { fontSize: 8 }).h;
            }
          }
        });

        // Verificar si hay suficiente espacio para el recuadro de NO INCLUYE
        currentY = checkPageOverflow(doc, currentY, noIncluyeHeight);

        // Actualizar currentY solo si NO se ha producido un salto de página en la sección anterior
        if (!saltoDePagina) {
          currentY = margins.top; // Reiniciar currentY después de agregar una nueva página
        }

        const noIncluyeTop = currentY + 10; // Espacio entre recuadros

        // Dibujar el recuadro de NO INCLUYE
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          noIncluyeTop,
          pageWidth - margins.left - margins.right,
          noIncluyeHeight
        );
        doc.setFontSize(12);
        doc.text("NO INCLUYE:", margins.left + 2, noIncluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de NO INCLUYE
        currentLineY = noIncluyeTop + 15; // Empezar debajo del título
        noIncluyeLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = noIncluyeTop + noIncluyeHeight; // Actualizar currentY

        // ... código posterior ...
        //------------------------------------
        //------------------------------------
        // Sección: LIQUIDACIÓN
        // Título de la sección LIQUIDACIÓN
        doc.addPage(); // Agregar una nueva página
        currentY = margins.top; // Reiniciar currentY para la nueva página
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
              tipoBase === "Comisión" ? "BASE COMISIÓN" : "BASE COMISION";
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
        if (cotizacion.extra1) {
          // Verificar si existe cotizacion.extra1
          if (cotizacion.extra1.includes("*")) {
            // Comprobar si hay un asterisco
            let partes = cotizacion.extra1.split("*"); // Dividir en dos partes
            let variable1 = partes[0];
            let variable2 = partes[1];

            // Ahora puedes usar variable1 y variable2 como necesites
            nombres.push("Valor Extra", "Valor Extra2");
            valores.push(variable1, variable2);
          } else {
            // Si no hay asterisco
            let valorUnico = cotizacion.extra1;

            // Usar valorUnico
            nombres.push("Valor Extra");
            valores.push(valorUnico);
          }
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
              "COMISION",
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
        const suplemento = 0;
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
        // Actualizar recuadroY para que coincida con la posición actual
        recuadroY = currentY;
        // Dibujar el recuadro
        doc.rect(recuadroX, currentY, recuadroWidth, recuadroHeight);
        // Título del recuadro (sin cambios)
        doc.text(
          "Deposito y Condiciones de Pago",
          recuadroX + 5,
          recuadroY + 3
        );

        // Escribir el texto dentro del recuadro
        splitLines.forEach((splitLine, splitIndex) => {
          doc.text(
            splitLine,
            recuadroX + 5,
            recuadroY + 10 + splitIndex * lineHeightPago
          );
        });

        if (liquidacion[0].facturaPara) {
          currentY = recuadroY + 10 + splitLines.length * lineHeightPago; // Posición debajo del texto anterior
          doc.setFontSize(8);
          doc.text("FACTURA A NOMBRE DE:", recuadroX + 5, currentY);
          currentY += lineHeightPago;
          doc.text(liquidacion[0].facturaPara, recuadroX + 5, currentY);
        }
        // Mover a la posición donde se empezará a dibujar la siguiente sección
        currentY += recuadroHeight + 5; // Agregar un espacio adicional después del recuadro
        // Array para almacenar las respuestas de costos de hotel
        const costosHotelResponses = [];

        // Iterar sobre los tipos de habitación
        for (const habitacionData of habitacion) {
          const params = {
            pertenece: cotizacion.salida,
            destino: cotizacion.destino,
            nombrePrograma: cotizacion.nombrePrograma,
            hotel: cotizacion.hotel,
            noches: cotizacion.noches, // <-- aquí solo el número
            tipoHabitacion: habitacionData.tipoHabitacion,
          };

          try {
            const response = await axios.post(
              "https://backmultidestinos.onrender.com/costosHotel/buscar",
              params
            );
            console.log("Respuesta:", response.data);
            costosHotelResponses.push(response.data);
          } catch (error) {
            console.error("Error al buscar costo hotel:", error.response?.data || error.message);
          }
        }


        // Procesar las respuestas de costos de hotel
        console.log("costosHotelResponses", costosHotelResponses);

        //------------------------------------------------------------------

        // ... (código existente)

        //------------------------------------------------------------------
        // SECCIÓN: COSTOS DE HOTEL
        doc.setFontSize(10);
        doc.text("COSTOS DE HOTEL:", margins.left, currentY);
        currentY += 5; // Espacio después del título

        // Incluir el nombre del hotel
        doc.setFont("helvetica", "bold");
        doc.text(cotizacion.hotel, margins.left, currentY); // Asumiendo que cotizacion.hotel tiene el nombre del hotel
        doc.setFont("helvetica", "normal");
        currentY += 8;

        // Mostrar la información de cada habitación como un elemento de una lista
        costosHotelResponses.forEach((costosHotel, index) => {
          const habitacionData = habitacion[index];

          doc.setFontSize(8);
          doc.text(
            `• Tipo de habitación: ${habitacionData.tipoHabitacion}`,
            margins.left,
            currentY
          );
          currentY += 6;

          // Acomodación en minúscula
          const acomodacion = habitacionData.acomodacion.toLowerCase();

          // Validación: si no hay datos, mostrar "No disponible"
          let valor = "No disponible";
          if (costosHotel && costosHotel.length > 0 && costosHotel[0][acomodacion]) {
            valor = costosHotel[0][acomodacion];
            if (typeof valor === "number") {
              valor = numeral(valor).format("$0,0");
            }
          }

          doc.text(
            `  - Acomodación: ${habitacionData.acomodacion}`,
            margins.left + 10,
            currentY
          );
          currentY += 6;
          doc.text(`  - Valor: ${valor}`, margins.left + 10, currentY);
          currentY += 8;
        });

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

    //----------------------------------------------------------  Liquidacion caño Cristal ---------------------------------------------------------------------//
    async descargarLiquidacionCano(idCotizacion, idLiquidacion) {
      try {
        // Realizar las solicitudes HTTP para obtener los datos
        function checkPageOverflow(
          doc,
          currentY,
          elementHeight,
          marginBottom = 10
        ) {
          if (currentY + elementHeight > pageHeight - marginBottom) {
            doc.addPage();
            return margins.top; // Reiniciar currentY en la nueva página
          }
          return currentY;
        }
        const [
          habitacionResponse,
          cotizacionResponse,
          impuestoResponse,
          liquidacionResponse,
          pasajeroResponse,
        ] = await Promise.all([
          axios.get(
            `https://backmultidestinos.onrender.com/habitacionCotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/cotizacion/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/ImpuestoCot/${idCotizacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/liquidacion/${idLiquidacion}`
          ),
          axios.get(
            `https://backmultidestinos.onrender.com/pasajero/${idLiquidacion}`
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
        const impuesto = impuestoResponse.data[0];
        console.log("impuesto", impuesto);
        const habitacion = habitacionResponse.data;
        console.log("habitacion", habitacion);
        const liquidacion = liquidacionResponse.data;
        console.log("liquidacion", liquidacion);
        const pasajero = pasajeroResponse.data;
        console.log("pasajero", pasajero);

        //clientes porcentaje
        const clienteResponse = await axios.get(
          `https://backmultidestinos.onrender.com/cliente/buscar/${cotizacion.cliente}`
        );
        console.log("clienteResponse", clienteResponse);
        const clienteData = clienteResponse.data[0];
        console.log("clienteData", clienteData);
        const tipoBase = clienteData.tipoBase;
        const vendedorResponse = await axios.get(
          `https://backmultidestinos.onrender.com/user/${cotizacion.CreadorCotizacion}`
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
          "https://backmultidestinos.onrender.com/hoteles/buscar",
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
        const headerTextGeneral = `PBX(601)7621133\nCALLE 64 No. 11-37 LOC 301\nEMAIL: MULTIDESTINOS_EXPRESS@YAHOO.COM`;
        const headerTextCotizacion = `Numero de Liquidacion: ${idLiquidacion}`;

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

        // ... (código anterior) ...

        // SECCIÓN: PASAJEROS (Nuevo título)
        currentY += 1;
        doc.setFontSize(10);
        doc.text("PASAJEROS: ", margins.left, currentY + 12);

        // Mover a la posición donde se empezará a dibujar la tabla de pasajeros
        currentY += 20;

        // Configuración de la tabla de pasajeros
        const columnsPasajeros = [
          "NOMBRE",
          "DOCUMENTO",
          "F. NACIMIENTO",
          "EDAD",
        ];
        const dataPasajeros = pasajero.map((p) => {
          // Calcular la edad
          const fechaNacimiento = new Date(p.fechaNacimiento);
          const hoy = new Date();
          let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
          const m = hoy.getMonth() - fechaNacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
          }
          return [
            p.nombre,
            p.numeroDocumento,
            fechaNacimiento.toLocaleDateString(),
            edad,
          ];
        });

        // Calcular el ancho de cada columna de la tabla de pasajeros
        const columnWidthPasajeros =
          (pageWidth - margins.left - margins.right) / columnsPasajeros.length;

        // Calcular las dimensiones del recuadro de pasajeros DESPUÉS de agregar los datos
        const tablePasajerosWidth = pageWidth - margins.left - margins.right;
        const tablePasajerosHeight = 10 + 8 * dataPasajeros.length;

        // Dibujar el recuadro alrededor de la tabla de pasajeros
        doc.rect(
          margins.left,
          currentY,
          tablePasajerosWidth,
          tablePasajerosHeight,
          "S"
        );

        // Dibujar encabezados de la tabla de pasajeros
        doc.setFontSize(8);
        columnsPasajeros.forEach((column, index) => {
          doc.text(
            column,
            margins.left + 5 + index * columnWidthPasajeros,
            currentY + 5
          );
        });

        // Pequeño espacio antes de las filas de datos de pasajeros
        currentY += 10;

        // Dibujar contenido de la tabla de pasajeros
        dataPasajeros.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell.toString(),
              margins.left + 5 + cellIndex * columnWidthPasajeros,
              currentY + rowIndex * 8
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección (ajustado)
        currentY += tablePasajerosHeight - 15;

        // ... (código del itinerario) ...

        // SECCIÓN: ITINERARIO (Nuevo título)
        currentY += 1;
        doc.setFontSize(10);
        doc.text("ITINERARIO: ", margins.left, currentY + 12);

        // Mover a la posición donde se empezará a dibujar la tabla
        currentY += 20;

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
            cotizacion.aerolineaIda || "N/A",
            cotizacion.vueloIda || "N/A",
            cotizacion.fechaInicio
              ? new Date(
                  new Date(cotizacion.fechaInicio).getTime() +
                    new Date(cotizacion.fechaInicio).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            cotizacion.ruta1 || "N/A",
            cotizacion.claseIda || "N/A",
            cotizacion.horaSalidaIda || "N/A",
            cotizacion.horaLlegadaIda || "N/A",
            cotizacion.recordIda || "N/A",
          ],
        ];

        if (cotizacion.aerolineaEscalaIda != null) {
          data.push([
            cotizacion.aerolineaEscalaIda || "N/A",
            cotizacion.vueloEscalaIda || "N/A",
            cotizacion.fechaInicio
              ? new Date(
                  new Date(cotizacion.fechaInicio).getTime() +
                    new Date(cotizacion.fechaInicio).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            "Escala Ida", // Puedes ajustar esto según tu lógica
            cotizacion.claseEscalaIda || "N/A",
            cotizacion.horaSalidaEscalaIda || "N/A",
            cotizacion.horaLlegadaEscalaIda || "N/A",
            "", // No hay record para escalas
          ]);

          data.push([
            cotizacion.aerolineaEscalaVuelta || "N/A",
            cotizacion.vueloEscalaVuelta || "N/A",
            cotizacion.fechaFin
              ? new Date(
                  new Date(cotizacion.fechaFin).getTime() +
                    new Date(cotizacion.fechaFin).getTimezoneOffset() * 60000
                ).toLocaleDateString()
              : "N/A",
            "Escala Vuelta", // Puedes ajustar esto según tu lógica
            cotizacion.claseEscalaVuelta || "N/A",
            cotizacion.horaSalidaEscalaVuelta || "N/A",
            cotizacion.horaLlegadaEscalaVuelta || "N/A",
            "", // No hay record para escalas
          ]);
        }

        data.push([
          cotizacion.aerolineaVuelta || "N/A",
          cotizacion.vueloVuelta || "N/A",
          cotizacion.fechaFin
            ? new Date(
                new Date(cotizacion.fechaFin).getTime() +
                  new Date(cotizacion.fechaFin).getTimezoneOffset() * 60000
              ).toLocaleDateString()
            : "N/A",
          cotizacion.ruta2 || "N/A",
          cotizacion.claseVuelta || "N/A",
          cotizacion.horaSalidaVuelta || "N/A",
          cotizacion.horaLlegadaVuelta || "N/A",
          cotizacion.recordVuelta || "N/A",
        ]);

        // Calcular el ancho de cada columna
        const columnWidth =
          (pageWidth - margins.left - margins.right) / columns.length;

        // Calcular las dimensiones del recuadro del itinerario DESPUÉS de agregar los datos
        const tableItinerarioWidth = pageWidth - margins.left - margins.right;
        const tableItinerarioHeight = 10 + 8 * data.length; // Altura de fila reducida a 8

        // Dibujar el recuadro alrededor de la tabla
        doc.rect(
          margins.left,
          currentY, // No restamos 5 aquí
          tableItinerarioWidth,
          tableItinerarioHeight,
          "S"
        );

        // Dibujar encabezados de la tabla
        doc.setFontSize(8);
        columns.forEach((column, index) => {
          doc.text(column, margins.left + index * columnWidth, currentY + 5); // Pequeño ajuste vertical
        });

        // Pequeño espacio antes de las filas de datos
        currentY += 10; // Aumentamos un poco el espacio

        // Dibujar contenido de la tabla
        data.forEach((row, rowIndex) => {
          row.forEach((cell, cellIndex) => {
            doc.text(
              cell,
              margins.left + cellIndex * columnWidth,
              currentY + rowIndex * 8 // Altura de fila reducida a 8
            );
          });
        });

        // Mover a la posición donde se empezará a dibujar la siguiente sección (ajustado)
        currentY += tableItinerarioHeight - 8; // Ajustamos para incluir el espacio adicional
        let currentLineY;
        //-----------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------
        // SECCIÓN: OBSERVACIONES
        const observationsText =
          "Esta cotización está sujeta a cambio y disponibilidad al momento de reservar (Sin servicio confirmado)";
        const observationsTop = currentY;
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

        currentY = observationsTop + observationsHeight;
        //------------------------------------------------------------------

        //------------------------------------------------------------------
        // SECCIÓN: PLAZO DE PAGO (nueva sección)

        const plazoPagoTop = currentY + 10; // Espacio entre recuadros
        doc.setFontSize(8);

        const plazoPagoText = `El pago de su plan se realizará conforme a las siguientes condiciones:

Planes con inicio dentro de los 30 días:  El pago total deberá efectuarse dentro de un día hábil a partir de la fecha de envío de este documento.
Planes con inicio posterior a los 30 días: El pago se realizará en dos cuotas:
  * Primera cuota: 50% del valor total del plan, pagadero dentro de un día hábil a partir de la fecha de envío de este documento.
  * Segunda cuota: 50% restante del valor total del plan, pagadero 30 días antes de la fecha de inicio del plan.`;

        // Dividir el texto de plazoPagoText en líneas que se ajusten al ancho
        const plazoPagoLines = doc.splitTextToSize(
          plazoPagoText,
          pageWidth - margins.left - margins.right - 4
        );

        // Calcular la altura del recuadro de PLAZO DE PAGO dinámicamente
        let plazoPagoHeight = 18; // Espacio para el título y margen superior
        plazoPagoLines.forEach((line) => {
          plazoPagoHeight += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        // Verificar si hay suficiente espacio para el recuadro de PLAZO DE PAGO
        currentY = checkPageOverflow(doc, currentY, plazoPagoHeight);

        // Dibujar el recuadro de PLAZO DE PAGO
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          plazoPagoTop,
          pageWidth - margins.left - margins.right,
          plazoPagoHeight
        );
        doc.setFontSize(12);
        doc.text("PLAZO DE PAGO:", margins.left + 2, plazoPagoTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de PLAZO DE PAGO
        currentLineY = plazoPagoTop + 15; // Empezar debajo del título
        plazoPagoLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = plazoPagoTop + plazoPagoHeight; // Actualizar currentY
        let saltoDePagina = false;
        //------------------------------------------------------------------
        //------------------------------------------------------------------
        // INCLUYE (con ajuste de espacio y saltos de línea)
        // ... código anterior ...

        //------------------------------------------------------------------
        // INCLUYE (con ajuste de espacio, saltos de línea y control de salto de página)

        doc.setFontSize(8);

        // Dividir el texto de hotelincluye usando "**¿**" como separador
        const incluyeLineas = hotelincluye.split("¿");

        // Dividir cada línea en sublíneas que se ajusten al ancho y agregarlas a incluyeLines
        let incluyeLines = [];
        incluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );
          incluyeLines = incluyeLines.concat(subLineas);
        });

        // Calcular la altura del recuadro de INCLUYE dinámicamente (incluyendo saltos de línea)
        let incluyeHeight = 18; // Espacio para el título y margen superior
        incluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );

          // Sumar la altura de cada sublínea (sin forEach anidado)
          for (let i = 0; i < subLineas.length; i++) {
            const subLinea = subLineas[i];
            incluyeHeight += doc.getTextDimensions(subLinea, { fontSize: 8 }).h;

            // Sumar la altura de un salto de línea adicional solo si la sublínea NO termina con salto de línea
            if (!subLinea.endsWith("\n") && i < subLineas.length - 1) {
              incluyeHeight += doc.getTextDimensions(" ", { fontSize: 8 }).h;
            }
          }
        });

        // Verificar si hay suficiente espacio para el recuadro de INCLUYE
        currentY = checkPageOverflow(doc, currentY, incluyeHeight);

        // Actualizar currentY y la variable saltoDePagina si se agrega una nueva página
        if (currentY === margins.top) {
          saltoDePagina = true;
        }

        // Calcular la posición vertical del recuadro "INCLUYE"
        const incluyeTop = currentY + 10; // Espacio entre recuadros

        // Dibujar el recuadro de INCLUYE
        doc.setDrawColor(0);
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
        currentLineY = incluyeTop + 15; // Empezar debajo del título
        incluyeLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = incluyeTop + incluyeHeight; // Actualizar currentY

        //------------------------------------------------------------------
        // NO INCLUYE (con ajuste de espacios, control de salto de página y
        //                  corrección del cálculo de noIncluyeHeight)

        // Dividir el texto de hotelnoincluye en líneas usando "**¿**" como separador
        const noIncluyeLineas = hotelnoincluye.split("¿");

        // Dividir cada línea en sublíneas que se ajusten al ancho y agregarlas a noIncluyeLines
        let noIncluyeLines = [];
        noIncluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );
          noIncluyeLines = noIncluyeLines.concat(subLineas);
        });

        // Calcular la altura del recuadro de NO INCLUYE dinámicamente (incluyendo saltos de línea)
        let noIncluyeHeight = 18; // Espacio para el título y margen superior
        noIncluyeLineas.forEach((linea) => {
          const subLineas = doc.splitTextToSize(
            linea,
            pageWidth - margins.left - margins.right - 4
          );

          // Sumar la altura de cada sublínea (sin forEach anidado)
          for (let i = 0; i < subLineas.length; i++) {
            const subLinea = subLineas[i];
            noIncluyeHeight += doc.getTextDimensions(subLinea, {
              fontSize: 8,
            }).h;

            // Sumar la altura de un salto de línea adicional solo si la sublínea NO termina con salto de línea
            if (!subLinea.endsWith("\n") && i < subLineas.length - 1) {
              noIncluyeHeight += doc.getTextDimensions(" ", { fontSize: 8 }).h;
            }
          }
        });

        // Verificar si hay suficiente espacio para el recuadro de NO INCLUYE
        currentY = checkPageOverflow(doc, currentY, noIncluyeHeight);

        // Actualizar currentY solo si NO se ha producido un salto de página en la sección anterior
        if (!saltoDePagina) {
          currentY = margins.top; // Reiniciar currentY después de agregar una nueva página
        }

        const noIncluyeTop = currentY + 10; // Espacio entre recuadros

        // Dibujar el recuadro de NO INCLUYE
        doc.setDrawColor(0);
        doc.rect(
          margins.left,
          noIncluyeTop,
          pageWidth - margins.left - margins.right,
          noIncluyeHeight
        );
        doc.setFontSize(12);
        doc.text("NO INCLUYE:", margins.left + 2, noIncluyeTop + 6);
        doc.setFontSize(8);

        // Mostrar cada línea del texto de NO INCLUYE
        currentLineY = noIncluyeTop + 15; // Empezar debajo del título
        noIncluyeLines.forEach((line) => {
          doc.text(line, margins.left + 2, currentLineY, {
            maxWidth: pageWidth - margins.left - margins.right - 4,
          });
          currentLineY += doc.getTextDimensions(line, { fontSize: 8 }).h;
        });

        currentY = noIncluyeTop + noIncluyeHeight; // Actualizar currentY

        // ... código posterior ...
        //------------------------------------
        // Sección: LIQUIDACIÓN
        // Título de la sección LIQUIDACIÓN
        doc.addPage(); // Agregar una nueva página
        currentY = margins.top; // Reiniciar currentY para la nueva página
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
              tipoBase === "Comisión" ? "BASE COMISIÓN" : "BASE COMISION";
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
        ];

        // Valores correspondientes
        const valores = [
          cotizacion.otros,
          cotizacion.combus,
          cotizacion.iva,
          cotizacion.tasa,
          cotizacion.ta,
          cotizacion.ivaTa,
          impuesto.defensaCivil_Total,
          impuesto.alcaldiaNacional_Total,
          impuesto.alcaldiaExtranjero_Total,
          impuesto.pqsNaturalesExtranjero_Total,
          impuesto.pqsNaturales25a65_Total,
          impuesto.pqsNaturales5a24_Total,
          impuesto.cormacarenaExtranjero_Total,
          impuesto.cormacarena5a11_Total,
          impuesto.cormacarena12a65_Total,
          cotizacion.precioTrans,
        ];
        // Definir impuestosAdicionales FUERA del else if
        const impuestosAdicionales = [
          "alcaldiaNacional",
          "alcaldiaExtranjero",
          "pqsNaturalesExtranjero",
          "pqsNaturales25a65",
          "pqsNaturales5a24",
          "cormacarenaExtranjero",
          "cormacarena5a11",
          "cormacarena12a65",
        ];
        // Mapeo de nombres originales a nombres para mostrar
        const nombreAMostrar = {
          defensaCivil: "Defensa Civil",
          alcaldiaNacional: "Alcaldía Nacional",
          alcaldiaExtranjero: "Alcaldía Extranjero",
          pqsNaturalesExtranjero: "PQS. Naturales Extranjero",
          pqsNaturales25a65: "PQS. Naturales 25 a 65",
          pqsNaturales5a24: "PQS. Naturales 5 a 24",
          cormacarenaExtranjero: "Cormacarena Extranjero",
          cormacarena5a11: "Cormacarena 5 a 11",
          cormacarena12a65: "Cormacarena 12 a 65",
        };

        if (cotizacion.suplemento > 0) {
          nombres.push("SUPLEMENTO");
          valores.push(cotizacion.suplemento);
        }
        if (cotizacion.extra1) {
          // Verificar si existe cotizacion.extra1
          if (cotizacion.extra1.includes("*")) {
            // Comprobar si hay un asterisco
            let partes = cotizacion.extra1.split("*"); // Dividir en dos partes
            let variable1 = partes[0];
            let variable2 = partes[1];

            // Ahora puedes usar variable1 y variable2 como necesites
            nombres.push("Valor Extra", "Valor Extra2");
            valores.push(variable1, variable2);
          } else {
            // Si no hay asterisco
            let valorUnico = cotizacion.extra1;

            // Usar valorUnico
            nombres.push("Valor Extra");
            valores.push(valorUnico);
          }
        }

        // Añadir los nombres y valores a la tabla
        nombres.forEach((nombre, index) => {
          const y = currentY + index * cellHeight;

          // Dibujar la fila de la tabla
          drawRow(y);

          // Primera columna: Nombre
          // Obtener el nombre a mostrar usando el mapeo
          const nombreAMostrarEnTabla = nombreAMostrar[nombre] || nombre; // Si no está en el mapeo, usar el original

          // Primera columna: Nombre (usando el nombre a mostrar)
          doc.text(
            nombreAMostrarEnTabla,
            margins.left + cellPadding,
            y + cellHeight / 2,
            {
              // Cambiar "nombre" por "nombreAMostrarEnTabla"
              baseline: "middle",
            }
          );

          // Segunda columna: Valor dividido (adaptado para impuestos adicionales)
          const totalPasajeros = cotizacion.totalPasajeros;
          const valor = valores[index] || 0;
          let valorDividido = "";

          if (impuestosAdicionales.includes(nombre)) {
            // Si es un impuesto adicional, dividir por el número de personas de ese impuesto
            const propiedadNumeroPersonas = `${nombre}_numeroPersonas`;
            const numeroPersonasImpuesto =
              impuesto[propiedadNumeroPersonas] || 0;
            valorDividido =
              numeroPersonasImpuesto !== 0
                ? Math.trunc(valor / numeroPersonasImpuesto)
                : "";
          } else {
            // Si no es un impuesto adicional, dividir por el total de pasajeros
            valorDividido =
              totalPasajeros !== 0 ? Math.trunc(valor / totalPasajeros) : "";
          }

          doc.text(
            valorDividido.toString(),
            margins.left + cellWidth + cellPadding,
            y + cellHeight / 2,
            { baseline: "middle" }
          );

          // Tercera columna: Número total de pasajeros
          const totalPasajerosTexto =
            totalPasajeros !== 0 ? Math.trunc(totalPasajeros).toString() : "";
          let textoTerceraColumna = "";
          if (impuestosAdicionales.includes(nombre)) {
            const propiedadNumeroPersonas = `${nombre}_numeroPersonas`;
            textoTerceraColumna = impuesto[propiedadNumeroPersonas] || "";
          } else {
            textoTerceraColumna = totalPasajerosTexto;
          }
          doc.text(
            textoTerceraColumna,
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

        if (liquidacion[0].facturaPara) {
          currentY = recuadroY + 10 + splitLines.length * lineHeightPago; // Posición debajo del texto anterior
          doc.setFontSize(8);
          doc.text("FACTURA A NOMBRE DE:", recuadroX + 5, currentY);
          currentY += lineHeightPago;
          doc.text(liquidacion[0].facturaPara, recuadroX + 5, currentY);
        }

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


//--------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------ Documento De tablas de liquidacion --------------------------------------------------//

exportToPDF() {
  if (!this.filteredRows.length) {
    this.$q.notify({ type: 'warning', message: 'No hay datos para exportar' });
    return;
  }

  const doc = new jsPDF('l', 'mm', 'a4'); // ← orientación horizontal
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.text('Lista de Liquidaciones', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.text(`Generado el ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

  const headers = this.columns.map(col => col.label);
  const data = this.filteredRows.map(row =>
    this.columns.map(col => {
      const value = typeof col.field === 'function' ? col.field(row) : row[col.field];
      return value != null ? String(value) : '';
    })
  );

  doc.autoTable({
    head: [headers],
    body: data,
    startY: 35,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save('Lista-Liquidaciones.pdf');
},


//------------------------------------------ Funcion de Boton de Recarga de tabla --------------------------------------------------//

actualizarTabla() {
  this.loading = true;  // Activar el indicador de carga
  setTimeout(() => {
    this.loading = false; // Desactivar el indicador de carga después de un breve retraso
    this.$q.notify({ type: 'positive', message: 'Tabla recargada correctamente' });
  }, 1000);  // Simulamos un retraso de 1 segundo, puedes ajustarlo según lo que necesites
},


  },
  async mounted() {
    try {
      const response = await axios.get(
        "https://backmultidestinos.onrender.com/liquidacion"
      );
      this.rows = response.data;
    } catch (error) {
      console.error("Error al obtener las liquidaciones:", error);
    }
  },
};
</script>
<style lang="scss">
.liquidaciones-page {
  .q-table__top {
    padding: 8px 16px;
  }

  .liquidaciones-table {
    thead tr th {
      font-weight: bold;
      position: sticky;
      z-index: 1;
    }

    tbody td {
      height: 48px;
    }

    .q-table__grid-content {
      min-height: 500px;
    }
  }

  .search-input .q-field__control {
    background: rgba(255, 255, 255, 0.2);
  }

  .filtros-card {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
