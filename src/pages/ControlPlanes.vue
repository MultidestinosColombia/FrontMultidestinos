<template>
  <q-page class="q-pa-md">
    <h6 class="q-mt-lg">Planes</h6>
    <q-btn
      @click="mostrarModalAgregar = true"
      label="Agregar Plan"
      class="q-mb-md q-mr-sm"
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
    <!--------------------------------------------------Boton de Descarga de Formato----------------------------------------------------->
    <q-btn
      @click="abrirModalFormato"
      label="Descargar Formato"
      class="q-mb-md q-mr-sm"
      color="primary"
      icon="download"
    />

    <!-- Modal de Descarga -->
    <q-dialog v-model="MostrarFormato" persistent>
      <q-card class="q-pa-lg" style="border-radius: 12px; max-width: 500px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3)">
        <q-card-section class="text-center">
          <div class="text-h6 text-weight-bold">Seleccionar Formato</div>
          <div class="text-subtitle1 text-grey-7 q-mt-xs">¿Qué tipo de formato necesitas?</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <q-list bordered separator>

            <!-- Botón para descargar formato para nuevos registros -->
            <q-item clickable v-ripple class="hover-effect" @click="descargarExcel('nuevo')">
              <q-item-section avatar>
                <q-avatar size="48px" class="bg-primary text-white">
                  <q-icon name="cloud_download" size="28px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Planes Nuevos</q-item-label>
                <q-item-label caption>Formato para crear nuevos registros</q-item-label>
              </q-item-section>
            </q-item>

            <!-- Botón para descargar formato con datos existentes -->
            <q-item clickable v-ripple class="hover-effect selected-item" @click="descargarExcel('existente')">
              <q-item-section avatar>
                <q-avatar size="48px" class="bg-blue-3 text-primary">
                  <q-icon name="assignment" size="28px" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Actualización</q-item-label>
                <q-item-label caption>Formato con datos existentes</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-mt-md">
          <q-btn label="Cancelar" color="grey-8" flat v-close-popup class="full-width q-pa-md text-bold" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- Botón para abrir el modal de importar datos -->
    <q-btn
      @click="mostrarModalImportar = true"
      label="Importar Datos"
      class="q-mb-md"
      color="positive"
      icon="upload_file"
    />

    <!-- Modal para importar datos -->
  <q-dialog v-model="mostrarModalImportar" persistent transition-show="scale" transition-hide="fade">
    <q-card style="min-width: 420px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3)">
      <q-card-section class="bg-positive text-white">
        <div class="text-h6 flex items-center">
          <q-icon name="upload_file" size="md" class="q-mr-sm" />
          Importar Datos
        </div>
      </q-card-section>

      <q-card-section class="q-pa-md">
        <q-separator class="q-my-md" color="positive" />
        <div class="q-pa-md">
          <q-file
            v-model="archivoExcel"
            label="Seleccionar archivo Excel"
            accept=".xlsx"
            @rejected="onRejected"
            filled
            color="positive"
            counter
            bottom-slots
            class="animated-input"
          >
            <template v-slot:append>
              <q-icon name="cloud_upload" size="md" class="text-white" />
            </template>
            <template v-slot:hint> Solo archivos Excel (.xlsx) </template>
          </q-file>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md q-gutter-md">
        <q-btn
          flat
          label="Cancelar"
          color="grey-8"
          v-close-popup
          :disable="procesando"
          class="rounded-borders animated-btn"
        />

        <!-- Botón para importar datos nuevos -->
        <q-btn
          label="Importar Datos Nuevos"
          color="positive"
          @click="importarDatosNuevo"
          :loading="procesando"
          :disable="!archivoExcel"
          icon="file_upload"
          class="rounded-borders animated-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots color="white" />
          </template>
        </q-btn>

        <!-- Botón para actualizar datos -->
        <q-btn
          label="Actualizar Datos"
          color="primary"
          @click="importarDatosExistente"
          :loading="procesando"
          :disable="!archivoExcel"
          icon="refresh"
          class="rounded-borders animated-btn"
        >
          <template v-slot:loading>
            <q-spinner-dots color="white" />
          </template>
        </q-btn>
      </q-card-actions>

      <q-linear-progress v-if="procesando" indeterminate color="positive" class="q-mt-sm" />
    </q-card>
  </q-dialog>




    <!---------------------------------------------------------------------------------------------------------------------------------->
    <q-table
      :rows="planes"
      :columns="columnas"
      row-key="id"
      :pagination="{ rowsPerPage: 5 }"
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
               v-for="noches in (props.row.noches ? props.row.noches.split('*') : [])"
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

<!---------------------------------------------------------------Nuevo Formato--------------------------------------------------------------------------->
    <!-- TIQUETE Y TRANSPORTE -->

    <q-page class="q-pa-md">
      <h6 class="q-mt-lg">Tiquete (Suplemento)</h6>

      <q-btn
        @click="mostrarModalAgregarTiquete = true"
        label="Agregar Tiquete"
        class="q-mb-md"
        color="primary"
      />

      <q-dialog v-model="mostrarModalAgregarTiquete" persistent>
        <q-card class="transport-dialog-card" style="max-width: 700px; width: 100%">
          <!-- Encabezado del Dialog -->
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="text-h6">
                <q-icon name="add_circle" class="q-mr-sm" />
                Nuevo Tiquete
              </div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="agregarTiqueteSubmit" class="q-gutter-md">
              <!-- Información Básica -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-primary">Información Básica</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Salida"
                      v-model="nuevoTiqueteSalida"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="flight_takeoff" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Pertenece"
                      v-model="nuevoTiquetePertenece"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="map" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos y tasa -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="teal" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-teal">Impuestos y Tasas</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Neta"
                      v-model="nuevoTiqueteNeta"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_money" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Tasas"
                      v-model="nuevoTiqueteTasas"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="IVA"
                      v-model="nuevoTiqueteIva"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Total"
                      v-model="nuevoTiqueteTotal"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calculate" color="teal" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  v-close-popup
                  class="q-px-md"
                  icon="close"
                />
                <q-btn
                  type="submit"
                  label="Agregar Tiquete"
                  color="primary"
                  class="q-px-md"
                  icon="save"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

<!------------------------------------------------------------------------------------------------------------------------------------------>
<q-dialog v-model="mostrarModalEditarTiquete" persistent>
        <q-card class="transport-dialog-card" style="max-width: 700px; width: 100%">
          <!-- Encabezado del Dialog -->
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="text-h6">
                <q-icon name="add_circle" class="q-mr-sm" />
                Editar Tiquete
              </div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="editarTiqueteSubmit" class="q-gutter-md">
              <!-- Información Básica -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-primary">Información Básica</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Salida"
                      v-model="salidaEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="flight_takeoff" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Pertenece"
                      v-model="perteneceTiqueteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="map" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos y tasa -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="teal" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-teal">Impuestos y Tasas</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Neta"
                      v-model="netaEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_money" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Tasas"
                      v-model="tasasEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="IVA"
                      v-model="ivaTiqueteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Total"
                      v-model="totalTiqueteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calculate" color="teal" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  v-close-popup
                  class="q-px-md"
                  icon="close"
                />
                <q-btn
                  type="submit"
                  label="Guardar Cambios"
                  color="primary"
                  class="q-px-md"
                  icon="save"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

<!------------------------------------------------------------------------------------------------------------------------------------------>

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

     <!-- Dialog para Agregar Transporte -->
      <q-dialog v-model="mostrarModalAgregarTransporte" persistent>
        <q-card class="transport-dialog-card" style="max-width: 700px; width: 100%">
          <!-- Encabezado del Dialog -->
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="text-h6">
                <q-icon name="add_circle" class="q-mr-sm" />
                Nuevo Transporte
              </div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="agregarTransporteSubmit" class="q-gutter-md">
              <!-- Información Básica -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-primary">Información Básica</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Pertenece"
                      v-model="nuevoTransportePertenece"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Destino"
                      v-model="nuevoTransporteDestino"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="place" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos y Tasas -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="receipt" color="teal" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-teal">Impuestos y Tasas</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="Combustible"
                      v-model="nuevoTransporteCombus"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="local_gas_station" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="Tasa"
                      v-model="nuevoTransporteTasa"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="IVA"
                      v-model="nuevoTransporteIva"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="TA"
                      v-model="nuevoTransporteTa"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="IVA TA"
                      v-model="nuevoTransporteIvaTa"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos de Hotel -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impuestos de Hotel</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="nuevoTransporteSencillaImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="nuevoTransporteDobleImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="nuevoTransporteTripleImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="nuevoTransporteCuadrupleImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="nuevoTransporteQuintupleImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="nuevoTransporteSextupleImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="nuevoTransporteniñoImpuestoHotel"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

               <!-- Impuestos de Hotel Ingreso -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impuestos de Ingreso Propio</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="nuevoTransporteSencillaImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="nuevoTransporteDobleImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="nuevoTransporteTripleImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="nuevoTransporteCuadrupleImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="nuevoTransporteSextupleImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="sextupleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="nuevoTransporteniñoImpuestoIngr"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos del Hotel ipoconsumos -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impoconsumo</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="nuevoTransporteSencillaImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="nuevoTransporteDobleImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="nuevoTransporteTripleImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="nuevoTransporteCuadrupleImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="nuevoTransporteQuintupleImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="nuevoTransporteSextupleImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="nuevoTransporteniñoImpoconsumo"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>


              <!-- Costos Adicionales -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="attach_money" color="deep-orange" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-deep-orange">Costos Adicionales</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Transportes no comicionables"
                      v-model="nuevoTransporteOtros"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="orange-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="miscellaneous_services" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Total"
                      v-model="nuevoTransporteTotal"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input total-input"
                      bg-color="orange-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calculate" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  v-close-popup
                  class="q-px-md"
                  icon="close"
                />
                <q-btn
                  type="submit"
                  label="Guardar Transporte"
                  color="primary"
                  class="q-px-md"
                  icon="save"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Dialog para Editar Transporte -->
      <q-dialog v-model="mostrarModalEditarTransporte" persistent>
        <q-card class="transport-dialog-card" style="max-width: 800px; width: 100%">
          <!-- Encabezado -->
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="text-h6">
                <q-icon name="edit" class="q-mr-sm" />
                Editar Transporte
              </div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit="editarTransporteSubmit" class="q-gutter-md">
              <!-- Información Básica -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="info" color="primary" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-primary">Información Básica</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Pertenece"
                      v-model="perteneceTransporteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Destino"
                      v-model="destinoTransporteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      class="custom-input"
                      bg-color="blue-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="place" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos y Tasas -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="receipt" color="teal" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-teal">Impuestos y Tasas</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="Combustible"
                      v-model="combusEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="local_gas_station" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="Tasa"
                      v-model="tasaTransporteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="IVA"
                      v-model="ivaTransporteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="TA"
                      v-model="taEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      filled
                      label="IVA TA"
                      v-model="ivaTaEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="teal-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="percent" color="teal" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos de Hotel -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impuestos de Hotel</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="sencillaImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="dobleImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="tripleImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="cuadrupleImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="quintupleImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="sextupleImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="niñoImpuestoHotelEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

               <!-- Impuestos de Hotel Ingreso -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impuestos de Ingreso Propio</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="sencillaImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="dobleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="tripleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="cuadrupleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="quintupleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="sextupleImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="niñoImpuestoIngrEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Impuestos del Hotel ipoconsumos -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="hotel" color="purple" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-purple">Impoconsumo</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sencilla"
                      v-model="sencillaImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="single_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Doble"
                      v-model="dobleImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="king_bed" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Triple"
                      v-model="tripleImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Cuadruple"
                      v-model="cuadrupleImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Quintuple"
                      v-model="quintupleImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Sextuple"
                      v-model="sextupleImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6 col-md-4">
                    <q-input
                      filled
                      label="Habitación Niño"
                      v-model="niñoImpoconsumoEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="purple-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="bedroom_parent" color="purple" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Costos Adicionales -->
              <div class="section-container q-pa-md">
                <div class="section-header q-mb-md">
                  <q-icon name="attach_money" color="deep-orange" size="sm" class="q-mr-sm" />
                  <span class="text-subtitle1 text-weight-bold text-deep-orange">Costos Adicionales</span>
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Transportes no comicionables"
                      v-model="otrosEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input"
                      bg-color="orange-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="miscellaneous_services" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      label="Total"
                      v-model="totalTransporteEditar"
                      :rules="[(val) => !!val || 'Campo obligatorio']"
                      prefix="$"
                      class="custom-input total-input"
                      bg-color="orange-1"
                    >
                      <template v-slot:prepend>
                        <q-icon name="calculate" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="row justify-end q-mt-lg q-gutter-sm">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  v-close-popup
                  class="q-px-md"
                  icon="close"
                />
                <q-btn
                  type="submit"
                  label="Guardar Cambios"
                  color="primary"
                  class="q-px-md"
                  icon="save"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <h6 class="q-mt-lg">Transportes</h6>
      <q-btn
        @click="mostrarModalAgregarTransporte = true"
        label="Agregar Transporte"
        class="q-mb-md q-mr-sm"
        color="primary"
      />

        <!--------------------------------------------------Boton de Descarga de Formato----------------------------------------------------->
        <q-btn
          @click="abrir_Modal_Formato"
          label="Descargar Formato"
          class="q-mb-md q-mr-sm"
          color="primary"
          icon="download"
        />

        <!-- Modal de Descarga -->
        <q-dialog v-model="Mostrar_Formato" persistent>
          <q-card class="q-pa-lg" style="border-radius: 12px; max-width: 500px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3)">
            <q-card-section class="text-center">
              <div class="text-h6 text-weight-bold">Seleccionar Formato</div>
              <div class="text-subtitle1 text-grey-7 q-mt-xs">¿Qué tipo de formato necesitas?</div>
            </q-card-section>
            <q-card-section class="q-gutter-y-md">
              <q-list bordered separator>

                <!-- Botón para descargar formato para nuevos registros -->
                <q-item clickable v-ripple class="hover-effect" @click="descargar_Excel('nuevo')">
                  <q-item-section avatar>
                    <q-avatar size="48px" class="bg-primary text-white">
                      <q-icon name="cloud_download" size="28px" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-bold">Planes Nuevos</q-item-label>
                    <q-item-label caption>Formato para crear nuevos registros</q-item-label>
                  </q-item-section>
                </q-item>

                <!-- Botón para descargar formato con datos existentes -->
                <q-item clickable v-ripple class="hover-effect selected-item" @click="descargar_Excel('existente')">
                  <q-item-section avatar>
                    <q-avatar size="48px" class="bg-blue-3 text-primary">
                      <q-icon name="assignment" size="28px" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-bold">Actualización</q-item-label>
                    <q-item-label caption>Formato con datos existentes</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-card-section>

            <q-separator />

            <q-card-actions align="center" class="q-mt-md">
              <q-btn label="Cancelar" color="grey-8" flat v-close-popup class="full-width q-pa-md text-bold" />
            </q-card-actions>
          </q-card>
        </q-dialog>


        <!-- Botón para abrir el modal de importar datos -->
        <q-btn
          @click="mostrar_Modal_Importar = true"
          label="Importar Datos"
          class="q-mb-md"
          color="positive"
          icon="upload_file"
        />

        <!-- Modal para importar datos -->
      <q-dialog v-model="mostrar_Modal_Importar" persistent transition-show="scale" transition-hide="fade">
        <q-card style="min-width: 420px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3)">
          <q-card-section class="bg-positive text-white">
            <div class="text-h6 flex items-center">
              <q-icon name="upload_file" size="md" class="q-mr-sm" />
              Importar Datos
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-separator class="q-my-md" color="positive" />
            <div class="q-pa-md">
              <q-file
                v-model="archivo_Excel"
                label="Seleccionar archivo Excel"
                accept=".xlsx"
                @rejected="onRejected"
                filled
                color="positive"
                counter
                bottom-slots
                class="animated-input"
              >
                <template v-slot:append>
                  <q-icon name="cloud_upload" size="md" class="text-white" />
                </template>
                <template v-slot:hint> Solo archivos Excel (.xlsx) </template>
              </q-file>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md q-gutter-md">
            <q-btn
              flat
              label="Cancelar"
              color="grey-8"
              v-close-popup
              :disable="procesando_2"
              class="rounded-borders animated-btn"
            />

            <!-- Botón para importar datos nuevos -->
            <q-btn
              label="Importar Datos Nuevos"
              color="positive"
              @click="importar_Nuevo"
              :loading="procesando_2"
              :disable="!archivo_Excel"
              icon="file_upload"
              class="rounded-borders animated-btn"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>

            <!-- Botón para actualizar datos -->
            <q-btn
              label="Actualizar Datos"
              color="primary"
              @click="importar_Existente"
              :loading="procesando_2"
              :disable="!archivo_Excel"
              icon="refresh"
              class="rounded-borders animated-btn"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>
          </q-card-actions>

          <q-linear-progress v-if="procesando_2" indeterminate color="positive" class="q-mt-sm" />
        </q-card>
      </q-dialog>




        <!---------------------------------------------------------------------------------------------------------------------------------->

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
<style>
.hover-effect {
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
}

.hover-effect:hover {
  background-color: rgba(0, 145, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 145, 255, 0.2);
}

.selected-item {
  border: 2px solid rgba(0, 145, 255, 0.5);
  background-color: rgba(0, 145, 255, 0.05);

  .animated-btn {
  transition: all 0.3s ease-in-out;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 145, 255, 0.3);
}

.animated-input {
  transition: border-color 0.3s ease-in-out;
}

.animated-input:hover {
  border-color: #4caf50;
}

}







.transport-dialog-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-container {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.section-container:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #eef2f6;
}

.custom-input {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-input:hover {
  transform: translateY(-1px);
}

.custom-input .q-field__control {
  height: 48px;
}

.total-input {
  background: rgba(255, 87, 34, 0.05);
}

.total-input .q-field__native {
  font-weight: bold;
  font-size: 1.1em;
}

/* Estilos para los iconos en los inputs */
.q-field__prepend {
  padding-right: 8px;
}

/* Estilos para los botones */
.q-btn {
  transition: all 0.3s ease;
  border-radius: 8px;
  text-transform: none;
  font-weight: 600;
}

.q-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Estilo específico para el botón primario */
.q-btn.bg-primary {
  background: linear-gradient(135deg, #1976d2, #1565c0) !important;
}

/* Estilo para el botón de cancelar */
.q-btn.text-grey-7 {
  background: #f5f5f5;
}

/* Estilos adicionales para mejorar la apariencia general */
.q-dialog__inner {
  backdrop-filter: blur(5px);
}

.q-field--error {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Animación para campos con error */
@keyframes shake {
  10%, 90% {
    transform: translateX(-1px);
  }
  20%, 80% {
    transform: translateX(2px);
  }
  30%, 50%, 70% {
    transform: translateX(-4px);
  }
  40%, 60% {
    transform: translateX(4px);
  }
}

/* Estilos para el scroll dentro del dialog */
.q-card__section {
  scrollbar-width: thin;
  scrollbar-color: #1976d2 #f5f5f5;
}

.q-card__section::-webkit-scrollbar {
  width: 8px;
}

.q-card__section::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.q-card__section::-webkit-scrollbar-thumb {
  background: #1976d2;
  border-radius: 4px;
}

/* Estilos para las etiquetas de los campos */
.q-field__label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
}

/* Estilos para los iconos */
.q-icon {
  transition: transform 0.3s ease;
}

.section-container:hover .q-icon {
  transform: scale(1.1);
}

/* Estilos para los campos monetarios */
.q-field__prefix {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  padding-right: 4px;
}

/* Efecto de focus mejorado */
.q-field--focused {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

/* Estilo para campos deshabilitados */
.q-field--disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Estilo para el fondo del dialog */
.q-dialog__backdrop {
  background: rgba(0, 0, 0, 0.4) !important;
}

/* Animaciones suaves para los cambios de estado */
.q-field__control,
.q-field__native,
.q-field__label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Estilos para mensajes de error */
.q-field__messages {
  color: #c10015;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
}

/* Mejora visual para campos obligatorios */
.q-field__label::after {
  content: " *";
  color: #c10015;
}

</style>

<script>
import { Notify } from "quasar";
import * as XLSX from "xlsx";

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
      nuevoTransporteSencillaImpuestoHotel: "",
      nuevoTransporteDobleImpuestoHotel: "",
      nuevoTransporteTripleImpuestoHotel: "",
      nuevoTransporteCuadrupleImpuestoHotel: "",
      nuevoTransporteQuintupleImpuestoHotel: "",
      nuevoTransporteSextupleImpuestoHotel: "",
      nuevoTransporteniñoImpuestoHotel: "",
      nuevoTransporteSencillaImpuestoIngr: "",
      nuevoTransporteDobleImpuestoIngr: "",
      nuevoTransporteTripleImpuestoIngr: "",
      nuevoTransporteCuadrupleImpuestoIngr: "",
      nuevoTransporteQuintupleImpuestoIngr: "",
      nuevoTransporteSextupleImpuestoIngr: "",
      nuevoTransporteniñoImpuestoIngr: "",
      nuevoTransporteSencillaImpoconsumo: "",
      nuevoTransporteDobleImpoconsumo: "",
      nuevoTransporteTripleImpoconsumo: "",
      nuevoTransporteCuadrupleImpoconsumo: "",
      nuevoTransporteQuintupleImpoconsumo: "",
      nuevoTransporteSextupleImpoconsumo: "",
      nuevoTransporteniñoImpoconsumo: "",
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
      sencillaImpuestoHotelEditar: "",
      dobleImpuestoHotelEditar: "",
      tripleImpuestoHotelEditar: "",
      cuadrupleImpuestoHotelEditar: "",
      quintupleImpuestoHotelEditar: "",
      sextupleImpuestoHotelEditar: "",
      niñoImpuestoHotelEditar: "",
      sencillaImpuestoIngrEditar: "",
      dobleImpuestoIngrEditar: "",
      tripleImpuestoIngrEditar: "",
      cuadrupleImpuestoIngrEditar: "",
      quintupleImpuestoIngrEditar: "",
      sextupleImpuestoIngrEditar: "",
      niñoImpuestoIngrEditar: "",
      sencillaImpoconsumoEditar: "",
      dobleImpoconsumoEditar: "",
      tripleImpoconsumoEditar: "",
      cuadrupleImpoconsumoEditar: "",
      quintupleImpoconsumoEditar: "",
      sextupleImpoconsumoEditar: "",
      niñoImpoconsumoEditar: "",
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
        { name: "sencilla_ImpuestoHotel", label: "Sencilla_ImpuestoHotel", field: "sencilla_ImpuestoHotel", sortable: true },
        { name: "doble_ImpuestoHotel", label: "Doble_ImpuestoHotel", field: "doble_ImpuestoHotel", sortable: true },
        { name: "triple_ImpuestoHotel", label: "Triple_ImpuestoHotel", field: "triple_ImpuestoHotel", sortable: true },
        { name: "cuadruple_ImpuestoHotel", label: "Cuadruple_ImpuestoHotel", field: "cuadruple_ImpuestoHotel", sortable: true },
        { name: "quintuple_ImpuestoHotel", label: "Quintuple_ImpuestoHotel", field: "quintuple_ImpuestoHotel", sortable: true },
        { name: "sextuple_ImpuestoHotel", label: "Sextuple_ImpuestoHotel", field: "sextuple_ImpuestoHotel", sortable: true },
        { name: "niño_ImpuestoHotel", label: "niño_ImpuestoHotel", field: "niño_ImpuestoHotel", sortable: true },
        { name: "sencilla_ImpuestoIngr", label: "Sencilla_ImpuestoIngr", field: "sencilla_ImpuestoIngr", sortable: true },
        { name: "doble_ImpuestoIngr", label: "Doble_ImpuestoIngr", field: "doble_ImpuestoIngr", sortable: true },
        { name: "triple_ImpuestoIngr", label: "Triple_ImpuestoIngr", field: "triple_ImpuestoIngr", sortable: true },
        { name: "cuadruple_ImpuestoIngr", label: "Cuadruple_ImpuestoIngr", field: "cuadruple_ImpuestoIngr", sortable: true },
        { name: "quintuple_ImpuestoIngr", label: "Quintuple_ImpuestoIngr", field: "quintuple_ImpuestoIngr", sortable: true },
        { name: "sextuple_ImpuestoIngr", label: "Sextuple_ImpuestoIngr", field: "sextuple_ImpuestoIngr", sortable: true },
        { name: "niño_ImpuestoIngr", label: "niño_ImpuestoIngr", field: "niño_ImpuestoIngr", sortable: true },
        { name: "sencilla_Impoconsumo", label: "Sencilla_Impoconsumo", field: "sencilla_Impoconsumo", sortable: true },
        { name: "doble_Impoconsumo", label: "Doble_Impoconsumo", field: "doble_Impoconsumo", sortable: true },
        { name: "triple_Impoconsumo", label: "Triple_Impoconsumo", field: "triple_Impoconsumo", sortable: true },
        { name: "cuadruple_Impoconsumo", label: "Cuadruple_Impoconsumo", field: "cuadruple_Impoconsumo", sortable: true },
        { name: "quintuple_Impoconsumo", label: "Quintuple_Impoconsumo", field: "quintuple_Impoconsumo", sortable: true },
        { name: "sextuple_Impoconsumo", label: "Sextuple_Impoconsumo", field: "sextuple_Impoconsumo", sortable: true },
        { name: "niño_Impoconsumo", label: "niño_Impoconsumo", field: "niño_Impoconsumo", sortable: true },
        { name: "otros", label: "Otros", field: "otros", sortable: true },
        { name: "total", label: "Total", field: "total", sortable: true },

        { name: "acciones", label: "Acciones", align: "center" },
      ],

      //------------------------------------ Retornar datos de formato-------------------------------------------//
      // Datos para la descarga e importación
      procesando: false,
      procesando_2: false,
      archivoExcel: null,
      archivo_Excel: null,
      columnasRequeridas: [
        "id",
        "pertenece",
        "destino",
        "nombrePrograma",
        "hotel",
        "plan",
        "noches",
        "baseComisionable",
        "baseTiqueta",
        "acomodacion",
      ],
      columnas_Requeridas: [
        "id",
        "pertenece",
        "destino",
        "nombrePrograma",
        "hotel",
        "plan",
        "noches",
        "tipoHabitacion",
        "combus",
        "tasa",
        "iva",
        "ta",
        "ivaTa",
        "sencilla_ImpuestoHotel",
        "doble_ImpuestoHotel",
        "triple_ImpuestoHotel",
        "cuadruple_ImpuestoHotel",
        "quintuple_ImpuestoHotel",
        "sextuple_ImpuestoHotel",
        "niño_ImpuestoHotel",
        "sencilla_ImpuestoIngr",
        "doble_ImpuestoIngr",
        "triple_ImpuestoIngr",
        "cuadruple_ImpuestoIngr",
        "quintuple_ImpuestoIngr",
        "sextuple_ImpuestoIngr",
        "niño_ImpuestoIngr",
        "sencilla_Impoconsumo",
        "doble_Impoconsumo",
        "triple_Impoconsumo",
        "cuadruple_Impoconsumo",
        "quintuple_Impoconsumo",
        "sextuple_Impoconsumo",
        "niño_Impoconsumo",
        "otros",
        "total",
        "porcionTerrestreBaja",
        "porcionTerrestreAlta",
        "creadorPor",
        "fechaCreacion",
      ],
      mostrarModalImportar: false,
      MostrarFormato: false,
      mostrar_Modal_Importar: false,
      Mostrar_Formato: false,
      descargando_2: false,
      descargando: false,
      mostrarModalAgregar: false,
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
      fetch("http://localhost:8010/transporte")
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
        nombrePrograma: this.nuevoTransporteNombrePrograma,
        combus: this.nuevoTransporteCombus,
        tasa: this.nuevoTransporteTasa,
        iva: this.nuevoTransporteIva,
        ta: this.nuevoTransporteTa,
        ivaTa: this.nuevoTransporteIvaTa,
        sencilla_ImpuestoHotel: this.nuevoTransporteSencillaImpuestoHotel,
        doble_ImpuestoHotel: this.nuevoTransporteDobleImpuestoHotel,
        triple_ImpuestoHotel: this.nuevoTransporteTripleImpuestoHotel,
        cuadruple_ImpuestoHotel: this.nuevoTransporteCuadrupleImpuestoHotel,
        quintuple_ImpuestoHotel: this.nuevoTransporteQuintupleImpuestoHotel,
        sextuple_ImpuestoHotel: this.nuevoTransporteSextupleImpuestoHotel,
        niño_ImpuestoHotel: this.nuevoTransporteniñoImpuestoHotel,
        sencilla_ImpuestoIngr: this.nuevoTransporteSencillaImpuestoIngr,
        doble_ImpuestoIngr: this.nuevoTransporteDobleImpuestoIngr,
        triple_ImpuestoIngr: this.nuevoTransporteTripleImpuestoIngr,
        cuadruple_ImpuestoIngr: this.nuevoTransporteCuadrupleImpuestoIngr,
        quintuple_ImpuestoIngr: this.nuevoTransporteQuintupleImpuestoIngr,
        sextuple_ImpuestoIngr: this.nuevoTransporteSextupleImpuestoIngr,
        niño_ImpuestoIngr: this.nuevoTransporteniñoImpuestoIngr,
        sencilla_Impoconsumo: this.nuevoTransporteSencillaImpoconsumo,
        doble_Impoconsumo: this.nuevoTransporteDobleImpoconsumo,
        triple_Impoconsumo: this.nuevoTransporteTripleImpoconsumo,
        cuadruple_Impoconsumo: this.nuevoTransporteCuadrupleImpoconsumo,
        quintuple_Impoconsumo: this.nuevoTransporteQuintupleImpoconsumo,
        sextuple_Impoconsumo: this.nuevoTransporteSextupleImpoconsumo,
        niño_Impoconsumo: this.nuevoTransporteniñoImpoconsumo,
        otros: this.nuevoTransporteOtros,
        total: this.nuevoTransporteTotal,
        porcionTerrestreBaja: this.nuevoTransportePorcionTerrestreBaja,
        porcionTerrestreAlta: this.nuevoTransportePorcionTerrestreAlta,
      };

      fetch("http://localhost:8010/transporte", {
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
      this.nuevoTransporteSencillaImpuestoHotel = "";
      this.nuevoTransporteDobleImpuestoHotel = "";
      this.nuevoTransporteTripleImpuestoHotel = "";
      this.nuevoTransporteCuadrupleImpuestoHotel = "";
      this.nuevoTransporteQuintupleImpuestoHotel = "";
      this.nuevoTransporteSextupleImpuestoHotel = "";
      this.nuevoTransporteniñoImpuestoHotel = "";
      this.nuevoTransporteSencillaImpuestoIngr = "";
      this.nuevoTransporteDobleImpuestoIngr = "";
      this.nuevoTransporteTripleImpuestoIngr = "";
      this.nuevoTransporteCuadrupleImpuestoIngr = "";
      this.nuevoTransporteQuintupleImpuestoIngr = "";
      this.nuevoTransporteSextupleImpuestoIngr = "";
      this.nuevoTransporteniñoImpuestoIngr = "";
      this.nuevoTransporteSencillaImpoconsumo = "";
      this.nuevoTransporteDobleImpoconsumo = "";
      this.nuevoTransporteTripleImpoconsumo = "";
      this.nuevoTransporteCuadrupleImpoconsumo = "";
      this.nuevoTransporteQuintupleImpoconsumo = "";
      this.nuevoTransporteSextupleImpoconsumo = "";
      this.nuevoTransporteniñoImpoconsumo = "";
      this.nuevoTransporteOtros = "";
      this.nuevoTransporteTotal = "";
      this.nuevoTransportePorcionTerrestreBaja = "";
      this.nuevoTransportePorcionTerrestreAlta = "";
    },

    editarTransporte(transporte) {
      this.transporteEditando = transporte;
      this.perteneceTransporteEditar = transporte.pertenece;
      this.destinoTransporteEditar = transporte.destino;
      this.nombreProgramaTransporteEditar = transporte.nombrePrograma || ""; // Asumiendo que `nombrePrograma` puede ser null
      this.combusEditar = transporte.combus;
      this.tasaTransporteEditar = transporte.tasa;
      this.ivaTransporteEditar = transporte.iva;
      this.taEditar = transporte.ta;
      this.ivaTaEditar = transporte.ivaTa;
      this.sencillaImpuestoHotelEditar = transporte.sencilla_ImpuestoHotel || ""; // Asumiendo que puede ser null
      this.dobleImpuestoHotelEditar = transporte.doble_ImpuestoHotel || "";
      this.tripleImpuestoHotelEditar = transporte.triple_ImpuestoHotel || "";
      this.cuadrupleImpuestoHotelEditar = transporte.cuadruple_ImpuestoHotel || "";
      this.quintupleImpuestoHotelEditar = transporte.quintuple_ImpuestoHotel || "";
      this.sextupleImpuestoHotelEditar = transporte.sextuple_ImpuestoHotel || "";
      this.niñoImpuestoHotelEditar = transporte.niño_ImpuestoHotel || "";
      this.sencillaImpuestoIngrEditar = transporte.sencilla_ImpuestoIngr || "";
      this.dobleImpuestoIngrEditar = transporte.doble_ImpuestoIngr || "";
      this.tripleImpuestoIngrEditar = transporte.triple_ImpuestoIngr || "";
      this.cuadrupleImpuestoIngrEditar = transporte.cuadruple_ImpuestoIngr || "";
      this.quintupleImpuestoIngrEditar = transporte.quintuple_ImpuestoIngr || "";
      this.sextupleImpuestoIngrEditar = transporte.sextuple_ImpuestoIngr || "";
      this.niñoImpuestoIngrEditar = transporte.niño_ImpuestoIngr || "";
      this.sencillaImpoconsumoEditar = transporte.sencilla_Impoconsumo || "";
      this.dobleImpoconsumoEditar = transporte.doble_Impoconsumo || "";
      this.tripleImpoconsumoEditar = transporte.triple_Impoconsumo || "";
      this.cuadrupleImpoconsumoEditar = transporte.cuadruple_Impoconsumo || "";
      this.quintupleImpoconsumoEditar = transporte.quintuple_Impoconsumo || "";
      this.sextupleImpoconsumoEditar = transporte.sextuple_Impoconsumo || "";
      this.niñoImpoconsumoEditar = transporte.niño_Impoconsumo || "";
      this.otrosEditar = transporte.otros;
      this.totalTransporteEditar = transporte.total;
      this.porcionTerrestreBajaEditar = transporte.porcionTerrestreBaja || "";
      this.porcionTerrestreAltaEditar = transporte.porcionTerrestreAlta || "";
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
        sencilla_ImpuestoHotel: this.sencillaImpuestoHotelEditar,
        doble_ImpuestoHotel: this.dobleImpuestoHotelEditar,
        triple_ImpuestoHotel: this.tripleImpuestoHotelEditar,
        cuadruple_ImpuestoHotel: this.cuadrupleImpuestoHotelEditar,
        quintuple_ImpuestoHotel: this.quintupleImpuestoHotelEditar,
        sextuple_ImpuestoHotel: this.sextupleImpuestoHotelEditar,
        niño_ImpuestoHotel: this.niñoImpuestoHotelEditar,
        sencilla_ImpuestoIngr: this.sencillaImpuestoIngrEditar,
        doble_ImpuestoIngr: this.dobleImpuestoIngrEditar,
        triple_ImpuestoIngr: this.tripleImpuestoIngrEditar,
        cuadruple_ImpuestoIngr: this.cuadrupleImpuestoIngrEditar,
        quintuple_ImpuestoIngr: this.quintupleImpuestoIngrEditar,
        sextuple_ImpuestoIngr: this.sextupleImpuestoIngrEditar,
        niño_ImpuestoIngr: this.niñoImpuestoIngrEditar,
        sencilla_Impoconsumo: this.sencillaImpoconsumoEditar,
        doble_Impoconsumo: this.dobleImpoconsumoEditar,
        triple_Impoconsumo: this.tripleImpoconsumoEditar,
        cuadruple_Impoconsumo: this.cuadrupleImpoconsumoEditar,
        quintuple_Impoconsumo: this.quintupleImpoconsumoEditar,
        sextuple_Impoconsumo: this.sextupleImpoconsumoEditar,
        niño_Impoconsumo: this.niñoImpoconsumoEditar,
        otros: this.otrosEditar,
        total: this.totalTransporteEditar,
        porcionTerrestreBaja: this.porcionTerrestreBajaEditar,
        porcionTerrestreAlta: this.porcionTerrestreAltaEditar,
      };

      fetch(
        `http://localhost:8010/transporte/${updatedTransporte.id}`,
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

    //---------------------------------------------Descarga del Formato --------------------------------------------------//
    // Abre el modal para descargar formato
   abrirModalFormato() {
      this.MostrarFormato = true;
    },

   // Abre el modal para descargar formato
   async descargarExcel(tipo) {
      try {
        this.descargando = true;
        let columnasConId;
        let datosExistentes = [];

        if (tipo === "existente") {
          const response = await fetch("https://backmultidestinos.onrender.com/planes", {
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }

          datosExistentes = await response.json();
          columnasConId = ['id', ...this.columnasRequeridas];
        } else {
          columnasConId = this.columnasRequeridas.filter(col => col !== "id"); // Sin el ID para nuevos datos
        }

        const columnas = datosExistentes.map((dato) => {
          const fila = columnasConId.reduce((acc, columna) => {
            if (columna === 'id') {
              acc[columna] = dato[columna] || ''; // Incluir el ID existente
            } else if (["baseComisionable", "baseTiqueta", "noches"].includes(columna)) {
              acc[columna] = dato[columna] || 0; // Asegurar números
            } else {
              acc[columna] = dato[columna] || ""; // Manejar cadenas vacías
            }
            return acc;
          }, {});
          return fila;
        });

        // Agregar fila vacía para nuevos datos si se requiere
        if (tipo === "nuevo") {
          columnas.push(columnasConId.reduce((acc, columna) => {
            acc[columna] = columna === "id" ? "" : ""; // Dejar vacíos los campos excepto el ID
            return acc;
          }, {}));
        }

        const hoja = XLSX.utils.json_to_sheet(columnas);

        // Ajustar el rango del autofiltro para incluir columnas
        const ultimaColumna = String.fromCharCode(64 + columnasConId.length);
        hoja["!autofilter"] = { ref: `A1:${ultimaColumna}1` };

        hoja["!cols"] = columnasConId.map((columna) => {
          if (columna === 'id') {
            return { wch: 10 };
          } else if (["nombrePrograma", "hotel", "plan"].includes(columna)) {
            return { wch: 30 };
          } else if (["baseComisionable", "baseTiqueta", "noches"].includes(columna)) {
            return { wch: 15 };
          } else {
            return { wch: 20 };
          }
        });

        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, tipo === "existente" ? "DatosExistentes" : "NuevoFormato");

        const excelBuffer = XLSX.write(libro, {
          bookType: "xlsx",
          type: "array",
          compression: true,
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fechaFormateada = new Date().toISOString().split("T")[0];
        const nombreArchivo = tipo === "existente"
          ? `formato_planes_existentes_${fechaFormateada}.xlsx`
          : `formato_planes_nuevos_${fechaFormateada}.xlsx`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.$q.notify({
          type: "positive",
          message: "Formato descargado exitosamente",
          position: "top",
          timeout: 3000,
        });

        this.MostrarFormato = false;
      } catch (error) {
        console.error("Error al descargar el formato:", error);
        this.$q.notify({
          type: "negative",
          message: `Error al descargar el formato: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.descargando = false;
      }
    },

    async leerArchivoExcel(archivo) {
      return new Promise((resolve, reject) => {
        if (!archivo) {
          return reject(new Error("No se ha seleccionado un archivo."));
        }

        if (archivo.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          return reject(new Error("El archivo no es un archivo Excel válido. Asegúrate de seleccionar un archivo .xlsx."));
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error("El archivo Excel está vacío o no contiene hojas válidas.");
            }

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            let jsonData = XLSX.utils.sheet_to_json(firstSheet, {
              raw: false,
              defval: "",
            });

            if (jsonData.length === 0) {
              throw new Error("El archivo Excel no contiene datos válidos.");
            }

            let lastValidId = 0;
            jsonData = jsonData.map((row) => {
              if (!row.id || isNaN(Number(row.id))) {
                row.id = ++lastValidId;
              } else {
                row.id = Number(row.id);
                lastValidId = Math.max(lastValidId, row.id);
              }

              return {
                id: row.id,
                pertenece: String(row.pertenece || ""),
                destino: String(row.destino || ""),
                nombrePrograma: String(row.nombrePrograma || ""),
                hotel: String(row.hotel || ""),
                plan: String(row.plan || ""),
                noches: row.noches ? String(row.noches) : "",
                baseComisionable: row.baseComisionable ? Number(row.baseComisionable) : 0,
                baseTiqueta: row.baseTiqueta ? Number(row.baseTiqueta) : 0,
                acomodacion: String(row.acomodacion || ""),
              };
            });

            resolve(jsonData);
          } catch (error) {
            reject(new Error("Error al procesar el archivo Excel: " + error.message));
          }
        };

        reader.onerror = () => {
          reject(new Error("Error al leer el archivo. Verifica que el archivo no esté corrupto o vacío."));
        };

        reader.readAsArrayBuffer(archivo);
      });
    },

    async importarDatosNuevo() {
      try {
        if (!this.archivoExcel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        console.log("Archivo seleccionado:", this.archivoExcel);

        this.procesando = true;
        console.log("Iniciando la importación de nuevos datos...");

        const datos = await this.leerArchivoExcel(this.archivoExcel);

        if (datos.length === 0) {
          throw new Error("El archivo no contiene datos válidos para importar.");
        }

        // Eliminar los 'id' de los nuevos registros antes de enviarlos a la base de datos
        const datosNuevos = datos.map(plan => {
          if (!plan.id || isNaN(plan.id)) {
            plan.id = null; // No asignar ID a los nuevos registros
          }
          return plan;
        });

        console.log("Datos procesados:", datosNuevos);
        await this.guardarEnBaseDeDatos(datosNuevos, 'nuevo');

        this.mostrarModalImportar = false;
      } catch (error) {
        console.error("Error al importar datos:", error);
        this.$q.notify({
          type: "negative",
          message: `Error: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.procesando = false;
      }
    },

    async importarDatosExistente() {
      try {
        if (!this.archivoExcel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        console.log("Archivo seleccionado:", this.archivoExcel);

        this.procesando = true;
        console.log("Iniciando la actualización de datos...");

        const datos = await this.leerArchivoExcel(this.archivoExcel);

        if (datos.length === 0) {
          throw new Error("El archivo no contiene datos válidos para actualizar.");
        }

        console.log("Datos procesados:", datos);
        await this.guardarEnBaseDeDatos(datos, 'actualizar');

        this.mostrarModalImportar = false;
      } catch (error) {
        console.error("Error al actualizar datos:", error);
        this.$q.notify({
          type: "negative",
          message: `Error: ${error.message}`,
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.procesando = false;
      }
    },

   async guardarEnBaseDeDatos(datos, tipo) {
      try {
          // Obtener los planes existentes de la base de datos
          const responseExistentes = await fetch("https://backmultidestinos.onrender.com/planes");
          if (!responseExistentes.ok) {
              throw new Error(`Error al obtener los datos. Estado: ${responseExistentes.status}`);
          }
          const planesExistentes = await responseExistentes.json();

          // Procesar los datos basándose en si los registros existen
          const procesarDatos = datos.map(plan => {
              const existe = planesExistentes.find(
                  planExistente => planExistente.id === plan.id
              );

              // Si es un registro nuevo o no existe, establecer id como null
              if (tipo === 'nuevo' || !existe) {
                  return {
                      ...plan,
                      id: null
                  };
              }

              // Si se está actualizando y existe, mantener el id original
              return plan;
          });

          // Utilizar el endpoint procesar-lote para manejar tanto creaciones como actualizaciones
          const response = await fetch("http://localhost:8010/planes/procesar-lote", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ planes: procesarDatos })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Error al procesar los datos: ${errorData.mensaje || response.statusText}`);
          }

          const resultado = await response.json();

          // Mostrar notificación de éxito
          this.$q.notify({
              type: "positive",
              message: `Accion realizada con exito`,
              position: "top",
              timeout: 3000
          });

          return resultado;

      } catch (error) {
          console.error("Error al guardar los datos en la base de datos:", error);
          this.$q.notify({
              type: "negative",
              message: `Error al guardar los datos: ${error.message}`,
              position: "top",
              timeout: 5000
          });
          throw error;
      }
    },
     //-------------------------------------------------------------------------------------------------------------------------------//
     //---------------------------------------------Descarga del Formato transportes --------------------------------------------------//
    // Abre el modal para descargar formato
    abrir_Modal_Formato() {
      this.Mostrar_Formato = true;
    },

    // Descarga el formato en Excel
    async descargar_Excel(tipo) {
      try {
        this.descargando_2 = true;
        let columnasConId;
        let datosExistentes = [];

        if (tipo === "existente") {
          const response = await fetch("https://backmultidestinos.onrender.com/transporte", {
            headers: { Accept: "application/json" },
          });

          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }

          datosExistentes = await response.json();
          columnasConId = ["id", ...this.columnas_Requeridas];

        } else {
          columnasConId = this.columnas_Requeridas.filter((col) => col !== "id");
        }

        const columnas = datosExistentes.map((dato) => {
          const fila = columnasConId.reduce((acc, columna) => {
            acc[columna] = dato[columna] || (columna === "id" ? "" : "");
            return acc;
          }, {});
          return fila;
        });

        if (tipo === "nuevo") {
          columnas.push(
            columnasConId.reduce((acc, columna) => {
              acc[columna] = "";
              return acc;
            }, {})
          );
        }

        const hoja = XLSX.utils.json_to_sheet(columnas);
        hoja["!autofilter"] = { ref: `A1:AN1` };
        hoja["!cols"] = columnasConId.map(() => ({ wch: 20 }));

        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, tipo === "existente" ? "DatosExistentes" : "NuevoFormato");

        const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array", compression: true });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        const fechaFormateada = new Date().toISOString().split("T")[0];
        const nombreArchivo = tipo === "existente"
          ? `formato_transportes_existentes_${fechaFormateada}.xlsx`
          : `formato_transportes_nuevos_${fechaFormateada}.xlsx`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);

        this.$q.notify({ type: "positive", message: "Formato descargado exitosamente", position: "top", timeout: 3000 });
        this.MostrarFormato = false;
      } catch (error) {
        console.error("Error al descargar el formato:", error);
        this.$q.notify({ type: "negative", message: `Error al descargar el formato: ${error.message}`, position: "top", timeout: 5000 });
      } finally {
        this.descargando = false;
      }
    },

    // Lee el archivo Excel y devuelve los datos en formato JSON
    async leer_Archivo_Excel(archivo) {
      return new Promise((resolve, reject) => {
        if (!archivo) {
          return reject(new Error("No se ha seleccionado un archivo."));
        }

        if (archivo.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          return reject(new Error("El archivo no es un archivo Excel válido. Asegúrate de seleccionar un archivo .xlsx."));
        }

        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error("El archivo Excel está vacío o no contiene hojas válidas.");
            }

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            if (firstSheet["!autofilter"]) {
              delete firstSheet["!autofilter"];
            }

            let jsonData = XLSX.utils.sheet_to_json(firstSheet, { raw: false, defval: null });

            if (jsonData.length === 0) {
              throw new Error("El archivo Excel no contiene datos válidos.");
            }

            let lastValidId = 0;
            jsonData = jsonData.map((row) => {
              if (!row.id || isNaN(Number(row.id))) {
                row.id = ++lastValidId;
              } else {
                row.id = Number(row.id);
                lastValidId = Math.max(lastValidId, row.id);
              }

              const parseCurrency = (value) => value ? Number(String(value).replace(/\./g, "")) : null;
              const parseDate = (value) => {
                if (!value) return null;
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                  if (value.includes(" A ")) {
                    const [startDate, endDate] = value.split(" A ").map(dateStr => new Date(dateStr.trim()));
                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                      throw new Error(`Invalid date range value: ${value}`);
                    }
                    return { startDate: startDate.toISOString().split("T")[0], endDate: endDate.toISOString().split("T")[0] };
                  }
                  throw new Error(`Invalid date value: ${value}`);
                }
                return date.toISOString().split("T")[0];
              };

              const fechaInicio = parseDate(row.FechaInicio);
              const fechaFin = parseDate(row.FechaFin);
              return {
                id: row.id,
                pertenece: row.pertenece != null ? String(row.pertenece) : null,
                destino: row.destino != null ? String(row.destino) : null,
                nombrePrograma: row.nombrePrograma != null ? String(row.nombrePrograma) : null,
                hotel: row.hotel != null ? String(row.hotel) : null,
                plan: row.plan != null ? String(row.plan) : null,
                noches: row.noches != null ? String(row.noches) : null,
                tipoHabitacion: row.tipoHabitacion != null ? String(row.tipoHabitacion) : null,
                combus: row.combus != null ? String(row.combus) : null,
                tasa: row.tasa != null ? String(row.tasa) : null,
                iva: row.iva != null ? String(row.iva) : null,
                ta: row.ta != null ? String(row.ta) : null,
                ivaTa: row.ivaTa != null ? String(row.ivaTa) : null,
                sencilla_ImpuestoHotel: parseCurrency(row.sencilla_ImpuestoHotel),
                doble_ImpuestoHotel: parseCurrency(row.doble_ImpuestoHotel),
                triple_ImpuestoHotel: parseCurrency(row.triple_ImpuestoHotel),
                cuadruple_ImpuestoHotel: parseCurrency(row.cuadruple_ImpuestoHotel),
                quintuple_ImpuestoHotel: parseCurrency(row.quintuple_ImpuestoHotel),
                sextuple_ImpuestoHotel: parseCurrency(row.sextuple_ImpuestoHotel),
                niño_ImpuestoHotel: parseCurrency(row.niño_ImpuestoHotel),
                sencilla_ImpuestoIngr: parseCurrency(row.sencilla_ImpuestoIngr),
                doble_ImpuestoIngr: parseCurrency(row.doble_ImpuestoIngr),
                triple_ImpuestoIngr: parseCurrency(row.triple_ImpuestoIngr),
                cuadruple_ImpuestoIngr: parseCurrency(row.cuadruple_ImpuestoIngr),
                quintuple_ImpuestoIngr: parseCurrency(row.quintuple_ImpuestoIngr),
                sextuple_ImpuestoIngr: parseCurrency(row.sextuple_ImpuestoIngr),
                niño_ImpuestoIngr: parseCurrency(row.niño_ImpuestoIngr),
                sencilla_Impoconsumo: parseCurrency(row.sencilla_Impoconsumo),
                doble_Impoconsumo: parseCurrency(row.doble_Impoconsumo),
                triple_Impoconsumo: parseCurrency(row.triple_Impoconsumo),
                cuadruple_Impoconsumo: parseCurrency(row.cuadruple_Impoconsumo),
                quintuple_Impoconsumo: parseCurrency(row.quintuple_Impoconsumo),
                sextuple_Impoconsumo: parseCurrency(row.sextuple_Impoconsumo),
                niño_Impoconsumo: parseCurrency(row.niño_Impoconsumo),
                otros: row.otros != null ? String(row.otros) : null,
                total: parseCurrency(row.total),
                porcionTerrestreBaja: parseCurrency(row.porcionTerrestreBaja),
                porcionTerrestreAlta: parseCurrency(row.porcionTerrestreAlta),
                creadorPor: row.creadorPor != null ? String(row.creadorPor) : null,
                fechaCreacion: row.fechaCreacion != null ? new Date(row.fechaCreacion) : null,
              };
            });

            resolve(jsonData);
          } catch (error) {
            reject(new Error("Error al procesar el archivo Excel: " + error.message));
          }
        };

        reader.onerror = () => {
          reject(new Error("Error al leer el archivo. Verifica que el archivo no esté corrupto o vacío."));
        };

        reader.readAsArrayBuffer(archivo);
      });
    },

    // Importa nuevos datos desde el archivo Excel
    async importar_Nuevo() {
      try {
        if (!this.archivo_Excel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        console.log("Archivo seleccionado:", this.archivo_Excel);

        this.procesando_2 = true;
        this.progreso_2 = 0; // Reiniciar el progreso
        console.log("Iniciando la importación de nuevos datos...");

        const datos = await this.leer_Archivo_Excel(this.archivo_Excel);

        if (datos.length === 0) {
          throw new Error("El archivo no contiene datos válidos para importar.");
        }

        const datosNuevos = datos.map((transporte) => {
          if (!transporte.id || isNaN(transporte.id)) {
            transporte.id = null;
          }
          return transporte;
        });

        const totalDatos = datosNuevos.length;
        let procesados = 0;

        for (const transporte of datosNuevos) {
          await this.guardar_Datos([transporte], "nuevo");
          procesados++;
          this.progreso_2 = (procesados / totalDatos) * 100; // Actualizar el progreso
        }

        this.mostrarModalImportar = false;
        this.$q.notify({ type: "positive", message: "Importación completada exitosamente", position: "top", timeout: 5000 });
      } catch (error) {
        console.error("Error al importar datos:", error);
        this.$q.notify({ type: "negative", message: `Error: ${error.message}`, position: "top", timeout: 5000 });
      } finally {
        this.procesando_2 = false;
        this.progreso_2 = 0; // Reiniciar el progreso
      }
    },

    // Actualiza datos existentes desde el archivo Excel
    async importar_Existente() {
      try {
        if (!this.archivo_Excel) {
          throw new Error("No se ha seleccionado un archivo Excel.");
        }

        this.procesando_2 = true;
        this.progreso_2 = 0;
        console.log("Iniciando la actualización de datos...");

        // Mostrar notificación inicial
        this.$q.notify({ type: "info", message: `Progreso: 0% - Tiempo restante estimado: Calculando...`, position: "top", timeout: 1000 });

        const datos = await this.leer_Archivo_Excel(this.archivo_Excel);

        if (datos.length === 0) {
          throw new Error("El archivo no contiene datos válidos para actualizar.");
        }

        // Obtener todos los datos existentes de una sola vez
        const responseExistentes = await fetch("https://backmultidestinos.onrender.com/transporte");
        if (!responseExistentes.ok) {
          throw new Error(`Error al obtener los datos existentes: ${responseExistentes.status}`);
        }
        const transportesExistentes = await responseExistentes.json();

        // Crear un mapa para búsqueda rápida
        const mapaExistentes = new Map(transportesExistentes.map((transporte) => [transporte.id, transporte]));

        // Procesar todos los datos en memoria
        const datosActualizados = datos.map((transporte) => {
          const existente = mapaExistentes.get(transporte.id);
          if (!existente) {
            return { ...transporte, id: null };
          }
          return { ...existente, ...transporte };
        });

        // Dividir en lotes más pequeños
        const BATCH_SIZE = 100; // Tamaño del lote reducido
        const batches = [];
        for (let i = 0; i < datosActualizados.length; i += BATCH_SIZE) {
          batches.push(datosActualizados.slice(i, i + BATCH_SIZE));
        }

        // Procesar lotes en paralelo con límite de concurrencia
        const CONCURRENT_BATCHES = 20; // Número de lotes procesados simultáneamente aumentado
        let completados = 0;
        const startTime = Date.now();

        for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
          const batchPromises = batches.slice(i, i + CONCURRENT_BATCHES).map(async (batch) => {
            const response = await fetch("http://localhost:8010/transporte/procesar-lote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ transportes: batch }),
            });

            if (!response.ok) {
              throw new Error(`Error en el lote: ${response.statusText}`);
            }

            completados += batch.length;
            this.progreso_2 = (completados / datosActualizados.length) * 100;

            // Calcular el tiempo estimado restante en segundos
            const elapsedTime = Date.now() - startTime;
            const remainingTime = (elapsedTime / completados) * (datosActualizados.length - completados);
            const remainingSeconds = (remainingTime / 1000).toFixed(2);

            // Notificar progreso y tiempo restante
            this.$q.notify({
              type: "info",
              message: `Progreso: ${Math.floor(this.progreso_2)}% - Tiempo restante estimado: ${remainingSeconds} segundos`,
              position: "top",
              timeout: 6000,
            });

            return response.json();
          });

          await Promise.all(batchPromises);
        }

        this.mostrarModalImportar = false;
        this.$q.notify({ type: "positive", message: "Actualización completada exitosamente", position: "top", timeout: 10000 });
      } catch (error) {
        console.error("Error en la importación:", error);
        this.$q.notify({ type: "negative", message: `Error: ${error.message}`, position: "top", timeout: 5000 });
      } finally {
        this.procesando_2 = false;
        this.progreso_2 = 0;
      }
    },

    // Guarda los datos en la base de datos
    async guardar_Datos(datos, tipo) {
      try {
        const responseExistentes = await fetch("https://backmultidestinos.onrender.com/transporte");
        if (!responseExistentes.ok) {
          throw new Error(`Error al obtener los datos. Estado: ${responseExistentes.status}`);
        }
        const transportesExistentes = await responseExistentes.json();

        const procesarDatos = datos.map((transporte) => {
          const existe = transportesExistentes.find((transporteExistente) => transporteExistente.id === transporte.id);

          if (tipo === "nuevo" || !existe) {
            return { ...transporte, id: null };
          }

          const cambios = Object.keys(transporte).reduce((acc, key) => {
            if (transporte[key] !== existe[key]) {
              acc[key] = transporte[key];
            }
            return acc;
          }, {});

          if (Object.keys(cambios).length > 0) {
            return { ...existe, ...cambios };
          }

          return existe;
        });

        const datosConCambios = procesarDatos.filter((transporte) => {
          const original = transportesExistentes.find((t) => t.id === transporte.id);
          return !original || JSON.stringify(transporte) !== JSON.stringify(original);
        });

        if (datosConCambios.length === 0) {
          this.$q.notify({ type: "info", message: "No hay cambios para actualizar.", position: "top", timeout: 3000 });
          return;
        }

        // Dividir los datos en lotes
        const batchSize = 100;
        const batches = [];
        for (let i = 0; i < datosConCambios.length; i += batchSize) {
          batches.push(datosConCambios.slice(i, i + batchSize));
        }

        // Procesar los lotes concurrentemente
        const promises = batches.map(async (batch) => {
          batch = batch.map((transporte) => {
            Object.keys(transporte).forEach((key) => {
              if (key.toLowerCase().includes("fecha") && transporte[key]) {
                const date = new Date(transporte[key]);
                if (!isNaN(date.getTime())) {
                  transporte[key] = date.toISOString().split("T")[0];
                } else {
                  console.warn(`Fecha inválida encontrada: ${transporte[key]}`);
                  transporte[key] = null;
                }
              }
            });
            return transporte;
          });

          const response = await fetch("http://localhost:8010/transporte/procesar-lote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transportes: batch }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al procesar los datos: ${errorData.mensaje || response.statusText}`);
          }

          return response.json();
        });

        // Esperar a que todas las promesas se resuelvan
        await Promise.all(promises);

        this.$q.notify({ type: "positive", message: `Acción realizada con éxito`, position: "top", timeout: 3000 });
      } catch (error) {
        console.error("Error al guardar los datos en la base de datos:", error);
        this.$q.notify({ type: "negative", message: `Error al guardar los datos: ${error.message}`, position: "top", timeout: 5000 });
        throw error;
      }
    }
  },
  //------------------------------------------------------------------------------------------------------------------//
  //FIN
};
</script>
