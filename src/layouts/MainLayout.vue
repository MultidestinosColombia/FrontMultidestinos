<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <span>MultiCotizaciones</span>

        <q-toolbar-title></q-toolbar-title>

        <div class="clock-text">{{ currentTime }} &nbsp; | &nbsp; Versión 0.3</div>

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


          <q-item clickable @click="goPage('/home')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="home" color="blue-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Inicio</q-item-label>
            </q-item-section>
          </q-item>



          <q-item clickable @click="goPage('/cotizacion')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="description" color="purple-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Cotización</q-item-label>
            </q-item-section>
          </q-item>



          <q-item clickable @click="goPage('/liquidacion')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="task_alt" color="orange-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Liquidación</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="goPage('/Liquidaciondecostos')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="payments   " color="green-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Liquidación</q-item-label>
              <q-item-label class="text-weight-bold ellipsis"> De Costos</q-item-label>
            </q-item-section>
          </q-item>


         <!--  <q-item
            v-if="userRole === 'administrador'"
            clickable
            @click="goPage('/ControlUser')"
            class="menu-item"
            dense
          >
            <q-item-section avatar>
              <q-icon name="manage_accounts" color="red-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Usuarios</q-item-label>
            </q-item-section>
          </q-item> -->


          <q-item clickable @click="goPage('/ControlClient')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="groups" color="teal-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Clientes</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable @click="goPage('/ControlPlanes')" class="menu-item" dense>
            <q-item-section avatar>
              <q-icon name="playlist_add_check" color="blue-7" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label overline class="text-uppercase text-primary">Control</q-item-label>
              <q-item-label class="text-weight-bold ellipsis">Planes</q-item-label>
            </q-item-section>
          </q-item>


          <q-item clickable @click="goPage('/ControlLiquidacion')" class="menu-item" dense>
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
        </q-list>
        <q-list class="absolute-bottom">

          <q-item clickable @click="goPage('/Perfil')" class="menu-item logout-item1" dense>
            <q-item-section avatar>
              <q-avatar size="36px">
                <img :src="imagenPerfil" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-primary ">
                {{ nombre }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="logout" class="menu-item logout-item" dense>
            <q-item-section avatar>
              <q-icon name="logout" color="negative" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">Cerrar Sesión</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.menu-item {
  transition: all 0.2s ease-in-out;
  border-radius: 8px;
  margin: 4px 8px;
}
.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.02);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout-item {
  background: rgba(255, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}
.logout-item:hover {
  background: rgba(255, 0, 0, 0.2);
}
.absolute-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
}


.logout-item1 {
  background: rgba(0, 98, 255, 0.1);
  transition: all 0.2s ease-in-out;
}
.logout-item1:hover {
  background: rgba(107, 107, 107, 0.2);
}
/*-------------------------------------------------------------------- */
.clock-text {
  font-family: "Courier New", monospace;
  letter-spacing: 1px;
}
</style>

<script src="./MainLayout.js"></script>

