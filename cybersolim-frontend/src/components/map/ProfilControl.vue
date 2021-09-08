<template>
  <div ref="profil"
       :class="activeClass">
    <button v-if="hasTarget"
            type="info"
            @click.prevent="buttonHandler"
            @touchstart.prevent="buttonHandler"></button>
    <div class="ol-inner">
      <div class="canvas-wrapper">
        <div :style="{width: canvasWidth/ratio, height: canvasHeight/ratio}"
             @click="divHandler"
             @mousemove="divHandler">
          <cavas :width="canvasWidth"
                 :height="canvasHeight"></cavas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {inherits} from 'ol'
  import {Control} from 'ol/control'
  import Profil from 'ol-ext/control/Profile'

  /**
   * TODO
   * @see https://github.com/Viglino/ol3-ext/blob/gh-pages/control/profilcontrol.js
   */
  export default {
    name: 'profil',
    data() {
      return {
        ratio: 2,
        _options: {}
      }
    },
    computed: {
      hasTarget() {
        return !typeof (this._options.target) === 'undefined';
      },
      activeClass() {
        let className = this._options.className || 'ol-profil';
        if (this.hasTarget) {
          className = +'ol-unselectable ol-control ol-collapsed'
        }
        return className;
      },
      canvasWidth() {
        return (this._options.width || 300) * this.ratio;
      },
      canvasHeight() {
        return (this._options.height || 150) * this.ratio;
      }
    },
    methods: {
      buttonHandler: () => {
        this.toogle();
      },
      divHandler: e => {
        this.onMove(e);
      }
    },
    mounted() {
      this._options = this.options;

      let _this = this; // vue
      Profil = function () {
        let self = this; // function
        let optOptions = this._options || {};
        let info = optOptions.info || ol.control.Profil.prototype.info;

        _this.ratio = self.ratio = 2;

        Control.call(self,
          {
            element: _this.$refs.profil,
            target: optOptions.target
          });

        // Offset in px
        /*
        self.margin_ = { top: 10 * ratio, left: 40 * ratio, bottom: 30 * ratio, right: 10 * ratio };
         if (!self.info.ytitle) self.margin_.left -= 20 * ratio;
         if (!self.info.xtitle) self.margin_.bottom -= 20 * ratio;

         // Cursor
         self.bar_ = $("<div>").addClass("ol-profilbar")
             .css({ top: (self.margin_.top / ratio) + "px", height: (self.canvas_.height - self.margin_.top - self.margin_.bottom) / ratio + "px" })
             .appendTo(div);
         self.cursor_ = $("<div>").addClass("ol-profilcursor")
             .appendTo(div);
         self.popup_ = $("<div>").addClass("ol-profilpopup")
             .appendTo(self.cursor_);

         // Track information
         var t = $("<table cellpadding='0' cellspacing='0'>").appendTo(div).width(self.canvas_.width / ratio);
         var tr = $("<tr>").addClass("track-info").appendTo(t);
         $("<td>").html((self.info.zmin || "Zmin") + ': <span class="zmin">').appendTo(tr);
         $("<td>").html((self.info.zmax || "Zmax") + ': <span class="zmax">').appendTo(tr);
         $("<td>").html((self.info.distance || "Distance") + ': <span class="dist">').appendTo(tr);
         $("<td>").html((self.info.time || "Time") + ': <span class="time">').appendTo(tr);
         tr = $("<tr>").addClass("point-info").appendTo(t);
         $("<td>").html((self.info.altitude || "Altitude") + ': <span class="z">').appendTo(tr);
         $("<td>").html((self.info.distance || "Distance") + ': <span class="dist">').appendTo(tr);
         $("<td>").html((self.info.time || "Time") + ': <span class="time">').appendTo(tr);
         */
        // Array of data
        self.tab_ = [];

        // Show feature
        if (this._options.feature) {
          self.setGeometry(this._.feature);
        }
      };
      inherits(Profil, Control);
    },
    props: {
      options: {
        type: Object,
        required: true,
        default() {
          return {};
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  canvas {
    transform: scale(0.5, 0.5);
    transform-origin: 0 0
  }

  .canvas-wrapper {
    position: relative;
  }
</style>
