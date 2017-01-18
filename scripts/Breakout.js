/**
 * Created by Adrià on 03/06/2016.    si l'usuari es diu juan jou xetem maxim, imatge a la bola musica  epica i mes shit , adria.pene--, que la bola es fagi gran,
 */
///////////////////////////////////    Objecte game
function Game(){
    this.AMPLADA_TOTXO=50; this.ALÇADA_TOTXO=25; // MIDES DEL TOTXO EN PÍXELS
    this.canvas,  this.context;       // context per poder dibuixar en el Canvas
    this.width, this.height;          // mides del canvas
    this.NIVELLS;

    this.paddle;   // la raqueta
    this.ball;
    this.ball2;// la pilota
    this.totxo;
    this.mur;
    this.nivellActual=1;
    this.puntuacio;
    this.vides=4;
    this.negre=false;
    this.numBoles=1;
    this.sound=false;
    this.pause;
    this.jou=false;



    this.t=0;      // el temps

    // Events del teclat
    this.key={
        RIGHT:{code: 39, pressed:false},
        LEFT :{code: 37, pressed:false},
        SPACE:{code: 32, pressed:false},
        RETURN:{code: 13, pressed: false},
        P:{code: 80, pressed: false}
    };
    $("#so").on("click",function(){
       if (game.sound){
           game.sound=false;
           $("#so").css({
               "width":"25px",
               "height":"25px",
               "border":"0px solid #3BF703"
           });
       }
        else{
           game.sound=true;
           $("#so").css({//so activat, posem border i fem la imatge mes petita perque el conjunt sigui igual que l'original
               "width":"21px",
               "height":"21px",
               "border":"2px solid #3BF703"
           });

       }
    });
    $("#Iup").on("click",function () {
        if(game.nivellActual<5) {
            game.inicialitzar(game.nivellActual + 1,game.puntuacio);
        }

    });
    $("#Idown").on("click",function () {
        if(game.nivellActual>1) {
            game.inicialitzar(game.nivellActual - 1,game.puntuacio);
        }
    });

}

Game.prototype.inicialitzar = function(nA, punts){
    this.canvas = document.getElementById("game");
    this.width = this.AMPLADA_TOTXO*15;  // 15 totxos com a màxim d'amplada
    this.canvas.width = this.width;
    this.height = this.ALÇADA_TOTXO*25;
    this.canvas.height =this.height;
    this.context = this.canvas.getContext("2d");
    this.nivellActual = nA;
    this.mur = new Mur(this.nivellActual);
    this.puntuacio=punts;
    game.negre=false;
    game.numBoles=1;
    $("#top").text("Millors jugadors: " +"1: " + localStorage.getItem("nom1") + " (" + localStorage.getItem("punt1") + ")"+ "2: " + localStorage.getItem("nom2") + " (" + localStorage.getItem("punt2") + ")" + "3: " + localStorage.getItem("nom3") + " (" + localStorage.getItem("punt3") + ")");

    this.paddle = new Paddle();
    this.ball = new Ball(390,560);
    switch(game.nivellActual){
        case 1:
            this.ball2 = new Ball(500,100);
            break;
        case 2:
            this.ball2 = new Ball(350,150);
            break;
        case 3:
            this.ball2 = new Ball(300,100);
            break;
    }
    
    this.llegirNivells();
    var nivell=this.NIVELLS[this.nivellActual-1];
    for(y = 0 ; y < nivell.totxos.length ; y++) {
        var linia = nivell.totxos[y];
        for (x = 0; x < linia.length; x++) {
            if (linia.charAt(x) != " ") {
                this.mur.totxos.push(new Totxo(x * this.AMPLADA_TOTXO, y * this.ALÇADA_TOTXO, this.AMPLADA_TOTXO, this.ALÇADA_TOTXO, nivell.colors[linia.charAt(x)]));
            }
        }
    }

    // Events amb jQuery
    $(document).on("keydown", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = true;
        }
        else if (e.keyCode==e.data.game.key.SPACE.code){
            e.data.game.key.SPACE.pressed=true;
        }
        else if (e.keyCode==e.data.game.key.RETURN.code){
            e.data.game.key.RETURN.pressed=true;
        }
        else if (e.keyCode==e.data.game.key.P.code){
            e.data.game.key.P.pressed=true;
            game.pause = !game.pause;
        }
    });
    $(document).on("keyup", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.SPACE.code){
           // e.data.game.key.SPACE.pressed=false;
        }
        else if (e.keyCode==e.data.game.key.RETURN.code){
          //  e.data.game.key.RETURN.pressed=false;
        }
    });

    this.t=new Date().getTime();     // inicialitzem el temps
    requestAnimationFrame(mainLoop);
}

Game.prototype.draw = function(){

    this.context.clearRect(0, 0, this.width, this.height);

    this.mur.draw(this.context);
    this.paddle.draw(this.context);
    this.ball.draw(this.context);
    if(game.negre)this.ball2.draw(this.context);
};

Game.prototype.update = function(){
    if(game.pause){
        this.t=new Date().getTime();
        $("#pause").css("display","inline");
        return;
    }
    $("#pause").css("display","none");
    var dt=Math.min((new Date().getTime() -this.t)/1000, 1); // temps, en segons, que ha passat des del darrer update
    this.t=new Date().getTime();

    if (game.key.RETURN.pressed) {
        $("#nickInput").css("display", "none");
        $("#nickName").text("Nick name: "+$("#Input").val());
        if($("#Input").val()=="jou"){game.jou=true;}
        if (game.key.SPACE.pressed) {
            this.paddle.update();    // Moviment de la raqueta
            this.ball.update(dt);
            if (game.negre) this.ball2.update(dt);// moviment de la bola, depen del temps que ha passat
            this.mur.update(this.nivellActual);
        }
    }
        $("#puntuacio").text("Puntuacio: " + game.puntuacio);
        $("#vida").text(" Vides: " + game.vides);
        $("#nivell").text("Nivell: " + game.nivellActual);
};

Game.prototype.win = function (){
    for (t = 0; t < game.mur.totxos.length; t++) {
        if(!(game.mur.totxos[t].tocat)){
            return false;
        }
    }
    if(game.nivellActual==5){
        $("#puntuacio").css("display","none");
        $(document).on("keydown keypress keyup", false);
        $("#completat").css("display","inline-block");
        $("#completat").text("Joc completat "+$("#Input").val()+"! La teva puntuació ha sigut: "+game.puntuacio +" i t'han sobrat: "+game.vides+" vides   ");
        if(localStorage.getItem("punt1")<game.puntuacio) {
            Utilitats.canviPos();
        }else{
        }
    }
    return true;
}

Game.prototype.llegirNivells = function(){
    this.NIVELLS = [
        {
            colors: {
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                p: "#BBB", // plata
                n: "#fff",  // blanc
                g: "#00ff11",//verd bola gran
                y: "#ff0", //groc, més velocitat
                x: "#D95AFF"
            },
            totxos: [
                "",
                "",
                "       g     ",
                "     ttttn   ",
                "    ccccccc  ",
                "   vvvvvvvyv ",
                "   eeeeeeeee ",
                "   lllllllll ",
                "   r r x r r "
            ]
        },
        {
            colors: {
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                g: "#F93", // groc
                p: "#BBB", // plata
                n: "#fff"  // blanc
            },
            totxos: [
                "",
                "",
                "  ppp     ppp ",
                "  tt       tt ",
                "  cc       cc ",
                "  vv       vv ",
                "  eeeeeneeeee ",
                "  lllllllllll ",
                "   r r r r r ",
                "      ggg "
            ]
        },
        {
            colors: {
                b: "#FFF", // blanc
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                g: "#F93", // groc
                p: "#BBB", // plata
                d: "#FB4", // dorat
                n: "#fff"  // blanc
            },
            totxos: [
                "",
                " ddd ",
                " pppp ",
                " ttttn ",
                " cccccc ",
                " vvvvvvv ",
                " eeeeeeee ",
                " lllllllll ",
                " rrrrrrrrrr ",
                " ggggggggggg ",
                " bbbbbbbbbbbb ",
                " ddddddddddddd "
            ]
        },
        {
            colors: {
                r: "#D40000", // vermell
                g: "#6D8902", // verd
                y: "#EBAD00" // groc
            },
            totxos: [
                "",
                "    rrrrrr  ",
                "   rrrrrrrrr  ",
                "   gggyygy  ",
                "  gygyyygyyy  ",
                "  gyggyyygyyy  ",
                "  ggyyyygggg  ",
                "    yyyyyyy  ",
                "   ggrggg  ",
                "  gggrggrggg  ",
                " ggggrrrrgggg  ",
                " yygryrryrgyy  ",
                " yyyrrrrrryyy  ",
                "   rrr  rrr  ",
                "  ggg    ggg  ",
                " gggg    gggg  "


            ]
        },
        {
            colors:
            {
                g: "#00ff00"
            },
            totxos: [
                "  ",
                "",
                " ",
                "    g     g   ",
                "     g   g    ",
                "    ggggggg   ",
                "   gg ggg gg  ",
                "  ggggggggggg ",
                "  g ggggggg g ",
                "  g g     g g ",
                "     gg gg    "
            ]
        }
    ];
}


//////////////////////////////////////////////////////////////////////
// Comença el programa
var game;
$(document).ready(function(){
    game= new Game();  	   // Inicialitzem la instància del joc
    // posar el nick abans de comenÇar amb un if

    game.inicialitzar(game.nivellActual, 0);   // estat inicial del joc

});

function mainLoop() {

    if (game.nivellActual < 6) {

    game.update();
    game.draw();
    }
    if(game.win()){
        if(game.sound) {
            var audio1 = new Audio('sound/bip.wav');//posem l'audio a una variable
            audio1.play();//executem l'audio
        }
        $("#win").css("display","block");
       setTimeout(function(){$("#win").css("display","none")}, 500);
        game.key.SPACE.pressed=false;
        game.inicialitzar(game.nivellActual+1, game.puntuacio);
    }
    requestAnimationFrame(mainLoop);
}

/////////////////////////////////// Mur
function Mur (n) {
    this.nivell=n;
    this.totxos=[];
}
Mur.prototype.draw=function (ctx) {
    //recorrer tota la array de mur cridant els draw dels totxos que es igual que la practica
    for (t = 0; t < game.mur.totxos.length; t++) {
        var totxo = game.mur.totxos[t];
        totxo.draw(ctx);
    }
}
Mur.prototype.update = function() {

}


///////////////////////////////////    Raqueta
function Paddle(){
    this.width = 300;
    this.height = 20;
    this.x = game.width/2 - this.width/2;
    this.y = game.height-50;
    this.vx = 7;
    this.color = "#FF0000"; // vermell
}

Paddle.prototype.update = function(){
    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + this.vx);
    }
    else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - this.vx);
    }
    if(game.jou){
        game.paddle.width=200;
        game.paddle.vx=10;
        game.paddle.color="#0000ff";
        $("#game").css("border-color", "#f00");
    }
}

Paddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
};


///////////////////////////////////    Pilota
function Ball(x,y){
    this.x = x; this.y = y;// posició del centre de la pilota
    this.vx = 300;  this.vy = 310;  // velocitat = 300 píxels per segon, cal evitar els 45 graus en el check!!
    this.radi = 10;                 // radi de la pilota
    this.color = "#0f0";  // gris fosc
    this.temp=true;
}

Ball.prototype.update = function(dt){
    var dtXoc;      // temps empleat fins al xoc
    var xoc=false;  // si hi ha xoc en aquest dt
    var k;          // proporció de la trajectoria que supera al xoc
    var trajectoria={};
    if(game.jou){
        game.ball.radi = 30;
         game.ball2.radi = 30;
       if(game.ball.temp){
           game.ball.y= 500;
           game.ball.vx = 500;
           game.ball.vy = 510;
           game.ball2.vx = 500;
           game.ball2.vy = 510;
           game.vides=100;
           game.ball.temp=false;
       }


    }
   // if(game.key.UP.pressed){this.vx + 1000;  this.vy +1000;}
    //else{ this.vx;  this.vy};
    trajectoria.p1={x:this.x, y:this.y};
//		var deltaX=this.vx*dt;
//		var deltaY=this.vy*dt;
    trajectoria.p2={x:this.x + this.vx*dt, y:this.y + this.vy*dt};  // nova posició de la bola

    // mirem tots els possibles xocs de la bola
    // Xoc amb la vora de sota de la pista
    if (trajectoria.p2.y + this.radi > game.height){
        // hem perdut l'intent actual

// mètode 2, simplificat	sense les variables deltaX i deltaY
        k=(trajectoria.p2.y+this.radi - game.height)/this.vy;
        // ens col·loquem just tocant la vora de la dreta
        this.x=trajectoria.p2.x-k*this.vx;
        this.y=game.height-this.radi;
        dtXoc=k*dt;  // temps que queda

        this.vy = -this.vy;
        xoc=true;
    }

    // Xoc amb la vora de dalt de la pista
    if (trajectoria.p2.y - this.radi < 0) {
        k = (trajectoria.p2.y - this.radi) / this.vy;  // k sempre positiu
        // ens col·loquem just tocant la vora de dalt
        this.x = trajectoria.p2.x - k * this.vx;
        this.y = this.radi;
        this.vy = -this.vy;
        dtXoc = k * dt;  // temps que queda
        xoc = true;
    }
    //Xoc amb la vora d'abaix de la pista
    if (trajectoria.p2.y + this.radi > game.height){
        this.vx=0;
        this.vy=0;
        k=(trajectoria.p2.y + this.radi - game.height)/this.vy;
        //ens col·loquem just tocant la vora d'abaix
        this.x=trajectoria.p2.x-k*this.vx;
        this.y=game.height-this.radi;
        dtXoc=k*dt;
        xoc=true;
        game.vides=game.vides-1;
       // game.puntuacio=game.puntuacio-100;
        game.numBoles=game.numBoles-1;
        if(game.numBoles==0 && game.vides>0){
            game.key.SPACE.pressed=false;
            game.inicialitzar(game.nivellActual, game.puntuacio);
        }
        if(game.vides==0){
            $(document).off('keyup keydown keypress');
            if(game.sound) {
                var audio2 = new Audio('sound/lose.wav');//posem l'audio a una variable
                audio2.play();//executem l'audio
            }
            $("#perdut").css("display","inline-block");
            $("#perdut").text("Has perdut "+$("#Input").val()+"! La teva puntuació ha sigut: "+game.puntuacio);

           if(localStorage.getItem("punt3")<game.puntuacio) {
               Utilitats.canviPos();
           }else{
           }

        }
    }

    // Xoc amb la vora dreta de la pista
    if (trajectoria.p2.x + this.radi > game.width){
        k=(trajectoria.p2.x+this.radi - game.width)/this.vx;
        // ens col·loquem just tocant la vora de la dreta
        this.x=game.width-this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }

    // Xoc amb la vora esquerra de la pista
    if (trajectoria.p2.x - this.radi< 0){
        k=(trajectoria.p2.x-this.radi)/this.vx;  // k sempre positiu
        // ens col·loquem just tocant la vora de l'esquerra
        this.x=this.radi;
        this.y=trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
    }


    // Xoc amb la raqueta
    var pXocP=Utilitats.interseccioSegmentRectangle(trajectoria,{p:{x:game.paddle.x-this.radi,y:game.paddle.y-this.radi},
        w:game.paddle.width+2*this.radi,
        h:game.paddle.height+2*this.radi});
    if(pXocP){
        xoc=true;
        this.x=pXocP.p.x;
        this.y=pXocP.p.y;
        switch(pXocP.vora){
            case "superior":
            case "inferior":  this.vy = -this.vy; break;
            case "esquerra":
            case "dreta"   :  this.vx = -this.vx; break;
        }
        dtXoc=(Utilitats.distancia(pXocP.p,trajectoria.p2)/Utilitats.distancia(trajectoria.p1,trajectoria.p2))*dt;
    }
    // Xoc amb el mur

    for(t=0;t<game.mur.totxos.length;t++) {
        var totxo = game.mur.totxos[t];
        if (!(totxo.tocat)) {
            // xoc amb un totxo
            var pXoc = Utilitats.interseccioSegmentRectangle(trajectoria, {
                p: {x: totxo.x - this.radi, y: totxo.y - this.radi},
                w: totxo.w + 2 * this.radi,
                h: totxo.h + 2 * this.radi
            });
            if (pXoc) {
                xoc = true;
                this.x = pXoc.p.x;
                this.y = pXoc.p.y;
                switch (pXoc.vora) {
                    case "superior":
                    case "inferior":
                        this.vy = -this.vy;
                        break;
                    case "esquerra":
                    case "dreta"   :
                        this.vx = -this.vx;
                        break;
                }
                dtXoc = (Utilitats.distancia(pXoc.p, trajectoria.p2) / Utilitats.distancia(trajectoria.p1, trajectoria.p2)) * dt;
                totxo.tocat= true;
                if(game.sound) {
                    var audio = new Audio('sound/coin.wav');//posem l'audio a una variable
                    audio.play();//executem l'audio
                }
                if(totxo.color=="#fff"){
                    game.negre=true;
                    game.numBoles=game.numBoles+1;
                }
                if(totxo.color=="#00ff11"){
                    game.ball.radi=30;
                    game.ball2.radi=30;
                    setTimeout(function(){game.ball.radi=10;game.ball2.radi=10}, 3000);
                }
                if(totxo.color=="#D95AFF"){
                    game.paddle.width=100;
                    setTimeout(function (){game.paddle.width=300;},5000);
                }
                if(totxo.color=="#ff0") {
                    game.ball.vx = 600;
                    game.ball.vy = 610;
                    game.ball2.vx = 600;
                    game.ball2.vy = 610;
                    setTimeout(function () {
                        game.ball.vx = 300;
                        game.ball.vy = 310;
                        game.ball2.vx = 300;
                        game.ball2.vy = 310;
                    }, 4000);
                }
                if(totxo.color=="#BBB")game.puntuacio=game.puntuacio+70;
                else if(totxo.color=="#F77")game.puntuacio=game.puntuacio+50;
                else if(totxo.color=="#47F")game.puntuacio=game.puntuacio+30;
                else if(totxo.color=="#8D1")game.puntuacio=game.puntuacio+20;
                else if(totxo.color=="#D30")game.puntuacio=game.puntuacio+15;

                else{game.puntuacio=game.puntuacio+10;}
                break;
            }
        }
    }

    // actualitzem la posició de la bola
    if(xoc){
        this.update(dtXoc);  // crida recursiva
    }
    else{
        this.x=trajectoria.p2.x;
        this.y=trajectoria.p2.y;
    }
};

Ball.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};

///////////////////////////////////    Totxo
function Totxo(x,y,w,h,color){
    this.x=x; this.y=y;         // posició, en píxels respecte el canvas
    this.w=w; this.h=h;         // mides
    this.color=color;
    this.tocat=false;
}

Totxo.prototype.draw = function(ctx){
    if (!(this.tocat)){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
};


//////////////////////////////////////////////////////////////////////
// Utilitats
var Utilitats={};
Utilitats.esTallen = function(p1,p2,p3,p4){
    function check(p1,p2,p3){
        return (p2.y-p1.y)*(p3.x-p1.x) < (p3.y-p1.y)*(p2.x-p1.x);
    }
    return check(p1,p2,p3) != check(p1,p2,p4) && check(p1,p3,p4) != check(p2,p3,p4);
}

// si retorna undefined és que no es tallen

Utilitats.puntInterseccio2 = function(p1,p2,p3,p4){
    var A1, B1, C1, A2, B2, C2, x, y, d;
    if(Utilitats.esTallen(p1,p2,p3,p4)){
        A1=p2.y-p1.y; B1=p1.x-p2.x; C1=p1.x*p2.y-p2.x*p1.y;
        A2=p4.y-p3.y; B2=p3.x-p4.x; C2=p3.x*p4.y-p4.x*p3.y;
        d=A1*B2-A2*B1;
        if(d!=0){
            x=(C1*B2-C2*B1)/d;
            y= (A1*C2-A2*C1)/d;
            return {x:x, y:y};
        }
    }
}

Utilitats.puntInterseccio=function (p1,p2,p3,p4){
    // converteix segment1 a la forma general de recta: Ax+By = C
    var a1 = p2.y - p1.y;
    var b1 = p1.x - p2.x;
    var c1 = a1 * p1.x + b1 * p1.y;

    // converteix segment2 a la forma general de recta: Ax+By = C
    var a2 = p4.y - p3.y;
    var b2 = p3.x - p4.x;
    var c2 = a2 * p3.x + b2 * p3.y;

    // calculem el punt intersecció
    var d = a1*b2 - a2*b1;

    // línies paral·leles quan d és 0
    if (d == 0) {
        return false;
    }
    else {
        var x = (b2*c1 - b1*c2) / d;
        var y = (a1*c2 - a2*c1) / d;
        var puntInterseccio={x:x, y:y};	// aquest punt pertany a les dues rectes
        if(Utilitats.contePunt(p1,p2,puntInterseccio) && Utilitats.contePunt(p3,p4,puntInterseccio) )
            return puntInterseccio;
    }
}

Utilitats.contePunt=function(p1,p2, punt){
    return (valorDinsInterval(p1.x, punt.x, p2.x) || valorDinsInterval(p1.y, punt.y, p2.y));

    // funció interna
    function valorDinsInterval(a, b, c) {
        // retorna cert si b està entre a i b, ambdos exclosos
        if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) { // no podem fer a==b amb valors reals!!
            return false;
        }
        return (a < b && b < c) || (c < b && b < a);
    }
}


Utilitats.distancia = function(p1,p2){
    return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
}

Utilitats.interseccioSegmentRectangle = function(seg,rect){  // seg={p1:{x:,y:},p2:{x:,y:}}
    // rect={p:{x:,y:},w:,h:}
    var pI, dI, pImin, dImin=Infinity, vora;
    // vora superior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x,y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="superior";
        }
    }
    // vora inferior
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y+rect.h},{x:rect.p.x, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="inferior";
        }
    }

    // vora esquerra
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x-1, y:rect.p.y+rect.h+1},{x:rect.p.x-1,y:rect.p.y-1});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="esquerra";
        }
    }
    // vora dreta
    pI=Utilitats.puntInterseccio(seg.p1, seg.p2,
        {x:rect.p.x+rect.w, y:rect.p.y}, {x:rect.p.x+rect.w, y:rect.p.y+rect.h});
    if(pI){
        dI=Utilitats.distancia(seg.p1, pI);
        if(dI<dImin){
            dImin=dI;
            pImin=pI;
            vora="dreta";
        }
    }

    if(vora){
        return {p:pImin,vora:vora}
    }
}
Utilitats.canviPos = function () {
    alert("canvipos");
    if(localStorage.getItem("punt1")>game.puntuacio&&game.puntuacio>localStorage.getItem("punt2")){
        alert("pene");
        localStorage.setItem("nom1",localStorage.getItem("nom2"));
        localStorage.setItem("punt3",localStorage.getItem("punt2"));
        localStorage.setItem("nom2",$("#Input").val());
        localStorage.setItem("punt2", game.puntuacio);
        return;
    }
    else if(localStorage.getItem("punt2")>game.puntuacio&&game.puntuacio>localStorage.getItem("punt3")){
        localStorage.setItem("nom3",$("#Input").val());
        localStorage.setItem("punt3", game.puntuacio);
        return;
    }
    else {

        // /nom3- nom2
        localStorage.setItem("nom3", localStorage.getItem("nom2"));
        localStorage.setItem("punt3", localStorage.getItem("punt2"));
        //nom2-nom1
        localStorage.setItem("nom2", localStorage.getItem("nom1"));
        localStorage.setItem("punt2", localStorage.getItem("punt1"));
        //nom1-temp
        localStorage.setItem("nom1", $("#Input").val());
        localStorage.setItem("punt1", game.puntuacio);
        return;
    }
}





