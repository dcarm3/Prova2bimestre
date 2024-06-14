const iconeFiltro = document.getElementById('iconeFiltro');
const modalFiltros = document.getElementById('modalFiltros');
const fecharModal = document.getElementById('fecharModal');
const contadorFiltros = document.getElementById('contadorFiltros');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

document.addEventListener('DOMContentLoaded', () => {
    function updateContadorFiltros() {
        let totalFiltros = 0;
        urlParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'busca' && value) {
                totalFiltros++;
            }
        });
        contadorFiltros.textContent = totalFiltros;
    }

    iconeFiltro.addEventListener('click', () => {
        modalFiltros.showModal();
    });

    fecharModal.addEventListener('click', () => {
        modalFiltros.close();
    });

    function setFiltros() {
        urlParams.forEach((value, key) => {
            const input = document.querySelector(`#formularioFiltros [name=${key}]`);
            if (input) {
                input.value = value;
            }
        });
    }

    function initFiltros() {
        setFiltros();
        updateContadorFiltros();
    }

    initFiltros();
});
