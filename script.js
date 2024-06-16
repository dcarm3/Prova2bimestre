document.addEventListener('DOMContentLoaded', () => {
    const iconeFiltro = document.getElementById('iconeFiltro');
    const modalFiltros = document.getElementById('modalFiltros');
    const fecharModal = document.getElementById('fecharModal');
    const contadorFiltros = document.getElementById('contadorFiltros');
    const campoBuscar = document.getElementById('campoBuscar');
    const botaoBuscar = document.getElementById('botaoBuscar');
    const tipoSelect = document.getElementById('tipo');
    const aplicarFiltros = document.getElementById('aplicarFiltros');
    const noticiasContainer = document.getElementById('noticias');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    async function initFiltrosENoticias() {
        await setFiltros();
        updateContadorFiltros();
        await buscarNoticias();
    }

    async function atualizarTipos() {
        try {
            const response = await fetch('http://servicodados.ibge.gov.br/api/v3/noticias/tipos');
            const tipos = await response.json();
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id;
                option.textContent = tipo.nome;
                tipoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao buscar tipos de notícias:', error);
        }
    }

    function updateContadorFiltros() {
        let totalFiltros = 0;
        urlParams.forEach((value, key) => {
            if (key !== 'page' && key !== 'busca' && value) {
                totalFiltros++;
            }
        });
        contadorFiltros.textContent = totalFiltros;
        contadorFiltros.style.color = totalFiltros > 0 ? 'black' : 'transparent';
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

    async function buscarNoticias() {
        try {
            const url = new URL('http://servicodados.ibge.gov.br/api/v3/noticias');
            url.searchParams.set('qtd', '10');
            urlParams.forEach((value, key) => {
                if (value) {
                    url.searchParams.set(key, value);
                }
            });
            const response = await fetch(url);
            const noticias = await response.json();
            exibirNoticias(noticias.items);
        } catch (error) {
            console.error('Erro ao buscar notícias:', error);
        }
    }

    function exibirNoticias(noticias) {
        noticiasContainer.innerHTML = '';
        noticias.forEach(noticia => {
            const noticiaElement = document.createElement('div');
            noticiaElement.innerHTML = `
                <h2>${noticia.titulo}</h2>
                <p>${noticia.introducao}</p>
                <a href="${noticia.link}">Leia mais</a>
            `;
            noticiasContainer.appendChild(noticiaElement);
        });
    }

    aplicarFiltros.addEventListener('click', (event) => {
        event.preventDefault();
        const url = new URL(window.location);
        const formData = new FormData(document.getElementById('formularioFiltros'));
        formData.forEach((value, key) => {
            if (value) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        url.searchParams.set('page', '1');
        window.history.pushState({}, '', url);
        initFiltrosENoticias();
        modalFiltros.close();
    });

    botaoBuscar.addEventListener('click', (event) => {
        event.preventDefault();
        const url = new URL(window.location);
        url.searchParams.set('busca', campoBuscar.value);
        if (campoBuscar.value === '') {
            url.searchParams.delete('busca');
        }
        url.searchParams.set('page', '1');
        window.history.pushState({}, '', url);
        initFiltrosENoticias();
    });

    atualizarTipos().then(() => {
        initFiltrosENoticias();
    });
});
