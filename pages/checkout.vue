<template>
<v-app top-toolbar left-fixed-sidebar>

<v-layout>
    <v-flex xs12 sm6 offset-sm3>
 <v-card>
  <form action="" method="post" id="pay" name="pay" v-on:submit.prevent="payNow" class="ma-2">
    <v-text-field label="E-mail" v-model="cardInfo.email"  name="email" id="email" required></v-text-field>
    <v-text-field label="Card number" v-model="cardInfo.number"  data-checkout="cardNumber" id="cardNumber" required></v-text-field>
    <v-text-field label="CVV" v-model="cardInfo.cvv" data-checkout="securityCode" id="securityCode" required></v-text-field>
    <v-text-field label="Expiration Month" v-model="cardInfo.expirationMonth" data-checkout="cardExpirationMonth" id="cardExpirationMonth" required></v-text-field>
    <v-text-field label="Expiration Year" v-model="cardInfo.expirationYear" data-checkout="cardExpirationYear" id="cardExpirationYear" required></v-text-field>
    <v-text-field label="Holder name" v-model="cardInfo.holderName" data-checkout="cardholderName" id="cardholderName" required></v-text-field>
    <v-btn success type="submit">Subscribe</v-btn>
</form>

<div id="card_draw"></div>

</v-card>
</v-flex>
  </v-layout>


<div>{{cardInfo}}</div>
<div>{{data}}</div>



</v-app top-toolbar>
</template>

<script>
export default {
  asyncData(context) {
    console.log(context.query)
    return {
        cardInfo:{
            email: '',
            number: 4075595716483764 ,
            cvv: '',
            expirationMonth: '',
            expirationYear: '',
            holderName: '',
            cardToken: ''
        },
        data:{
            cardToken:{},
            userId: context.query ? context.query.token : ''           
        }
    }
  },
  head: {
    script: [
      { src: 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js' }, 
      { src: 'https://rawgit.com/jessepollak/card/master/dist/card.js' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/vuetify/0.17.3/vuetify.min.css'}
    ]
  },

  methods:{
    click: function(){
      console.log('metodo ejecutado.')
    },
    getRoute: function(){
        this.$router.push('congrats')
    },

    handleTokenResponse: function(status, response) {
        console.log(status, JSON.stringify(response))
        if (status != 200 && status != 201) {
            alert("Check data");
        }else{
            var form = document.querySelector('#pay');

            var card = document.createElement('input');
            card.setAttribute('name',"token");
            card.setAttribute('type',"hidden");
            card.setAttribute('value',response.id);
            this.cardInfo.cardToken = response.id
            form.appendChild(card);
            //this.addCardTokenToServer(response)
        }
    },
    payNow: function(){
        console.log('Formulario enviado...')
        var $form = document.querySelector('#pay');
        console.log($form)
        Mercadopago.createToken($form, this.handleTokenResponse);
        return true;
    },

    addCardTokenToServer: function(cardToken){
        console.log('SEND',cardToken)
        this.data.cardToken = cardToken

        fetch('/api/token',{
            method: 'POST',
            body: JSON.stringify(this.data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response=>{
            return response.json()
        }).then(data=>{
            console.log(data)
        })
    }
  },
  mounted(){

var card = new Card({
    form: '#pay', // *required*
    container: '#card_draw', // *required*
    formSelectors: {
        numberInput: '#cardNumber', // optional — default input[name="number"]
        expiryInput: '#cardExpiration', // optional — default input[name="expiry"]
        cvcInput: '#securityCode', // optional — default input[name="cvc"]
        nameInput: '#cardholderName' // optional - defaults input[name="name"]
    },

    width: 200, // optional — default 350px
    formatting: true, // optional - default true

    // Strings for translation - optional
    messages: {
        validDate: 'valid\ndate', // optional - default 'valid\nthru'
        monthYear: 'mm/yyyy', // optional - default 'month/year'
    },

    // Default placeholders for rendered fields - optional
    placeholders: {
        number: '•••• •••• •••• ••••',
        name: 'Full Name',
        expiry: '••/••',
        cvc: '•••'
    },

    masks: {
        cardNumber: '•' // optional - mask card number
    },

    // if true, will log helpful messages for setting up Card
    debug: true // optional - default false
});



    Mercadopago.setPublishableKey("TEST-c6bc5f01-87ba-4a25-83dd-12b8bbee080c");


    function addEvent(el, eventName, handler){
        if (el.addEventListener) {
               el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function(){
              handler.call(el);
            });
        }
    };

    function getBin() {
        var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
        return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
    };

    function guessingPaymentMethod(event) {
        var bin = getBin();

        if (event.type == "keyup") {
            if (bin.length >= 6) {
                Mercadopago.getPaymentMethod({
                    "bin": bin
                }, setPaymentMethodInfo);
            }
        } else {
            setTimeout(function() {
                if (bin.length >= 6) {
                    Mercadopago.getPaymentMethod({
                        "bin": bin
                    }, setPaymentMethodInfo);
                }
            }, 100);
        }
    };

    function setPaymentMethodInfo(status, response) {
        if (status == 200) {
            // do somethings ex: show logo of the payment method
            var form = document.querySelector('#pay');

            if (document.querySelector("input[name=paymentMethodId]") == null) {
                var paymentMethod = document.createElement('input');
                paymentMethod.setAttribute('name', "paymentMethodId");
                paymentMethod.setAttribute('type', "hidden");
                paymentMethod.setAttribute('value', response[0].id);

                form.appendChild(paymentMethod);
            } else {
                document.querySelector("input[name=paymentMethodId]").value = response[0].id;
            }
        }
    };

    addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
    addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);


    var doSubmit = false;

  }
}
</script>

<style scoped>
  .title {
    padding-left: 20px;
  }
</style>
