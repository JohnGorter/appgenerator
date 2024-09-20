import { createApp, ref, defineProps } from 'vue'

 


  const MyComponent2 = {
    props: {
      title: {
        type:String,
        default:"hello world"
      }
    },
    methods: {
      addBio(bio) {
         console.log("ttt")// this was needed on vue 2
      }
    },
    // setup(props, { attrs }) {
    //   console.log("hoerenzoon", attrs)
    //   const count = ref(0)
    //   return { count }
    // },
    template: `<div>Countsss is: {{ title }} {{ $attrs }} </div>`
  }

  const MyComponent = {
    props: {
      title: {
        type:String,
        default:"hello world"
      }
    },
    methods: {
      addBio(bio) {
         console.log("ttt")// this was needed on vue 2
      }
    },
    setup(props, { attrs, expose }) {
      const count = ref(0)
      let johnTitle = ref('testt')
      expose({johnTitle})
      return { count, johnTitle }
    },
    template: `<div @click="title = 't'">Count is: {{ count }}  <MyComponent2 :title="johnTitle"></MyComponent2></div>`
  }

const app = createApp(MyComponent)
app.component ('MyComponent2', MyComponent2)
app.mount('#app')





