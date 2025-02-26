<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="row justify-center">
        <q-card class="box small custom-card">
          <q-card-section>
            <span class="custom-text">Manejo de costos</span>
          </q-card-section>
        </q-card>
      </div>
      <div class="row">
        <q-card class="box full">
          <q-table
            flat
            bordered
            title="Listado de Costos"
            :rows="rowsCostos.slice(0, 10)"
            :columns="columns"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:top-right>
              <q-btn
                color="primary"
                label="Recargar Datos"
                icon="refresh"
                unelevated
                @click="fetchData"
                class="q-mr-md"
              />
              <div>
                <!-- Botón principal con gradiente -->
                <q-btn
                  unelevated
                  class="gradient-btn q-mr-md"
                  @click="showDialog = true"
                >
                  <q-icon name="add" size="sm" class="q-mr-sm" />
                  <span class="text-weight-bold">Cargar Nuevo Excel</span>
                </q-btn>

                <!-- Diálogo -->
                <q-dialog v-model="showDialog">
                  <q-card class="dialog-card">
                    <!-- Header -->
                    <q-card-section class="row items-center q-pb-sm">
                      <div class="row items-center">
                        <q-icon
                          name="description"
                          color="green"
                          size="sm"
                          class="q-mr-sm"
                        />
                        <div class="text-subtitle1">Subir Archivo Excel</div>
                      </div>
                      <q-space />
                      <q-btn icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-separator class="separator" />

                    <!-- Contenido principal dentro de una carta/alerta -->
                    <q-card-section class="q-pa-md">
                      <q-card class="inner-card">
                        <q-card-section>
                          <!-- Texto instructivo -->
                          <div class="text-body2 text-blue-9 q-mb-lg">
                            Selecciona tu archivo Excel para comenzar
                          </div>

                          <!-- Área de selección de archivo -->
                          <div
                            class="upload-area q-pa-md q-mb-lg cursor-pointer text-center"
                            @click="$refs.fileInput.pickFiles"
                          >
                            <div class="row items-center justify-center">
                              <q-icon
                                name="upload_file"
                                color="primary"
                                size="sm"
                                class="q-mr-sm"
                              />
                              <span class="text-primary">
                                {{
                                  file
                                    ? file.name
                                    : "Arrastra o selecciona tu archivo Excel"
                                }}
                              </span>
                            </div>
                          </div>

                          <!-- Input de archivo oculto -->
                          <q-file
                            ref="fileInput"
                            v-model="file"
                            label="Subir Excel"
                            accept=".xlsx,.xls"
                            class="hidden"
                          />

                          <!-- Botón de subida -->
                          <q-toolbar>
                            <q-btn
                              unelevated
                              color="green"
                              class="full-width"
                              :disable="!file"
                              @click="subirExcel"
                            >
                              <q-icon name="upload" size="sm" class="q-mr-sm" />
                              Subir Archivo
                            </q-btn>

                            <q-space />
                            <!-- Espacio flexible entre los botones -->

                            <q-btn
                              unelevated
                              color="primary"
                              class="full-width"
                              @click="descargarExcel"
                            >
                              <q-icon
                                name="download"
                                size="sm"
                                class="q-mr-sm"
                              />
                              Descargar Excel
                            </q-btn>
                          </q-toolbar>
                        </q-card-section>
                      </q-card>

                      <!-- Formatos soportados -->
                      <div
                        class="text-caption text-primary text-center q-mt-sm"
                      >
                        Formatos soportados: .xlsx, .xls
                      </div>
                    </q-card-section>
                  </q-card>
                </q-dialog>
              </div>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="row">
        <q-card class="box full">
          <q-table
            flat
            bordered
            title="Costos Unicos"
            :rows="rowsCostos_Unicos.slice(0, 10)"
            :columns="columns_Costos_Unicos"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="row">
        <q-card class="box medium">
          <q-table
            flat
            bordered
            title="Costos De Una Noche"
            :rows="rowsNochesUno.slice(0, 10)"
            :columns="columns_noche_1"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
        <q-card class="box medium">
          <q-table
            flat
            bordered
            title="Costos De Dos Noches"
            :rows="rowsNochesDos.slice(0, 10)"
            :columns="columns_noche_2"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="row">
        <q-card class="box medium">
          <q-table
            flat
            bordered
            title="Costos De Tres Noches"
            :rows="rowsNochesTres.slice(0, 10)"
            :columns="columns_noche_3"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
        <q-card class="box medium">
          <q-table
            flat
            bordered
            title="Costos De Cuatro Noches"
            :rows="rowsNochesCuatro.slice(0, 10)"
            :columns="columns_noche_4"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="row">
        <q-card class="box full">
          <q-table
            flat
            bordered
            title="Costos De Noche Adicional"
            :rows="rowsNocheAdicionales.slice(0, 10)"
            :columns="columns_noche_5"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
      <div class="row">
        <q-card class="box full">
          <q-table
            flat
            bordered
            title="Receptivos"
            :rows="rowsreceptivo.slice(0, 10)"
            :columns="columns_Receptivos"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="row">
        <q-card class="box full">
          <q-table
            flat
            bordered
            title="Proveedores"
            :rows="rowsproveedores.slice(0, 10)"
            :columns="columns_Proveedores"
            row-key="id"
            dense
            :loading="loading"
            class="custom-table"
            hide-pagination
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props" class="hover-effect">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<!------------------------------------------------------- Script del codigo ---------------------------------------------------------------------------------->

<script>
// En lugar de usar un import dinámico, usa un import estático
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      loading: false,
      file: null,
      showDialog: false,
      status: "",

      // Cada tabla tiene su propio `rows`
      rowsCostos: [],
      rowsCostos_Unicos: [],
      rowsNochesUno: [],
      rowsNochesDos: [],
      rowsNochesTres: [],
      rowsNochesCuatro: [],
      rowsNocheAdicionales: [],
      rowsreceptivo: [],
      rowsproveedores: [],

      columns: [
        {
          name: "pertenece",
          label: "Pertenece",
          align: "left",
          field: "pertenece",
          sortable: true,
        },
        {
          name: "destino",
          label: "Destino",
          align: "left",
          field: "destino",
          sortable: true,
        },
        {
          name: "hotel",
          label: "Hotel",
          align: "left",
          field: "hotel",
          sortable: true,
        },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
          sortable: true,
        },
        {
          name: "plan",
          label: "Plan",
          align: "left",
          field: "plan",
          sortable: true,
        },
        {
          name: "nombrePrograma",
          label: "Nombre Programa",
          align: "left",
          field: "nombrePrograma",
          sortable: true,
        },
        {
          name: "noches",
          label: "Noches",
          align: "left",
          field: "noches",
          sortable: true,
        },
        {
          name: "receptivo_id",
          label: "Receptivo_id",
          align: "center",
          field: "receptivo_id",
          sortable: true,
        },
        {
          name: "Tarifa_aerea",
          label: "Tarifa Aérea",
          align: "right",
          field: "Tarifa_aerea",
          sortable: true,
        },
        {
          name: "Tarjeta_asistencia",
          label: "Tarjeta Asistencia",
          align: "right",
          field: "Tarjeta_asistencia",
          sortable: true,
        },

        // Nuevas columnas agregadas

        {
          name: "costos_sencilla",
          label: "Costos Sencilla",
          align: "right",
          field: "costos_sencilla",
          sortable: true,
        },
        {
          name: "costos_doble",
          label: "Costos Doble",
          align: "right",
          field: "costos_doble",
          sortable: true,
        },
        {
          name: "costos_triple",
          label: "Costos Triple",
          align: "right",
          field: "costos_triple",
          sortable: true,
        },
        {
          name: "costos_cuadruple",
          label: "Costos Cuádruple",
          align: "right",
          field: "costos_cuadruple",
          sortable: true,
        },
        {
          name: "costos_niño",
          label: "Costos Niño",
          align: "right",
          field: "costos_niño",
          sortable: true,
        },
        {
          name: "impuesto",
          label: "Impuesto",
          align: "right",
          field: "impuesto",
          sortable: true,
        },
        {
          name: "iva_sencilla",
          label: "IVA Sencilla",
          align: "right",
          field: "iva_sencilla",
          sortable: true,
        },
        {
          name: "iva_doble",
          label: "IVA Doble",
          align: "right",
          field: "iva_doble",
          sortable: true,
        },
        {
          name: "iva_triple",
          label: "IVA Triple",
          align: "right",
          field: "iva_triple",
          sortable: true,
        },
        {
          name: "iva_cuadruple",
          label: "IVA Cuádruple",
          align: "right",
          field: "iva_cuadruple",
          sortable: true,
        },
        {
          name: "iva_niño",
          label: "IVA Niño",
          align: "right",
          field: "iva_niño",
          sortable: true,
        },
        {
          name: "impoconsumo_sencilla",
          label: "Impoconsumo Sencilla",
          align: "right",
          field: "impoconsumo_sencilla",
          sortable: true,
        },
        {
          name: "impoconsumo_doble",
          label: "Impoconsumo Doble",
          align: "right",
          field: "impoconsumo_doble",
          sortable: true,
        },
        {
          name: "impoconsumo_triple",
          label: "Impoconsumo Triple",
          align: "right",
          field: "impoconsumo_triple",
          sortable: true,
        },
        {
          name: "impoconsumo_cuadruple",
          label: "Impoconsumo Cuádruple",
          align: "right",
          field: "impoconsumo_cuadruple",
          sortable: true,
        },
        {
          name: "impoconsumo_niño",
          label: "Impoconsumo Niño",
          align: "right",
          field: "impoconsumo_niño",
          sortable: true,
        },
        {
          name: "ing_propio_sencilla",
          label: "Ingreso Propio Sencilla",
          align: "right",
          field: "ing_propio_sencilla",
          sortable: true,
        },
        {
          name: "ing_propio_doble",
          label: "Ingreso Propio Doble",
          align: "right",
          field: "ing_propio_doble",
          sortable: true,
        },
        {
          name: "ing_propio_triple",
          label: "Ingreso Propio Triple",
          align: "right",
          field: "ing_propio_triple",
          sortable: true,
        },
        {
          name: "ing_propio_cuadruple",
          label: "Ingreso Propio Cuádruple",
          align: "right",
          field: "ing_propio_cuadruple",
          sortable: true,
        },
        {
          name: "ing_propio_niño",
          label: "Ingreso Propio Niño",
          align: "right",
          field: "ing_propio_niño",
          sortable: true,
        },
        {
          name: "rentabilidad_sencilla",
          label: "Rentabilidad Sencilla",
          align: "right",
          field: "rentabilidad_sencilla",
          sortable: true,
        },
        {
          name: "rentabilidad_doble",
          label: "Rentabilidad Doble",
          align: "right",
          field: "rentabilidad_doble",
          sortable: true,
        },
        {
          name: "rentabilidad_triple",
          label: "Rentabilidad Triple",
          align: "right",
          field: "rentabilidad_triple",
          sortable: true,
        },
        {
          name: "rentabilidad_cuadruple",
          label: "Rentabilidad Cuádruple",
          align: "right",
          field: "rentabilidad_cuadruple",
          sortable: true,
        },
        {
          name: "rentabilidad_niño",
          label: "Rentabilidad Niño",
          align: "right",
          field: "rentabilidad_niño",
          sortable: true,
        },
        {
          name: "iva_ing_propio_sencilla",
          label: "IVA Ingreso Propio Sencilla",
          align: "right",
          field: "iva_ing_propio_sencilla",
          sortable: true,
        },
        {
          name: "iva_ing_propio_doble",
          label: "IVA Ingreso Propio Doble",
          align: "right",
          field: "iva_ing_propio_doble",
          sortable: true,
        },
        {
          name: "iva_ing_propio_triple",
          label: "IVA Ingreso Propio Triple",
          align: "right",
          field: "iva_ing_propio_triple",
          sortable: true,
        },
        {
          name: "iva_ing_propio_cuadruple",
          label: "IVA Ingreso Propio Cuádruple",
          align: "right",
          field: "iva_ing_propio_cuadruple",
          sortable: true,
        },
        {
          name: "iva_ing_propio_niño",
          label: "IVA Ingreso Propio Niño",
          align: "right",
          field: "iva_ing_propio_niño",
          sortable: true,
        },
        {
          name: "total",
          label: "Total",
          align: "right",
          field: "total",
          sortable: true,
        },
      ],

      columns_Costos_Unicos: [
        {
          name: "pertenece",
          label: "Pertenece",
          align: "left",
          field: "pertenece",
        },
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "center", field: "hotel" },
        {
          name: "tipo_habitacion",
          label: "Tipo de habitación",
          align: "center",
          field: "tipo_habitacion",
        },
        { name: "noches", label: "Noches", align: "center", field: "noches" },
        { name: "plan", label: "Plan", align: "center", field: "plan" },
        {
          name: "valor_sencilla",
          label: "Valor Sencilla",
          align: "center",
          field: "valor_sencilla",
        },
        {
          name: "valor_doble",
          label: "Valor Doble",
          align: "center",
          field: "valor_doble",
        },
        {
          name: "valor_triple",
          label: "Valor Triple",
          align: "center",
          field: "valor_triple",
        },
        {
          name: "valor_cuadruple",
          label: "Valor Cuádruple",
          align: "center",
          field: "valor_cuadruple",
        },
        {
          name: "valor_niño",
          label: "Valor Niño",
          align: "center",
          field: "valor_niño",
        },
        {
          name: "tiquetes_aereos",
          label: "Tiquetes Aéreos",
          align: "center",
          field: "tiquetes_aereos",
        },
        {
          name: "tarjetas_asistencia",
          label: "Tarjetas de Asistencia",
          align: "center",
          field: "tarjetas_asistencia",
        },
        {
          name: "costos_sencilla",
          label: "Costos Sencilla",
          align: "center",
          field: "costos_sencilla",
        },
        {
          name: "costos_doble",
          label: "Costos Doble",
          align: "center",
          field: "costos_doble",
        },
        {
          name: "costos_triple",
          label: "Costos Triple",
          align: "center",
          field: "costos_triple",
        },
        {
          name: "costos_cuadruple",
          label: "Costos Cuádruple",
          align: "center",
          field: "costos_cuadruple",
        },
        {
          name: "costos_niño",
          label: "Costos Niño",
          align: "center",
          field: "costos_niño",
        },
        {
          name: "impuesto",
          label: "Impuesto",
          align: "center",
          field: "impuesto",
        },
        {
          name: "iva_sencilla",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sencilla",
        },
        {
          name: "iva_doble",
          label: "IVA Doble",
          align: "center",
          field: "iva_doble",
        },
        {
          name: "iva_triple",
          label: "IVA Triple",
          align: "center",
          field: "iva_triple",
        },
        {
          name: "iva_cuadruple",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cuadruple",
        },
        {
          name: "iva_niño",
          label: "IVA Niño",
          align: "center",
          field: "iva_niño",
        },
        {
          name: "impoconsumo_sencilla",
          label: "Impoconsumo Sencilla",
          align: "center",
          field: "impoconsumo_sencilla",
        },
        {
          name: "impoconsumo_doble",
          label: "Impoconsumo Doble",
          align: "center",
          field: "impoconsumo_doble",
        },
        {
          name: "impoconsumo_triple",
          label: "Impoconsumo Triple",
          align: "center",
          field: "impoconsumo_triple",
        },
        {
          name: "impoconsumo_cuadruple",
          label: "Impoconsumo Cuádruple",
          align: "center",
          field: "impoconsumo_cuadruple",
        },
        {
          name: "impoconsumo_niño",
          label: "Impoconsumo Niño",
          align: "center",
          field: "impoconsumo_niño",
        },
        {
          name: "ing_propio_sencilla",
          label: "Ingreso Propio Sencilla",
          align: "center",
          field: "ing_propio_sencilla",
        },
        {
          name: "ing_propio_doble",
          label: "Ingreso Propio Doble",
          align: "center",
          field: "ing_propio_doble",
        },
        {
          name: "ing_propio_triple",
          label: "Ingreso Propio Triple",
          align: "center",
          field: "ing_propio_triple",
        },
        {
          name: "ing_propio_cuadruple",
          label: "Ingreso Propio Cuádruple",
          align: "center",
          field: "ing_propio_cuadruple",
        },
        {
          name: "ing_propio_niño",
          label: "Ingreso Propio Niño",
          align: "center",
          field: "ing_propio_niño",
        },
        {
          name: "rentabilidad_sencilla",
          label: "Rentabilidad Sencilla",
          align: "center",
          field: "rentabilidad_sencilla",
        },
        {
          name: "rentabilidad_doble",
          label: "Rentabilidad Doble",
          align: "center",
          field: "rentabilidad_doble",
        },
        {
          name: "rentabilidad_triple",
          label: "Rentabilidad Triple",
          align: "center",
          field: "rentabilidad_triple",
        },
        {
          name: "rentabilidad_cuadruple",
          label: "Rentabilidad Cuádruple",
          align: "center",
          field: "rentabilidad_cuadruple",
        },
        {
          name: "rentabilidad_niño",
          label: "Rentabilidad Niño",
          align: "center",
          field: "rentabilidad_niño",
        },
        {
          name: "iva_ing_propio_sencilla",
          label: "IVA Ingreso Propio Sencilla",
          align: "center",
          field: "iva_ing_propio_sencilla",
        },
        {
          name: "iva_ing_propio_doble",
          label: "IVA Ingreso Propio Doble",
          align: "center",
          field: "iva_ing_propio_doble",
        },
        {
          name: "iva_ing_propio_triple",
          label: "IVA Ingreso Propio Triple",
          align: "center",
          field: "iva_ing_propio_triple",
        },
        {
          name: "iva_ing_propio_cuadruple",
          label: "IVA Ingreso Propio Cuádruple",
          align: "center",
          field: "iva_ing_propio_cuadruple",
        },
        {
          name: "iva_ing_propio_niño",
          label: "IVA Ingreso Propio Niño",
          align: "center",
          field: "iva_ing_propio_niño",
        },
        { name: "total", label: "Total", align: "center", field: "total" },
      ],

      columns_noche_1: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
        {
          name: "Subtotal_sencilla",
          label: "Subtotal Sencilla",
          align: "center",
          field: "Subtotal_sencilla",
        },
        {
          name: "Subtotal_doble",
          label: "Subtotal Doble",
          align: "center",
          field: "Subtotal_doble",
        },
        {
          name: "Subtotal_triple",
          label: "Subtotal Triple",
          align: "center",
          field: "Subtotal_triple",
        },
        {
          name: "Subtotal_cuadruple",
          label: "Subtotal Cuádruple",
          align: "center",
          field: "Subtotal_cuadruple",
        },
        {
          name: "Subtotal_nino",
          label: "Subtotal Niño",
          align: "center",
          field: "Subtotal_nino",
        },
        {
          name: "Imgreso_sencilla",
          label: "Ingreso Sencilla",
          align: "center",
          field: "Imgreso_sencilla",
        },
        {
          name: "Imgreso_doble",
          label: "Ingreso Doble",
          align: "center",
          field: "Imgreso_doble",
        },
        {
          name: "Imgreso_triple",
          label: "Ingreso Triple",
          align: "center",
          field: "Imgreso_triple",
        },
        {
          name: "Imgreso_cuadruple",
          label: "Ingreso Cuádruple",
          align: "center",
          field: "Imgreso_cuadruple",
        },
        {
          name: "Imgreso_nino",
          label: "Ingreso Niño",
          align: "center",
          field: "Imgreso_nino",
        },
        {
          name: "utilidad_sencilla",
          label: "Utilidad Sencilla",
          align: "center",
          field: "utilidad_sencilla",
        },
        {
          name: "utilidad_doble",
          label: "Utilidad Doble",
          align: "center",
          field: "utilidad_doble",
        },
        {
          name: "utilidad_triple",
          label: "Utilidad Triple",
          align: "center",
          field: "utilidad_triple",
        },
        {
          name: "utilidad_cuadruple",
          label: "Utilidad Cuádruple",
          align: "center",
          field: "utilidad_cuadruple",
        },
        {
          name: "utilidad_nino",
          label: "Utilidad Niño",
          align: "center",
          field: "utilidad_nino",
        },
        {
          name: "imptos_tkt",
          label: "Impuestos TKT",
          align: "center",
          field: "imptos_tkt",
        },
        {
          name: "iva_sgl",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sgl",
        },
        {
          name: "iva_db",
          label: "IVA Doble",
          align: "center",
          field: "iva_db",
        },
        {
          name: "iva_trp",
          label: "IVA Triple",
          align: "center",
          field: "iva_trp",
        },
        {
          name: "iva_cdp",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cdp",
        },
        {
          name: "iva_nino",
          label: "IVA Niño",
          align: "center",
          field: "iva_nino",
        },
        {
          name: "iva_imgr_sgl",
          label: "IVA Ingreso Sencilla",
          align: "center",
          field: "iva_imgr_sgl",
        },
        {
          name: "iva_imgr_db",
          label: "IVA Ingreso Doble",
          align: "center",
          field: "iva_imgr_db",
        },
        {
          name: "iva_imgr_trp",
          label: "IVA Ingreso Triple",
          align: "center",
          field: "iva_imgr_trp",
        },
        {
          name: "iva_imgr_cdp",
          label: "IVA Ingreso Cuádruple",
          align: "center",
          field: "iva_imgr_cdp",
        },
        {
          name: "iva_imgr_nino",
          label: "IVA Ingreso Niño",
          align: "center",
          field: "iva_imgr_nino",
        },
        {
          name: "precio_venta_sencilla",
          label: "Precio Venta Sencilla",
          align: "center",
          field: "precio_venta_sencilla",
        },
        {
          name: "precio_venta_doble",
          label: "Precio Venta Doble",
          align: "center",
          field: "precio_venta_doble",
        },
        {
          name: "precio_venta_triple",
          label: "Precio Venta Triple",
          align: "center",
          field: "precio_venta_triple",
        },
        {
          name: "precio_venta_cuadruple",
          label: "Precio Venta Cuádruple",
          align: "center",
          field: "precio_venta_cuadruple",
        },
        {
          name: "precio_venta_nino",
          label: "Precio Venta Niño",
          align: "center",
          field: "precio_venta_nino",
        },
      ],

      columns_noche_2: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
        {
          name: "Subtotal_sencilla",
          label: "Subtotal Sencilla",
          align: "center",
          field: "Subtotal_sencilla",
        },
        {
          name: "Subtotal_doble",
          label: "Subtotal Doble",
          align: "center",
          field: "Subtotal_doble",
        },
        {
          name: "Subtotal_triple",
          label: "Subtotal Triple",
          align: "center",
          field: "Subtotal_triple",
        },
        {
          name: "Subtotal_cuadruple",
          label: "Subtotal Cuádruple",
          align: "center",
          field: "Subtotal_cuadruple",
        },
        {
          name: "Subtotal_nino",
          label: "Subtotal Niño",
          align: "center",
          field: "Subtotal_nino",
        },
        {
          name: "Imgreso_sencilla",
          label: "Ingreso Sencilla",
          align: "center",
          field: "Imgreso_sencilla",
        },
        {
          name: "Imgreso_doble",
          label: "Ingreso Doble",
          align: "center",
          field: "Imgreso_doble",
        },
        {
          name: "Imgreso_triple",
          label: "Ingreso Triple",
          align: "center",
          field: "Imgreso_triple",
        },
        {
          name: "Imgreso_cuadruple",
          label: "Ingreso Cuádruple",
          align: "center",
          field: "Imgreso_cuadruple",
        },
        {
          name: "Imgreso_nino",
          label: "Ingreso Niño",
          align: "center",
          field: "Imgreso_nino",
        },
        {
          name: "utilidad_sencilla",
          label: "Utilidad Sencilla",
          align: "center",
          field: "utilidad_sencilla",
        },
        {
          name: "utilidad_doble",
          label: "Utilidad Doble",
          align: "center",
          field: "utilidad_doble",
        },
        {
          name: "utilidad_triple",
          label: "Utilidad Triple",
          align: "center",
          field: "utilidad_triple",
        },
        {
          name: "utilidad_cuadruple",
          label: "Utilidad Cuádruple",
          align: "center",
          field: "utilidad_cuadruple",
        },
        {
          name: "utilidad_nino",
          label: "Utilidad Niño",
          align: "center",
          field: "utilidad_nino",
        },
        {
          name: "imptos_tkt",
          label: "Impuestos TKT",
          align: "center",
          field: "imptos_tkt",
        },
        {
          name: "iva_sgl",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sgl",
        },
        {
          name: "iva_db",
          label: "IVA Doble",
          align: "center",
          field: "iva_db",
        },
        {
          name: "iva_trp",
          label: "IVA Triple",
          align: "center",
          field: "iva_trp",
        },
        {
          name: "iva_cdp",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cdp",
        },
        {
          name: "iva_nino",
          label: "IVA Niño",
          align: "center",
          field: "iva_nino",
        },
        {
          name: "iva_imgr_sgl",
          label: "IVA Ingreso Sencilla",
          align: "center",
          field: "iva_imgr_sgl",
        },
        {
          name: "iva_imgr_db",
          label: "IVA Ingreso Doble",
          align: "center",
          field: "iva_imgr_db",
        },
        {
          name: "iva_imgr_trp",
          label: "IVA Ingreso Triple",
          align: "center",
          field: "iva_imgr_trp",
        },
        {
          name: "iva_imgr_cdp",
          label: "IVA Ingreso Cuádruple",
          align: "center",
          field: "iva_imgr_cdp",
        },
        {
          name: "iva_imgr_nino",
          label: "IVA Ingreso Niño",
          align: "center",
          field: "iva_imgr_nino",
        },
        {
          name: "precio_venta_sencilla",
          label: "Precio Venta Sencilla",
          align: "center",
          field: "precio_venta_sencilla",
        },
        {
          name: "precio_venta_doble",
          label: "Precio Venta Doble",
          align: "center",
          field: "precio_venta_doble",
        },
        {
          name: "precio_venta_triple",
          label: "Precio Venta Triple",
          align: "center",
          field: "precio_venta_triple",
        },
        {
          name: "precio_venta_cuadruple",
          label: "Precio Venta Cuádruple",
          align: "center",
          field: "precio_venta_cuadruple",
        },
        {
          name: "precio_venta_nino",
          label: "Precio Venta Niño",
          align: "center",
          field: "precio_venta_nino",
        },
      ],

      columns_noche_3: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
        {
          name: "Subtotal_sencilla",
          label: "Subtotal Sencilla",
          align: "center",
          field: "Subtotal_sencilla",
        },
        {
          name: "Subtotal_doble",
          label: "Subtotal Doble",
          align: "center",
          field: "Subtotal_doble",
        },
        {
          name: "Subtotal_triple",
          label: "Subtotal Triple",
          align: "center",
          field: "Subtotal_triple",
        },
        {
          name: "Subtotal_cuadruple",
          label: "Subtotal Cuádruple",
          align: "center",
          field: "Subtotal_cuadruple",
        },
        {
          name: "Subtotal_nino",
          label: "Subtotal Niño",
          align: "center",
          field: "Subtotal_nino",
        },
        {
          name: "Imgreso_sencilla",
          label: "Ingreso Sencilla",
          align: "center",
          field: "Imgreso_sencilla",
        },
        {
          name: "Imgreso_doble",
          label: "Ingreso Doble",
          align: "center",
          field: "Imgreso_doble",
        },
        {
          name: "Imgreso_triple",
          label: "Ingreso Triple",
          align: "center",
          field: "Imgreso_triple",
        },
        {
          name: "Imgreso_cuadruple",
          label: "Ingreso Cuádruple",
          align: "center",
          field: "Imgreso_cuadruple",
        },
        {
          name: "Imgreso_nino",
          label: "Ingreso Niño",
          align: "center",
          field: "Imgreso_nino",
        },
        {
          name: "utilidad_sencilla",
          label: "Utilidad Sencilla",
          align: "center",
          field: "utilidad_sencilla",
        },
        {
          name: "utilidad_doble",
          label: "Utilidad Doble",
          align: "center",
          field: "utilidad_doble",
        },
        {
          name: "utilidad_triple",
          label: "Utilidad Triple",
          align: "center",
          field: "utilidad_triple",
        },
        {
          name: "utilidad_cuadruple",
          label: "Utilidad Cuádruple",
          align: "center",
          field: "utilidad_cuadruple",
        },
        {
          name: "utilidad_nino",
          label: "Utilidad Niño",
          align: "center",
          field: "utilidad_nino",
        },
        {
          name: "imptos_tkt",
          label: "Impuestos TKT",
          align: "center",
          field: "imptos_tkt",
        },
        {
          name: "iva_sgl",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sgl",
        },
        {
          name: "iva_db",
          label: "IVA Doble",
          align: "center",
          field: "iva_db",
        },
        {
          name: "iva_trp",
          label: "IVA Triple",
          align: "center",
          field: "iva_trp",
        },
        {
          name: "iva_cdp",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cdp",
        },
        {
          name: "iva_nino",
          label: "IVA Niño",
          align: "center",
          field: "iva_nino",
        },
        {
          name: "iva_imgr_sgl",
          label: "IVA Ingreso Sencilla",
          align: "center",
          field: "iva_imgr_sgl",
        },
        {
          name: "iva_imgr_db",
          label: "IVA Ingreso Doble",
          align: "center",
          field: "iva_imgr_db",
        },
        {
          name: "iva_imgr_trp",
          label: "IVA Ingreso Triple",
          align: "center",
          field: "iva_imgr_trp",
        },
        {
          name: "iva_imgr_cdp",
          label: "IVA Ingreso Cuádruple",
          align: "center",
          field: "iva_imgr_cdp",
        },
        {
          name: "iva_imgr_nino",
          label: "IVA Ingreso Niño",
          align: "center",
          field: "iva_imgr_nino",
        },
        {
          name: "precio_venta_sencilla",
          label: "Precio Venta Sencilla",
          align: "center",
          field: "precio_venta_sencilla",
        },
        {
          name: "precio_venta_doble",
          label: "Precio Venta Doble",
          align: "center",
          field: "precio_venta_doble",
        },
        {
          name: "precio_venta_triple",
          label: "Precio Venta Triple",
          align: "center",
          field: "precio_venta_triple",
        },
        {
          name: "precio_venta_cuadruple",
          label: "Precio Venta Cuádruple",
          align: "center",
          field: "precio_venta_cuadruple",
        },
        {
          name: "precio_venta_nino",
          label: "Precio Venta Niño",
          align: "center",
          field: "precio_venta_nino",
        },
      ],

      columns_noche_4: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
        {
          name: "Subtotal_sencilla",
          label: "Subtotal Sencilla",
          align: "center",
          field: "Subtotal_sencilla",
        },
        {
          name: "Subtotal_doble",
          label: "Subtotal Doble",
          align: "center",
          field: "Subtotal_doble",
        },
        {
          name: "Subtotal_triple",
          label: "Subtotal Triple",
          align: "center",
          field: "Subtotal_triple",
        },
        {
          name: "Subtotal_cuadruple",
          label: "Subtotal Cuádruple",
          align: "center",
          field: "Subtotal_cuadruple",
        },
        {
          name: "Subtotal_nino",
          label: "Subtotal Niño",
          align: "center",
          field: "Subtotal_nino",
        },
        {
          name: "Imgreso_sencilla",
          label: "Ingreso Sencilla",
          align: "center",
          field: "Imgreso_sencilla",
        },
        {
          name: "Imgreso_doble",
          label: "Ingreso Doble",
          align: "center",
          field: "Imgreso_doble",
        },
        {
          name: "Imgreso_triple",
          label: "Ingreso Triple",
          align: "center",
          field: "Imgreso_triple",
        },
        {
          name: "Imgreso_cuadruple",
          label: "Ingreso Cuádruple",
          align: "center",
          field: "Imgreso_cuadruple",
        },
        {
          name: "Imgreso_nino",
          label: "Ingreso Niño",
          align: "center",
          field: "Imgreso_nino",
        },
        {
          name: "utilidad_sencilla",
          label: "Utilidad Sencilla",
          align: "center",
          field: "utilidad_sencilla",
        },
        {
          name: "utilidad_doble",
          label: "Utilidad Doble",
          align: "center",
          field: "utilidad_doble",
        },
        {
          name: "utilidad_triple",
          label: "Utilidad Triple",
          align: "center",
          field: "utilidad_triple",
        },
        {
          name: "utilidad_cuadruple",
          label: "Utilidad Cuádruple",
          align: "center",
          field: "utilidad_cuadruple",
        },
        {
          name: "utilidad_nino",
          label: "Utilidad Niño",
          align: "center",
          field: "utilidad_nino",
        },
        {
          name: "imptos_tkt",
          label: "Impuestos TKT",
          align: "center",
          field: "imptos_tkt",
        },
        {
          name: "iva_sgl",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sgl",
        },
        {
          name: "iva_db",
          label: "IVA Doble",
          align: "center",
          field: "iva_db",
        },
        {
          name: "iva_trp",
          label: "IVA Triple",
          align: "center",
          field: "iva_trp",
        },
        {
          name: "iva_cdp",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cdp",
        },
        {
          name: "iva_nino",
          label: "IVA Niño",
          align: "center",
          field: "iva_nino",
        },
        {
          name: "iva_imgr_sgl",
          label: "IVA Ingreso Sencilla",
          align: "center",
          field: "iva_imgr_sgl",
        },
        {
          name: "iva_imgr_db",
          label: "IVA Ingreso Doble",
          align: "center",
          field: "iva_imgr_db",
        },
        {
          name: "iva_imgr_trp",
          label: "IVA Ingreso Triple",
          align: "center",
          field: "iva_imgr_trp",
        },
        {
          name: "iva_imgr_cdp",
          label: "IVA Ingreso Cuádruple",
          align: "center",
          field: "iva_imgr_cdp",
        },
        {
          name: "iva_imgr_nino",
          label: "IVA Ingreso Niño",
          align: "center",
          field: "iva_imgr_nino",
        },
        {
          name: "precio_venta_sencilla",
          label: "Precio Venta Sencilla",
          align: "center",
          field: "precio_venta_sencilla",
        },
        {
          name: "precio_venta_doble",
          label: "Precio Venta Doble",
          align: "center",
          field: "precio_venta_doble",
        },
        {
          name: "precio_venta_triple",
          label: "Precio Venta Triple",
          align: "center",
          field: "precio_venta_triple",
        },
        {
          name: "precio_venta_cuadruple",
          label: "Precio Venta Cuádruple",
          align: "center",
          field: "precio_venta_cuadruple",
        },
        {
          name: "precio_venta_nino",
          label: "Precio Venta Niño",
          align: "center",
          field: "precio_venta_nino",
        },
      ],

      columns_noche_5: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "hotel", label: "Hotel", align: "left", field: "hotel" },
        {
          name: "tipodehabitacion",
          label: "Tipo de Habitación",
          align: "left",
          field: "tipodehabitacion",
        },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
        {
          name: "Subtotal_sencilla",
          label: "Subtotal Sencilla",
          align: "center",
          field: "Subtotal_sencilla",
        },
        {
          name: "Subtotal_doble",
          label: "Subtotal Doble",
          align: "center",
          field: "Subtotal_doble",
        },
        {
          name: "Subtotal_triple",
          label: "Subtotal Triple",
          align: "center",
          field: "Subtotal_triple",
        },
        {
          name: "Subtotal_cuadruple",
          label: "Subtotal Cuádruple",
          align: "center",
          field: "Subtotal_cuadruple",
        },
        {
          name: "Subtotal_nino",
          label: "Subtotal Niño",
          align: "center",
          field: "Subtotal_nino",
        },
        {
          name: "Imgreso_sencilla",
          label: "Ingreso Sencilla",
          align: "center",
          field: "Imgreso_sencilla",
        },
        {
          name: "Imgreso_doble",
          label: "Ingreso Doble",
          align: "center",
          field: "Imgreso_doble",
        },
        {
          name: "Imgreso_triple",
          label: "Ingreso Triple",
          align: "center",
          field: "Imgreso_triple",
        },
        {
          name: "Imgreso_cuadruple",
          label: "Ingreso Cuádruple",
          align: "center",
          field: "Imgreso_cuadruple",
        },
        {
          name: "Imgreso_nino",
          label: "Ingreso Niño",
          align: "center",
          field: "Imgreso_nino",
        },
        {
          name: "utilidad_sencilla",
          label: "Utilidad Sencilla",
          align: "center",
          field: "utilidad_sencilla",
        },
        {
          name: "utilidad_doble",
          label: "Utilidad Doble",
          align: "center",
          field: "utilidad_doble",
        },
        {
          name: "utilidad_triple",
          label: "Utilidad Triple",
          align: "center",
          field: "utilidad_triple",
        },
        {
          name: "utilidad_cuadruple",
          label: "Utilidad Cuádruple",
          align: "center",
          field: "utilidad_cuadruple",
        },
        {
          name: "utilidad_nino",
          label: "Utilidad Niño",
          align: "center",
          field: "utilidad_nino",
        },
        {
          name: "imptos_tkt",
          label: "Impuestos TKT",
          align: "center",
          field: "imptos_tkt",
        },
        {
          name: "iva_sgl",
          label: "IVA Sencilla",
          align: "center",
          field: "iva_sgl",
        },
        {
          name: "iva_db",
          label: "IVA Doble",
          align: "center",
          field: "iva_db",
        },
        {
          name: "iva_trp",
          label: "IVA Triple",
          align: "center",
          field: "iva_trp",
        },
        {
          name: "iva_cdp",
          label: "IVA Cuádruple",
          align: "center",
          field: "iva_cdp",
        },
        {
          name: "iva_nino",
          label: "IVA Niño",
          align: "center",
          field: "iva_nino",
        },
        {
          name: "iva_imgr_sgl",
          label: "IVA Ingreso Sencilla",
          align: "center",
          field: "iva_imgr_sgl",
        },
        {
          name: "iva_imgr_db",
          label: "IVA Ingreso Doble",
          align: "center",
          field: "iva_imgr_db",
        },
        {
          name: "iva_imgr_trp",
          label: "IVA Ingreso Triple",
          align: "center",
          field: "iva_imgr_trp",
        },
        {
          name: "iva_imgr_cdp",
          label: "IVA Ingreso Cuádruple",
          align: "center",
          field: "iva_imgr_cdp",
        },
        {
          name: "iva_imgr_nino",
          label: "IVA Ingreso Niño",
          align: "center",
          field: "iva_imgr_nino",
        },
        {
          name: "precio_venta_sencilla",
          label: "Precio Venta Sencilla",
          align: "center",
          field: "precio_venta_sencilla",
        },
        {
          name: "precio_venta_doble",
          label: "Precio Venta Doble",
          align: "center",
          field: "precio_venta_doble",
        },
        {
          name: "precio_venta_triple",
          label: "Precio Venta Triple",
          align: "center",
          field: "precio_venta_triple",
        },
        {
          name: "precio_venta_cuadruple",
          label: "Precio Venta Cuádruple",
          align: "center",
          field: "precio_venta_cuadruple",
        },
        {
          name: "precio_venta_nino",
          label: "Precio Venta Niño",
          align: "center",
          field: "precio_venta_nino",
        },
      ],
      columns_Receptivos: [
        {
          name: "receptivos",
          label: "Receptivos",
          align: "left",
          field: "receptivos",
        },
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        {
          name: "sencilla",
          label: "Sencilla",
          align: "center",
          field: "sencilla",
        },
        { name: "doble", label: "Doble", align: "center", field: "doble" },
        { name: "triple", label: "Triple", align: "center", field: "triple" },
        {
          name: "cuadruple",
          label: "Cuádruple",
          align: "center",
          field: "cuadruple",
        },
        { name: "niño", label: "Niño", align: "center", field: "niño" },
      ],

      columns_Proveedores: [
        { name: "destino", label: "Destino", align: "left", field: "destino" },
        { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
        { name: "nit", label: "Nit", align: "center", field: "nit" },
        { name: "rnt", label: "Rnt", align: "center", field: "rnt" },
        { name: "ciudad", label: "Ciudad", align: "center", field: "ciudad" },
        {
          name: "direccion",
          label: "Direccion",
          align: "center",
          field: "direccion",
        },
        { name: "correo", label: "Correo", align: "center", field: "correo" },
        {
          name: "telefono",
          label: "Telefono",
          align: "center",
          field: "telefono",
        },
        { name: "web", label: "Web", align: "center", field: "web" },
        {
          name: "tipo_servicio",
          label: "Tipo de servicio",
          align: "center",
          field: "tipo_servicio",
        },
        {
          name: "operador",
          label: "Operador",
          align: "center",
          field: "operador",
        },
        {
          name: "tipo_de_regimen",
          label: "Tipo de regimen",
          align: "center",
          field: "tipo_de_regimen",
        },
        {
          name: "representante_legal",
          label: "Representante legal",
          align: "center",
          field: "representante_legal",
        },
        {
          name: "Num_Registro_Camara_De_Comercio",
          label: "Numero de registro Mercantil",
          align: "center",
          field: "Num_Registro_Camara_De_Comercio",
        },
        {
          name: "certificacion_sostenibilidad",
          label: "Certificacion sostenibilidad",
          align: "center",
          field: "certificacion_sostenibilidad",
        },
      ],

      pagination: {
        rowsPerPage: 10,
        sortBy: null,
        descending: false,
        page: 1,
      },
    };
  },

  methods: {
    //----------------------------------------------------------- Datos de las Tablas ------------------------------------------------------------------//
    async fetchData() {
      this.loading = true;
      try {
        const baseURL = "http://localhost:8010/ControlLiquidacion";

        // Verificar que el servidor esté respondiendo
        const responses = await Promise.all([
          axios.get(`${baseURL}/costos`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/Costos_unico`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/noches_uno`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/noches_dos`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/noches_tres`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/noches_cuatro`).catch((e) => ({ data: [] })),
          axios
            .get(`${baseURL}/noche_adicionales`)
            .catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/receptivo`).catch((e) => ({ data: [] })),
          axios.get(`${baseURL}/proveedores`).catch((e) => ({ data: [] })),
        ]);

        [
          this.rowsCostos,
          this.rowsCostos_Unicos,
          this.rowsNochesUno,
          this.rowsNochesDos,
          this.rowsNochesTres,
          this.rowsNochesCuatro,
          this.rowsNocheAdicionales,
          this.rowsreceptivo,
          this.rowsproveedores,
        ] = responses.map((response) => response.data);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        // Inicializar con arrays vacíos en caso de error
        this.rowsCostos = [];
        this.rowsCostos_Unicos = [];
        this.rowsNochesUno = [];
        this.rowsNochesDos = [];
        this.rowsNochesTres = [];
        this.rowsNochesCuatro = [];
        this.rowsNocheAdicionales = [];
        this.rowsreceptivo = [];
        this.rowsproveedores = [];
      } finally {
        this.loading = false;
      }
    },
    //----------------------------------------------------------- Script del Excel supremo ------------------------------------------------------------------//

    async descargarExcel() {
      try {
        const response = await axios.get(
          "https://backmultidestinos.onrender.com/ControlLiquidacion/descargar-excel",
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "costos.xlsx");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error al descargar Excel:", error);
      }
    },
    async subirExcel() {
      if (!this.file) {
        alert("Selecciona un archivo Excel");
        return;
      }
      const formData = new FormData();
      formData.append("file", this.file);

      try {
        const response = await axios.post(
          "https://backmultidestinos.onrender.com/ControlLiquidacion/subir-excel",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // ✅ Mensaje en consola
        console.log("✅ Archivo subido correctamente:", response);

        // ✅ Alerta visual
        Swal.fire({
          title: "¡Éxito!",
          text: "Archivo subido exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
          timer: 3000, // Cierra la alerta automáticamente después de 3 segundos
          timerProgressBar: true,
        });

        this.showDialog = false; // 🔹 Cierra el diálogo

        // Limpiar el archivo después de la subida
        this.file = null;

        this.fetchData(); // Recargar datos
      } catch (error) {
        // ❌ Error en la subida
        console.error("❌ Error al subir Excel:", error);

        // ❌ Alerta de error
        Swal.fire({
          title: "Error",
          text: "No se pudo subir el archivo. Inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
          timer: 3000, // Cierra la alerta automáticamente después de 3 segundos
          timerProgressBar: true,
        });
      }
    },

    //-------------------------------------------------------------------------------------------------------------------------------------------------------------//
  },
  mounted() {
    this.fetchData(); // Cargar datos al iniciar la página
  },
};
</script>

<!------------------------------------------------------------------------------------------------------------------------------------------------------------->

<!--------------------------------------------------------- Style del codigo ---------------------------------------------------------------------------------->

<style scoped>
/*--------------------------------------------------------------------Cuerpo de la estructura------------------------------------------------------------------*/
.container {
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre los cuadros */
}

.box {
  border: 1px solid black;
  background: white;
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.small {
  width: 100%;
  height: 70px;
  /* Permite scroll si es necesario */
}

.full {
  width: 100%;
  height: auto; /* Cambiado de 300px a auto */
  min-height: 300px;
  max-height: 500px; /* Altura máxima */
  overflow: auto; /* Permite scroll si el contenido excede */
}

.row {
  display: flex;
  gap: 15px;
}

.medium {
  width: calc(50% - 7.5px);
  height: auto; /* Cambiado de 300px a auto */
  min-height: 300px;
  max-height: 500px; /* Altura máxima */
  overflow: auto; /* Permite scroll si el contenido excede */
}

/* Responsivo */
@media (max-width: 1024px) {
  .medium {
    width: 100%;
  }
}

/*--------------------------------------------------------------------Cuerpo de la tabla ---------------------------------------------------------------------*/

/* Estilos base para la tabla */
.custom-table {
  height: 100%;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  overflow: hidden;
  transform-origin: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(to right, #ffffff, #fafafa);
}

.custom-table:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Estilos para el encabezado superior */
.q-table__top {
  position: sticky;
  top: 0;
  z-index: 3;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  padding: 20px 28px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* Estilos para el encabezado de columnas */
thead tr:first-child th {
  position: sticky;
  top: 72px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  font-weight: 700;
  color: #2d3436;
  padding: 16px 20px;
  border-bottom: 3px solid #e1e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

thead tr:first-child th:hover {
  background: linear-gradient(135deg, #e9ecef, #dee2e6);
  transform: translateY(-1px);
}

/* Estilos para las celdas */
.q-td {
  padding: 16px 20px !important;
  color: #2d3436;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto hover en las filas */
.hover-effect {
  position: relative;
  overflow: hidden;
}

.hover-effect:hover {
  background: linear-gradient(
    to right,
    rgba(200, 230, 255, 0.1),
    rgba(200, 230, 255, 0.2)
  ) !important;
  transform: scale(1.002);
}

.hover-effect::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.hover-effect:hover::after {
  left: 100%;
}

/* Contenedor de la tabla con scroll */
.q-table__container {
  max-height: calc(100vh - 130px);
  overflow-y: auto;
  border-radius: 25px;
  transition: all 0.3s ease;
  scrollbar-width: thin;
  scrollbar-color: #0116ff #ffffff;
}

/* Ocultar scrollbar por defecto */
.q-table__container::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}

/* Track del scrollbar */
.q-table__container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

/* Thumb del scrollbar - Estilo minimalista */
.q-table__container::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
  height: 100px;
  position: relative;
}

/* Hover effect en el thumb */
.q-table__container::-webkit-scrollbar-thumb:hover {
  background: #bdbdbd;
}

/* Active state */
.q-table__container::-webkit-scrollbar-thumb:active {
  background: #9e9e9e;
}

/* Área de agarre central */
.q-table__container::-webkit-scrollbar-thumb::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 50px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

/* Eliminar botones del scrollbar */
.q-table__container::-webkit-scrollbar-button {
  display: none;
}

/* Animación de carga */
.q-table--loading {
  position: relative;
  overflow: hidden;
}

.q-table--loading::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: loading-shine 1.5s infinite;
}

@keyframes loading-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Estilos para valores numéricos */
.q-table td[align="right"] {
  text-align: right;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.95em;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.q-table td[align="right"]:hover {
  color: #0066cc;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .q-table__container {
    max-height: calc(100vh - 110px);
  }

  .q-td,
  thead tr:first-child th {
    padding: 12px 16px !important;
  }

  .q-table__title {
    font-size: 1.2em;
  }
}

/* Estilos para filas alternadas */
.q-table tbody tr:nth-child(even) {
  background: linear-gradient(to right, #f8f9fa, #f1f3f5);
  transition: all 0.3s ease;
}

/* Estilos para el título de la tabla */
.q-table__title {
  font-size: 1.5em;
  font-weight: 700;
  color: #2d3436;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #2d3436, #636e72);
  background-clip: text; /* Versión estándar */
  -webkit-background-clip: text; /* Versión con prefijo */
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.q-table__title:hover {
  transform: translateX(4px);
  background: linear-gradient(135deg, #0984e3, #00b894);
  background-clip: text; /* Versión estándar */
  -webkit-background-clip: text; /* Versión con prefijo */
  -webkit-text-fill-color: transparent;
}
/* Animación de expansión de filas */
.q-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.q-table tbody tr:hover {
  transform: scale(1.002);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 1;
  position: relative;
}

/*--------------------------------------------------------------------Estilos del titulo---------------------------------------------------------------------*/
.custom-card {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 2rem; /* Texto más grande */
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;

  /* Fondo transparente */
  background: transparent;
  border-radius: 18px;
  box-shadow: 6px 6px 20px rgba(0, 0, 0, 0.447); /* Sombra sutil */

  /* Borde estilo glassmorphism */
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Texto con degradado */
.custom-card span {
  background: linear-gradient(45deg, #ff6a00, #ee0979, #8a2be2);
  background-clip: text; /* Propiedad estándar */
  -webkit-background-clip: text; /* Para compatibilidad con WebKit */
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Efecto de brillo en hover */
.custom-card:hover {
  transform: scale(1.05);
  box-shadow: 8px 8px 25px rgba(255, 255, 255, 0.2);
}

/* Animación de entrada */
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

.custom-card {
  animation: fadeIn 0.6s ease-in-out;
}

/*--------------------------------------------------------------------Cuerpo de la alerta del Excel ---------------------------------------------------------------------*/

.gradient-btn {
  background: linear-gradient(to right, #1976d2, #6d4c9c);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.gradient-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.dialog-card {
  width: 550px;
  max-width: 50vw;
  border-radius: 12px;
  background: linear-gradient(to bottom, rgb(255, 255, 255), #90c4ff);
  border: 2px solid #90caf9;
}

.header-section {
  border-bottom: 1px solid #e3f2fd;
  padding: 20px;
}

.upload-alert {
  background: rgba(255, 255, 255, 0.7);
  border: 2px solid #90caf9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 24px;
  border: 2px dashed #0134ff;
  border-radius: 8px;
  transition: all 0.2s;
}

.upload-area:hover {
  background: #e3f2fd;
}

.upload-btn {
  background: linear-gradient(to right, #2e7d32, #1b5e20);
  color: rgb(217, 0, 0);
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.upload-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.status-message {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
}

.status-message.success {
  background: #e8f5e9;
  color: #00ff0d;
}

.status-message.error {
  background: #ffebee;
  color: #c62828;
}

.separator {
  background: #e3edf4;
  height: 3px;
  width: 90%;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.208);
  margin-left: 5%;
}
</style>

<!------------------------------------------------------------------------------------------------------------------------------------------------------------->
