
class Reclamacao {
    constructor() {
        this.id = 0
        this.arrayReclamacao = []
        this.editId = null
        
    }

    salvarComEnter() {
        document.getElementById("quantidade").addEventListener("keyup", e => {
            if (e.key === "Enter") {
                this.salvar()
                document.getElementById("reclamacao").focus()
            }
        }, { once: true })

    }

    salvar() {
        let reclamacao = this.lerDados()
        if (this.validaDados(reclamacao)) {
            if (this.editId == null) {
                this.adicionar(reclamacao)
            } else {
                this.atualizar(this.editId, reclamacao)
            }
        }
        this.listaTabela()
        attGrafico()
        this.cancelar()
    }

    listaTabela() {
        let tbody = document.querySelector(".tbody")
        tbody.innerText = ""
        for (let i = 0; i < this.arrayReclamacao.length; i++) {
            let tr = tbody.insertRow()
            let tdTipo = tr.insertCell()
            let tdQuant = tr.insertCell()
            let tdAcao = tr.insertCell()

            tdTipo.innerText = this.arrayReclamacao[i].tipo.charAt(0).toUpperCase() + this.arrayReclamacao[i].tipo.slice(1)
            tdQuant.innerText = this.arrayReclamacao[i].quantidade

            let imgEdit = document.createElement("img")
            let imgDelete = document.createElement("img")
            imgDelete.src = "../icones/deleteIcon.svg"
            imgDelete.setAttribute("onclick", "reclamacao.deletar(" + this.arrayReclamacao[i].id + ")")
            imgEdit.src = "../icones/editIcon.svg"
            imgEdit.setAttribute("onclick", "reclamacao.preparaEdicao(" + JSON.stringify(this.arrayReclamacao[i]) + ")")
            imgDelete.classList.add("deletar")
            tdAcao.appendChild(imgEdit)
            tdAcao.appendChild(imgDelete)
        }
    }

    adicionar(reclamacao) {
        this.arrayReclamacao.push(reclamacao)
        this.id++
    }

    lerDados() {
        let reclamacao = {}
        reclamacao.id = this.id
        reclamacao.tipo = document.getElementById('reclamacao').value
        reclamacao.quantidade = document.getElementById('quantidade').value
        return reclamacao
    }

    validaDados(reclamacao) {
        let msg = ""
        if (reclamacao.tipo == "") {
            msg += "preencha o tipo \n"
        }
        if (reclamacao.quantidade == "") {
            msg += "preencha a quantidade \n"
        }
        if (msg != "") {
            alert(msg)
            return false
        }
        return true
    }

    cancelar() {
        document.querySelector(".salvar").innerText = "Adicionar"
        document.getElementById("reclamacao").value = ""
        document.getElementById("quantidade").value = ""
        this.editId = null
    }

    deletar(id) {
        let tbody = document.querySelector(".tbody")
        for (let i = 0; i < this.arrayReclamacao.length; i++) {
            if (this.arrayReclamacao[i].id == id) {
                this.arrayReclamacao.splice(i, 1)
                tbody.deleteRow(i)
            }
        }
        attGrafico()
    }

    preparaEdicao(dados) {
        this.editId = dados.id
        document.getElementById("reclamacao").value = dados.tipo
        document.getElementById("quantidade").value = dados.quantidade

        document.querySelector(".salvar").innerText = "Atualizar"
        document.getElementById("reclamacao").focus()
    }

    atualizar(id, reclamacao) {
        for (let i = 0; i < this.arrayReclamacao.length; i++) {
            if (this.arrayReclamacao[i].id == id) {
                this.arrayReclamacao[i].tipo = reclamacao.tipo
                this.arrayReclamacao[i].quantidade = reclamacao.quantidade
            }
        }
    }
}

var reclamacao = new Reclamacao();

//-----------------

const data = {
    labels: reclamacao.arrayReclamacao.map(el=>el.tipo),
    datasets: [{
        label: reclamacao.arrayReclamacao.map(el =>el.tipo),
        data: reclamacao.arrayReclamacao.map(el=>el.quantidade),
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(161, 99, 223)',
            'rgb(255,255,0)',
            '#1AF938',
            '#F91A1A'
        ],
        hoverOffset: 4
    }]
};

const config = {
    type: 'doughnut',
    data: data,
    options: {
        parsing: {
            key: 'quantidade'
        },
        plugins: {
            tooltip: {
                yAlign: 'bottom',
                usePointStyle: true,
                callbacks: {
                    title: function(context) {
                        return reclamacao.arrayReclamacao.map(el=>el.tipo)[context[0].dataIndex]
                    },
                    beforeBody: function(context) {
                        return "Quantidade"
                    },
                    labelPointStyle: function(context) {
                        return {
                            pointStyle: 'circle',
                            rotation: 0
                        }
                    }
                }
            },
            datalabels: {
                formatter: (value) => {
                    const datapoints = reclamacao.arrayReclamacao.map(el=>el.quantidade);
                    const sum =(total, el)=>parseInt(total) +parseInt(el)
                    const totalsum = datapoints.reduce(sum)
                    const percentage = (value / totalsum * 100).toFixed(1)
                    return percentage + "%"
                    
                },
                color: 'Black',
                borderRadius: 100,
                padding: 5,
                backgroundColor: '#FFFFFF99',
            }, 
        }
    },
    plugins: [ChartDataLabels]
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config
);

const attGrafico = ()=>{
    myChart.data.datasets[0].data = reclamacao.arrayReclamacao.map(el=>el.quantidade)
    myChart.update()
}