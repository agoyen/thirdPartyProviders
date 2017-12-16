<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
     <div class="text-xs-center">
        <img src="../assets/img/JimmyStreamingLogo.png" alt="Vuetify.js" class="mb-5" />
      </div>
      <v-card class="transparent-background">
       <v-card-title class="headline">Felicitaciones! Ya podes disfrutar de todo el contenido de Jimmy Streaming :)</v-card-title>
       <v-card-actions>
          <v-spacer></v-spacer>
          <a href="#">Acciones</a>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  asyncData(context) {
    return {}
  },
  mounted(){
  }
}
</script>
