document.getElementById('pesquisaTicket').addEventListener('submit',
  function (event) {
    event.preventDefault();

    // Variáveis, função & Teste

    const formData = new FormData(this);
    const ticketId = formData.get('id');
    const appToken = 'xrRDRKJcXpZQqJnSSWZZGSz4RMxSbcI3RY5ytUfV';
    const apiUrl = 'http://54.174.195.170//glpi/apirest.php/';
    const itemTypeUrl = `${apiUrl}Ticket/${ticketId}?expand_dropdowns`;
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get('token');
    const killSessionUrl = `${apiUrl}killSession`;

    console.log(sessionToken)
    console.log(itemTypeUrl)

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

    function formatarData(dataOriginal) {
      const partesData = dataOriginal.split(/[- ]/); // Divide a data em partes (ano, mês, dia)
      const dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]} ${partesData[3]}`; // Formata no formato dd/mm/yyyy
      return dataFormatada;
    }

    // Requisição API

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Session-Token', `${sessionToken}`);
    headers.append('App-Token', appToken);

    fetch(itemTypeUrl, {
      method: 'GET',
      headers: headers
    })

      // Resultados requisição API

      .then(response => {
        if (!response.ok) {
          // killSession();
          // alert(erroAutenicacao);
          throw new Error('Erro ao realizar a busca');
        }
        return response.json();
      })

      .then(data => {
        const dados = JSON.stringify(data);
        console.log(dados);

        const tableBody = document.querySelector('#tabelaTickets tbody');
        tableBody.innerHTML = null; // Limpar conteúdo antigo da tabela
        if (Array.isArray(data)) {
          data.forEach(ticket => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = ticket.id;
            row.insertCell().textContent = ticket.name;
            row.insertCell().textContent = formatarData(ticket.date_mod);
            row.insertCell().textContent = formatarData(ticket.date);
            row.insertCell().textContent = Status(ticket.status);
            row.insertCell().textContent = ticket.users_id_recipient;
            row.insertCell().textContent = ticket.users_id_lastupdater;
            row.insertCell().textContent = ticket.entities_id;
            const limpezaTela = document.querySelector('#tabelaTickets tbody')
          })
        }

        else {
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

    const botaoKillSession = document.getElementById('logout')
    botaoKillSession.addEventListener('click', function () {
      fetch(killSessionUrl, {
        method: 'GET',
        headers: headers
      })

        .then(response => {
          if (!response.ok) {
            console.log('Erro ao matar sessão')
          }
          else {
            alert('Sessão finalizada. Voltando para a página inicial')
            console.log('Sessão finalizada')
            window.location.href = '../index.html'
          }
        })
    })
  }
)

