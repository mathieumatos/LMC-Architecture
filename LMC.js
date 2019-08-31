//
// Devoir 1 - Machine virtuelle pour
// l'architecture Little Man Computer
// Auteur: Mathieu Matos
// Matricule: 20032753
//

var signer = function(num){
    if(num>=0 && num<=499){
        return(num);
    } else{
        var nombre = String(1000+num);
		return(Number(nombre.substring(nombre.length-3,nombre.length)));
	};
};
/*
 Si la valeur signée est entre 0 et 499, elle est de même que non-signée. Si non, on
 ajoute la valeur à 1000 et on garde les trois derniers chiffres du résultat pour une
 représentation non-signée. Vice-versa pour passer de non-signée à signée.
*/


var LMCState = function(mem, pc, acc) {
    return {
		mem: mem,
		pc: pc,
		acc: acc
    };
};
/*
 La fonction LMCState prend comme paramètres la mémoire, pc et acc au moment désiré
 et retourne l'enregistrement de ceux-ci avec leur données respectives.
*/


//COMPILATION

var compile = function(source){
    
    
    //PRÉTRAITEMENT
    
	var pretraitement = function(source){
		var separ = source.split("\n");
		var tabPT = [];
		for(var i = 0; i<separ.length; i++) {
	    	if(separ[i].split(" ") != ""){
				tabPT.push(separ[i].toUpperCase().split(" "));
	    	};
		};
		return(tabPT);
    };
    /*
     On sépare les éléments de la source par les sauts de ligne ("\n") et si les éléments
     ne sont pas vide (le résultat d'autres sauts de ligne), on les ajoute dans un tableau
     prétraité (tabPT = tableau prétraité) et le tout se fait en séparant les éléments
     eux-mêmes par des espaces (" "). Cela donne le tableau prétraité.
    */
    
    
    //DÉSÉTIQUETAGE

    var desetiquetage = function(tabPRET){
        for(var i = 0; i<tabPRET.length; i++){
            if(tabPRET[i].length>2){
            	for(var j = 0; j<tabPRET.length; j++){
                	for(var k = 0; k<tabPRET[j].length; k++){
                		if(tabPRET[j][k]===tabPRET[i][0].substring(0,1)){
                    		tabPRET[j][k]=i;
                		};
               		};
            	};
            };
        };
        var tabDes = [];
        for(var l = 0; l<tabPRET.length; l++){
            if(tabPRET[l].length<=2){
            	tabDes.push(tabPRET[l]);
            } else {
                tabPRET[l].shift();
            	tabDes.push(tabPRET[l]);
            };
        };
        return(tabDes);
    };
    /*
     Avec le tableau prétraité, on désétiquette le tableau et remplaçant l'étiquette
     par sa valeur. Avec cette fonction, on trouve l'index de l'étiquette et on donne
     cette valeur aux étiquettes correspondantes. Ensuite, après avoir changé ces 
     étiquettes pour leur valeur correspondante, on reforme un tableau désétiqueté
     (nommé tabDes) avec l'étiquette d'enlevée par la méthode shift. Le résultat final
     donne un tableau désétiqueté, prêt pour la génération.
    */
	        
    
    //GÉNÉRATION

    var generation = function(tabDes){
        var mem = [];
        loop:
        for(var i = 0; i<tabDes.length && mem.length <=100; i++){
            if(tabDes[i][0] === "LDA"){
            	mem.push(500+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "ADD"){
            	mem.push(100+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "SUB"){
            	mem.push(200+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "STA"){
            	mem.push(300+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "BRA"){
            	mem.push(600+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "BRZ"){
            	mem.push(700+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "BRP"){
            	mem.push(800+(Number(tabDes[i][1])));
            	continue loop;
            } else if(tabDes[i][0] === "INP"){
            	mem.push(901);
            	continue loop;
            } else if(tabDes[i][0] === "OUT"){
            	mem.push(902);
            	continue loop;
            } else if(tabDes[i][0] === "HLT"){
            	mem.push(0);
            	continue loop;
            } else if(tabDes[i][0] === "DAT"){
            	mem.push(Number(tabDes[i][1]));
            } else {
            	pause(); //test de fonction
            };
        };
        return(mem);
    };
    /*
     Le fonction generation prend le tableau désétiqueté et associe pour chaque élément
     du tableau sa correspondance numérique en testant chaque élément pour une valeur
     numérique correspondante. Des variations s'appliquent selon la mnémonique respective
     et le tout est inséré dans un tableau généré qu'on interprète comme la mémoire du
     programme (mem). Puisque nous avons des mnémoniques limités et qui sont toutes 
     inscrites pour une correspondance conditionnelle, nous avons un test à la fin, qui
     pause le programme si jamais il n'y a pas de correspondance (donc, un bug).
    */
    
    return(generation(desetiquetage(pretraitement(source))));  
};    
/*
 La fonction compile retourne la génération du tableau désétiqueté du tableau prétraité
 de la source. Autre dit, elle retourne la mémoire initiale du programme LMC avant d'être
 exécutée.
*/


//EXÉCUTION

var execute = function(mem){
    
    
    //INITIALISATION
    
    var pc  = 0, acc = 0;
    /*
     On initialise la machine en mettant pc (le compteur) à 0 et de même pour
     l'accumulateur.
    */
    
    
    //EXÉCUTION
    
    while(mem.length>pc && mem.length <= 100){
		if(String(mem[pc]).length == 3){
	    	if(mem[pc] === 901){
				pc++;
				var MESSAGE_INPUT = prompt("Entrez une valeur numérique");
            	if(MESSAGE_INPUT<-500 || MESSAGE_INPUT>499){
                	print("Veuillez entre une valeur entre -500 et 499");
            	};
				acc = signer(MESSAGE_INPUT);
	    	} else if(mem[pc] === 902){
				pc++;
				var output = signer(acc);
				print(output);
            } else if(String(mem[pc]).substring(0,1) === "8"){
				pc++;
				if(acc >= 0){
		    		pc = Number(String(mem[pc]).substring(1,3));
				};
	    	} else if(String(mem[pc]).substring(0,1) === "7"){
				pc++;
				if(acc === 0){
		    		pc = Number(String(mem[pc]).substring(1,3));
				};
	    	} else if(String(mem[pc]).substring(0,1) === "6"){
				pc++;
				pc = Number(String(mem[pc-1]).substring(1,3));
	    	} else if(String(mem[pc]).substring(0,1) === "5"){
				pc++;
				acc = mem[Number(String(mem[pc-1]).substring(1,3))];
	    	} else if(String(mem[pc]).substring(0,1) === "3"){
				pc++;
				mem[Number(String(mem[pc-1]).substring(1,3))] = acc;
	    	} else if(String(mem[pc]).substring(0,1) === "2"){
				pc++;
				acc -= mem[Number(String(mem[pc-1]).substring(1,3))];
	    	} else if(String(mem[pc]).substring(0,1) === "1"){
				pc++;
				acc += mem[Number(String(mem[pc-1]).substring(1,3))];
	    	}else if(mem[pc] === 0){
				return(LMCState(mem,pc,acc));
	    	} else{
				return(LMCState(mem,pc,acc));
	    	};
		} else{
	    	return(LMCState(mem,pc,acc));
		};
    };
};
/*
 La fonction execute prend le tableau mem (mémoire) et avec les données numériques
 du tableau, selon leur correspondance respective, agit comme processeur. On initialise
 le compteur à 0 et l'accumulateur à 0. Pour chaque valeur de pc on prend le "pc"-ième
 élément du tableau et on effectue sont effet respectif selon les énoncés conditionnels.
 L'exécution se déroule tant et aussi longtemps que le compteur "pc" est plus 
 petit que la taille de la mémoire, est inférieur à 100 et/ou tant que le programme ne
 s'arrête (par exemple, par une correspondance "HLT" = 0 ou une correspondance inconnue).
 Lorsqu'elle arrête, elle retourne l'enregistrement LMCState qui donne la mémoire, pc et
 acc au moment final de l'exécution (avec la fonction LMCState définit plus haut). Les
 entrées et sorties se font généralement pendant l'exécution.
*/


/*
 Pour exécuter une source compilée, il ne suffit de faire : execute(compile(source));
 Cela donnera l'état de la machine par l'enregistrement LMCState au moment final de
 l'exécution et les entrées/sorties se feront durant le processus de l'exécution
*/

