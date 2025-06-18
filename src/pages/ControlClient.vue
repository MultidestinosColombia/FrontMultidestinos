<template>
  <q-page class="travel-clients-page">
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
    <!-- Header con gradiente -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <q-icon name="flight" size="2.5rem" class="header-icon" />
          <div>
            <h1 class="main-title">Gestión de Clientes</h1>
            <p class="subtitle">Sistema de administración de clientes de la agencia</p>
          </div>
        </div>
        <q-btn
          @click="mostrarModalAgregar"
          label="Nuevo Cliente"
          icon="person_add"
          class="add-client-btn"
          size="lg"
          no-caps
        />
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-container">
      <div class="stat-card zona1">
        <q-icon name="location_city" size="2rem" />
        <div class="stat-content">
          <div class="stat-number">{{ clientesZona1.length }}</div>
          <div class="stat-label">Clientes Zona 1</div>
        </div>
      </div>
      <div class="stat-card zona2">
        <q-icon name="apartment" size="2rem" />
        <div class="stat-content">
          <div class="stat-number">{{ clientesZona2.length }}</div>
          <div class="stat-label">Clientes Zona 2</div>
        </div>
      </div>
      <div class="stat-card total">
        <q-icon name="groups" size="2rem" />
        <div class="stat-content">
          <div class="stat-number">{{ clientes.length }}</div>
          <div class="stat-label">Total Clientes</div>
        </div>
      </div>
    </div>

    <!-- Tablas por Zona -->
    <div class="tables-container">
      <!-- Zona 1 -->
      <div class="zone-section zona1-section">
        <div class="zone-header zona1-header">
          <q-icon name="location_city" size="1.5rem" />
          <h2>Zona 1 - Bogotá</h2>
          <q-chip :label="`${clientesZona1.length} clientes`" class="zone-chip zona1-chip" />
        </div>

         <q-table
            :rows="clientesZona1"
            :columns="columnas"
            row-key="id"
            pagination="paginationZona1"
            class="clients-table zona1-table"
            :loading="loading"
            separator="cell"
          >


          <template v-slot:body-cell-correo="props">
            <q-td :props="props">
              <div class="email-chips">
                <q-chip
                  v-for="(correo, index) in props.row.correo.split(',')"
                  :key="index"
                  :label="correo.trim()"
                  class="email-chip"
                  dense
                  outline
                  color="primary"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <div class="action-buttons">
                <q-btn
                  @click="editarCliente(props.row)"
                  icon="edit"
                  class="action-btn edit-btn"
                  dense
                  round
                  flat
                />
                <q-btn
                  @click="eliminarCliente(props.row.id, props.row.nombre)"
                  icon="delete"
                  class="action-btn delete-btn"
                  dense
                  round
                  flat
                />
                <q-btn
                  @click="verDetalles(props.row)"
                  icon="visibility"
                  class="action-btn view-btn"
                  dense
                  round
                  flat
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Zona 2 -->
      <div class="zone-section zona2-section">
        <div class="zone-header zona2-header">
          <q-icon name="apartment" size="1.5rem" />
          <h2>Zona 2 - Cali</h2>
          <q-chip :label="`${clientesZona2.length} clientes`" class="zone-chip zona2-chip" />
        </div>

        <q-table
          :rows="clientesZona2"
          :columns="columnas"
          row-key="id"
          pagination="paginationZona2"
          class="clients-table zona2-table"
          :loading="loading"
          separator="cell"
        >
          <template v-slot:body-cell-correo="props">
            <q-td :props="props">
              <div class="email-chips">
                <q-chip
                  v-for="(correo, index) in props.row.correo.split(',')"
                  :key="index"
                  :label="correo.trim()"
                  class="email-chip"
                  dense
                  outline
                  color="secondary"
                />
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <div class="action-buttons">
                <q-btn
                  @click="editarCliente(props.row)"
                  icon="edit"
                  class="action-btn edit-btn"
                  dense
                  round
                  flat
                />
                <q-btn
                  @click="eliminarCliente(props.row.id, props.row.nombre)"
                  icon="delete"
                  class="action-btn delete-btn"
                  dense
                  round
                  flat
                />
                <q-btn
                  @click="verDetalles(props.row)"
                  icon="visibility"
                  class="action-btn view-btn"
                  dense
                  round
                  flat
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Overlay de carga -->
    <q-inner-loading :showing="loading" class="loading-overlay">
      <q-spinner-grid size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import Swal from 'sweetalert2';

export default {
  name: "ClientesPage",
  data() {
    return {
      clientes: [],
      loading: false,
      rolUsuarioActual: null,
      zonas: ['Zona 1', 'Zona 2'],
      usuariosPorZona: {
        'Zona 1': [],
        'Zona 2': []
      },
      paginationZona1: {
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 5, // 👈 perfecto
        rowsNumber: 0
      },

      paginationZona2: {
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      columnas: [
        { name: "nombre", label: "Nombre", align: "left", field: "nombre", sortable: true },
        { name: "correo", label: "Correos", align: "left", field: "correo" },
        { name: "contacto", label: "Contacto", align: "left", field: "contacto" },
        { name: "telefono", label: "Teléfono", align: "left", field: "telefono" },
        { name: "nit", label: "NIT", align: "left", field: "nit" },
        { name: "direccion", label: "Dirección", align: "left", field: "direccion" },
        { name: "acciones", label: "Acciones", align: "center", field: "acciones" }
      ]
    };
  },

  computed: {
    clientesZona1() {
      return this.clientes.filter(cliente => cliente.zona === 'Zona 1');
    },
    clientesZona2() {
      return this.clientes.filter(cliente => cliente.zona === 'Zona 2');
    }
  },

  mounted() {
    this.inicializar();
  },

  methods: {
    async inicializar() {
      try {
        this.loading = true;
        await this.obtenerRolUsuarioActual();
        await this.cargarZonasYUsuarios();
        await this.cargarClientes();
      } catch (error) {
        console.error('Error al inicializar:', error);
        this.mostrarError('Error al cargar los datos iniciales');
      } finally {
        this.loading = false;
      }
    },

    async obtenerRolUsuarioActual() {
      const userData = LocalStorage.getItem("userData");
      if (userData && userData.rol) {
        this.rolUsuarioActual = userData.rol;
      } else {
        throw new Error("No se encontró el rol del usuario");
      }
    },

    async cargarZonasYUsuarios() {
      try {
        const response = await fetch("https://backmultidestinos.onrender.com/user/zona/zona");
        if (!response.ok) throw new Error("Error al cargar zonas y usuarios");

        const data = await response.json();
        const zonas = { "Zona 1": [], "Zona 2": [] };

        data.forEach(usuario => {
          if (zonas[usuario.zona]) {
            zonas[usuario.zona].push({
              value: usuario.id,
              label: usuario.nombreCompleto
            });
          }
        });

        this.usuariosPorZona = zonas;
      } catch (error) {
        console.error('Error al cargar zonas:', error);
        throw error;
      }
    },

    async cargarClientes() {
      try {
        const response = await fetch("https://backmultidestinos.onrender.com/cliente");
        if (!response.ok) throw new Error("Error al cargar clientes");

        const data = await response.json();
        this.clientes = data.map(cliente => ({
          id: cliente.id,
          nombre: cliente.nombre || "",
          ciudad: cliente.ciudad || "",
          correo: cliente.correo || "",
          direccion: cliente.direccion || "",
          contacto: cliente.contacto || "",
          telefono: cliente.telefono || "",
          nit: cliente.nit || "",
          rnt: cliente.rnt || "",
          lmc: cliente.lmc || "",
          demas: cliente.demas || "",
          primerDeposito: cliente.primerDeposito || "",
          segundoDeposito: cliente.segundoDeposito || "",
          zona: cliente.zona || "",
          asesor: cliente.asesor || "",
          rteFuente: cliente.rteFuente || "",
          porcentajeIva: cliente.porcentajeIva || "",
          rteIca: cliente.rteIca || "",
          tipoBase: cliente.tipoBase || ""
        }));
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        throw error;
      }
    },

    async mostrarModalAgregar() {
      const { value: formValues } = await Swal.fire({
        title: '✈️ Nuevo Cliente',
        html: `
          <div class="swal-form">
            <div class="form-section">
              <h4><i class="fas fa-user"></i> Información Personal</h4>
              <input id="nombre" class="swal2-input" placeholder="Nombre completo" required>
              <input id="contacto" class="swal2-input" placeholder="Persona de contacto">
              <input id="telefono" class="swal2-input" placeholder="Teléfono">
            </div>

            <div class="form-section">
              <h4><i class="fas fa-envelope"></i> Correos Electrónicos</h4>
              <input id="correos" class="swal2-input" placeholder="correo1@email.com, correo2@email.com">
            </div>

            <div class="form-section">
              <h4><i class="fas fa-map-marker-alt"></i> Ubicación</h4>
              <select id="ciudad" class="swal2-select">
                <option value="">Seleccionar ciudad</option>
                <option value="BOGOTA">Bogotá</option>
                <option value="CALI">Cali</option>
              </select>
              <input id="direccion" class="swal2-input" placeholder="Dirección completa">
            </div>

            <div class="form-section">
              <h4><i class="fas fa-building"></i> Información Empresarial</h4>
              <input id="nit" class="swal2-input" placeholder="NIT">
              <input id="rnt" class="swal2-input" placeholder="RNT">
              <input id="lmc" class="swal2-input" placeholder="LMC" required>
              <input id="demas" class="swal2-input" placeholder="Demás" required>
            </div>

            <div class="form-section">
              <h4><i class="fas fa-money-bill"></i> Información Financiera</h4>
              <input id="primerDeposito" class="swal2-input" placeholder="Primer Depósito">
              <input id="segundoDeposito" class="swal2-input" placeholder="Segundo Depósito">
              <select id="tipoBase" class="swal2-select">
                <option value="">Tipo de Base</option>
                <option value="Comisión">Comisión</option>
                <option value="Descuento">Descuento</option>
              </select>
            </div>

            <div class="form-section">
              <h4><i class="fas fa-map"></i> Zona y Asesor</h4>
              <select id="zona" class="swal2-select">
                <option value="">Seleccionar zona</option>
                <option value="Zona 1">Zona 1</option>
                <option value="Zona 2">Zona 2</option>
              </select>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear Cliente',
        cancelButtonText: 'Cancelar',
        width: '800px',
        customClass: {
          popup: 'custom-swal-popup',
          confirmButton: 'custom-swal-confirm',
          cancelButton: 'custom-swal-cancel'
        },
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value;
          const lmc = document.getElementById('lmc').value;
          const demas = document.getElementById('demas').value;

          if (!nombre || !lmc || !demas) {
            Swal.showValidationMessage('Por favor complete los campos obligatorios');
            return false;
          }

          return {
            nombre: nombre,
            contacto: document.getElementById('contacto').value,
            telefono: document.getElementById('telefono').value,
            correos: document.getElementById('correos').value,
            ciudad: document.getElementById('ciudad').value,
            direccion: document.getElementById('direccion').value,
            nit: document.getElementById('nit').value,
            rnt: document.getElementById('rnt').value,
            lmc: lmc,
            demas: demas,
            primerDeposito: document.getElementById('primerDeposito').value,
            segundoDeposito: document.getElementById('segundoDeposito').value,
            tipoBase: document.getElementById('tipoBase').value,
            zona: document.getElementById('zona').value
          };
        }
      });

      if (formValues) {
        await this.crearCliente(formValues);
      }
    },

    async crearCliente(datos) {
      try {
        this.loading = true;
        const response = await fetch("https://backmultidestinos.onrender.com/cliente/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...datos,
            correo: datos.correos,
            asesor: datos.zona ? this.usuariosPorZona[datos.zona][0]?.value : null
          })
        });

        if (!response.ok) throw new Error("Error al crear cliente");

        await Swal.fire({
          icon: 'success',
          title: '¡Cliente creado!',
          text: 'El cliente ha sido registrado exitosamente',
          timer: 2000,
          showConfirmButton: false
        });

        await this.cargarClientes();
      } catch (error) {
        console.error('Error al crear cliente:', error);
        this.mostrarError('Error al crear el cliente');
      } finally {
        this.loading = false;
      }
    },

    async editarCliente(cliente) {
      if (!this.verificarPermisos(['administrador'])) return;

      try {
        const response = await fetch(`https://backmultidestinos.onrender.com/user/${cliente.asesor}`);
        const userData = await response.json();

        // Procesar correos existentes
        const correosExistentes = cliente.correo ? cliente.correo.split(',').map(email => email.trim()).filter(email => email) : [];

        // Crear HTML para correos dinámicamente
        const generarCorreosHtml = (correos) => {
          if (correos.length === 0) {
            return `
              <div class="email-field-container" data-index="0">
                <div class="input-group">
                  <input id="correo_0" class="swal2-input email-input" placeholder="Correo electrónico" value="" type="email">
                  <button type="button" class="remove-email-btn" onclick="window.removeEmailField(0)" style="display:none">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `;
          }

          return correos.map((email, index) => `
            <div class="email-field-container" data-index="${index}">
              <div class="input-group">
                <input id="correo_${index}" class="swal2-input email-input" placeholder="Correo electrónico" value="${email.replace(/"/g, '&quot;')}" type="email">
                <button type="button" class="remove-email-btn" onclick="window.removeEmailField(${index})" ${correos.length <= 1 ? 'style="display:none"' : ''}>
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `).join('');
        };

        // Funciones globales para manejo de correos
        window.emailCounter = correosExistentes.length > 0 ? correosExistentes.length : 1;

        window.addEmailField = () => {
          const container = document.getElementById('emails-container');
          const newFieldHtml = `
            <div class="email-field-container" data-index="${window.emailCounter}">
              <div class="input-group">
                <input id="correo_${window.emailCounter}" class="swal2-input email-input" placeholder="Correo electrónico" value="" type="email">
                <button type="button" class="remove-email-btn" onclick="window.removeEmailField(${window.emailCounter})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `;
          container.insertAdjacentHTML('beforeend', newFieldHtml);
          window.emailCounter++;
          window.updateRemoveButtons();
        };

        window.removeEmailField = (index) => {
          const field = document.querySelector(`[data-index="${index}"]`);
          if (field) {
            field.remove();
            window.updateRemoveButtons();
          }
        };

        window.updateRemoveButtons = () => {
          const emailFields = document.querySelectorAll('.email-field-container');
          const removeButtons = document.querySelectorAll('.remove-email-btn');

          removeButtons.forEach(btn => {
            btn.style.display = emailFields.length > 1 ? 'flex' : 'none';
          });
        };

        const { value: formValues } = await Swal.fire({
          title: `<i class="fas fa-edit text-primary"></i> Editar Cliente`,
          html: `
            <style>
              .travel-form {
                max-height: 70vh;
                overflow-y: auto;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              }

              .form-section {
                background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
                border: 1px solid #e1e8f0;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
              }

              .form-section:hover {
                box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                transform: translateY(-2px);
              }

              .section-title {
                color: #2c5aa0;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                border-bottom: 2px solid #e1e8f0;
                padding-bottom: 8px;
              }

              .section-title i {
                color: #4a90e2;
                font-size: 18px;
              }

              .client-name {
                background: linear-gradient(135deg, #4a90e2, #357abd);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 700;
                font-size: 18px;
              }

              .swal2-input, .swal2-select {
                border: 2px solid #e1e8f0 !important;
                border-radius: 8px !important;
                padding: 12px 16px !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
                background: #ffffff !important;
                margin: 8px 0 !important;
              }

              .swal2-input:focus, .swal2-select:focus {
                border-color: #4a90e2 !important;
                box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1) !important;
                outline: none !important;
              }

              .input-group {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
              }

              .email-input {
                flex: 1;
                margin: 0 !important;
              }

              .remove-email-btn {
                background: #ff4757;
                border: none;
                border-radius: 6px;
                color: white;
                padding: 8px 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .remove-email-btn:hover {
                background: #ff3838;
                transform: scale(1.05);
              }

              .add-email-btn {
                background: linear-gradient(135deg, #26c281, #20a66b);
                border: none;
                border-radius: 8px;
                color: white;
                padding: 10px 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 10px;
                box-shadow: 0 2px 8px rgba(38, 194, 129, 0.3);
              }

              .add-email-btn:hover {
                background: linear-gradient(135deg, #20a66b, #1a8f5a);
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(38, 194, 129, 0.4);
              }

              .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
              }

              .form-full {
                grid-column: span 2;
              }

              .travel-icon {
                color: #4a90e2;
                margin-right: 8px;
              }

              @media (max-width: 768px) {
                .form-row {
                  grid-template-columns: 1fr;
                }
                .form-full {
                  grid-column: span 1;
                }
              }
            </style>

            <div class="travel-form">
              <div style="text-align: center; margin-bottom: 25px;">
                <h3 class="client-name">${cliente.nombre.replace(/"/g, '&quot;')}</h3>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">
                  <i class="fas fa-plane travel-icon"></i>
                  Gestión de Cliente - Multidestinos
                </p>
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-user"></i>
                  Información Personal
                </div>
                <div class="form-row">
                  <input id="nombre" class="swal2-input" placeholder="Nombre completo *" value="${cliente.nombre.replace(/"/g, '&quot;')}" required>
                  <input id="contacto" class="swal2-input" placeholder="Persona de contacto" value="${(cliente.contacto || '').replace(/"/g, '&quot;')}">
                </div>
                <input id="telefono" class="swal2-input form-full" placeholder="Teléfono" value="${(cliente.telefono || '').replace(/"/g, '&quot;')}">
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-envelope"></i>
                  Correos Electrónicos
                </div>
                <div id="emails-container">
                  ${generarCorreosHtml(correosExistentes)}
                </div>
                <button type="button" class="add-email-btn" onclick="window.addEmailField()">
                  <i class="fas fa-plus"></i>
                  Agregar otro correo
                </button>
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-map-marker-alt"></i>
                  Ubicación
                </div>
                <div class="form-row">
                  <select id="ciudad" class="swal2-select">
                    <option value="BOGOTA" ${cliente.ciudad === 'BOGOTA' ? 'selected' : ''}>Bogotá</option>
                    <option value="CALI" ${cliente.ciudad === 'CALI' ? 'selected' : ''}>Cali</option>
                  </select>
                  <input id="direccion" class="swal2-input" placeholder="Dirección completa" value="${(cliente.direccion || '').replace(/"/g, '&quot;')}">
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-building"></i>
                  Información Empresarial
                </div>
                <div class="form-row">
                  <input id="nit" class="swal2-input" placeholder="NIT" value="${(cliente.nit || '').replace(/"/g, '&quot;')}">
                  <input id="rnt" class="swal2-input" placeholder="RNT" value="${(cliente.rnt || '').replace(/"/g, '&quot;')}">
                </div>
                <div class="form-row">
                  <input id="lmc" class="swal2-input" placeholder="LMC *" value="${(cliente.lmc || '').replace(/"/g, '&quot;')}" required>
                  <input id="demas" class="swal2-input" placeholder="Demás *" value="${(cliente.demas || '').replace(/"/g, '&quot;')}" required>
                </div>
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-money-bill-wave"></i>
                  Información Financiera
                </div>
                <div class="form-row">
                  <input id="primerDeposito" class="swal2-input" placeholder="Primer Depósito" value="${cliente.primerDeposito || ''}" type="number">
                  <input id="segundoDeposito" class="swal2-input" placeholder="Segundo Depósito" value="${cliente.segundoDeposito || ''}" type="number">
                </div>
                <select id="tipoBase" class="swal2-select form-full">
                  <option value="Comisión" ${cliente.tipoBase === 'Comisión' ? 'selected' : ''}>Comisión</option>
                  <option value="Descuento" ${cliente.tipoBase === 'Descuento' ? 'selected' : ''}>Descuento</option>
                </select>
              </div>

              <div class="form-section">
                <div class="section-title">
                  <i class="fas fa-map"></i>
                  Zona y Territorio
                </div>
                <select id="zona" class="swal2-select">
                  <option value="Zona 1" ${cliente.zona === 'Zona 1' ? 'selected' : ''}>Zona 1</option>
                  <option value="Zona 2" ${cliente.zona === 'Zona 2' ? 'selected' : ''}>Zona 2</option>
                </select>
              </div>
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: '<i class="fas fa-save"></i> Guardar Cambios',
          cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
          width: '900px',
          customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'custom-swal-confirm',
            cancelButton: 'custom-swal-cancel',
            title: 'custom-swal-title'
          },
          didOpen: () => {
            // Inicializar botones después de que se abra el modal
            window.updateRemoveButtons();

            // Estilos para botones
            const confirmBtn = document.querySelector('.custom-swal-confirm');
            const cancelBtn = document.querySelector('.custom-swal-cancel');

            if (confirmBtn) {
              confirmBtn.style.cssText = `
                background: linear-gradient(135deg, #4a90e2, #357abd) !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 24px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3) !important;
                transition: all 0.3s ease !important;
              `;
            }

            if (cancelBtn) {
              cancelBtn.style.cssText = `
                background: #6c757d !important;
                border: none !important;
                border-radius: 8px !important;
                padding: 12px 24px !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3) !important;
                transition: all 0.3s ease !important;
              `;
            }
          },
          preConfirm: () => {
            // Recopilar todos los correos
            const emailInputs = document.querySelectorAll('.email-input');
            const correos = Array.from(emailInputs)
              .map(input => input.value.trim())
              .filter(email => email && email.includes('@'))
              .join(', ');

            // Validar campos requeridos
            const nombre = document.getElementById('nombre').value.trim();
            const lmc = document.getElementById('lmc').value.trim();
            const demas = document.getElementById('demas').value.trim();

            if (!nombre) {
              Swal.showValidationMessage('El nombre es requerido');
              return false;
            }

            if (!lmc) {
              Swal.showValidationMessage('El campo LMC es requerido');
              return false;
            }

            if (!demas) {
              Swal.showValidationMessage('El campo Demás es requerido');
              return false;
            }

            return {
              nombre: nombre,
              contacto: document.getElementById('contacto').value.trim(),
              telefono: document.getElementById('telefono').value.trim(),
              correos: correos,
              ciudad: document.getElementById('ciudad').value,
              direccion: document.getElementById('direccion').value.trim(),
              nit: document.getElementById('nit').value.trim(),
              rnt: document.getElementById('rnt').value.trim(),
              lmc: lmc,
              demas: demas,
              primerDeposito: document.getElementById('primerDeposito').value.trim(),
              segundoDeposito: document.getElementById('segundoDeposito').value.trim(),
              tipoBase: document.getElementById('tipoBase').value,
              zona: document.getElementById('zona').value
            };
          }
        });

        if (formValues) {
          // Limpiar funciones globales
          delete window.emailCounter;
          delete window.addEmailField;
          delete window.removeEmailField;
          delete window.updateRemoveButtons;

          // Mostrar mensaje de éxito
          await Swal.fire({
            icon: 'success',
            title: '¡Cliente actualizado!',
            text: `Los datos de ${formValues.nombre} han sido actualizados correctamente.`,
            showConfirmButton: false,
            timer: 2000
          });

          await this.actualizarCliente(cliente.id, formValues);
        } else {
          // Limpiar funciones globales si se cancela
          delete window.emailCounter;
          delete window.addEmailField;
          delete window.removeEmailField;
          delete window.updateRemoveButtons;
        }

      } catch (error) {
        console.error('Error al editar cliente:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al cargar los datos del cliente. Por favor, inténtelo nuevamente.'
        });
      }
    },

    async actualizarCliente(id, datos) {
      try {
        this.loading = true;
        const response = await fetch(`https://backmultidestinos.onrender.com/cliente/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...datos,
            correo: datos.correos,
            asesor: datos.zona ? this.usuariosPorZona[datos.zona][0]?.value : null
          })
        });

        if (!response.ok) throw new Error("Error al actualizar cliente");

        await Swal.fire({
          icon: 'success',
          title: '¡Cliente actualizado!',
          text: 'Los cambios han sido guardados exitosamente',
          timer: 2000,
          showConfirmButton: false
        });

        await this.cargarClientes();
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
        this.mostrarError('Error al actualizar el cliente');
      } finally {
        this.loading = false;
      }
    },

    async eliminarCliente(id, nombre) {
      if (!this.verificarPermisos(['administrador', 'Asesor'])) return;

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Se eliminará permanentemente el cliente: ${nombre}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          confirmButton: 'custom-swal-delete',
          cancelButton: 'custom-swal-cancel'
        }
      });

      if (result.isConfirmed) {
        try {
          this.loading = true;
          const response = await fetch(`https://backmultidestinos.onrender.com/cliente/${id}`, {
            method: "DELETE"
          });

          if (!response.ok) throw new Error("Error al eliminar cliente");

          await Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado',
            text: 'El cliente ha sido eliminado exitosamente',
            timer: 2000,
            showConfirmButton: false
          });

          this.clientes = this.clientes.filter(cliente => cliente.id !== id);
        } catch (error) {
          console.error('Error al eliminar cliente:', error);
          this.mostrarError('Error al eliminar el cliente');
        } finally {
          this.loading = false;
        }
      }
    },

    async verDetalles(cliente) {
      await Swal.fire({
        title: `👤 ${cliente.nombre}`,
        html: `
          <div class="client-details">
            <div class="detail-section">
              <h4><i class="fas fa-info-circle"></i> Información General</h4>
              <p><strong>Ciudad:</strong> ${cliente.ciudad}</p>
              <p><strong>Contacto:</strong> ${cliente.contacto}</p>
              <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
              <p><strong>Dirección:</strong> ${cliente.direccion}</p>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-envelope"></i> Correos</h4>
              <p>${cliente.correo}</p>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-building"></i> Información Empresarial</h4>
              <p><strong>NIT:</strong> ${cliente.nit}</p>
              <p><strong>RNT:</strong> ${cliente.rnt}</p>
              <p><strong>LMC:</strong> ${cliente.lmc}</p>
              <p><strong>Demás:</strong> ${cliente.demas}</p>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-money-bill"></i> Información Financiera</h4>
              <p><strong>1er Depósito:</strong> ${cliente.primerDeposito}</p>
              <p><strong>2do Depósito:</strong> ${cliente.segundoDeposito}</p>
              <p><strong>Tipo Base:</strong> ${cliente.tipoBase}</p>
            </div>

            <div class="detail-section">
              <h4><i class="fas fa-map"></i> Zona</h4>
              <p><strong>Zona:</strong> ${cliente.zona}</p>
            </div>
          </div>
        `,
        width: '600px',
        customClass: {
          popup: 'custom-swal-details'
        }
      });
    },

    verificarPermisos(rolesPermitidos) {
      if (!rolesPermitidos.includes(this.rolUsuarioActual)) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No tienes permisos para realizar esta acción'
        });
        return false;
      }
      return true;
    },

    mostrarError(mensaje) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje
      });
    }
  }
};
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
  filter: brightness(0.6);
}

.travel-clients-page {
  min-height: 100vh;
  padding: 0;
}

/* Header */
.page-header {
  padding: 2rem;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.main-title {
  color: white;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-size: 1.1rem;
}

.add-client-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border-radius: 50px;
  padding: 12px 24px;
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
  transition: all 0.3s ease;
}

.add-client-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 90, 36, 0.6);
}

/* Estadísticas */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-card.zona1::before {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-card.zona2::before {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.stat-card.total::before {
  background: linear-gradient(135deg, #fa709a, #fee140);
}

.stat-card .q-icon {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.75rem;
  border-radius: 50%;
}

.stat-card.zona1 .q-icon {
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
}

.stat-card.zona2 .q-icon {
  color: #43e97b;
  background: rgba(67, 233, 123, 0.1);
}

.stat-card.total .q-icon {
  color: #fa709a;
  background: rgba(250, 112, 154, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

/* Contenedor de tablas */
.tables-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Secciones de zona */
.zone-section {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.zone-section:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.zone-header {
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  position: relative;
}

.zona1-header {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.zona2-header {
  background: linear-gradient(135deg, #43e97b, #38f9d7);
}

.zone-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  flex: 1;
}

.zone-chip {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  font-weight: 500;
}

/* Tablas */
.clients-table {
  background: white;
}

.clients-table .q-table__top {
  display: none;
}

.clients-table .q-table__middle {
  border-radius: 0;
}

.clients-table .q-table thead th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.clients-table .q-table tbody td {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.clients-table .q-table tbody tr:hover {
  background: #f8f9fa;
}

/* Chips de email */
.email-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.email-chip {
  font-size: 0.75rem;
  border-radius: 20px;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.edit-btn {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.edit-btn:hover {
  background: rgba(52, 152, 219, 0.2);
  transform: scale(1.1);
}

.delete-btn {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: scale(1.1);
}

.view-btn {
  color: #9b59b6;
  background: rgba(155, 89, 182, 0.1);
}

.view-btn:hover {
  background: rgba(155, 89, 182, 0.2);
  transform: scale(1.1);
}

/* Loading overlay */
.loading-overlay {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(5px);
}

/* SweetAlert2 personalizado */
:global(.custom-swal-popup) {
  border-radius: 15px;
  padding: 2rem;
}

:global(.custom-swal-confirm) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 25px;
  padding: 10px 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:global(.custom-swal-confirm:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

:global(.custom-swal-cancel) {
  background: #95a5a6;
  border: none;
  border-radius: 25px;
  padding: 10px 25px;
  font-weight: 600;
  color: white;
}

:global(.custom-swal-delete) {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: none;
  border-radius: 25px;
  padding: 10px 25px;
  font-weight: 600;
}

:global(.custom-swal-details) {
  border-radius: 15px;
}

/* Formulario SweetAlert2 */
:global(.swal-form) {
  text-align: left;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}

:global(.form-section) {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

:global(.form-section h4) {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:global(.form-section h4 i) {
  color: #667eea;
}

:global(.swal2-input), :global(.swal2-select) {
  margin: 0.5rem 0;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  transition: all 0.3s ease;
}

:global(.swal2-input:focus), :global(.swal2-select:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  outline: none;
}

/* Detalles del cliente */
:global(.client-details) {
  text-align: left;
  max-height: 60vh;
  overflow-y: auto;
}

:global(.detail-section) {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

:global(.detail-section h4) {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

:global(.detail-section h4 i) {
  color: #667eea;
}

:global(.detail-section p) {
  margin: 0.5rem 0;
  color: #34495e;
  line-height: 1.5;
}

:global(.detail-section p strong) {
  color: #2c3e50;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .main-title {
    font-size: 2rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .tables-container {
    padding: 0 1rem;
  }

  .zone-header {
    padding: 1rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .clients-table .q-table thead th,
  .clients-table .q-table tbody td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .email-chips {
    flex-direction: column;
  }

  :global(.custom-swal-popup) {
    width: 95% !important;
    padding: 1rem;
  }

  :global(.swal-form) {
    max-height: 50vh;
  }

  :global(.form-section) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
}

/* Animaciones */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.zone-section {
  animation: slideInUp 0.6s ease forwards;
}

.zone-section:nth-child(2) {
  animation-delay: 0.1s;
}

.stat-card {
  animation: slideInUp 0.6s ease forwards;
}

.stat-card:nth-child(2) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.2s;
}

/* Scroll personalizado */
:global(.swal-form::-webkit-scrollbar),
:global(.client-details::-webkit-scrollbar) {
  width: 6px;
}

:global(.swal-form::-webkit-scrollbar-track),
:global(.client-details::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 10px;
}

:global(.swal-form::-webkit-scrollbar-thumb),
:global(.client-details::-webkit-scrollbar-thumb) {
  background: #667eea;
  border-radius: 10px;
}

:global(.swal-form::-webkit-scrollbar-thumb:hover),
:global(.client-details::-webkit-scrollbar-thumb:hover) {
  background: #5a67d8;
}

</style>
