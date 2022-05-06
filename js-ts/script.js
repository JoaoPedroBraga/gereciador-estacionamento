(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const hor = Math.floor(mil / 3600000);
        const min = Math.floor((mil % 3600000) / 60000);
        let valor = 0;
        if (min <= 30) {
            valor = 0;
        }
        else if (min > 30 && hor <= 1) {
            valor = 4;
        }
        else if (hor > 1 && hor <= 2) {
            valor = 6;
        }
        else if (hor > 2 && hor <= 3) {
            valor = 8;
        }
        else if (hor > 3 && hor < 24) {
            valor = 15;
        }
        return `ficou ${hor}hrs ${min}m  e o valor a ser pago R$ ${valor},00`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="info">${veiculo.cliente}</td>
                <td class="info">${veiculo.nome}</td>
                <td class="info">${veiculo.placa}</td>
                <td class="info">${veiculo.entrada}</td>
                <td>
                <i class="fa-solid fa-circle-minus delete" data-placa = "${veiculo.placa}"></i>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { entrada, cliente, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} do ${cliente}, ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b, _c;
        const cliente = (_a = $("#cliente")) === null || _a === void 0 ? void 0 : _a.value;
        const nome = (_b = $("#nome")) === null || _b === void 0 ? void 0 : _b.value;
        const placa = (_c = $("#placa")) === null || _c === void 0 ? void 0 : _c.value;
        cliente.toLocaleUpperCase;
        nome.toLocaleUpperCase;
        placa.toLocaleUpperCase;
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigadorios');
            return;
        }
        patio().adicionar({ cliente, nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
