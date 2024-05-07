document.getElementById('dados-glpi').addEventListener('submit', 
    function(event){
        event.preventDefault();
        
        // Variáveis

        const formData = new FormData(this);
        const login = formData.get('login');
        const password = formData.get('password')
        const appToken = 'xrRDRKJcXpZQqJnSSWZZGSz4RMxSbcI3RY5ytUfV';
        const apiUrl = 'http://54.174.195.170//glpi/apirest.php/'
        const authorization = 'PaUup1PQE08T1hmOlwOb2oEbWJ6sl00LC3c3ZoaK' 
        const initSessionUrl = `${apiUrl}initSession?login=${login}&password=${password}`;

        // Solicitação API

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Basic ${authorization}`);
        headers.append('App-Token', appToken);
        fetch(initSessionUrl, {
            method: 'GET',
            headers: headers
        })

        // Resultados requisição API

        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao realizar a busca');
            }
            return response.json();
        })
        .then(data => {
            window.location.href = `./pesquisaTicket/pesquisaTicket.html?token=${data.session_token}`;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }
)