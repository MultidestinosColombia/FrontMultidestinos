<template>
  <q-page class="q-pa-md">
    <h6 class="q-mt-lg">Planes</h6>

    <q-btn
      @click="mostrarModalAgregar = true"
      label="Agregar Plan"
      class="q-mb-md"
      color="primary"
    />
    <q-dialog v-model="mostrarModalAgregar" content-css="max-width: 500px;">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-form @submit="agregarPlanSubmit" class="q-gutter-md">
            <q-select
              label="Pertenece"
              v-model="nuevoPlanPertenece"
              :options="opcionesPertenece"
              style="width: 100%"
              :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
              emit-value
              map-options
            />
            <q-input
              label="Destino"
              v-model="nuevoPlanDestino"
              :rules="[(val) => !!val || 'El campo Destino es obligatorio']"
              lazy-rules
              style="width: 100%"
            />
            <q-input
              label="Nombre del Programa"
              v-model="nuevoPlanNombrePrograma"
              :rules="[
                (val) => !!val || 'El campo Nombre del Programa es obligatorio',
              ]"
              lazy-rules
              style="width: 100%"
            />

            <div class="q-mb-md col-12">
              <label class="q-mb-sm">Hoteles</label>
              <div class="row q-gutter-sm items-center">
                <q-chip
                  v-for="hotel in nuevosHoteles"
                  :key="hotel"
                  removable
                  @remove="eliminarNuevoHotel(hotel)"
                  :label="hotel"
                  class="q-ma-xs"
                  color="primary"
                  text-color="white"
                />
              </div>
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="nuevoHotelInput"
                  placeholder="Agregar hotel"
                  dense
                  outlined
                  class="col-grow"
                  style="padding-top: 15px"
                />
                <q-btn
                  @click="agregarNuevoHotel"
                  label="Agregar"
                  color="primary"
                />
              </div>
            </div>

            <div class="q-mb-md col-12">
              <label for="nochesSelect" class="q-mb-sm">Noches</label>
              <q-select
                multiple
                v-model="nuevasNoches"
                :options="opcionesNoches"
                style="width: 100%"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                input-debounce="0"
              />
            </div>

            <div class="q-mb-md col-12">
              <label for="acomodacionSelect" class="q-mb-sm">Acomodación</label>
              <q-select
                multiple
                v-model="nuevasAcomodaciones"
                :options="opcionesAcomodacion"
                style="width: 100%"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                input-debounce="0"
              />
            </div>

            <q-input
              label="Plan"
              v-model="nuevoPlanPlan"
              :rules="[(val) => !!val || 'El campo Plan es obligatorio']"
              lazy-rules
              style="width: 100%"
            />

            <div class="row justify-end q-mt-md">
              <q-btn type="submit" label="Agregar Plan" color="primary" />
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
            color="info"
            @click="verDetallesPlan(props.row.id)"
            class="q-mx-xs"
          >
            Ver Detalles
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="mostrarModalEditar" content-css="max-width: 500px;">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-form @submit="editarPlanSubmit" class="q-gutter-md">
            <q-select
              label="Pertenece"
              v-model="perteneceEditar"
              :options="opcionesPertenece"
              style="width: 100%"
              :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
              emit-value
              map-options
            />
            <q-input
              label="Destino"
              v-model="destinoEditar"
              :rules="[(val) => !!val || 'El campo Destino es obligatorio']"
              lazy-rules
              style="width: 100%"
            />
            <q-input
              label="Nombre del Programa"
              v-model="nombreProgramaEditar"
              :rules="[
                (val) => !!val || 'El campo Nombre del Programa es obligatorio',
              ]"
              lazy-rules
              style="width: 100%"
            />

            <div class="q-mb-md col-12">
              <label class="q-mb-sm">Hoteles</label>
              <div class="row q-gutter-sm items-center">
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
              </div>
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="nuevoHotel"
                  placeholder="Agregar hotel"
                  dense
                  outlined
                  class="col-grow"
                  style="padding-top: 15px"
                />
                <q-btn
                  @click="agregarHotelEditar"
                  label="Agregar"
                  color="primary"
                />
              </div>
            </div>

            <div class="q-mb-md col-12">
              <label for="nochesSelect" class="q-mb-sm">Noches</label>
              <q-select
                multiple
                v-model="nochesEditar"
                :options="opcionesNoches"
                style="width: 100%"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                input-debounce="0"
              />
            </div>

            <div class="q-mb-md col-12">
              <label for="acomodacionSelect" class="q-mb-sm">Acomodación</label>
              <q-select
                multiple
                v-model="acomodacionEditar"
                :options="opcionesAcomodacion"
                style="width: 100%"
                emit-value
                map-options
                option-value="value"
                option-label="label"
                input-debounce="0"
              />
            </div>

            <q-input
              label="Plan"
              v-model="planEditar"
              :rules="[(val) => !!val || 'El campo Plan es obligatorio']"
              lazy-rules
              style="width: 100%"
            />

            <div class="row justify-end q-mt-md">
              <q-btn type="submit" label="Guardar Cambios" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--
TIQUETE Y TRANSPORTE -->

    <q-page class="q-pa-md">
      <h6 class="q-mt-lg">Tiquete (Suplemento)</h6>

      <q-btn
        @click="mostrarModalAgregarTiquete = true"
        label="Agregar Tiquete"
        class="q-mb-md"
        color="primary"
      />

      <q-dialog
        v-model="mostrarModalAgregarTiquete"
        content-css="max-width: 500px;"
      >
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <q-form @submit="agregarTiqueteSubmit" class="q-gutter-md">
              <q-input
                label="Salida"
                v-model="nuevoTiqueteSalida"
                :rules="[(val) => !!val || 'El campo Salida es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Pertenece"
                v-model="nuevoTiquetePertenece"
                :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Neta"
                v-model="nuevoTiqueteNeta"
                :rules="[(val) => !!val || 'El campo Neta es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Tasas"
                v-model="nuevoTiqueteTasas"
                :rules="[(val) => !!val || 'El campo Tasas es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="IVA"
                v-model="nuevoTiqueteIva"
                :rules="[(val) => !!val || 'El campo IVA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Total"
                v-model="nuevoTiqueteTotal"
                :rules="[(val) => !!val || 'El campo Total es obligatorio']"
                lazy-rules
                style="width: 100%"
              />

              <div class="row justify-end q-mt-md">
                <q-btn type="submit" label="Agregar Tiquete" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="mostrarModalEditarTiquete"
        content-css="max-width: 400px;"
      >
        <q-card>
          <q-card-section class="row items-center q-pa-md">
            <q-form @submit="editarTiqueteSubmit">
              <q-input
                label="Salida"
                v-model="salidaEditar"
                :rules="[(val) => !!val || 'El campo Salida es obligatorio']"
              />
              <q-input
                label="Pertenece"
                v-model="perteneceTiqueteEditar"
                :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
              />
              <q-input
                label="Neta"
                v-model="netaEditar"
                :rules="[(val) => !!val || 'El campo Neta es obligatorio']"
              />
              <q-input
                label="Tasas"
                v-model="tasasEditar"
                :rules="[(val) => !!val || 'El campo Tasas es obligatorio']"
              />
              <q-input
                label="IVA"
                v-model="ivaTiqueteEditar"
                :rules="[(val) => !!val || 'El campo IVA es obligatorio']"
              />
              <q-input
                label="Total"
                v-model="totalTiqueteEditar"
                :rules="[(val) => !!val || 'El campo Total es obligatorio']"
              />

              <div class="row justify-end q-mt-md">
                <q-btn type="submit" label="Guardar Cambios" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-table
        :rows="tiquetes"
        :columns="columnasTiquete"
        row-key="id"
        :pagination="pagination"
        class="q-mt-md"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              dense
              color="primary"
              @click="editarTiquete(props.row)"
              class="q-mx-xs"
              >Editar</q-btn
            >

            <q-btn
              dense
              color="negative"
              @click="eliminarTiquete(props.row.id)"
              class="q-mx-xs"
              >Eliminar</q-btn
            >
          </q-td>
        </template>
      </q-table>

      <q-dialog
        v-model="mostrarModalAgregarTransporte"
        content-css="max-width: 500px;"
      >
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <q-form @submit="agregarTransporteSubmit" class="q-gutter-md">
              <q-input
                label="Pertenece"
                v-model="nuevoTransportePertenece"
                :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Destino"
                v-model="nuevoTransporteDestino"
                :rules="[(val) => !!val || 'El campo Destino es obligatorio']"
                lazy-rules
                style="width: 100%"
              />

              <q-input
                label="Combustible"
                v-model="nuevoTransporteCombus"
                :rules="[
                  (val) => !!val || 'El campo Combustible es obligatorio',
                ]"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Tasa"
                v-model="nuevoTransporteTasa"
                :rules="[(val) => !!val || 'El campo Tasa es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="IVA"
                v-model="nuevoTransporteIva"
                :rules="[(val) => !!val || 'El campo IVA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="TA"
                v-model="nuevoTransporteTa"
                :rules="[(val) => !!val || 'El campo TA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="IVA TA"
                v-model="nuevoTransporteIvaTa"
                :rules="[(val) => !!val || 'El campo IVA TA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Otros"
                v-model="nuevoTransporteOtros"
                :rules="[(val) => !!val || 'El campo Otros es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Total"
                v-model="nuevoTransporteTotal"
                :rules="[(val) => !!val || 'El campo Total es obligatorio']"
                lazy-rules
                style="width: 100%"
              />

              <div class="row justify-end q-mt-md">
                <q-btn
                  type="submit"
                  label="Agregar Transporte"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="mostrarModalEditarTransporte"
        content-css="max-width: 500px;"
      >
        <q-card>
          <q-card-section class="row items-center q-pa-md">
            <q-form @submit="editarTransporteSubmit" class="q-gutter-md">
              <q-input
                label="Pertenece"
                v-model="perteneceTransporteEditar"
                :rules="[(val) => !!val || 'El campo Pertenece es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Destino"
                v-model="destinoTransporteEditar"
                :rules="[(val) => !!val || 'El campo Destino es obligatorio']"
                lazy-rules
                style="width: 100%"
              />

              <q-input
                label="Combustible"
                v-model="combusEditar"
                :rules="[
                  (val) => !!val || 'El campo Combustible es obligatorio',
                ]"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Tasa"
                v-model="tasaTransporteEditar"
                :rules="[(val) => !!val || 'El campo Tasa es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="IVA"
                v-model="ivaTransporteEditar"
                :rules="[(val) => !!val || 'El campo IVA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="TA"
                v-model="taEditar"
                :rules="[(val) => !!val || 'El campo TA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="IVA TA"
                v-model="ivaTaEditar"
                :rules="[(val) => !!val || 'El campo IVA TA es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Otros"
                v-model="otrosEditar"
                :rules="[(val) => !!val || 'El campo Otros es obligatorio']"
                lazy-rules
                style="width: 100%"
              />
              <q-input
                label="Total"
                v-model="totalTransporteEditar"
                :rules="[(val) => !!val || 'El campo Total es obligatorio']"
                lazy-rules
                style="width: 100%"
              />

              <div class="row justify-end q-mt-md">
                <q-btn type="submit" label="Guardar Cambios" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <h6 class="q-mt-lg">Transportes</h6>
      <q-btn
        @click="mostrarModalAgregarTransporte = true"
        label="Agregar Transporte"
        class="q-mb-md"
        color="primary"
      />
      <q-table
        :rows="transportes"
        :columns="columnasTransporte"
        row-key="id"
        :pagination="pagination"
        class="q-mt-md"
      >
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              dense
              color="primary"
              @click="editarTransporte(props.row)"
              class="q-mx-xs"
              >Editar</q-btn
            >

            <q-btn
              dense
              color="negative"
              @click="eliminarTransporte(props.row.id)"
              class="q-mx-xs"
              >Eliminar</q-btn
            >
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page>
</template>

<script>
import { Notify } from "quasar";

export default {
  data() {
    return {
      // ... otras variables ...
      opcionesAcomodacion: [
        { label: "Sencilla", value: "sencilla" },
        { label: "Doble", value: "doble" },
        { label: "Triple", value: "triple" },
        { label: "Cuádruple", value: "cuadruple" },
        { label: "Quíntuple", value: "quintuple" },
        { label: "Séxtuple", value: "sextuple" },
      ],

      opcionesPertenece: [
        "Bogota",
        "Cali",
        "Medellin",
        "Porcion Terrestre",
        "San Andres",
      ],
      opcionesNoches: [
        { label: "1 noche", value: "1 noche" },
        { label: "2 noches", value: "2 noches" },
        { label: "3 noches", value: "3 noches" },
        { label: "4 noches", value: "4 noches" },
        { label: "5 noches", value: "5 noches" },
        // ... más opciones si es necesario
      ],
      // Variables para el formulario de agregar
      nuevoPlanPertenece: "",
      nuevoPlanDestino: "",
      nuevoPlanNombrePrograma: "",
      nuevosHoteles: [],
      nuevoHotelInput: "",
      nuevasNoches: [],
      nuevaNocheInput: "",
      nuevasAcomodaciones: [],
      nuevaAcomodacionInput: "",
      nuevoPlanPlan: "",

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

      // --- TIQUETES ---
      // Variables para el formulario de agregar tiquetes
      mostrarModalAgregarTiquete: false,
      nuevoTiqueteSalida: "",
      nuevoTiquetePertenece: "",
      nuevoTiqueteNeta: "",
      nuevoTiqueteTasas: "",
      nuevoTiqueteIva: "",
      nuevoTiqueteTotal: "",

      // Variables para el formulario de editar tiquetes
      mostrarModalEditarTiquete: false,
      tiqueteEditando: null,
      salidaEditar: "",
      perteneceTiqueteEditar: "",
      netaEditar: "",
      tasasEditar: "",
      ivaTiqueteEditar: "",
      totalTiqueteEditar: "",

      // Variables para la tabla de tiquetes
      tiquetes: [],
      columnasTiquete: [
        { name: "salida", label: "Salida", field: "salida", sortable: true },
        {
          name: "pertenece",
          label: "Pertenece",
          field: "pertenece",
          sortable: true,
        },
        { name: "neta", label: "Neta", field: "neta", sortable: true },
        { name: "tasas", label: "Tasas", field: "tasas", sortable: true },
        { name: "iva", label: "IVA", field: "iva", sortable: true },
        { name: "total", label: "Total", field: "total", sortable: true },
        { name: "acciones", label: "Acciones", align: "center" },
      ],
      pagination: { rowsPerPage: 10 },

      // --- TRANSPORTES ---
      // Variables para el formulario de agregar transportes
      mostrarModalAgregarTransporte: false,
      nuevoTransportePertenece: "",
      nuevoTransporteDestino: "",
      nuevoTransporteNombrePrograma: "",
      nuevoTransporteCombus: "",
      nuevoTransporteTasa: "",
      nuevoTransporteIva: "",
      nuevoTransporteTa: "",
      nuevoTransporteIvaTa: "",
      nuevoTransporteOtros: "",
      nuevoTransporteTotal: "",
      nuevoTransportePorcionTerrestreBaja: "",
      nuevoTransportePorcionTerrestreAlta: "",

      // Variables para el formulario de editar transportes
      mostrarModalEditarTransporte: false,
      transporteEditando: null,
      perteneceTransporteEditar: "",
      destinoTransporteEditar: "",
      nombreProgramaTransporteEditar: "",
      combusEditar: "",
      tasaTransporteEditar: "",
      ivaTransporteEditar: "",
      taEditar: "",
      ivaTaEditar: "",
      otrosEditar: "",
      totalTransporteEditar: "",
      porcionTerrestreBajaEditar: "",
      porcionTerrestreAltaEditar: "",
      // Variables para la tabla de transportes
      transportes: [],
      columnasTransporte: [
        {
          name: "pertenece",
          label: "Pertenece",
          field: "pertenece",
          sortable: true,
        },
        { name: "destino", label: "Destino", field: "destino", sortable: true },

        {
          name: "combus",
          label: "Combustible",
          field: "combus",
          sortable: true,
        },
        { name: "tasa", label: "Tasa", field: "tasa", sortable: true },
        { name: "iva", label: "IVA", field: "iva", sortable: true },
        { name: "ta", label: "TA", field: "ta", sortable: true },
        { name: "ivaTa", label: "IVA TA", field: "ivaTa", sortable: true },
        { name: "otros", label: "Otros", field: "otros", sortable: true },
        { name: "total", label: "Total", field: "total", sortable: true },

        { name: "acciones", label: "Acciones", align: "center" },
      ],
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
    this.cargarPlanes();
    this.cargarTiquetes();
    this.cargarTransportes();
  },

  methods: {
    //EDITAR

    agregarHotelEditar() {
      if (this.nuevoHotel && this.nuevoHotel.trim() !== "") {
        console.log("Método agregarHotelEditar ejecutado"); // <-- Nuevo console.log
        this.hotelesEditar.push(this.nuevoHotel.trim());
        this.nuevoHotel = "";
        this.$forceUpdate();
      }
    },

    eliminarHotelEditar(hotel) {
      // Encuentra el índice del hotel a eliminar y elimínalo
      const index = this.hotelesEditar.indexOf(hotel);
      if (index > -1) {
        this.hotelesEditar.splice(index, 1);
      }
    },

    agregarNocheEditar() {
      if (this.nuevaNoche && this.nuevaNoche.trim() !== "") {
        console.log("Método agregarNocheEditar ejecutado"); // <-- Nuevo console.log
        this.nochesEditar.push(this.nuevaNoche.trim());
        this.nuevaNoche = "";
        this.$forceUpdate();
      }
    },

    eliminarNocheEditar(noche) {
      const index = this.nochesEditar.indexOf(noche);
      if (index > -1) {
        this.nochesEditar.splice(index, 1);
      }
    },
    agregarAcomodacionEditar() {
      if (this.nuevaAcomodacion && this.nuevaAcomodacion.trim() !== "") {
        console.log("Método nuevaAcomodacion ejecutado"); // <-- Nuevo console.log
        this.acomodacionEditar.push(this.nuevaAcomodacion.trim());
        this.nuevaAcomodacion = "";
        this.$forceUpdate();
      }
    },

    eliminarAcomodacionEditar(acomodacion) {
      const index = this.acomodacionEditar.indexOf(acomodacion);
      if (index > -1) {
        this.acomodacionEditar.splice(index, 1);
      }
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
      console.log("hotelesEditar:", this.hotelesEditar); // <-- Nuevo console.log
      console.log("nochesEditar:", this.nochesEditar); // <-- Nuevo console.log
      console.log("acomodacionEditar:", this.acomodacionEditar); // <-- Nuevo console.log
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
      console.log("Datos del plan recibido para editar:", plan);
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
      // Verifica si las propiedades existen antes de aplicar split
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
    agregarHotel() {
      if (this.nuevoHotel && this.nuevoHotel.trim() !== "") {
        this.$set(this.hoteles, this.hoteles.length, this.nuevoHotel.trim());
        this.nuevoHotel = "";
      }
    },

    agregarNoche() {
      if (this.nuevaNoche && this.nuevaNoche.trim() !== "") {
        this.$set(this.noches, this.noches.length, this.nuevaNoche.trim());
        this.nuevaNoche = "";
      }
    },

    agregarAcomodacion() {
      if (this.nuevaAcomodacion && this.nuevaAcomodacion.trim() !== "") {
        this.$set(
          this.acomodacion,
          this.acomodacion.length,
          this.nuevaAcomodacion.trim()
        );
        this.nuevaAcomodacion = "";
      }
    },

    //AGREGAR METODOS
    agregarNuevoHotel() {
      if (this.nuevoHotelInput && this.nuevoHotelInput.trim() !== "") {
        this.nuevosHoteles.push(this.nuevoHotelInput.trim());
        this.nuevoHotelInput = "";
      }
    },
    eliminarNuevoHotel(hotel) {
      const index = this.nuevosHoteles.indexOf(hotel);
      if (index > -1) {
        this.nuevosHoteles.splice(index, 1);
      }
    },
    agregarNuevaNoche() {
      if (this.nuevaNocheInput && this.nuevaNocheInput.trim() !== "") {
        this.nuevasNoches.push(this.nuevaNocheInput.trim());
        this.nuevaNocheInput = "";
      }
    },
    eliminarNuevaNoche(noche) {
      const index = this.nuevasNoches.indexOf(noche);
      if (index > -1) {
        this.nuevasNoches.splice(index, 1);
      }
    },
    agregarNuevaAcomodacion() {
      if (
        this.nuevaAcomodacionInput &&
        this.nuevaAcomodacionInput.trim() !== ""
      ) {
        this.nuevasAcomodaciones.push(this.nuevaAcomodacionInput.trim());
        this.nuevaAcomodacionInput = "";
      }
    },
    eliminarNuevaAcomodacion(acomodacion) {
      const index = this.nuevasAcomodaciones.indexOf(acomodacion);
      if (index > -1) {
        this.nuevasAcomodaciones.splice(index, 1);
      }
    },

    agregarPlanSubmit() {
      const hotelString = this.nuevosHoteles.join("*");
      const nochesString = this.nuevasNoches.join("*");
      const acomodacionString = this.nuevasAcomodaciones.join("*");

      const newPlan = {
        pertenece: this.nuevoPlanPertenece,
        destino: this.nuevoPlanDestino,
        nombrePrograma: this.nuevoPlanNombrePrograma,
        hotel: hotelString,
        plan: this.nuevoPlanPlan,
        noches: nochesString,
        acomodacion: acomodacionString,
        // Campos opcionales: enviar como null si no están definidos en data
        baseComisionable: this.baseComisionable || null,
        baseTiqueta: this.baseTiqueta || null,
        fechaBloqueo: this.fechaBloqueo || null,
        vigenciaInicio: this.vigenciaInicio || null,
        vigenciaFinal: this.vigenciaFinal || null,
        incluye: this.incluye || null,
        noIncluye: this.noIncluye || null,
        notas: this.notas || null,
      };

      console.log("Datos que se enviarán al servidor:", newPlan);

      fetch("https://backmultidestinos.onrender.com/planes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlan),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar el plan");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Plan agregado:", data);
          this.planes.push(data);
          this.mostrarModalAgregar = false;
          this.limpiarFormularioAgregar();
          Notify.create({
            message: "Plan agregado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al agregar plan:", error);
          Notify.create({
            message:
              "Error al agregar el plan. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },

    limpiarFormularioAgregar() {
      this.nuevoPlanPertenece = "";
      this.nuevoPlanDestino = "";
      this.nuevoPlanNombrePrograma = "";
      this.nuevosHoteles = [];
      this.nuevoHotelInput = "";
      this.nuevasNoches = [];
      this.nuevaNocheInput = "";
      this.nuevasAcomodaciones = [];
      this.nuevaAcomodacionInput = "";
      this.nuevoPlanPlan = "";
      // ... limpia otros campos del formulario
    },

    // --- TIQUETES ---
    cargarTiquetes() {
      fetch("https://backmultidestinos.onrender.com/tiquete")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los tiquetes desde la API");
          }
          return response.json();
        })
        .then((data) => {
          this.tiquetes = data;
        })
        .catch((error) => {
          console.error("Error al cargar tiquetes:", error);
          Notify.create({
            message:
              "Error al cargar los tiquetes. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    agregarTiqueteSubmit() {
      const newTiquete = {
        salida: this.nuevoTiqueteSalida,
        pertenece: this.nuevoTiquetePertenece,
        neta: this.nuevoTiqueteNeta,
        tasas: this.nuevoTiqueteTasas,
        iva: this.nuevoTiqueteIva,
        total: this.nuevoTiqueteTotal,
      };

      fetch("https://backmultidestinos.onrender.com/tiquete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTiquete),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar el tiquete");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tiquete agregado:", data);
          this.tiquetes.push(data);
          this.mostrarModalAgregarTiquete = false;
          this.limpiarFormularioTiquete();
          Notify.create({
            message: "Tiquete agregado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al agregar tiquete:", error);
          Notify.create({
            message:
              "Error al agregar el tiquete. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    limpiarFormularioTiquete() {
      this.nuevoTiqueteSalida = "";
      this.nuevoTiquetePertenece = "";
      this.nuevoTiqueteNeta = "";
      this.nuevoTiqueteTasas = "";
      this.nuevoTiqueteIva = "";
      this.nuevoTiqueteTotal = "";
    },
    editarTiquete(tiquete) {
      this.tiqueteEditando = tiquete;
      this.salidaEditar = tiquete.salida;
      this.perteneceTiqueteEditar = tiquete.pertenece;
      this.netaEditar = tiquete.neta;
      this.tasasEditar = tiquete.tasas;
      this.ivaTiqueteEditar = tiquete.iva;
      this.totalTiqueteEditar = tiquete.total;
      this.mostrarModalEditarTiquete = true;
    },
    editarTiqueteSubmit() {
      const updatedTiquete = {
        id: this.tiqueteEditando.id,
        salida: this.salidaEditar,
        pertenece: this.perteneceTiqueteEditar,
        neta: this.netaEditar,
        tasas: this.tasasEditar,
        iva: this.ivaTiqueteEditar,
        total: this.totalTiqueteEditar,
      };

      fetch(
        `https://backmultidestinos.onrender.com/tiquete/${updatedTiquete.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTiquete),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el tiquete");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Tiquete actualizado:", data);
          const index = this.tiquetes.findIndex(
            (t) => t.id === updatedTiquete.id
          );
          if (index !== -1) {
            this.tiquetes[index] = data;
          }
          this.mostrarModalEditarTiquete = false;
          this.tiqueteEditando = null;
          Notify.create({
            message: "Tiquete actualizado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al actualizar el tiquete:", error);
          Notify.create({
            message:
              "Error al actualizar el tiquete. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    eliminarTiquete(id) {
      if (confirm("¿Estás seguro de que quieres eliminar este tiquete?")) {
        fetch(`https://backmultidestinos.onrender.com/tiquete/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar el tiquete");
            }
            return response.json();
          })
          .then(() => {
            this.tiquetes = this.tiquetes.filter((t) => t.id !== id);
            Notify.create({
              message: "Tiquete eliminado correctamente",
              color: "positive",
            });
          })
          .catch((error) => {
            console.error("Error al eliminar el tiquete:", error);
            Notify.create({
              message:
                "Error al eliminar el tiquete. Por favor, inténtalo de nuevo más tarde.",
              color: "negative",
            });
          });
      }
    },
    // --- TRANSPORTES ---
    cargarTransportes() {
      fetch("https://backmultidestinos.onrender.com/transporte")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los transportes desde la API");
          }
          return response.json();
        })
        .then((data) => {
          this.transportes = data;
        })
        .catch((error) => {
          console.error("Error al cargar transportes:", error);
          Notify.create({
            message:
              "Error al cargar los transportes. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    agregarTransporteSubmit() {
      const newTransporte = {
        pertenece: this.nuevoTransportePertenece,
        destino: this.nuevoTransporteDestino,
        nombrePrograma: null,
        combus: this.nuevoTransporteCombus,
        tasa: this.nuevoTransporteTasa,
        iva: this.nuevoTransporteIva,
        ta: this.nuevoTransporteTa,
        ivaTa: this.nuevoTransporteIvaTa,
        otros: this.nuevoTransporteOtros,
        total: this.nuevoTransporteTotal,
        porcionTerrestreBaja: null,
        porcionTerrestreAlta: null,
      };

      fetch("https://backmultidestinos.onrender.com/transporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransporte),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al agregar el transporte");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Transporte agregado:", data);
          this.transportes.push(data);
          this.mostrarModalAgregarTransporte = false;
          this.limpiarFormularioTransporte();
          Notify.create({
            message: "Transporte agregado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al agregar transporte:", error);
          Notify.create({
            message:
              "Error al agregar el transporte. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    limpiarFormularioTransporte() {
      this.nuevoTransportePertenece = "";
      this.nuevoTransporteDestino = "";
      this.nuevoTransporteNombrePrograma = "";
      this.nuevoTransporteCombus = "";
      this.nuevoTransporteTasa = "";
      this.nuevoTransporteIva = "";
      this.nuevoTransporteTa = "";
      this.nuevoTransporteIvaTa = "";
      this.nuevoTransporteOtros = "";
      this.nuevoTransporteTotal = "";
      this.nuevoTransportePorcionTerrestreBaja = "";
      this.nuevoTransportePorcionTerrestreAlta = "";
    },
    editarTransporte(transporte) {
      this.transporteEditando = transporte;
      this.perteneceTransporteEditar = transporte.pertenece;
      this.destinoTransporteEditar = transporte.destino;
      this.nombreProgramaTransporteEditar = null;
      this.combusEditar = transporte.combus;
      this.tasaTransporteEditar = transporte.tasa;
      this.ivaTransporteEditar = transporte.iva;
      this.taEditar = transporte.ta;
      this.ivaTaEditar = transporte.ivaTa;
      this.otrosEditar = transporte.otros;
      this.totalTransporteEditar = transporte.total;
      this.porcionTerrestreBajaEditar = null;
      this.porcionTerrestreAltaEditar = null;
      this.mostrarModalEditarTransporte = true;
    },
    editarTransporteSubmit() {
      const updatedTransporte = {
        id: this.transporteEditando.id,
        pertenece: this.perteneceTransporteEditar,
        destino: this.destinoTransporteEditar,
        nombrePrograma: this.nombreProgramaTransporteEditar,
        combus: this.combusEditar,
        tasa: this.tasaTransporteEditar,
        iva: this.ivaTransporteEditar,
        ta: this.taEditar,
        ivaTa: this.ivaTaEditar,
        otros: this.otrosEditar,
        total: this.totalTransporteEditar,
        porcionTerrestreBaja: this.porcionTerrestreBajaEditar,
        porcionTerrestreAlta: this.porcionTerrestreAltaEditar,
      };

      fetch(
        `https://backmultidestinos.onrender.com/transporte/${updatedTransporte.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTransporte),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el transporte");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Transporte actualizado:", data);
          const index = this.transportes.findIndex(
            (t) => t.id === updatedTransporte.id
          );
          if (index !== -1) {
            this.transportes[index] = data;
          }
          this.mostrarModalEditarTransporte = false;
          this.transporteEditando = null;
          Notify.create({
            message: "Transporte actualizado correctamente",
            color: "positive",
          });
        })
        .catch((error) => {
          console.error("Error al actualizar el transporte:", error);
          Notify.create({
            message:
              "Error al actualizar el transporte. Por favor, inténtalo de nuevo más tarde.",
            color: "negative",
          });
        });
    },
    eliminarTransporte(id) {
      if (confirm("¿Estás seguro de que quieres eliminar este transporte?")) {
        fetch(`https://backmultidestinos.onrender.com/transporte/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar el transporte");
            }
            return response.json();
          })
          .then(() => {
            this.transportes = this.transportes.filter((t) => t.id !== id);
            Notify.create({
              message: "Transporte eliminado correctamente",
              color: "positive",
            });
          })
          .catch((error) => {
            console.error("Error al eliminar el transporte:", error);
            Notify.create({
              message:
                "Error al eliminar el transporte. Por favor, inténtalo de nuevo más tarde.",
              color: "negative",
            });
          });
      }
    },
    //FIN
  },
};
</script>
