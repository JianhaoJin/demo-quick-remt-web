<template>
  <div class="mercurySpan">
    <span>{{text}}</span>
  </div>
</template>
     
     
<script>
export default {
  name: "mercurySpan",
  data() {
    return {
      text: "",
      dict: []
    };
  },
  props: {
    dicttypeid: {
      type: String
    },
    dictid: {
      type: String
    },
    changeText: {
      type: String
    }
  },
  methods: {
    _getData(data){
      data.forEach(element => {
          if(element.dictid == this.dictid){
              this.text = element.dictname
          }
      });
    }
  },
  watch: {
    changeText(){
      this._getData(this.dict);
    },
    dictid(val){
      this._getData(this.dict)
    }
  },
  mounted() {
    this.getDicts({dicttypeid: this.dicttypeid}).then(response => {
        let res = response.data.results
        this.dict = response.data.results
        this._getData(res);
    })
  }
};
</script>
