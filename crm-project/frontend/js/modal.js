

const MAX_CONTACTS = 10;

const CONTACT_TYPES = ['Телефон', 'Email', 'Facebook', 'VK', 'Другое'];


const clientModalOverlay  = document.getElementById('clientModalOverlay');
const clientModal         = document.getElementById('clientModal');
const clientModalClose    = document.getElementById('clientModalClose');
const clientModalTitle    = document.getElementById('clientModalTitle');
const clientModalSubtitle = document.getElementById('clientModalSubtitle');

const fieldSurname   = document.getElementById('fieldSurname');
const fieldName      = document.getElementById('fieldName');
const fieldLastName  = document.getElementById('fieldLastName');
const contactsSection = document.getElementById('contactsSection');
const addContactBtn  = document.getElementById('addContactBtn');
const formErrors     = document.getElementById('formErrors');
const saveClientBtn  = document.getElementById('saveClientBtn');
const deleteClientFromFormBtn = document.getElementById('deleteClientFromFormBtn');

const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const deleteModalClose   = document.getElementById('deleteModalClose');
const confirmDeleteBtn   = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn    = document.getElementById('cancelDeleteBtn');


let currentClientId = null;       
let onSaveCallback  = null;
let onDeleteCallback = null;


function openClientModal({ title, subtitle = '', clientData = null, clientId = null, onSave, onDelete }) {
  currentClientId = clientId;
  onSaveCallback  = onSave;
  onDeleteCallback = onDelete;

  clientModalTitle.textContent    = title;
  clientModalSubtitle.textContent = subtitle;


  fieldSurname.value  = clientData ? clientData.surname  : '';
  fieldName.value     = clientData ? clientData.name     : '';
  fieldLastName.value = clientData ? (clientData.lastName || '') : '';


  contactsSection.innerHTML = '';

  if (clientData && clientData.contacts) {
    clientData.contacts.forEach((c) => addContactRow(c.type, c.value));
  }

  updateAddContactBtn();
  hideErrors();


  deleteClientFromFormBtn.style.display = clientId ? '' : 'none';

  clientModalOverlay.classList.add('modal-overlay--visible');
}

function closeClientModal() {
  clientModalOverlay.classList.remove('modal-overlay--visible');
  currentClientId = null;
}


let deleteTargetId = null;

function openDeleteModal(clientId, onConfirm) {
  deleteTargetId = clientId;
  onDeleteCallback = onConfirm;
  deleteModalOverlay.classList.add('modal-overlay--visible');
}

function closeDeleteModal() {
  deleteModalOverlay.classList.remove('modal-overlay--visible');
  deleteTargetId = null;
}

function addContactRow(type = 'Телефон', value = '') {
  const row = document.createElement('div');
  row.classList.add('contact-row');

  const typeOptions = CONTACT_TYPES.map(
    (t) => `<option value="${t}" ${t === type ? 'selected' : ''}>${t}</option>`
  ).join('');

  row.innerHTML = `
    <select class="contact-row__select">
      ${typeOptions}
    </select>
    <input
      type="text"
      class="contact-row__input"
      placeholder="Введите данные контакта"
      value="${escapeHtml(value)}"
    >
    <button class="contact-row__remove" title="Удалить контакт" type="button">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.4 1.4L12.6 12.6M12.6 1.4L1.4 12.6" stroke="#B0B0B0" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  row.querySelector('.contact-row__remove').addEventListener('click', () => {
    row.remove();
    updateAddContactBtn();
  });

  contactsSection.appendChild(row);
  updateAddContactBtn();
}

function updateAddContactBtn() {
  const count = contactsSection.querySelectorAll('.contact-row').length;
  if (count >= MAX_CONTACTS) {
    addContactBtn.classList.add('add-contact-btn--hidden');
  } else {
    addContactBtn.classList.remove('add-contact-btn--hidden');
  }
}


function getFormData() {
  const surname  = fieldSurname.value.trim();
  const name     = fieldName.value.trim();
  const lastName = fieldLastName.value.trim();

  const contactRows = contactsSection.querySelectorAll('.contact-row');
  const contacts = Array.from(contactRows).map((row) => ({
    type:  row.querySelector('.contact-row__select').value,
    value: row.querySelector('.contact-row__input').value.trim(),
  }));

  return { surname, name, lastName, contacts };
}


function showErrors(messages) {
  formErrors.innerHTML = messages.map((m) => `<p>${escapeHtml(m)}</p>`).join('');
  formErrors.classList.add('form-errors--visible');
}

function hideErrors() {
  formErrors.textContent = '';
  formErrors.classList.remove('form-errors--visible');
}


function validateForm(data) {
  const errors = [];
  if (!data.surname) errors.push('Фамилия обязательна');
  if (!data.name)    errors.push('Имя обязательно');
  data.contacts.forEach((c, i) => {
    if (!c.value) errors.push(`Контакт ${i + 1}: заполните значение`);
  });
  return errors;
}


async function handleSave() {
  hideErrors();
  const data = getFormData();
  const errors = validateForm(data);

  if (errors.length) {
    showErrors(errors);
    return;
  }

  saveClientBtn.disabled = true;
  saveClientBtn.textContent = 'Сохранение...';

  try {
    await onSaveCallback(currentClientId, data);
    closeClientModal();
  } catch (err) {
    let messages = ['Что-то пошло не так...'];
    if (err.errors && err.errors.length) {
      messages = err.errors.map((e) => e.message || String(e));
    }
    showErrors(messages);
  } finally {
    saveClientBtn.disabled = false;
    saveClientBtn.textContent = 'Сохранить';
  }
}


async function handleDeleteFromForm() {
  if (!currentClientId) return;
  closeClientModal();
  openDeleteModal(currentClientId, onDeleteCallback);
}

async function handleConfirmDelete() {
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Удаление...';

  try {
    await onDeleteCallback(deleteTargetId);
    closeDeleteModal();
  } catch (err) {
    alert('Ошибка при удалении клиента');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Удалить';
  }
}


clientModalClose.addEventListener('click', closeClientModal);
clientModalOverlay.addEventListener('click', (e) => {
  if (e.target === clientModalOverlay) closeClientModal();
});

addContactBtn.addEventListener('click', () => addContactRow());
saveClientBtn.addEventListener('click', handleSave);
deleteClientFromFormBtn.addEventListener('click', handleDeleteFromForm);

deleteModalClose.addEventListener('click', closeDeleteModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModalOverlay.addEventListener('click', (e) => {
  if (e.target === deleteModalOverlay) closeDeleteModal();
});
confirmDeleteBtn.addEventListener('click', handleConfirmDelete);


document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeClientModal();
    closeDeleteModal();
  }
});


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
