let map;
let markers = [];

document.addEventListener('DOMContentLoaded', function () {
    initMap();
});

function initMap() {
    // Coordenadas aproximadas do centro de Maringá para visualização inicial
    const maringaCentro = [-23.4251, -51.9386]; // Ajustado para um centro mais genérico de Maringá

    map = L.map('map').setView(maringaCentro, 13);

    // Adiciona o mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Pontos de descarte - Baterias, Pilhas, Sucatas Eletrônicas em Maringá
    // OBS: Pontos com lat/lng null precisam ter suas coordenadas encontradas e preenchidas.
    const pontosDescarte = [
        {
            lat: -23.42385, lng: -51.93946,
            nome: "Prefeitura do Município de Maringá",
            info: "Sucatas eletrônicas. Endereço: Avenida XV de Novembro, 701, Maringá"
        },
        {
            lat: -23.41823, lng: -51.93063,
            nome: "Supermercado Angeloni – Armazém",
            info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Av. Adv. Horácio Raccanello Filho, 5120, Maringá"
        },
        {
            lat: -23.42223, lng: -51.93287, // Coordenada aproximada
            nome: "Estação de Reciclagem Maringá Park",
            info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida São Paulo, 1099, Maringá"
        },
        {
            lat: -23.42042, lng: -51.93540, // Coordenada aproximada
            nome: "Casas Bahia – Centro",
            info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida Brasil, 3414, Maringá"
        },
        {
            lat: -23.41851, lng: -51.94672, // Coordenada aproximada
            nome: "Atacadão Maringá",
            info: "Pilhas, Baterias. Endereço: Rua Fernão Dias, 300, Maringá"
        },
   
        {
            lat: -23.40814, lng: -51.95598, // COORDENADAS NECESSÁRIAS
            nome: "Tiro de Guerra de Maringá",
            info: "Sucatas eletrônicas. Endereço: Avenida Mandacaru, 730, Maringá"
        },
        {
            lat: -23.42478, lng: -51.90738, // COORDENADAS NECESSÁRIAS
            nome: "4º Batalhão de Polícia Militar",
            info: "Sucatas eletrônicas. Endereço: Rua Mitsuzo Taguchi, 99, Maringá"
        },
        {
            lat: -23.42772, lng: -51.93788, // COORDENADAS NECESSÁRIAS
            nome: "Câmara Municipal de Maringá",
            info: "Sucatas eletrônicas. Endereço: Avenida Papa João XXIII, 239, Maringá"
        },
        {
            lat: -23.45319, lng: -51.99911, // COORDENADAS NECESSÁRIAS
            nome: "Coopercanção",
            info: "Sucatas eletrônicas. Endereço: Avenida Vereador João Batista Sanches, 1234, Maringá"
        },
        {
            lat: -23.41628, lng: -51.94096, // COORDENADAS NECESSÁRIAS
            nome: "Faculdade Maringá",
            info: "Sucatas eletrônicas. Endereço: Avenida Prudente de Morais, 815, Maringá"
        },
        {
            lat: -23.41531, lng: -51.99315, // COORDENADAS NECESSÁRIAS
            nome: "UNIFAMMA - Fd. Metropolitana de Maringá",
            info: "Sucatas eletrônicas. Endereço: Av. Virgílio Manília, 22.260 - Jardim Ouro Cola, Maringá "
        },
        {
            lat: -23.42507, lng: -51.95745, // COORDENADAS NECESSÁRIAS
            nome: "SESI Maringá",
            info: "Sucatas eletrônicas. Endereço: Rua Antônio Carniel, 499, Maringá"
        },
        {
            lat: -23.42056, lng: -51.93428, // COORDENADAS NECESSÁRIAS
            nome: "Casas Bahia – Zona 01",
            info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida Brasil, 3300, Maringá"
        },
        {
            lat: -23.42385, lng: -51.95866, // COORDENADAS NECESSÁRIAS
            nome: "Banco Sicoob Maringá (Av. Brasil)",
            info: "Pilhas, Baterias. Endereço: Avenida Brasil, 2309, Maringá"
        }
    ];

    pontosDescarte.forEach(ponto => {
        // Adiciona o marcador apenas se lat e lng não forem null
        if (ponto.lat !== null && ponto.lng !== null) {
            addMarker(ponto.lat, ponto.lng, ponto.nome, ponto.info);
        }
    });

    // Tenta pegar a localização do usuário ao abrir
    getCurrentLocation();
}

function addMarker(lat, lng, title, info) {
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<h3>${title}</h3><p>${info}</p>`);
    markers.push(marker);
}

function searchAddress() {
    const address = document.getElementById("search-address").value;
    if (!address) {
        alert("Digite um endereço.");
        return;
    }

    // Usando Nominatim para geocodificação
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                map.setView([lat, lon], 15); // Zoom maior ao encontrar endereço

                // Limpa marcadores anteriores de busca para não poluir o mapa
                markers.forEach(marker => {
                    if (marker.getPopup().getContent().includes("Localização Encontrada")) {
                        map.removeLayer(marker);
                    }
                });
                markers = markers.filter(marker => !marker.getPopup().getContent().includes("Localização Encontrada"));


                const marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup(`<h3>Localização Encontrada</h3><p>${data[0].display_name}</p>`).openPopup();
                markers.push(marker);
            } else {
                alert("Endereço não encontrado.");
            }
        })
        .catch(() => {
            alert("Erro ao buscar o endereço. Verifique sua conexão ou tente novamente.");
        });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.setView([lat, lng], 15); // Zoom maior na localização do usuário

                const userIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', // Exemplo de ícone azul
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41]
                });
                
                // Limpa marcador anterior de "Sua Localização" se houver
                markers.forEach(marker => {
                    if (marker.getPopup().getContent().includes("Sua Localização")) {
                        map.removeLayer(marker);
                    }
                });
                markers = markers.filter(marker => !marker.getPopup().getContent().includes("Sua Localização"));

                const marker = L.marker([lat, lng], { icon: userIcon }).addTo(map); // Usando o ícone personalizado

                marker.bindPopup("<h3>Sua Localização</h3>").openPopup();
                markers.push(marker);
            },
            (error) => {
                console.error("Erro ao obter localização: ", error);
                // Não mostrar alerta se o usuário negou, apenas se houve outro erro.
                if (error.code !== error.PERMISSION_DENIED) {
                    alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
                } else {
                    // O usuário negou. Pode-se centralizar no default de Maringá ou não fazer nada.
                    // map.setView(maringaCentro, 13); // Opcional: recentralizar se permissão negada.
                }
            },
            { // Opções para getCurrentPosition
                enableHighAccuracy: true,
                timeout: 10000, // 10 segundos
                maximumAge: 0 // Não usar cache de posição
            }
        );
    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
}

// Agendamento (apenas um esqueleto - a lógica real dependerá do backend)
document.addEventListener('DOMContentLoaded', () => {
    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', function(event) {
            event.preventDefault(); // Evita o envio padrão do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const tipoResiduo = document.getElementById('tipo-residuo').value;
            const endereco = document.getElementById('endereco').value;
            const dataColeta = document.getElementById('data-coleta').value;
            const observacoes = document.getElementById('observacoes').value;

            console.log("Dados do agendamento:", { nome, email, tipoResiduo, endereco, dataColeta, observacoes });
            alert('Agendamento realizado com sucesso! )');
        });
    }

    // Calculadora de Impacto Ambiental (lógica básica)
    const btnCalcularImpacto = document.querySelector('#calculadora-impacto button');
    const resultadoImpactoDiv = document.getElementById('resultado-impacto');

    if (btnCalcularImpacto && resultadoImpactoDiv) {
        btnCalcularImpacto.addEventListener('click', calcularImpacto);
    }

    function calcularImpacto() {
        const qtdComputadores = parseInt(document.getElementById('qtd-computadores').value) || 0;
        const qtdCelulares = parseInt(document.getElementById('qtd-celulares').value) || 0;
        const qtdTelevisoes = parseInt(document.getElementById('qtd-televisoes').value) || 0;

        // Simulação de fatores de impacto (você precisará de dados mais precisos)
        const impactoComputador = 20; // Ex: kg de CO2 evitado
        const impactoCelular = 10;
        const impactoTelevisao = 25;

        const impactoTotal = (qtdComputadores * impactoComputador) +
                             (qtdCelulares * impactoCelular) +
                             (qtdTelevisoes * impactoTelevisao);

        resultadoImpactoDiv.textContent = `Seu descarte evitou aproximadamente ${impactoTotal} kg de CO2 (estimativa). Obrigado!`;
    }
});

// Garante que o mapa seja inicializado após o carregamento da página
window.onload = function() {
    if (typeof initMap === 'function') {
        initMap();
    }
};