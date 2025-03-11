<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <span>MultiCotizaciones</span>

        <q-toolbar-title></q-toolbar-title>

        <div>Versión 0.3</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list padding>


          <q-item clickable @click="goPage('/home')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="home" color="blue-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Inicio</q-item-label>
            </q-item-section>
          </q-item>



          <q-item clickable @click="goPage('/cotizacion')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="description" color="purple-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Cotización</q-item-label>
            </q-item-section>
          </q-item>



          <q-item clickable @click="goPage('/liquidacion')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="task_alt" color="orange-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Liquidación</q-item-label>
            </q-item-section>
          </q-item>


          <q-item
            v-if="userRole === 'administrador'"
            clickable
            @click="goPage('/ControlUser')"
            class="q-hover-shadow"
            dense
          >
            <q-item-section avatar>
              <q-icon name="manage_accounts" color="red-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Usuarios</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable @click="goPage('/ControlClient')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="groups" color="teal-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Clientes</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable @click="goPage('/ControlPlanes')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="playlist_add_check" color="blue-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Planes</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable @click="goPage('/ControlLiquidacion')" class="q-hover-shadow" dense>
            <q-item-section avatar>
              <q-icon name="monetization_on" color="green-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis"> De Costos</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-item clickable @click="goPage('/cotizacion')">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Cerrar Sesión</q-item-section>
          </q-item> -->

          <q-separator />

          <q-item clickable @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Cerrar Sesión</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script src="./MainLayout.js"></script>

