
const sortState = {
  col: 'id',
  dir: 'asc', 
};


const CONTACT_ICONS = {
  'Телефон': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="#9873FF" d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
  </svg>`,
  'Email': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="#9873FF" d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.577L16 11.801V4.697l-5.803 3.556z"/>
  </svg>`,
  'Facebook': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="#9873FF" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
  </svg>`,
  'VK': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill="#9873FF" d="M15.684 0H.316C.142 0 0 .142 0 .316v15.368c0 .174.142.316.316.316h15.368c.174 0 .316-.142.316-.316V.316C16 .142 15.858 0 15.684 0zm-2.718 11.027h-1.316c-.498 0-.651-.395-1.543-1.291-.783-.757-1.13-.857-1.323-.857-.271 0-.348.077-.348.45v1.179c0 .32-.102.511-1.04.511-1.532 0-3.233-.928-4.428-2.659C1.456 6.428.972 4.878.972 4.494c0-.193.077-.373.45-.373H2.74c.334 0 .46.154.589.515.648 1.866 1.731 3.502 2.178 3.502.167 0 .244-.077.244-.502V5.802c-.052-.905-.53-.982-.53-1.303 0-.154.128-.309.334-.309h2.07c.28 0 .38.148.38.463v2.49c0 .28.128.38.206.38.167 0 .308-.1.616-.41.95-1.066 1.628-2.71 1.628-2.71.09-.193.244-.373.578-.373h1.316c.396 0 .483.203.396.48-.165.77-1.764 3.018-1.764 3.018-.14.224-.19.322 0 .573.14.193.597.593.901.95.56.642.99 1.18.99 1.576 0 .338-.206.515-.52.515z"/>
  </svg>`,
};

const DEFAULT_CONTACT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path fill="#9873FF" d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
</svg>`;


function formatDate(dateStr) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}


function sortClients(clients) {
  const { col, dir } = sortState;
  const mult = dir === 'asc' ? 1 : -1;

  return [...clients].sort((a, b) => {
    let aVal, bVal;

    if (col === 'fio') {
      aVal = `${a.surname} ${a.name} ${a.lastName || ''}`.trim().toLowerCase();
      bVal = `${b.surname} ${b.name} ${b.lastName || ''}`.trim().toLowerCase();
    } else if (col === 'createdAt' || col === 'updatedAt') {
      aVal = new Date(a[col]).getTime();
      bVal = new Date(b[col]).getTime();
    } else {
      aVal = a[col];
      bVal = b[col];
    }

    if (aVal < bVal) return -1 * mult;
    if (aVal > bVal) return 1 * mult;
    return 0;
  });
}


function updateSortIcons() {
  document.querySelectorAll('.sort-icon').forEach((icon) => {
    const col = icon.getAttribute('data-col');
    icon.classList.remove('sort-icon--asc', 'sort-icon--desc');
    if (col === sortState.col) {
      icon.classList.add(sortState.dir === 'asc' ? 'sort-icon--asc' : 'sort-icon--desc');
    }
  });
}


function buildContactsCell(contacts) {
  if (!contacts || contacts.length === 0) return '';

  const items = contacts.map((contact) => {
    const svgIcon = CONTACT_ICONS[contact.type] || DEFAULT_CONTACT_ICON;
    const tooltip = `${contact.type}: ${contact.value}`;

    return `
      <li class="contact-icon" title="">
        ${svgIcon}
        <span class="contact-icon__tooltip">${escapeHtml(tooltip)}</span>
      </li>
    `;
  });

  return `<ul class="contacts-list">${items.join('')}</ul>`;
}


function buildClientRow(client, onEdit, onDelete) {
  const { date: createdDate, time: createdTime } = formatDate(client.createdAt);
  const { date: updatedDate, time: updatedTime } = formatDate(client.updatedAt);
  const fullName = [client.surname, client.name, client.lastName].filter(Boolean).join(' ');

  const tr = document.createElement('tr');
  tr.classList.add('clients-table__row');
  tr.dataset.id = client.id;

  tr.innerHTML = `
    <td class="clients-table__td td-id">${escapeHtml(String(client.id))}</td>
    <td class="clients-table__td">${escapeHtml(fullName)}</td>
    <td class="clients-table__td td-date">
      <span class="td-date__date">${createdDate}</span>
      <span class="td-date__time">${createdTime}</span>
    </td>
    <td class="clients-table__td td-date">
      <span class="td-date__date">${updatedDate}</span>
      <span class="td-date__time">${updatedTime}</span>
    </td>
    <td class="clients-table__td">${buildContactsCell(client.contacts)}</td>
    <td class="clients-table__td">
      <div class="actions-cell">
        <button class="action-btn action-btn--edit" data-id="${client.id}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.498 1.998a1.5 1.5 0 0 1 2.121 2.121l-.707.707-2.121-2.121.707-.707zM9.376 4.12 2.5 11v2.5H5l6.876-6.879L9.376 4.12z" fill="#9873FF"/>
          </svg>
          Изменить
        </button>
        <button class="action-btn action-btn--danger action-btn--delete" data-id="${client.id}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="#F06A4D"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="#F06A4D"/>
          </svg>
          Удалить
        </button>
      </div>
    </td>
  `;

  tr.querySelector('.action-btn--edit').addEventListener('click', () => onEdit(client.id));
  tr.querySelector('.action-btn--delete').addEventListener('click', () => onDelete(client.id));

  return tr;
}


function renderTable(clients, onEdit, onDelete) {
  const tbody = document.getElementById('clientsTableBody');
  const table = document.getElementById('clientsTable');
  const loader = document.getElementById('loader');

  tbody.innerHTML = '';

  if (clients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td class="clients-table__td" colspan="6">
          <div class="empty-state">Клиенты не найдены</div>
        </td>
      </tr>
    `;
  } else {
    const sorted = sortClients(clients);
    sorted.forEach((client) => {
      tbody.appendChild(buildClientRow(client, onEdit, onDelete));
    });
  }

  loader.classList.add('loader--hidden');
  table.classList.add('clients-table--visible');

  updateSortIcons();
}


function showLoader() {
  const loader = document.getElementById('loader');
  const table = document.getElementById('clientsTable');
  loader.classList.remove('loader--hidden');
  table.classList.remove('clients-table--visible');
}


function initSortHandlers(onSortChange) {
  document.querySelectorAll('.clients-table__th--sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (sortState.col === col) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = 'asc';
      }
      updateSortIcons();
      onSortChange();
    });
  });
}


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
