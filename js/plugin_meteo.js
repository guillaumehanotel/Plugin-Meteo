(function($){
	$.fn.pluginmeteo=function(options){
        
        
        // variables par défauts
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
        
        // variable servant à stocker l'option fahrenheit(bool) pour savoir si la temp est en Celsius ou en Fahrenhait
        var fah = options.fahrenheit;
        
        
        // Fonction qui applique les options CSS au plugin
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
        
        
        
        
        

        // Fonction servant à créer et renvoyer le html du plugin
        function getHtmlPlugin(html){
            
            html = "<div class='heure'><p class='hour'></p><p class='minute'></p></div>";
            html += "<div class='ville'></div>";
            html += "<div class='condition'></div>";
            html += "<img class='imgcond' src='#' height='45' width='45' alt='meteo'/>";
            html += "<div class='temp'></div>";
            // si fah est vrai, on affiche sur le bouton °C,sinon °F
            if(fah==true){
                html += "<button class='btn1' >°C</button>"
            } else {
                html += "<button class='btn1' >°F</button>"
            }
            
            
            html += "<img height='20' width='20' class='icon' src='icon-reload.png' alt=''/>"
            
            return html;
        }
        
        
        
        
        //Fonction servant à récupérer les données de l'API
        function getDataMeteo (urlMeteo) {
			return $.ajax(urlMeteo);
                /*
            .done(function(){
                alert('toto');
            }).fail(function(){
                alert('tata');
            });
            */
		}
        
        
        // fonction pour afficher les 0 manquants dans l'heure et les minutes 
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
        
        
        /*
        function testURL(urlMeteo){
            
            var res;
            
            getDataMeteo(urlMeteo).then(function(result){
                var tmp = result.current_condition.tmp;
                
                
                if(isNaN(tmp) == false){
                    res =  true;
                } else {
                    res = false;
                }
                
                return res;
                
            });
            
            console.log(res);
            return res; 
        }
        */
        
        
        // fonction servant à ajouter les données aux éléments HTML du plugin
        function refresh(urlMeteo,self){
            
            /* génération de la date */
            var d = new Date();
            var h = pad(d.getHours());
            var m = pad(d.getMinutes());
                
            getDataMeteo(urlMeteo)
				.then(function(result){
                
                
                    // on stocke les données voulues dans des variables
                    //console.log(result);
                  
                
					var currentCondition = result.current_condition.condition;
                    //température en celsius ou fahrenheit selon la variable fah
                    if(fah != true ){
                        var temp = result.current_condition.tmp+"°C";
                    } else {
                        var temp = toFahren(result.current_condition.tmp)+"°F";
                    }
					
                
					var img = result.fcst_day_0.icon;
                    var ville = result.city_info.name;
                
                    // on ajoute ces données dans le HTML
					$(".ville",self).text(ville);
					$(".condition",self).text(currentCondition);
                    $(".temp",self).text(temp);
                    $(".hour",self).text(h);
                    $(".minute",self).text(m);
                    $(".imgcond",self).attr('src',img);
                    
                
                
				}).fail(function(result){
                

                
                });
            }
        

        

        
        
		return this.each(function(){
            
            // lien de la ville
            var urlMeteo = "http://www.prevision-meteo.ch/services/json/chatelaillon-plage";
            
            
            
            
            // self est désigne 1 instance du plugin
            var self = $(this);
            
            // auquel on ajoute le html et le CSS
            createPluginCss(self);
            var html = getHtmlPlugin();
            
            self.html(html);

   
            
            
            // si l'option draggable est vrai, alors l'élément le devient
            if(options.draggable == true){
                $(this).draggable();
            }
            
            
            
            
            
            //ajout des données à l'instance en fct de l'url donné
            refresh(urlMeteo,self);
            
            
            
            //si le bouton pour changer d'unité est cliqué
            $(".btn1",self).on("click",function(){
 
                var btn = $(this);
                //on change la valeur dans l'autre unité
                if(btn.text() == "°F"){
                    btn.text("°C");
                    // on modifie la variable fah et on rafraichit
                    fah=true;
                    refresh(urlMeteo,self);
                }else{
                    btn.text("°F");
                    fah=false;
                    refresh(urlMeteo,self);
                }
                
            });
            
            //bouton refresh
            $(".icon",self).on("click",function(){
                refresh(urlMeteo,self);
            });
            
            
            //console.log(res);            

       	});
        
        
        
        
        
        
        
	};
})(jQuery);