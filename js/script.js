let map;
let markers = []; // Array para armazenar os marcadores no mapa

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -23.55052, lng: -46.633308 }, // Centro inicial em São Paulo
        zoom: 12,
        mapTypeId: 'roadmap', // Ou 'satellite', 'hybrid', 'terrain'
        mapTypeControl: false,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    // Exemplo de pontos de descarte (substitua com seus dados reais)
    const pontosDescarte = [
        { lat: -23.5688, lng: -46.6475, nome: "Ponto A", info: "Recebe computadores e celulares" },
        { lat: -23.5300, lng: -46.6800, nome: "Ponto B", info: "Aceita todos os tipos de eletrônicos" },
        { lat: -23.5800, lng: -46.6000, nome: "Ponto C", info: "Foco em eletrodomésticos" }
        // Adicione mais pontos aqui
    ];

    pontosDescarte.forEach(ponto => {
        addMarker(ponto.lat, ponto.lng, ponto.nome, ponto.info);
    });

    // Tenta obter a localização do usuário ao carregar o mapa
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
                // Adicionar um marcador para a localização do usuário (opcional)
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Sua Localização",
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                });
            },
            () => {
                console.log("Erro ao obter a localização.");
                // Lidar com o erro (ex: mostrar mensagem ao usuário)
            }
        );
    } else {
        console.log("Geolocalização não suportada pelo navegador.");
    }
}

function addMarker(lat, lng, title, info) {
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: title
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${title}</h3><p>${info}</p>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

function searchAddress() {
    const address = document.getElementById("search-address").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            // Opcional: Adicionar um marcador na localização pesquisada
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                title: "Localização Encontrada"
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);
            },
            () => {
                alert('Não foi possível obter sua localização.');
            }
        );
    } else {
        alert('Seu navegador não suporta geolocalização.');
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
            alert('Agendamento realizado com sucesso! (Funcionalidade ainda não implementada no backend)');
            // Aqui você faria a chamada para o seu backend para salvar os dados
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