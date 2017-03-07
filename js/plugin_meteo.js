(function($){
	$.fn.pluginmeteo=function(options){
        
        
        
		var defauts={
               	left: 150,
               	top: 150,
                fahrenheit : false,
                background : '#4A535A',
                width : 300,
                height : 150,
                draggable : true

           	};
        
        
        
		var options = $.extend(defauts, options); 
        
        // à déplacer
        var fah = options.fahrenheit;
        
        
        
        function createPluginCss(self){
            
            var optionsCss = {
                width : options.width,
                height : options.height,
                zIndex : 99,
                top : options.top,
                left : options.left,
                background : options.background
            }   
            
            self.css(optionsCss);
        }
        
        
        
        
        

        
        function getHtmlPlugin(html){
            
            html = "<div class='heure'><p class='hour'></p><p class='minute'></p></div>";
            html += "<div class='ville'></div>";
            html += "<div class='condition'></div>";
            html += "<img class='imgcond' src='#' height='45' width='45' alt='meteo'/>";
            html += "<div class='temp'></div>";
            if(fah==true){
                html += "<button class='btn1' >°C</button>"
            } else {
                html += "<button class='btn1' >°F</button>"
            }
            
            
            html += "<img height='20' width='20' class='icon' src='icon-reload.png' alt=''/>"
            
            return html;
        }
        
        
        
        
        
        function getDataMeteo (urlMeteo) {
			return $.ajax(urlMeteo);
		}
        
        /* fonction pour afficher les 0 manquants dans l'heure et les minutes */
        function pad(value) {
            if (value < 10) {
                return '0' + value;
            }
            else {
                 return value;
            }
        }
        
        /* fonction conversion celsius to fahenheit */
        function toFahren(value){
            return value*1.8 + 32;
        }
        
        
        
        
        function refresh(urlMeteo){
            
            /* génération de la date */
            var d = new Date();
            var h = pad(d.getHours());
            var m = pad(d.getMinutes());
                
            getDataMeteo(urlMeteo)
				.then(function(result){
					var currentCondition = result.current_condition.condition;
                    if(fah != true ){
                        var temp = result.current_condition.tmp+"°C";
                    } else {
                        var temp = toFahren(result.current_condition.tmp)+"°F";
                    }
					
                
					var img = result.fcst_day_0.icon;
                    var ville = result.city_info.name;
                

					$(".ville").text(ville);
					$(".condition").text(currentCondition);
                    $(".temp").text(temp);
                    $(".hour").text(h);
                    $(".minute").text(m);
                    $(".imgcond").attr('src',img);
                    
                
                
				});
            }
        


        
        
		return this.each(function(){
            
            
            
            
            
            var self = $(this);
            createPluginCss(self);
            var html = getHtmlPlugin();
            self.html(html);
            
            if(options.draggable == true){
                $(this).draggable();
            }
            
            
            var urlMeteo = "http://www.prevision-meteo.ch/services/json/bordeaux";
            
            refresh(urlMeteo);
            
            $(".btn1").on("click",function(){
                
                
                var btn = $(this);
                console.log(btn);
                
                
                if(btn.text() == "°F"){
                    
                    btn.text("°C");
                    fah=true;
                    refresh(urlMeteo);

                }else{
                    btn.text("°F");
                    fah=false;
                    refresh(urlMeteo);

                }
                
                
                
            });
            
            $("#icon").on("click",function(){
                refresh(urlMeteo);
            });
            
            

       	});
        
        
        
        
        
        
        
	};
})(jQuery);