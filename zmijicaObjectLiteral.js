var igricaZmijica = {
    visinaTabele: 5,
    sirinaTabele: 15,
    zmija: [[1, 3], [1, 2], [1, 1]],
    trenutniSmer: 'desno',
    smer: "desno",
    pauzirano: false,
    tabela: [],
    food: [],
    poeni: 0,
    vreme: 0,
    zivoti: 3,
    praznoPolje: 0,
    zmijica: 1,
    hrana: 2,

    postaviZmijuNaTabelu: function () {
        for (var deoZmije = 0; deoZmije < this.zmija.length; deoZmije++) {
            this.tabela[this.zmija[deoZmije][0]][this.zmija[deoZmije][1]] = this.zmijica;
        }
        return this.tabela;
    },

    daLiJeUdarilaZid: function () {
        var pozicijaGlaveVertikalno = this.zmija[0][0];
        var pozicijaGlaveHorizontalno = this.zmija[0][1];
        return pozicijaGlaveHorizontalno < 0 || pozicijaGlaveHorizontalno > this.sirinaTabele - 1 || pozicijaGlaveVertikalno < 0 || pozicijaGlaveVertikalno > this.visinaTabele - 1;
    },

    kretanje: function (trenutniSmer, zmija) {
        var vertikala = zmija[0][0],
            horizontala = zmija[0][1];

        if (this.pauzirano == true) {
            return zmija;
        } else {
            if (trenutniSmer == "levo") {
                zmija.unshift([vertikala, horizontala - 1]);
            }
            if (trenutniSmer == "desno") {
                zmija.unshift([vertikala, horizontala + 1]);
            }
            if (trenutniSmer == "gore") {
                zmija.unshift([vertikala - 1, horizontala]);
            }
            if (trenutniSmer == "dole") {
                zmija.unshift([vertikala + 1, horizontala]);
            }
            zmija.pop();
            return zmija;
        }
    },

    daLiJePreslaPrekoSebe: function () {
        //bug - ne proverava poslednji element niza zato sto kada (daLiJePojela() == true) vraca true.
        for (var i = 3; i < this.zmija.length - 1; i++) {
            if (this.zmija[0].toString() == this.zmija[i].toString()) {
                console.log("presla preko sebe");
                return true;
            }
        }
    },

    pokreciIgru: function () {
        this.nacrtajIgru();
        this.tabela[this.food[0]][this.food[1]] = this.hrana;
        this.trenutniSmer = this.smer;
        if (this.daLiJePreslaPrekoSebe() || this.daLiJeUdarilaZid()) {
            this.smanjiZivote(pokreniZmiju, pokreniVreme);
            this.zmija = [[1, 3], [1, 2], [1, 1]];
            this.trenutniSmer = "desno";
            this.smer = "desno";
        } else {
            this.zmija = this.kretanje(this.trenutniSmer, this.zmija);
        }
        this.postaviZmijuNaTabelu();
        this.ispisNaStranici(this.tabela, 20);
        this.daLiJePojela();
        this.azurirajStatuse();
    },

    pokreciVreme: function () {
        if (!this.pauzirano) this.vreme++;
    },

    pokreniIgru: function () {
        this.nacrtajIgru();
        this.postaviHranu();
        var pokreniZmiju = setInterval(this.pokreciIgru.bind(this), 500);
        var pokreniVreme = setInterval(this.pokreciVreme.bind(this), 1000);
    },

    pauzirajIgru: function (event) {
        if (event.keyCode == 80) { // p
            if (!this.pauzirano) {
                this.pauzirano = true;
            } else if (this.pauzirano) {
                this.pauzirano = false;
            }
        }
    },

    prekiniIgru: function (pokreniZmiju, pokreniVreme) {
        document.getElementById("poruka").innerHTML = "Kraj igre! Ukupan broj osvojenih poena je: <span>" + this.poeni + "</span>";
        clearInterval(pokreniZmiju);
        clearInterval(pokreniVreme);
    },

    nacrtajIgru: function () {
        var platforma = [];
        for (var visina = 0; visina < this.visinaTabele; visina++) {
            platforma[visina] = [];
            for (var sirina = 0; sirina < this.sirinaTabele; sirina++) {
                platforma[visina][sirina] = this.praznoPolje;
            }
        }
        this.tabela = platforma;
        return platforma;
    },

    ispisNaStranici: function (niz, velicinaPolja) {
        if (!this.daLiJeUdarilaZid()) {
            var tabela = document.createElement("table");
            tabela.style.border = "solid 3px gray";
            for (var red = 0; red < niz.length; red++) {
                var redUKoloni = document.createElement("tr");
                for (var kolona = 0; kolona < niz[red].length; kolona++) {
                    var polje = document.createElement("td");
                    if (niz[red][kolona] == 0) polje.style.backgroundColor = "white";
                    if (niz[red][kolona] == 1) polje.style.backgroundColor = "black";
                    if (niz[red][kolona] == 2) polje.style.background = "yellow";
                    polje.style.width = velicinaPolja + "px";
                    polje.style.height = velicinaPolja + "px";
                    polje.style.border = "dotted 1px silver";
                    redUKoloni.appendChild(polje);
                }
                tabela.appendChild(redUKoloni);
            }
            document.getElementById("ispis").innerHTML = tabela.outerHTML;
        }
    },

    postaviHranu: function () {
        var hranaPozicijaLeft = Math.floor(Math.random() * this.tabela[0].length);
        var hranaPozicijaTop = Math.floor(Math.random() * this.tabela.length);
        for (var index in this.zmija) {
            while (this.zmija[index][0] == hranaPozicijaTop && this.zmija[index][1] == hranaPozicijaLeft) {
                this.postaviHranu();
            }
        }
        this.food = [hranaPozicijaTop, hranaPozicijaLeft];
    },

    daLiJePojela: function () {
        if (this.zmija[0][0] == this.food[0] && this.zmija[0][1] == this.food[1]) {
            this.povecajZmijicu();
            this.postaviHranu();
            this.poeni++;
            this.pustiZvukJednom("collect.wav");
            console.log("pojela");
            return true;
        }
        return false;
    },

    povecajZmijicu: function () {
        this.zmija.push(this.food);
    },

    promeniSmer: function (event) {
        if (event.keyCode == 37) {
            if (this.trenutniSmer == 'desno') {
                this.smer = 'desno';
            } else {
                this.smer = 'levo';
            }
        } else if (event.keyCode == 39) {
            if (this.trenutniSmer == 'levo') {
                this.smer = "levo";
            } else {
                this.smer = 'desno';
            }
        } else if (event.keyCode == 38) {
            if (this.trenutniSmer == 'dole') {
                this.smer = 'dole'
            } else {
                this.smer = 'gore';
            }
        } else if (event.keyCode == 40) {
            if (this.trenutniSmer == 'gore') {
                this.smer = "gore";
            } else {
                this.smer = 'dole';
            }
        }
    },

    smanjiZivote: function (int1, int2) {
        if (this.zivoti == 1) {
            this.prekiniIgru(int1, int2);
        } else {
            this.zivoti--;
            this.azurirajStatuse();
        }
    },

    azurirajStatuse: function () {
        var statusi = ">> Poeni: <span>" + this.poeni + "</span> << || >> Vreme: <span>" + this.vreme + "</span> sec << || >> Zivoti: <span>" + this.zivoti + "</span> <<";
        document.getElementById("status").innerHTML = statusi;
    },

    pustiZvukJednom: function (parametar) {
        oneSound = new Audio(parametar);
        oneSound.play();
    }

};

document.body.addEventListener("keydown", igricaZmijica.promeniSmer);
document.body.addEventListener("keydown", igricaZmijica.pauzirajIgru);
//igricaZmijica.nacrtajIgru();
igricaZmijica.pokreniIgru();