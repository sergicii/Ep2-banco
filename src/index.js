import CalcularPrestamo from "./prestamo.js";

const dataForm = document.querySelector('#agregar-prestamo');
const montoTotal = document.querySelector('#monto-total');
const montoIncial = document.querySelector('#monto-inicial');
const plazoMeses = document.querySelector('#meses');
const TEA = document.querySelector('#tasa-anual');
const btnEnviar = document.querySelector('#enviar');
const inputs = document.querySelectorAll('#agregar-prestamo input');
const root = document.querySelector('#root');
const resetForm = document.querySelector('#reset');
const textosCols = ['Parc', 'Amortización', 'Interés', 'Pago', 'Saldo',]

const LoadScript = () => document.addEventListener('DOMContentLoaded', Exec)
const Exec = () => {

    dataForm.reset();
    montoIncial.disabled = true;
    btnEnviar.disabled = true;
    inputs.forEach(el => el.addEventListener('input', validarCampos))
}

const validarCampos = function () {

    const inicialMax = montoTotal.value * 0.8;
    const inicialMin = montoTotal.value * 0.2;
    const vValueInput = this.value;

    if (this.id === 'monto-total') {
        if (!vValueInput || isNaN(vValueInput) || Number(vValueInput) <= 0) {

            montoTotal.classList.contains('border-success') ? montoTotal.classList.toggle('border-success') : "";
            montoTotal.placeholder = "Esta vacio";
            montoTotal.classList.add("btn-danger");
            montoIncial.disabled = true;
            montoIncial.value = "";
        }
        else {

            montoTotal.classList.contains('btn-danger') ? montoTotal.classList.toggle('btn-danger') : "";
            montoTotal.classList.add("border-success");
            montoTotal.value = parseInt(vValueInput);
            montoIncial.disabled = false;
            montoIncial.value = "";
            montoIncial.placeholder = "Monto Inicial";
        }
    }

    if (this.id === 'monto-inicial') {
        if (Number(vValueInput) <= inicialMax && Number(vValueInput) >= inicialMin) {

            montoIncial.classList.contains('btn-danger') ? montoIncial.classList.toggle('btn-danger') : "";
            montoIncial.classList.add('border-success');
            montoIncial.value = parseInt(vValueInput);
        }
        else {

            montoIncial.placeholder = "Esta vacio";
            montoIncial.classList.add('btn-danger');
        }
    }

    if (this.id === 'meses') {
        if (!vValueInput || isNaN(vValueInput) || Number(vValueInput) <= 0 || Number(vValueInput) > 100) {

            plazoMeses.classList.contains('border-success') ? plazoMeses.classList.toggle('border-success') : "";
            plazoMeses.placeholder = "Esta vacio";
            plazoMeses.classList.add("btn-danger");
        }
        else {

            plazoMeses.classList.contains('btn-danger') ? plazoMeses.classList.toggle('btn-danger') : "";
            plazoMeses.classList.add("border-success");
            plazoMeses.value = parseInt(vValueInput);
        }
    }

    if (this.id === 'tasa-anual') {
        if (!vValueInput || isNaN(vValueInput) || Number(vValueInput) <= 0 || Number(vValueInput) > 80) {

            TEA.classList.contains('border-success') ? TEA.classList.toggle('border-success') : "";
            TEA.placeholder = "Esta vacio";
            TEA.classList.add("btn-danger");
        }
        else {

            TEA.classList.contains('btn-danger') ? TEA.classList.toggle('btn-danger') : "";
            TEA.classList.add("border-success");
            TEA.value = parseInt(vValueInput);
        }
    }

    const copyInputs = [...inputs];
    const validating = copyInputs.some(el => el.classList.contains('btn-danger') || el.value == "")
    validating ? btnEnviar.disabled = true : btnEnviar.disabled = false;
}

const Calcular = e => {

    const containerAmort = document.querySelector('#amortizacion-container');
    containerAmort ? containerAmort.remove() : "";

    e.preventDefault();
    const nMontoTotal = parseFloat(montoTotal.value);
    const nMontoInicial = parseFloat(montoIncial.value);
    const nMeses = parseInt(plazoMeses.value);
    const nTEA = parseInt(TEA.value)
    const Amortizacion = new CalcularPrestamo(nMontoTotal, nMontoInicial, nMeses, nTEA);
    const container = document.createElement('section');

    container.classList = "container-xl text-center";
    container.id = "amortizacion-container"
    
    for (let i = 0; i <= Amortizacion.meses + 1; i++) {

        const divRow = document.createElement('div');
        divRow.classList.add('row');
        container.appendChild(divRow);

        textosCols.forEach(el => {

            const divCol = document.createElement('div');
            divCol.classList = 'col border border-info p-3'
            container.children[i].appendChild(divCol);

            if (i === 0) {

                divCol.textContent = el;
                container.children[0].appendChild(divCol);
            }
        })

        if (i === 1) {
            divRow.firstElementChild.textContent = 0;
            divRow.lastElementChild.textContent = Amortizacion.pagos.toLocaleString('en-US');
        }

        if (i >= 2) {

            Amortizacion.calcularSaldos();
            divRow.children[0].textContent = i - 1;
            divRow.children[1].textContent = Amortizacion.amortD.toLocaleString('en-US');
            divRow.children[2].textContent = Amortizacion.interesesD.toLocaleString('en-US');
            divRow.children[3].textContent = Amortizacion.calcularCuotaM().toLocaleString('en-US');

            if (Amortizacion.pagos <= 0) Amortizacion.pagos = 0;
            if (Amortizacion.interesesD <= 0) Amortizacion.interesesD = 0;
            divRow.children[4].textContent = Amortizacion.pagos.toLocaleString('en-US');
        }
    }
    const TotalPagos = Amortizacion.calcularCuotaM()*Amortizacion.meses
    const divTotal = document.createElement("div");
    const parag = document.createElement('p');
    const span = document.createElement('span');
    const parag2 = document.createElement('p');
    const span2 = document.createElement('span');
    const parag3 = document.createElement('p');
    const span3 = document.createElement('span');

    parag.textContent = 'Pago mensual: '
    parag.classList="bg-info py-3"
    span.textContent = Amortizacion.calcularCuotaM().toLocaleString('en-US');
    parag.appendChild(span)
    parag2.textContent = 'Total Interes: '
    parag2.classList="bg-info py-3"
    span2.textContent = Amortizacion.interescontables.toLocaleString('en-US');
    parag2.appendChild(span2)
    parag3.textContent = 'Total Pagos: '
    parag3.classList="bg-info py-3"
    span3.textContent = TotalPagos.toLocaleString('en-US');

    parag3.appendChild(span3)

    divTotal.classList="d-flex flex-column gap-3 "
    divTotal.style.width="300px"
    divTotal.appendChild(parag)
    divTotal.appendChild(parag2)
    divTotal.appendChild(parag3)
    root.appendChild(divTotal)
  /*  "<div class="row">
    <div class="col">
      <input type="text" class="form-control" placeholder="First name" aria-label="First name">
    </div>
    <div class="col">
      <input type="text" class="form-control" placeholder="Last name" aria-label="Last name">
    </div>
  </div>"*/
    root.appendChild(container)
}

const LimpiarHTML = e => {

    e.preventDefault();
    const containerAmort = document.querySelector('#amortizacion-container');

    if (containerAmort) {

        dataForm.reset();
        containerAmort.remove();
        btnEnviar.disabled = true;
    }
    else {

        dataForm.reset();
        btnEnviar.disabled = true;
    }

    inputs.forEach(el => {

        el.classList.contains('border-success') ? el.classList.remove('border-success') : null;
        el.classList.contains('btn-danger') ? el.classList.remove('btn-danger') : null;

        if (el.id == 'monto-total') el.placeholder = 'Monto Total';
        if (el.id == 'monto-inicial') el.placeholder = 'Monto Inicial';
        if (el.id == 'meses') el.placeholder = 'Meses';
        if (el.id == 'tasa-anual') el.placeholder = 'Tasa Anual';
    })
    montoIncial.disabled = true;
}

dataForm.addEventListener('submit', Calcular)
resetForm.addEventListener('click', LimpiarHTML)

LoadScript();