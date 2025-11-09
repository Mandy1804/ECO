let map; 
let markers = []; 

function initMap() {
    if (!document.getElementById('map')) return;

    const maringaCentro = [-23.4251, -51.9386];
    map = L.map('map').setView(maringaCentro, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const pontosDescarte = [
        { lat: -23.42385, lng: -51.93946, nome: "Prefeitura do Município de Maringá", info: "Sucatas eletrônicas. Endereço: Avenida XV de Novembro, 701, Maringá" },
        { lat: -23.41823, lng: -51.93063, nome: "Supermercado Angeloni – Armazém", info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Av. Adv. Horácio Raccanello Filho, 5120, Maringá" },
        { lat: -23.42223, lng: -51.93287, nome: "Estação de Reciclagem Maringá Park", info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida São Paulo, 1099, Maringá" },
        { lat: -23.42042, lng: -51.93540, nome: "Casas Bahia – Centro", info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida Brasil, 3414, Maringá" },
        { lat: -23.41851, lng: -51.94672, nome: "Atacadão Maringá", info: "Pilhas, Baterias. Endereço: Rua Fernão Dias, 300, Maringá" },
        { lat: -23.40814, lng: -51.95598, nome: "Tiro de Guerra de Maringá", info: "Sucatas eletrônicas. Endereço: Avenida Mandacaru, 730, Maringá" },
        { lat: -23.42478, lng: -51.90738, nome: "4º Batalhão de Polícia Militar", info: "Sucatas eletrônicas. Endereço: Rua Mitsuzo Taguchi, 99, Maringá" },
        { lat: -23.42772, lng: -51.93788, nome: "Câmara Municipal de Maringá", info: "Sucatas eletrônicas. Endereço: Avenida Papa João XXIII, 239, Maringá" },
        { lat: -23.45319, lng: -51.99911, nome: "Coopercanção", info: "Sucatas eletrônicas. Endereço: Avenida Vereador João Batista Sanches, 1234, Maringá" },
        { lat: -23.41628, lng: -51.94096, nome: "Faculdade Maringá", info: "Sucatas eletrônicas. Endereço: Avenida Prudente de Morais, 815, Maringá" },
        { lat: -23.41531, lng: -51.99315, nome: "UNIFAMMA - Fd. Metropolitana de Maringá", info: "Sucatas eletrônicas. Endereço: Av. Virgílio Manília, 22.260 - Jardim Ouro Cola, Maringá " },
        { lat: -23.42507, lng: -51.95745, nome: "SESI Maringá", info: "Sucatas eletrônicas. Endereço: Rua Antônio Carniel, 499, Maringá" },
        { lat: -23.42056, lng: -51.93428, nome: "Casas Bahia – Zona 01", info: "Sucatas eletrônicas, Pilhas, Baterias. Endereço: Avenida Brasil, 3300, Maringá" },
        { lat: -23.42385, lng: -51.95866, nome: "Banco Sicoob Maringá (Av. Brasil)", info: "Pilhas, Baterias. Endereço: Avenida Brasil, 2309, Maringá" }
    ];

    pontosDescarte.forEach(ponto => {
        if (ponto.lat !== null && ponto.lng !== null) {
            addMarker(ponto.lat, ponto.lng, ponto.nome, ponto.info);
        }
    });
    getCurrentLocation();
}

function addMarker(lat, lng, title, info) {
    if (!map) return;
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<h3>${title}</h3><p>${info}</p>`);
    markers.push(marker);
}

function searchAddress() {
    if (!map) return;
    const address = document.getElementById("search-address").value;
    if (!address) {
        alert("Digite um endereço.");
        return;
    }
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=br&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                map.setView([lat, lon], 15);
                markers = markers.filter(marker => {
                    if (marker.getPopup().getContent().includes("Localização Encontrada")) {
                        map.removeLayer(marker);
                        return false;
                    }
                    return true;
                });
                const newMarker = L.marker([lat, lon]).addTo(map);
                newMarker.bindPopup(`<h3>Localização Encontrada</h3><p>${data[0].display_name}</p>`).openPopup();
                markers.push(newMarker);
            } else {
                alert("Endereço não encontrado.");
            }
        })
        .catch(() => {
            alert("Erro ao buscar o endereço. Verifique sua conexão ou tente novamente.");
        });
}

function getCurrentLocation() {
    if (!map) return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.setView([lat, lng], 15);
                const userIcon = L.icon({
                    iconUrl: "../ECO/imagem/red.png", // Verifique este caminho
                    iconSize: [35, 35],
                    iconAnchor: [17, 35],
                    popupAnchor: [0, -35],
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    shadowSize: [41, 41]
                });
                markers = markers.filter(marker => {
                     if (marker.getPopup().getContent().includes("Sua Localização")) {
                         map.removeLayer(marker);
                         return false;
                     }
                    return true;
                });
                const newMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
                newMarker.bindPopup("<h3>Sua Localização</h3>").openPopup();
                markers.push(newMarker);
            },
            (error) => {
                console.error("Erro ao obter localização: ", error);
                if (error.code !== error.PERMISSION_DENIED) {
                    // Opcional: não alertar, apenas logar o erro ou centralizar no mapa padrão.
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        // alert("Seu navegador não suporta geolocalização.");
    }
}


window.calcularImpacto = function() {
    const qtdComputadores = parseInt(document.getElementById('qtd-computadores').value) || 0;
    const qtdCelulares = parseInt(document.getElementById('qtd-celulares').value) || 0;
    const qtdTelevisoes = parseInt(document.getElementById('qtd-televisoes').value) || 0;
    const resultadoImpactoDiv = document.getElementById('resultado-impacto');


    const impactoComputador = 20; 
    const impactoCelular = 10;
    const impactoTelevisao = 25;

    const impactoTotal = (qtdComputadores * impactoComputador) +
                            (qtdCelulares * impactoCelular) +
                            (qtdTelevisoes * impactoTelevisao);

    if (resultadoImpactoDiv) {
        resultadoImpactoDiv.innerHTML = `Seu descarte consciente pode evitar a emissão de aproximadamente ${impactoTotal} kg de CO2 e conservar recursos naturais. Obrigado!`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu'); 
    const body = document.body;

    // Lógica do Menu Mobile
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            const isActive = menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            body.classList.toggle('no-scroll', isActive);
        });

        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    body.classList.remove('no-scroll');
                }
            });
        });
    }
    
// --- LÓGICA DE ENVIO DO FORMULÁRIO DE AGENDAMENTO (CÓDIGO CORRIGIDO) ---
const formAgendamento = document.getElementById('form-agendamento');
if (formAgendamento) {
    formAgendamento.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio tradicional do formulário
        
        // 1. Coleta dos dados
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const tipoResiduo = document.getElementById('tipo-residuo').value;
        const endereco = document.getElementById('endereco').value;
        const dataColeta = document.getElementById('data-coleta').value;
        const observacoes = document.getElementById('observacoes').value;

        if (!nome || !email || !tipoResiduo || !endereco || !dataColeta) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // 2. Monta o objeto JSON de forma PLANA para o Spring Boot
        const dadosAgendamento = {
            nome: nome,
            email: email,
            telefone: telefone,
            tipoResiduo: tipoResiduo,
            endereco: endereco,
            dataColeta: dataColeta, // Formato AAAA-MM-DD
            observacoes: observacoes
        };

        // 3. Envio dos dados para o Back-end (API REST na porta 8080)
        fetch('http://localhost:8080/api/agendamentos', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAgendamento) // Converte o objeto JS para JSON
        })
        .then(response => {
            if (response.ok) { 
                return response.json();
            }
            // Tenta ler o erro do Back-end
            return response.text().then(errorText => {
                throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
            });
        })
        .then(data => {
            console.log('Agendamento salvo com sucesso. ID:', data.id);
            alert('✅ Agendamento solicitado com sucesso! Seu ID de agendamento é: ' + data.id);
            formAgendamento.reset(); // Limpa o formulário após o sucesso
        })
        .catch(error => {
            console.error('Erro ao agendar:', error);
            alert('❌ Ocorreu um erro ao tentar agendar. Certifique-se de que o Back-end Spring Boot está rodando.');
        });
    });
}

    // Inicialização do Mapa
    if (document.getElementById('map')) {
        initMap();
    }
});