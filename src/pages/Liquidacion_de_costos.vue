<template>
  <q-page class="q-pa-md animated-page">
    <q-card class="q-mb-md shadow-3 animated-card">
      <q-card-section class="bg-primary text-white text-center">
        <div class="text-h4 text-bold">Liquidación de Costos</div>
        <div class="text-subtitle1">Gestión detallada de costos y pagos</div>
      </q-card-section>
    </q-card>

    <q-card class="shadow-3 animated-card">
      <q-card-section>
        <q-toolbar class="animated-toolbar">
          <q-input
            v-model="search"
            label="Buscar"
            dense
            outlined
            class="q-mr-md animated-input"
          />
          <q-select
            v-model="filtro"
            :options="['Todos', 'Pendiente', 'Pagado']"
            label="Estado"
            dense
            outlined
            class="animated-select"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Agregar"
            class="q-ml-md animated-button"
            @click="mostrarAlertaAgregarPago()"
          />
        </q-toolbar>
      </q-card-section>
      <div v-if="loading" class="spinner">
        <i class="fas fa-spinner fa-spin"></i> Cargando pagos...
      </div>
      <q-table
        flat
        bordered
        :rows="filtrarCostos"
        :columns="columns"
        row-key="id"
        :filter="search"
        class="animated-table"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="q-gutter-sm text-center">
            <q-btn
              icon="edit"
              color="info"
              dense
              flat
              @click="editarCosto(props.row)"
              class="animated-icon"
            />
            <q-btn
              icon="delete"
              color="negative"
              dense
              flat
              @click="eliminarCosto(props.row.id)"
              class="animated-icon"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-archivo="props">
          <q-td :props="props" class="text-center">
            <a
              v-if="props.row.archivo"
              :href="`https://backmultidestinos.onrender.com/uploads/${props.row.archivo}`"
              target="_blank"
              class="text-primary"
              style="text-decoration: underline"
            >
              Ver PDF
            </a>
            <span v-else class="text-grey">Sin archivo</span>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-card class="q-mt-md shadow-3 animated-card">
      <q-card-section>
        <q-toolbar class="animated-toolbar">
          <div class="text-h6">Resumen Financiero</div>
        </q-toolbar>
        <q-linear-progress
          :value="animatedProgress"
          color="green"
          class="q-mt-md animated-progress"
        />
        <div class="q-mt-md text-caption text-bold animated-text">
          {{ Math.round(progreso * 100) }}% de los costos han sido liquidados
        </div>
        <q-separator class="q-my-md" />
        <div class="text-subtitle1">
          Total Pagado:
          <span class="text-green text-bold">${{ totalPagado }}</span>
        </div>
        <div class="text-subtitle1">
          Total Pendiente:
          <span class="text-red text-bold">${{ totalPendiente }}</span>
        </div>
        <q-btn
          color="secondary"
          label="Ver Detalles"
          class="q-mt-md animated-button"
          @click="mostrarResumenVentas"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Swal from "sweetalert2";
import { nextTick } from "vue";
import axios from "axios";
import { Dialog } from "quasar";

export default {
  data() {
    return {
      search: "",
      filtro: "Todos",
      costos: [],
      usuarios: [],
      costoSeleccionado: null,
      loading: false,
      columns: [
        {
          name: "nombre",
          label: "Nombre del Comprador",
          align: "center",
          field: "nombre",
        },
        {
          name: "pasajeros",
          label: "Total pasajeros",
          align: "right",
          field: "pasajeros",
        },
        {
          name: "servicio",
          label: "Servicio",
          align: "left",
          field: "servicio",
        },
        {
          name: "montoPendiente",
          label: "Monto ($) Pendiente",
          align: "right",
          field: "montoPendiente",
          format: (val) => `$${val}`,
        },
        {
          name: "montoPagado",
          label: "Monto ($) Pagado",
          align: "right",
          field: "montoPagado",
          format: (val) => `$${val}`,
        },
        { name: "estado", label: "Estado", align: "left", field: "estado" },
        {
          name: "Area",
          label: "Area de Venta",
          align: "center",
          field: "Area",
        },
        {
          name: "archivo",
          label: "Comprobante",
          align: "center",
          field: "archivo",
          sortable: false,
        },
        {
          name: "acciones",
          label: "Acciones",
          align: "center",
          field: "acciones",
          sortable: false,
        },
      ],
      progreso: 0,
      animatedProgress: 0,
    };
  },
  computed: {
    filtrarCostos() {
      return this.filtro === "Todos"
        ? this.costos
        : this.costos.filter((c) => c.estado === this.filtro);
    },
    totalPagado() {
      return this.costos
        .filter((c) => c.estado === "Pagado")
        .reduce((acc, c) => acc + Number(c.montoPagado), 0);
    },
    totalPendiente() {
      return this.costos
        .filter((c) => c.estado === "Pendiente")
        .reduce((acc, c) => acc + Number(c.montoPendiente), 0);
    },
    //---------------------------------------------------------------------------------------------------------------------------------------//
    totalVentas() {
      return this.costos.length;
    },

    ventasPorArea() {
      return {
        Sur: this.costos.filter((c) => c.Area === "Sur").length,
        Norte: this.costos.filter((c) => c.Area === "Norte").length,
      };
    },

    montoPorArea() {
      return {
        Sur: Math.round(
          this.costos
            .filter((c) => c.Area === "Sur")
            .reduce((sum, c) => sum + Number(c.montoPagado), 0)
        ),
        Norte: Math.round(
          this.costos
            .filter((c) => c.Area === "Norte")
            .reduce((sum, c) => sum + Number(c.montoPagado), 0)
        ),
      };
    },

    usuariosPorArea() {
      const compradoresPorArea = {
        Sur: new Set(),
        Norte: new Set(),
      };

      this.costos.forEach((costo) => {
        if (costo.Area === "Sur") {
          compradoresPorArea.Sur.add(costo.nombre);
        } else if (costo.Area === "Norte") {
          compradoresPorArea.Norte.add(costo.nombre);
        }
      });

      return {
        Sur: compradoresPorArea.Sur.size,
        Norte: compradoresPorArea.Norte.size,
      };
    },

    totalPasajerosPorArea() {
      const pasajerosPorArea = {
        Sur: 0,
        Norte: 0,
      };

      this.costos.forEach((costo) => {
        if (costo.Area === "Sur") {
          pasajerosPorArea.Sur += parseInt(costo.pasajeros || 0);
        } else if (costo.Area === "Norte") {
          pasajerosPorArea.Norte += parseInt(costo.pasajeros || 0);
        }
      });

      return pasajerosPorArea;
    },
  },

  watch: {
    costos: {
      handler() {
        const total = this.totalPagado + this.totalPendiente;
        this.progreso = total ? this.totalPagado / total : 0;
      },
      deep: true,
    },
  },

  mounted() {
    this.animateProgress();
    this.cargarCostos();
  },

  methods: {
    mostrarResumenVentas() {
      const total = this.totalVentas;
      const ventasSur = this.ventasPorArea.Sur;
      const ventasNorte = this.ventasPorArea.Norte;
      const usuariosSur = this.usuariosPorArea.Sur;
      const usuariosNorte = this.usuariosPorArea.Norte;
      const montoSur = this.montoPorArea.Sur;
      const montoNorte = this.montoPorArea.Norte;
      const pasajerosSur = this.totalPasajerosPorArea.Sur;
      const pasajerosNorte = this.totalPasajerosPorArea.Norte;

      Swal.fire({
        title: "📊 Resumen de Ventas",
        html: `
          <div style="text-align: left; font-size: 15px;">
            <p><strong>Total Ventas:</strong> ${total}</p>
            <hr />
            <p><strong>Ventas por Área:</strong></p>
            <ul>
              <li>🌎 Sur: ${ventasSur}</li>
              <li>🧭 Norte: ${ventasNorte}</li>
            </ul>
            <p><strong>Compradores por Área:</strong></p>
            <ul>
              <li>👥 Sur: ${usuariosSur}</li>
              <li>👥 Norte: ${usuariosNorte}</li>
            </ul>
            <p><strong>Pasajeros por Área:</strong></p>
            <ul>
              <li>🧳 Sur: ${pasajerosSur}</li>
              <li>🧳 Norte: ${pasajerosNorte}</li>
            </ul>
            <p><strong>Monto Vendido por Área:</strong></p>
            <ul>
              <li>💰 Sur: S/. ${montoSur}</li>
              <li>💰 Norte: S/. ${montoNorte}</li>
            </ul>
          </div>
        `,
        background: "#f4faff",
        icon: "info",
        showCloseButton: true,
        confirmButtonColor: "#2196f3",
        confirmButtonText: "Cerrar",
        width: 450,
        customClass: {
          popup: "animated fadeInDown faster",
        },
      });
    },

    animateProgress() {
      this.animatedProgress = 0;
      setTimeout(() => {
        const total = this.totalPagado + this.totalPendiente;
        this.progreso = total ? this.totalPagado / total : 0;
        let step = 0;
        const interval = setInterval(() => {
          if (step >= this.progreso) {
            clearInterval(interval);
          } else {
            step += 0.02;
            this.animatedProgress = step;
          }
        }, 30);
      }, 500);
    },

    async editarCosto(costo) {
      const { value: formValues, dismiss: dismissReason } = await Swal.fire({
        title: "Editar Información",
        html: `
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <style>
      /* Base styles */
      .custom-popup {
          width: 100%;
          max-width: 900px;
          border-radius: 15px;
          overflow: hidden;
          animation: fadeIn 0.8s ease-out;
          position: relative;
          background: #0f1729;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: row;
      }

      /* Night sky background - LEFT SIDE */
      .night-sky {
          flex: 1;
          background: linear-gradient(135deg, #0f1729 0%, #1e3a8a 100%);
          padding: 20px;
          position: relative;
          color: white;
          height: 100%;
          min-height: 500px;
          overflow: hidden;
          border-radius: 15px 0 0 15px;
      }

      /* Form side - RIGHT SIDE */
      .form-side {
          flex: 1.2;
          padding: 20px;
          background: #111827;
          border-radius: 0 15px 15px 0;
      }

      .agency-subtitle {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fff;
          margin-top: 20px;
          position: relative;
          z-index: 5;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          text-align: center;
      }

      /* Stars in night sky */
      .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
      }

      .star {
          position: absolute;
          background-color: #fff;
          border-radius: 50%;
          animation: twinkle 1.5s infinite alternate;
      }

      /* Cloud container */
      .cloud-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 2;
          overflow: hidden;
      }

      /* Cloud styles */
      .cloud {
          position: absolute;
          width: 80px;
          opacity: 0.4;
          filter: brightness(0.7) contrast(1.2);
          animation: moveClouds 20s linear infinite;
      }

      /* Moon */
      .moon {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle at 30% 30%, #fff9c4, #ffd54f 60%, #ffb300);
          border-radius: 50%;
          top: 40px;
          left: 40px;
          box-shadow: 0 0 20px 5px rgba(255, 255, 255, 0.4);
          z-index: 2;
      }

      /* Moving clouds - different directions */
      .cloud.c1 {
          top: 60px;
          animation-duration: 25s;
      }
      .cloud.c2 {
          top: 140px;
          animation-duration: 35s;
          animation-delay: 2s;
      }
      .cloud.c3 {
          top: 210px;
          animation-duration: 28s;
          animation-delay: 5s;
      }

      /* Keyframes for clouds - now moving left to right */
      @keyframes moveClouds {
          0% {
              left: -100px;
          }
          100% {
              left: 100%;
          }
      }

      /* Animation for stars twinkling */
      @keyframes twinkle {
          0% {
              opacity: 0.3;
          }
          100% {
              opacity: 1;
          }
      }

      /* Plane flying animation - now left to right */
      .plane-animation {
          position: absolute;
          height: 40px;
          width: 100%;
          z-index: 3;
      }

      .plane {
          position: absolute;
          font-size: 28px;
          color: white;
          opacity: 0.9;
          animation: flyPlane 12s infinite;
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
      }

      @keyframes flyPlane {
          0% {
              left: -50px;
              top: 80px;
          }
          50% {
              left: 50%;
              top: 120px;
          }
          100% {
              left: 100%;
              top: 150px;
          }
      }

      /* Landing plane - now left to right */
      .landing-plane-container {
          position: absolute;
          width: 100%;
          height: 60px;
          top: 250px;
          left: 0;
          z-index: 3;
      }

      @keyframes planeLanding {
          0% {
              left: 10%;
              top: 30px;
              transform: rotate(10deg) scale(0.8);
              opacity: 0.5;
          }
          50% {
              left: 40%;
              top: 100px;
              transform: rotate(5deg) scale(0.9);
              opacity: 0.7;
          }
          100% {
              left: 70%;
              top: 180px;
              transform: rotate(0deg) scale(1);
              opacity: 0.9;
          }
      }

      .landing-plane {
          position: absolute;
          font-size: 32px;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          animation: planeLanding 15s ease-in-out infinite alternate;
      }

      /* Form container styles - now optimized for double column */
      .swal-container {
          padding: 10px 10px 20px;
      }

      .form-row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -10px;
      }

      .form-column {
          flex: 1;
          padding: 0 10px;
          min-width: 180px;
      }

      .full-width {
          flex-basis: 100%;
          padding: 0 10px;
      }

      .swal-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #e2e8f0;
          font-size: 0.9rem;
          text-align: left;
          margin-top: 15px;
      }

      .swal-input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #374151;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s;
          margin-bottom: 5px;
          background-color: #1f2937;
          color: #e5e7eb;
      }

      .swal-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          outline: none;
          background-color: #2d3748;
      }

      .file-upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1e293b;
          border: 2px dashed #3b82f6;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 5px;
      }

      .file-upload-container:hover {
          background: #2d3748;
      }

      .file-upload-icon {
          font-size: 24px;
          color: #3b82f6;
          margin-bottom: 10px;
      }

      .file-upload-text {
          color: #d1d5db;
          font-size: 0.9rem;
          text-align: center;
          margin-bottom: 5px;
      }

      #archivo {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -1;
      }

      /* File info styles */
      .file-info {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          background-color: #2d3748;
          border-radius: 6px;
          max-width: 100%;
          transition: all 0.3s;
          overflow: hidden;
          display: none;
      }

      .file-info.active {
          display: flex;
      }

      .file-icon {
          color: #60a5fa;
          font-size: 18px;
          margin-right: 8px;
      }

      .file-name {
          font-size: 0.85rem;
          color: #e5e7eb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
      }

      .file-remove {
          margin-left: auto;
          color: #ef4444;
          cursor: pointer;
          font-size: 16px;
          opacity: 0.7;
          transition: all 0.2s;
      }

      .file-remove:hover {
          opacity: 1;
      }

      /* Current file display */
      .current-file {
          margin-top: 8px;
          padding: 8px 12px;
          background-color: #1e293b;
          border-radius: 6px;
          display: flex;
          align-items: center;
      }

      .current-file-icon {
          color: #60a5fa;
          margin-right: 8px;
      }

      .current-file-name {
          font-size: 0.85rem;
          color: #d1d5db;
      }

      .section-divider {
          margin: 20px 0 10px;
          border-top: 1px solid #374151;
          position: relative;
      }

      /* Form title */
      .form-title {
          color: #ffffff;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 15px;
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #374151;
      }

      /* Button styles */
      .form-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
      }

      .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s;
          cursor: pointer;
          border: none;
      }

      .btn-primary {
          background: linear-gradient(90deg, #1d4ed8, #3b82f6);
          color: white;
          box-shadow: 0 3px 5px rgba(37, 99, 235, 0.3);
      }

      .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(37, 99, 235, 0.4);
      }

      .btn-secondary {
          background: #374151;
          color: #e5e7eb;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
      }

      .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-2px);
      }

      /* Animations */
      @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
          .custom-popup {
              flex-direction: column;
              max-width: 95%;
          }

          .night-sky {
              min-height: 200px;
              border-radius: 15px 15px 0 0;
          }

          .form-side {
              border-radius: 0 0 15px 15px;
          }

          .form-row {
              flex-direction: column;
          }
      }
      </style>

      <div class="custom-popup">
          <!-- Night sky with clouds and planes (LEFT SIDE) -->
          <div class="night-sky">
              <div class="stars">
                  <!-- Generate stars dynamically -->

              </div>

              <div class="moon"></div>

              <div class="cloud-container">
                  <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" class="cloud c1" alt="Nube">
                  <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" class="cloud c2" alt="Nube">
                  <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" class="cloud c3" alt="Nube">
              </div>

              <div class="plane-animation">
                  <span class="plane">
                      <img src="https://imgs.search.brave.com/dkOnHLGEUuQqnGU2uVXTeSR3fd7g0A-X8wE-T8v8wC4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL3RodW1icy81/ODBiNTg1YjJlZGJj/ZTI0YzQ3YjJkMTAu/cG5n" alt="Avión" width="80">
                  </span>
              </div>
              <p class="agency-subtitle">Viaja Fácil - La mejor experiencia</p>
          </div>

          <!-- Form side (RIGHT SIDE) -->
          <div class="form-side">
              <div class="form-title">Editar Detalles del Viaje</div>
              <div class="swal-container">
                  <div class="form-row">
                      <div class="form-column">
                          <label class="swal-label" for="cliente">Nombre del Cliente</label>
                          <input id="cliente" class="swal-input" type="text" value="${
                            costo.nombre
                          }">

                          <label class="swal-label" for="montoPendiente">Monto Pendiente</label>
                          <input id="montoPendiente" class="swal-input" type="number" value="${
                            costo.montoPendiente
                          }">

                          <label class="swal-label" for="estado">Estado del Pago</label>
                          <select id="estado" class="swal-input">
                              <option value="Pendiente" ${
                                costo.estado === "Pendiente" ? "selected" : ""
                              }>Pendiente</option>
                              <option value="Pagado" ${
                                costo.estado === "Pagado" ? "selected" : ""
                              }>Pagado</option>
                          </select>

                          <label class="swal-label" for="pasajeros">Total pasajeros</label>
                          <input id="pasajeros" class="swal-input" type="number" value="${
                            costo.pasajeros
                          }">
                      </div>

                      <div class="form-column">
                          <label class="swal-label" for="servicio">Servicio</label>
                          <input id="servicio" class="swal-input" type="text" value="${
                            costo.servicio
                          }">

                          <label class="swal-label" for="montoPagado">Monto Pagado</label>
                          <input id="montoPagado" class="swal-input" type="number" value="${
                            costo.montoPagado
                          }">

                          <label class="swal-label" for="Area">Area de Venta</label>
                          <select id="Area" class="swal-input">
                            <option value="Sur" ${
                              costo.Area === "Sur" ? "selected" : ""
                            }>Sur</option>
                            <option value="Norte" ${
                              costo.Area === "Norte" ? "selected" : ""
                            }>Norte</option>
                          </select>
                      </div>
                  </div>

                  <div class="section-divider"></div>

                  <div class="full-width">
                      <label class="swal-label" for="archivo">Comprobante de Pago</label>
                      ${
                        costo.archivo
                          ? `
                      <div class="current-file">
                          <i class="fas fa-file-pdf current-file-icon"></i>
                          <span class="current-file-name">Archivo actual: ${
                            costo.archivoNombre || "comprobante.pdf"
                          }</span>
                      </div>`
                          : ""
                      }

                      <label for="archivo" class="file-upload-container">
                          <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                          <span class="file-upload-text">Seleccione o arrastre un nuevo comprobante PDF</span>
                          <input id="archivo" type="file" accept="application/pdf">
                      </label>

                      <div id="fileInfo" class="file-info">
                          <i class="fas fa-file-pdf file-icon"></i>
                          <span id="fileName" class="file-name"></span>
                          <i class="fas fa-times file-remove" id="removeFile"></i>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: "custom-popup",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-secondary",
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        preConfirm: () => {
          const nombre = document.getElementById("cliente").value.trim();
          const servicio = document.getElementById("servicio").value.trim();
          const montoPendiente = document
            .getElementById("montoPendiente")
            .value.trim();
          const montoPagado = document
            .getElementById("montoPagado")
            .value.trim();
          const pasajeros = parseInt(
            document.getElementById("pasajeros").value
          );
          const estado = document.getElementById("estado").value;
          const archivo = document.getElementById("archivo").files[0] || null;

          if (
            !nombre ||
            !servicio ||
            !montoPendiente ||
            !montoPagado ||
            !estado ||
            !pasajeros
          ) {
            Swal.showValidationMessage("⚠️ Todos los campos son obligatorios");
            return false;
          }

          return {
            nombre,
            servicio,
            montoPendiente,
            montoPagado,
            estado,
            pasajeros,
            archivo,
          };
        },
      });

      // ✅ Si se canceló explícitamente
      if (dismissReason === Swal.DismissReason.cancel) {
        location.reload(); // solo aquí se recarga en cancelar
        return;
      }

      // ✅ Si no se envió el formulario correctamente
      if (!formValues) {
        return;
      }

      // ✅ Si llegó aquí, actualizamos
      const formData = new FormData();
      formData.append("nombre", formValues.nombre);
      formData.append("servicio", formValues.servicio);
      formData.append("montoPendiente", formValues.montoPendiente);
      formData.append("montoPagado", formValues.montoPagado);
      formData.append("estado", formValues.estado);
      formData.append("Area", document.getElementById("Area").value);
      formData.append("pasajeros", formValues.pasajeros);
      if (formValues.archivo) {
        formData.append("archivo", formValues.archivo);
      }

      try {
        document
          .querySelector(".swal2-confirm")
          .setAttribute("disabled", "true");

        await axios.put(
          `https://backmultidestinos.onrender.com/Liquidacion_Costos/modificar/${costo.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        await Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "🎉 Información actualizada correctamente",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });

        location.reload();
      } catch (error) {
        console.error("Error al actualizar:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "❌ Error al actualizar la información",
          confirmButtonText: "Entendido",
          timer: 1500,
        });
        location.reload();
      }
    },

    async eliminarCosto(id) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el registro y su archivo adjunto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        backdrop: `
          rgba(0,0,123,0.4)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://backmultidestinos.onrender.com/Liquidacion_Costos/eliminar/${id}`
          );
          this.costos = this.costos.filter((c) => c.id !== id);

          Swal.fire({
            title: "Eliminado",
            text: "🧹 Registro y archivo eliminados correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error al eliminar:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el registro",
            icon: "error",
          });
        }
      }
    },

    mostrarAlertaAgregarPago() {
      Swal.fire({
        title: "Control de clientes",
        html: this.generarHTMLFormularioPago(),
        showCancelButton: true,
        confirmButtonText: "Registrar Pago",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#2196f3",
        cancelButtonColor: "#d33",
        width: "auto", // Control del ancho de la alerta (ahora auto para que se ajuste)
        padding: "0", // Eliminar el padding para aprovechar mejor el espacio
        customClass: {
          popup: "custom-popup",
          container: "custom-container",
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCloseButton: true,
        didOpen: this.configurarInteraccionAlerta,
        willClose: this.animarCierreAlerta,
        preConfirm: this.validarFormularioPago,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const {
            nombre,
            servicio,
            montoPendiente,
            montoPagado,
            estado,
            Area,
            pasajeros,
            archivo,
          } = result.value;

          try {
            const formData = new FormData();
            formData.append("nombre", nombre);
            formData.append("servicio", servicio);
            formData.append("montoPendiente", montoPendiente);
            formData.append("montoPagado", montoPagado);
            formData.append("estado", estado);
            formData.append("Area", Area);
            formData.append("pasajeros", pasajeros);
            formData.append("archivo", archivo);

            const response = await fetch(
              "https://backmultidestinos.onrender.com/liquidacion_Costos/registrar",
              {
                method: "POST",
                body: formData,
              }
            );

            if (!response.ok) {
              throw new Error("Error al registrar el pago");
            }

            Swal.fire({
              title: "¡Éxito!",
              text: "El pago ha sido registrado correctamente.",
              icon: "success",
              confirmButtonColor: "#2196f3",
              width: "350px",
            });
          } catch (error) {
            console.error("Error:", error);
            Swal.fire({
              title: "Error",
              text: "No se pudo registrar el pago. Inténtalo nuevamente.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          console.log("Operación cancelada");
        }
      });
    },
    generarHTMLFormularioPago() {
      return `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-a..." crossorigin="anonymous" referrerpolicy="no-referrer" />

        <style>
          /* Base styles */
          .custom-popup {
              width: 500%;
              max-width: 575px;
              border-radius: 15px;
              overflow: hidden;
              animation: fadeIn 0.8s ease-out;
              position: relative;
              background: #ffffff;
          }

          .custom-header {
              background: linear-gradient(90deg, #1976d2, #2196f3);
              padding: 20px;
              text-align: center;
              position: relative;
              color: white;
              height: 140px;
              margin: -32px -32px 20px -32px;
              border-radius: 30px 30px 0 0;
              overflow: hidden;
          }

          .agency-subtitle {
              font-size: 1.1rem;
              font-weight: bold;
              opacity: 0.9;
              margin-top: 40px;
              position: relative;
              z-index: 1;
          }

          /* Contenedor de nubes */
          .cloud-container {
              position: absolute;
              width: 100%;
              height: 100px;
              top: 10px;
              left: 0;
              z-index: 1;
              overflow: hidden;
          }

          /* Estilos de las nubes */
          .cloud {
              position: absolute;
              width: 100px;
              opacity: 0.8;
              animation: moveClouds 10s linear infinite alternate;
          }

          /* Movimiento de nubes de izquierda a derecha */
          .cloud.left {
              animation-direction: normal;
          }

          .cloud.right {
              animation-direction: reverse;
          }

          /* Keyframes para nubes */
          @keyframes moveClouds {
              0% {
                  transform: translateX(-100px);
              }
              100% {
                  transform: translateX(100%);
              }
          }

         /* Animación de avión volando */
          .plane-animation {
              position: relative;
              height: 40px;
              margin-top: 5px;
          }

          .plane {
              position: absolute;
              font-size: 28px;
              color: white;
              opacity: 0.9;
              animation: flyPlane 3s infinite;
              transform: rotate(-5deg);
          }

          @keyframes flyPlane {
              0% {
                  left: -30px;
                  top: 0;
              }
              50% {
                  left: 50%;
                  top: -10px;
              }
              100% {
                  left: 85%;
                  top: 0;
              }
          }

          /* Avión aterrizando */
          .landing-plane-container {
              position: absolute;
              width: 100%;
              height: 60px;
              top: 20px;
              left: 0;
              z-index: 5;
              overflow: visible;
          }

          @keyframes planeLanding {
              0% {
                  left: 80%;
                  top: -20px;
                  transform: rotate(10deg) scale(1);
                  opacity: 0.7;
              }
              40% {
                  left: 50%;
                  top: 10px;
                  transform: rotate(0deg) scale(1.1);
                  opacity: 0.8;
              }
              80% {
                  left: 30%;
                  top: 25px;
                  transform: rotate(-5deg) scale(1.2);
                  opacity: 0.9;
              }
              100% {
                  left: 20%;
                  top: 30px;
                  transform: rotate(-10deg) scale(1.3);
                  opacity: 1;
              }
          }

          .landing-plane {
              position: absolute;
              font-size: 32px;
              color: white;
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
              animation: planeLanding 3s ease-in-out infinite alternate;
          }

          /* Responsividad */
          @media (max-width: 580px) {
              .form-column {
                  flex-basis: 100%;
              }
          }

          /* Form container and two-column layout */
          .swal-container {
            padding: 0 10px;
          }

          .form-row {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10px;
          }

          .form-column {
            flex: 1;
            padding: 0 10px;
            min-width: 250px;
          }

          .full-width {
            flex-basis: 100%;
            padding: 0 10px;
          }

          .swal-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 0.9rem;
            text-align: left;
            margin-top: 15px;
          }

          .swal-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s;
            margin-bottom: 5px;
          }

          .swal-input:focus {
            border-color: #2196f3;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
            outline: none;
          }

          .file-upload-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #f5f5f5;
            border: 2px dashed #2196f3;
            border-radius: 8px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 5px;
          }

          .file-upload-container:hover {
            background: #e3f2fd;
          }

          .file-upload-icon {
            font-size: 24px;
            color: #2196f3;
            margin-bottom: 10px;
          }

          .file-upload-text {
            color: #555;
            font-size: 0.9rem;
            text-align: center;
          }

          #archivo {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
          }

          .swal2-popup.swal2-modal.custom-popup.swal2-hide {
            animation: fadeOut 0.5s forwards !important;
          }

          .swal2-confirm {
            background: linear-gradient(90deg, #1976d2, #2196f3) !important;
            box-shadow: 0 3px 5px rgba(33, 150, 243, 0.3) !important;
            transition: all 0.3s !important;
          }

          .swal2-confirm:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 10px rgba(33, 150, 243, 0.4) !important;
          }

          @media (max-width: 580px) {
            .form-column {
              flex-basis: 100%;
            }
          }
        </style>

        <div class="custom-header">
            <div class="cloud-container">
                <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" class="cloud left" alt="Nube">
                <img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" class="cloud right" alt="Nube">
            </div>
            <div class="plane-animation">
                <span class="plane">
                  <img src="https://imgs.search.brave.com/dkOnHLGEUuQqnGU2uVXTeSR3fd7g0A-X8wE-T8v8wC4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL3RodW1icy81/ODBiNTg1YjJlZGJj/ZTI0YzQ3YjJkMTAu/cG5n"
            alt="Avión" width="100">
                  </span>
            </div>
            <div class="landing-plane-container">
                <span class="landing-plane">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/038/363/072/small_2x/ai-generated-side-view-of-commercial-airplane-isolated-on-transparent-background-passenger-plane-generative-ai-png.png"
            alt="Avión" width="100">
                  </span>
            </div>
            <p class="agency-subtitle">Viaja Fácil - La mejor experiencia</p>
        </div>


        <div class="swal-container">
          <div class="form-row">
            <!-- Left Column -->
            <div class="form-column">
              <label class="swal-label" for="cliente">Nombre del Cliente</label>
              <input id="cliente" class="swal-input" type="text" placeholder="Ingrese el nombre completo">

              <label class="swal-label" for="montoPendiente">Monto Pendiente</label>
              <input id="montoPendiente" class="swal-input" type="number" placeholder="Ingrese el monto en pesos">

              <label class="swal-label" for="estado">Estado del Pago</label>
              <select id="estado" class="swal-input">
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
              </select>

              <label class="swal-label" for="pasajeros">Total pasajeros</label>
              <input id="pasajeros" class="swal-input" type="number" min="1" required placeholder="Ingrese pasajeros">

            </div>

            <!-- Right Column -->
            <div class="form-column">
              <label class="swal-label" for="servicio">Servicio</label>
              <input id="servicio" class="swal-input" type="text" placeholder="Ingrese el servicio contratado">

              <label class="swal-label" for="montoPagado">Monto Pagado</label>
              <input id="montoPagado" class="swal-input" type="number" placeholder="Ingrese el monto en pesos">

              <label class="swal-label" for="Area">Area de Venta</label>
              <select id="Area" class="swal-input">
                <option value="Sur">Sur</option>
                <option value="Norte">Norte</option>
              </select>
            </div>

            <!-- Full Width Element -->
            <div class="full-width">
              <label class="swal-label" for="archivo">Subir Comprobante</label>
              <label for="archivo" class="file-upload-container">
                <i class="fas fa-cloud-upload-alt file-upload-icon"></i>
                <span class="file-upload-text">Seleccione o arrastre su archivo PDF</span>
                <input id="archivo" type="file" accept="application/pdf">
              </label>
            </div>
          </div>
        </div>
      `;
    },
    configurarInteraccionAlerta() {
      const fileInput = document.getElementById("archivo");
      const fileLabel = document.querySelector(".file-upload-text");
      fileInput.addEventListener("change", function () {
        fileLabel.textContent =
          this.files.length > 0
            ? this.files[0].name
            : "Seleccione o arrastre su archivo PDF";
      });

      const urlParams = new URLSearchParams(window.location.search);
      const size = urlParams.get("size");
      if (size === "large") {
        document.documentElement.style.setProperty("--swal-width", "650px");
      } else if (size === "small") {
        document.documentElement.style.setProperty("--swal-width", "450px");
      } else {
        document.documentElement.style.setProperty("--swal-width", "550px");
      }
    },

    animarCierreAlerta() {
      return new Promise((resolve) => {
        nextTick(() => {
          const popup = document.querySelector(".swal2-popup.custom-popup");
          if (popup) {
            popup.classList.add("swal2-hide");
            setTimeout(() => {
              resolve();
            }, 500);
          } else {
            resolve();
          }
        });
      });
    },

    validarFormularioPago() {
      const nombre = document.getElementById("cliente")?.value?.trim();
      const servicio = document.getElementById("servicio")?.value?.trim();
      const montoPendiente = parseFloat(
        document.getElementById("montoPendiente")?.value || "0"
      );
      const montoPagado = parseFloat(
        document.getElementById("montoPagado")?.value || "0"
      );
      const estado = document.getElementById("estado")?.value?.trim();
      const Area = document.getElementById("Area")?.value?.trim();

      const pasajerosInput = document.getElementById("pasajeros")?.value;
      const pasajeros =
        pasajerosInput && !isNaN(pasajerosInput)
          ? parseInt(pasajerosInput, 10)
          : 0;

      const archivo = document.getElementById("archivo")?.files[0];

      // Validación básica
      if (
        !nombre ||
        !servicio ||
        !estado ||
        !Area ||
        (montoPendiente <= 0 && montoPagado <= 0) ||
        !archivo ||
        pasajeros <= 0
      ) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      return {
        nombre,
        servicio,
        montoPendiente,
        montoPagado,
        estado,
        Area,
        pasajeros,
        archivo,
      };
    },

    async cargarCostos() {
      try {
        const response = await fetch(
          "https://backmultidestinos.onrender.com/Liquidacion_Costos/listar"
        );
        const data = await response.json();

        // Aquí 'data' es el array que te devuelve tu backend
        this.costos = data.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          servicio: item.servicio,
          montoPendiente: item.montoPendiente,
          montoPagado: item.montoPagado,
          estado: item.estado,
          Area: item.Area,
          pasajeros: item.pasajeros,
          archivo: item.archivo,
        }));
      } catch (error) {
        console.error("Error al cargar pagos:", error);
      }
    },

    async mounted() {
      await this.cargarCostos();
      await this.cargarUsuarios(); // crea esta función para obtener usuarios con su área
    },

    async cargarUsuarios() {
      const res = await fetch(
        "https://backmultidestinos.onrender.com/usuarios/listar"
      );
      const data = await res.json();
      this.usuarios = data; // asegúrate que tengan la propiedad "Area"
    },
  },
};
</script>

<style scoped>
.animated-page {
  animation: fadeIn 0.5s ease-in-out;
}

.animated-card {
  border-radius: 16px;
  transition: transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
}

.animated-card:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.animated-progress {
  transition: width 1.5s ease-in-out;
}

.animated-button:hover {
  transform: scale(1.08);
}

.animated-icon:hover {
  transform: scale(1.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/*------------------------------------------------------------------------------------------------------*/

/* Estilos base */
.custom-popup {
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.custom-header {
  background: linear-gradient(90deg, #1976d2, #2196f3);
  padding: 20px;
  text-align: center;
  position: relative;
  color: white;
  height: 100px;
  margin: -32px -32px 20px -32px;
  border-radius: 15px 15px 0 0;
}

.agency-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 5px;
}

.plane-animation {
  position: relative;
  height: 40px;
  margin-top: 5px;
}

.plane {
  position: absolute;
  font-size: 24px;
  color: white;
  opacity: 0.9;
  animation: flyPlane 3s infinite;
  transform: rotate(-5deg);
}

@keyframes flyPlane {
  0% {
    left: -30px;
    top: 0;
  }
  50% {
    left: 50%;
    top: -10px;
  }
  100% {
    left: 110%;
    top: 0;
  }
}

.swal-container {
  padding: 0 10px;
}

.swal-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
  text-align: left;
  margin-top: 15px;
}

.swal-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.swal-input:focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  outline: none;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f5;
  border: 2px dashed #2196f3;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 5px;
}

.file-upload-container:hover {
  background: #e3f2fd;
}

.file-upload-icon {
  font-size: 24px;
  color: #2196f3;
  margin-bottom: 10px;
}

.file-upload-text {
  color: #555;
  font-size: 0.9rem;
  text-align: center;
}

/* Ocultar el input de archivo real */
#archivo {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ajustar los botones de SweetAlert */
.swal2-confirm {
  background: linear-gradient(90deg, #1976d2, #2196f3) !important;
  box-shadow: 0 3px 5px rgba(33, 150, 243, 0.3) !important;
  transition: all 0.3s !important;
}

.swal2-confirm:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 5px 10px rgba(33, 150, 243, 0.4) !important;
}

/*------------------------------------------------------------------------------------------------------*/
</style>
