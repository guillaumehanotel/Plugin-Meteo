(function($){
	$.fn.pluginmeteo=function(options){
        
        
        
		var defauts={
               	left: 150,
               	top: 150,
                fahrenheit : false,
                background : '#4A535A',
                width : 300,
                height : 150

           	};
        
        
        
		var options = $.extend(defauts, options); 
        
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
        
        
        
        
        
        /** rafraichisement : button
        $('.btn-plugin).click(startrefresh);
        
        startrefresh();
        
        */
        
        function getHtmlPlugin(html){
            
            html = "<div id='heure'><p id='hour'></p><p id='minute'></p></div>";
            html += "<div id='ville'></div>";
            html += "<div id='condition'></div>";
            html += "<img src='#' height='45' width='45' alt='meteo'/>";
            html += "<div id='temp'></div>";
            
            html += "<button id='btn1' >°F</button>"
            
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
        
        /* génération de la date */
        var d = new Date();
        var h = pad(d.getHours());
        var m = pad(d.getMinutes());
        
        
        function refresh(urlMeteo){
                
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
                

					$("#ville").text(ville);
					$("#condition").text(currentCondition);
                    $("#temp").text(temp);
                    $("#hour").text(h);
                    $("#minute").text(m);
                    $("img").attr('src',img);
                    
                
                
				});
            }
        
        /*
            $("#btn1").click(function(){
                //var btn = $(this);
                alert("f");

            });

        */


        
        
		return this.each(function(){
            
            
            
            var self = $(this);
            createPluginCss(self);
            var html = getHtmlPlugin();
            self.html(html);
            
            var urlMeteo = "http://www.prevision-meteo.ch/services/json/bern";
            
            refresh(urlMeteo);
            
            $("button").on("click",function(){
                
                
                var btn = $(this);
                
                if(btn.text() == "°F"){
                    btn.text("°C");
                    fah=true;
                    refresh(urlMeteo);
                    //location.reload();
                }else{
                    btn.text("°F");
                    fah=false;
                    refresh(urlMeteo);
                    //location.reload();
                }
                
                
                
            });

       	});
        
        
        
        
        
        
        
	};
})(jQuery);