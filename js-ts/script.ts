interface Veiculo {
    cliente:string;
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function(){
    const $ = (query: string): HTMLInputElement | null => 
    document.querySelector(query);

    function calcTempo (mil : number){
        const hor = Math.floor(mil /  3600000)
        const min = Math.floor((mil % 3600000) / 60000);

        let valor = 0;

        if(min <= 30 ){
            valor = 0
        }else if (min > 30 && hor <=1){
            valor = 4
        }else if (hor > 1 && hor <= 2){
            valor = 6
        }else if(hor > 2 && hor <= 3){
            valor = 8
        }else if (hor > 3 && hor < 24){
            valor = 15
        }


        return `ficou ${hor}hrs ${min}m  e o valor a ser pago R$ ${valor},00`;


        
    }

    function patio(){

        function ler (): Veiculo[]{
            return localStorage.patio ? JSON.parse(localStorage.patio): []
        }

        function salvar (veiculos: Veiculo[]){
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function adicionar (veiculo: Veiculo, salva?:boolean){
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

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            if(salva) salvar([...ler(), veiculo])
        }

        function remover (placa:string){
            const {entrada, cliente, nome} = ler().find(veiculo => veiculo.placa === placa);

            const tempo =  calcTempo(
                    new Date().getTime() - new Date(entrada).getTime()
                ) ;

            if(!confirm (`O veiculo ${nome} do ${cliente}, ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter ((veiculo) => veiculo.placa !== placa ));

            render();
        }

        function render (){
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length){
                patio.forEach((veiculo)=> adicionar(veiculo))
            }
        }

        return {ler, adicionar, remover, salvar, render}
    }

    patio().render();
    $("#cadastrar")?.addEventListener("click", ()=>{
        const cliente = $("#cliente")?.value;
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        
        if(!nome || !placa){
            alert('Os campos nome e placa são obrigadorios');
            return
        }

        patio().adicionar({cliente, nome, placa, entrada: new Date().toISOString()}, true);
    })
})()