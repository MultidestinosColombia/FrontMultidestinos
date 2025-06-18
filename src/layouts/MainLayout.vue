<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="multidestinos-header">
      <q-toolbar>
        <q-btn
          flat
          @click="drawer = !drawer"
          round
          dense
          :icon="drawer ? 'menu_open' : 'menu'"
          class="q-mr-sm text-white menu-toggle-btn"
        ></q-btn>

        <div class="logo-wrapper">
          <q-icon name="explore" size="28px" color="amber-3" class="q-mr-sm" />
          <span class="logo-text">Multidestinos Express</span>
        </div>

        <q-toolbar-title></q-toolbar-title>

        <div class="clock-text">{{ currentTime }} &nbsp; | &nbsp; <span class="version-tag">Versión 1.0</span></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :width="240"
      :breakpoint="500"
      bordered
      behavior="desktop"
      content-class="multidestinos-sidebar"
      class="drawer-container"
      no-swipe-open
      no-swipe-close

    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <!-- Brand/Profile Area -->
        <div class="brand-section">
          <div class="background-gif"></div> <!-- Fondo con difuminado -->

          <q-avatar size="60px" class="q-mb-sm shadow-5">
            <img :src="imagenPerfil || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
          </q-avatar>

          <div class="user-details">
            <div class="text-weight-bold text-white">{{ nombre || 'Agente de Viajes' }}</div>
            <div class="text-amber-3 text-caption">Especialista en Viajes</div>
          </div>
        </div>


        <q-separator color="grey-8" />

        <!-- Main Menu -->
        <q-list padding class="multidestinos-menu">
          <!-- Main Section -->
          <q-item-label header class="menu-section-title">
            <q-icon name="travel_explore" size="xs" class="q-mr-xs"/> GESTIÓN DE VIAJES
          </q-item-label>

          <q-item clickable v-ripple @click="goPage('/home')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="home" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Inicio</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/cotizacion')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="description" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Cotización</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/Cotizacion2')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="flight" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Cotización Vuelos</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/liquidacion')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="task_alt" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Liquidación</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/Liquidaciondecostos')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="payments" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Liquidación</q-item-label>
              <q-item-label caption class="text-grey-4">De Costos</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Management Section -->
          <q-separator spaced class="q-my-md" />

          <q-item-label header class="menu-section-title">
            <q-icon name="business_center" size="xs" class="q-mr-xs"/> ADMINISTRACIÓN
          </q-item-label>

          <q-item clickable v-ripple @click="goPage('/ControlClient')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="groups" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Control</q-item-label>
              <q-item-label caption class="text-grey-4">Clientes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/ControlPlanes')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="playlist_add_check" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Gestion</q-item-label>
              <q-item-label caption class="text-grey-4">Planes</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="goPage('/ControlLiquidacion')" class="menu-item" active-class="menu-active">
            <q-item-section avatar>
              <q-icon name="monetization_on" color="amber-4" size="md" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Control</q-item-label>
              <q-item-label caption class="text-grey-4">De Costos</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-separator spaced class="q-my-md" />

        <!-- Footer Menu -->
        <div>

          <q-list padding class="multidestinos-menu">
            <q-item clickable v-ripple @click="goPage('/Perfil')" class="menu-item profile-item" active-class="menu-active">
              <q-item-section avatar>
                <q-avatar size="32px">
                  <img :src="imagenPerfil || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="menu-label">{{ nombre || 'Mi Perfil' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logout" class="menu-item logout-item" active-class="menu-active">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Header Styling */
.multidestinos-header {
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  z-index: 2000; /* Ensure header is above sidebar */
  height: 50px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  background: linear-gradient(to right, #fff, #ffca28);
  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
  color: transparent;
}

.clock-text {
  font-family: 'Roboto Mono', monospace;
  letter-spacing: 1px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
}

.version-tag {
  font-size: 0.8rem;
  opacity: 0.9;
  color: #ffd54f;
}

/* Sidebar Styling */
.multidestinos-sidebar {
  background: linear-gradient(180deg, #1a237e 0%, #121858 100%);
  color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.brand-section {
  position: relative;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.815);
  overflow: hidden;
  z-index: 0;
}

.background-gif {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://media.giphy.com/media/nIufcLJ4tPe5Zosc6t/giphy.gif') center/cover no-repeat;
  filter: blur(0px) brightness(0.3); /* ⬅️ más oscuro pero aún visible */
  z-index: -1;
  opacity: 0.9; /* Permite controlar cuán visible es */
}



.user-details {
  text-align: center;
  margin-top: 10px;
}

.menu-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffd54f;
  letter-spacing: 1px;
  padding-top: 1rem;
  display: flex;
  align-items: center;
  text-transform: uppercase;
}

.multidestinos-menu .menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  padding: 12px 16px;
  position: relative;
}

.multidestinos-menu .menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  width: 4px;
  height: 100%;
  background: #ffd54f;
  opacity: 0;
  transition: all 0.3s ease;
}

.multidestinos-menu .menu-item:hover {
  background: rgba(255, 255, 255, 0.949);
  transform: translateX(4px);
}

.multidestinos-menu .menu-item:hover::before {
  opacity: 1;
  left: 0;
}

.multidestinos-menu .menu-item:hover .q-icon {
  transform: scale(1.15);
  color: #000000 !important;
}

.menu-item .q-icon {
  transition: all 0.3s ease;
}

.menu-label {
  font-weight: 500;
  letter-spacing: 0.3px;
  color: rgba(0, 0, 0, 0.9);
}

.menu-active {
  background: rgba(255, 213, 79, 0.15) !important;
}

.menu-active::before {
  opacity: 1 !important;
  left: 0 !important;
}

.menu-active .menu-label {
  color: white;
  font-weight: 600;
}

.menu-active .q-icon {
  color: #ffd54f !important;
}

.profile-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px 8px 0 0;
}

.profile-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.logout-item {
  background: rgba(255, 82, 82, 0.1);
  border-radius: 0 0 8px 8px;
  margin-top: 1px;
}

.logout-item:hover {
  background: rgba(255, 82, 82, 0.2);
}

/* Animation for hover effect */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.multidestinos-menu .q-item:active .q-icon {
  animation: pulse 0.3s linear;
}

/* Make sure mini mode is styled properly */
:deep(.q-drawer--mini) .multidestinos-menu .q-item {
  padding: 8px;
  justify-content: center;
}

:deep(.q-drawer--mini) .q-item__section--side {
  padding-right: 0;
}

:deep(.q-drawer--mini) .q-item__section--avatar {
  min-width: 0;
}



/* Drawer animation styles */
.drawer-container {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) !important;
}

.menu-toggle-btn {
  transition: transform 0.3s ease;
}

.menu-toggle-btn:hover {
  transform: rotate(180deg);
}

/* Ensure sidebar appears below header */
.multidestinos-sidebar {
  top: 50px !important;
  height: calc(100% - 50px) !important;
}

</style>

<script src="./MainLayout.js"></script>
