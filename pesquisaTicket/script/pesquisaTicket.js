document.getElementById('pesquisaTicket').addEventListener('submit',
  function (event) {
    event.preventDefault();

    // Variáveis, função & Teste

    const formData = new FormData(this); 
    const ticketId = formData.get('id');
    const apiUrl = 'http://localhost/apirest.php/';
    const itemTypeUrl = `${apiUrl}Ticket/${ticketId}?expand_dropdowns`;
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('token');
    const killSessionUrl = `${apiUrl}killSession`;
    const usuariosMap = {
      2: 'glpi',
      3: 'post-only',
      4: 'tech',
      5: 'normal'
    };

    // Função para converter o ID do usuário em nome
    function nomeUsuario(idUsuario) {
      return usuariosMap[idUsuario] || 'Usuário desconhecido';
    }

    console.log(sessionToken)
    console.log(itemTypeUrl)

    // Vai pegar o número que vai retornar na API e transformar em um status equivalente ao do sistema

    function Status(status) {
      switch (status) {
        case 1:
          return 'Novo';
        case 2:
          return 'Em Atendimento';
        case 3:
          return 'Planejado';
        case 4:
          return 'Pendente';
        case 5:
          return 'Solucionado';
        case 6:
          return 'Fechado'
        default:
          return 'Desconhecido';
      }
    }

    // Vai transformar a data em dd/mm/yyyy hh:mm:ss, ao invés do formato que retorna originalmente, que é yyyy-mm-dd hh:mm:ss

    function formatarData(dataOriginal) {
      const partesData = dataOriginal.split(/[- ]/); // Divide a data em partes (ano, mês, dia)
      const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]} ${partesData[3]}`; // Formata no formato dd/mm/yyyy
      return dataFormatada;
    }

    // Requisição API

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Session-Token', `${sessionToken}`);

    fetch(itemTypeUrl, {
      method: 'GET',
      headers: headers
    })

      // Resultados requisição API

      .then(response => {
        if (!response.ok) {
          alert('Erro ao realizar busca')
          throw new Error('Erro ao realizar a busca');
        }
        return response.json();
      })

      .then(data => {
        const dados = JSON.stringify(data); // Vai transformar o JSON em uma string que pode ser interpretado pelo JS
        console.log(dados);

        const tableBody = document.querySelector('#tabelaTickets tbody');
        while (tableBody.firstChild) {
          tableBody.removeChild(tableBody.firstChild);
        } // Limpar conteúdo antigo da tabela

        if (Array.isArray(data)) { // Se for feita a pesquisa de mais de um ticket de uma vez, essa função irá formatar todos os tickets de forma igual
          data.forEach(ticket => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = ticket.id;
            row.insertCell().textContent = ticket.name;
            row.insertCell().textContent = formatarData(ticket.date_mod);
            row.insertCell().textContent = formatarData(ticket.date);
            row.insertCell().textContent = Status(ticket.status);
            row.insertCell().textContent = nomeUsuario(ticket.users_id_recipient);
            row.insertCell().textContent = nomeUsuario(ticket.users_id_lastupdater);
            row.insertCell().textContent = ticket.entities_id;
            const limpezaTela = document.querySelector('#tabelaTickets tbody')
          })
        }

        else { // Se retornar apenas um ticket, vai formatá-lo da ofrma certa
          const row = tableBody.insertRow();
          row.insertCell().textContent = data.id;
          row.insertCell().textContent = data.name;
          row.insertCell().textContent = formatarData(data.date_mod);
          row.insertCell().textContent = formatarData(data.date);
          row.insertCell().textContent = Status(data.status);
          row.insertCell().textContent = data.users_id_recipient;
          row.insertCell().textContent = data.users_id_lastupdater;
          row.insertCell().textContent = data.entities_id;
        }
      })

    const botaoKillSession = document.getElementById('logout') // Vai matar a sessão e vai retornar para a página de login
    botaoKillSession.addEventListener('click', function () {
      fetch(killSessionUrl, {
        method: 'GET',
        headers: headers
      })

      .then(response => { 
        if (response.ok) {
          alert('Sessão finalizada. Voltando para a página inicial')
          console.log('Sessão finalizada')
          window.location.href = '../index.html' 
        }
        else {
          alert('Erro ao matar sessão') 
        }
      })
    })
  }
)