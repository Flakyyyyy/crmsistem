


let allClients  = [];   
let searchQuery = '';   


async function loadClients() {
  showLoader();
  try {
    allClients = await apiGetClients(searchQuery);
    renderTable(allClients, handleEditClient, handleDeleteClient);
  } catch (err) {
    console.error('Ошибка загрузки клиентов:', err);
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = `
      <tr>
        <td class="clients-table__td" colspan="6">
          <div class="empty-state">Не удалось загрузить данные. Проверьте, запущен ли сервер.</div>
        </td>
      </tr>
    `;
    document.getElementById('loader').classList.add('loader--hidden');
    document.getElementById('clientsTable').classList.add('clients-table--visible');
  }
}


function handleAddClient() {
  openClientModal({
    title: 'Новый клиент',
    clientData: null,
    clientId: null,
    onSave: async (id, data) => {
      await apiCreateClient(data);
      await loadClients();
    },
    onDelete: null,
  });
}


async function handleEditClient(clientId) {

  let clientData;
  try {
    clientData = await apiGetClient(clientId);
  } catch (err) {
    alert('Не удалось загрузить данные клиента');
    return;
  }

  openClientModal({
    title: 'Изменить данные',
    subtitle: `ID: ${clientId}`,
    clientData,
    clientId,
    onSave: async (id, data) => {
      await apiUpdateClient(id, data);
      await loadClients();
    },
    onDelete: handleDeleteClient,
  });
}


function handleDeleteClient(clientId) {
  openDeleteModal(clientId, async (id) => {
    await apiDeleteClient(id);
    await loadClients();
  });
}


let searchTimer = null;

document.getElementById('searchInput').addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(async () => {
    searchQuery = e.target.value.trim();
    await loadClients();
  }, 300);
});


document.getElementById('addClientBtn').addEventListener('click', handleAddClient);


initSortHandlers(() => {

  renderTable(allClients, handleEditClient, handleDeleteClient);
});


loadClients();
