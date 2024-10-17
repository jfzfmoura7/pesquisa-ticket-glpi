document.getElementById('dados-glpi').addEventListener('submit', 
    function(event){
        event.preventDefault();
        
        // Variáveis. Tudo aqui será usado para fazer a requisição na API

        const formData = new FormData(this);
        const login = formData.get('login');
        const password = formData.get('password')
        const apiUrl = 'http://localhost/apirest.php/'
        const initSessionUrl = `${apiUrl}initSession?login=${login}&password=${password}`;

        // Solicitação para a API. Vai usar o comando fetch para fazer essa requisição e vai dar um retorno 

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        fetch(initSessionUrl, {
            method: 'GET',
            headers: headers,
        })

        // Resultados requisição API. Se a API der um retorno positivo, encaminha para a próxima página, se não der um retorno positivo ou não der retorno, gera um alerta na tela

        .then(response => {
            if (!response.ok) {
                alert('Não foi possível fazer a requisição')
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