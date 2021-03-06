odoo.define('negocio_web.theme_snippets_editor', function (require) {
    'use strict';

    var options = require('web_editor.snippets.options');
    var editor = require('web_editor.editor');
    var ajax = require('web.ajax');
    var core = require('web.core');
   //  var Model = require('web.Model');
    var qweb = core.qweb;
    var _t = core._t;
    var rpc = require('web.rpc');
     

    ajax.loadXML('/negocio_web/static/src/xml/html_block.xml', qweb);

      options.registry.tabslide = options.Class.extend({
       unique_id: function () {
            var id = 0;
            var self = this;
            self.$target.find(".nav-tabs a").each(function () {

                var cid = 1 + parseInt($(this).attr("href").replace(/[^0123456789]/g, ''),10);
                if (id < cid) id = cid;
            });
            return "myTabs" + id;
        },

        onBuilt: function () {
            this.$target.find('.nav-tabs a').show();
            var self = this;
            this.id = this.unique_id();
            this.$link.attr("href", '#' + self.id);
            this.$content.attr("id", self.id);
        },

        onClone: function () {
            // var self = this;
            // this.id = this.unique_id();
            // this.$link.attr("href", '#' + self.id);
            // this.$content.attr("id", self.id);
        },

        start: function () {
            this.$target.find('.nav-tabs a').show();
            var self = this;
            this.$link = self.$target.find('.nav-tabs a');
            this.$content = self.$target.find('.tab-pane');
        },
    }); 

    options.registry.js_embed_html = options.Class.extend({
        start : function () {
			      var self = this;
			      this.id = this.$target.attr("id");
			
		    },
        edit_html: function(type,value) {
     
          var self = this;
          this.id = this.$target.attr("id");
		  /*if(type !== "click") return;*/
         if (type == "click" || type === false){
            self.$modal = $(qweb.render("comercio_web.edit_html_modal"));
            $('body > #custom_html_modal').remove();
			      self.$modal.appendTo('body');
            self.$modal.modal();
            var $htmlvalue = self.$modal.find("#html_data"),
                $sub_data = self.$modal.find("#sub_data"); 
                $htmlvalue.val(self.$target.html());
                $sub_data.on('click', function() {
                  var html = $htmlvalue.val();
                  var live_str = $('<div>',{html:html});
                  var data = live_str.find('[data-html]');
                  var final = live_str;
                  if(data.length > 0){
                     var style = data.attr('style');
                     if(style)  self.$target.attr('style',style)
                      var cls = data.attr('class');
                      if(cls) self.$target.addClass(cls).attr('style',style);
                     var final = data.removeAttr('data-html').removeAttr('class').removeAttr('style');
                  } else {
                    
                  }
                  self.$target.empty().append(final);

        				  var oe_model = self.$target.parent().attr('data-oe-model');
        				  if(oe_model){
					          self.$target.parent().addClass('o_editable o_dirty');
				            }
                  var bar = live_str.find('.progress-bar');
                  if(bar.length > 0) IMPACTO.progressBar();

                  var counter = live_str.find('.counter');
                  if(counter.length > 0) IMPACTO.counters();

                  

                });              
             }
			      return self;
        },
        onBuilt: function() {
      			var self = this;
      			this._super();
      			this.edit_html('click');
        }
    });

    
    options.registry.js_progress_bar = options.Class.extend({
        start: function () {
            var self = this;
            this._super();
        },
        cleanForSave: function () {
            var $self = this;
            var no = $self.$target.find('.progress-number');
            var number = no.text();
            if(number != '' ) $self.$target.attr('data-percent',number);
            $('.progress-bar').removeAttr('style')
            $('.progress-number').remove();
            $('.progress-type').remove();
        }     
    });

    options.registry.js_counter = options.Class.extend({
        start: function () {
            var self = this;
            this._super();
        },
        cleanForSave: function () {
            var $self = this;
            var count = $self.$target.find('.timer');
            var number = count.text();
            count.attr('data-to',number);
        },        
    });
});



