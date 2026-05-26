
const API_BASE = 'http://localhost:3000/api';

/**
 
  @param {string} [search] 
  @returns {Promise<Array>}
 */
async function apiGetClients(search = '') {
  const url = search
    ? `${API_BASE}/clients?search=${encodeURIComponent(search)}`
    : `${API_BASE}/clients`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки клиентов: ${response.status}`);
  }

  return response.json();
}

/**
 *
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function apiGetClient(id) {
  const response = await fetch(`${API_BASE}/client/${id}`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки клиента: ${response.status}`);
  }

  return response.json();
}

/**
 * 
 * @param {Object} clientData - { name, surname, lastName, contacts }
 * @returns {Promise<Object>}
 */
async function apiCreateClient(clientData) {
  const response = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  });

  const data = await response.json();

  if (!response.ok) {
    // 
    const error = new Error('Ошибка создания клиента');
    error.status = response.status;
    error.errors = Array.isArray(data) ? data : null;
    throw error;
  }

  return data;
}

/**
 * 
 * @param {string} id
 * @param {Object} clientData
 * @returns {Promise<Object>}
 */
async function apiUpdateClient(id, clientData) {
  const response = await fetch(`${API_BASE}/client/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error('Ошибка обновления клиента');
    error.status = response.status;
    error.errors = Array.isArray(data) ? data : null;
    throw error;
  }

  return data;
}

/**
 * 
 * @param {string} id
 * @returns {Promise<void>}
 */
async function apiDeleteClient(id) {
  const response = await fetch(`${API_BASE}/client/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Ошибка удаления клиента: ${response.status}`);
  }
}
