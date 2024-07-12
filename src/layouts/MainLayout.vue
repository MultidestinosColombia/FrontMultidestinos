<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <span>MultiCotizaciones</span>

        <q-toolbar-title></q-toolbar-title>

        <div>Versión 0.1</div>
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
          <q-item clickable @click="goPage('/cotizacion')">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Cotización</q-item-section>
          </q-item>

          <q-item
            v-if="userRole === 'administrador'"
            clickable
            @click="goPage('/ControlUser')"
          >
            <q-item-section avatar>
              <q-icon name="manage_accounts" />
            </q-item-section>
            <q-item-section>Control Usuarios</q-item-section>
          </q-item>
          <q-item clickable @click="goPage('/ControlClient')">
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>Control Clientes</q-item-section>
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

