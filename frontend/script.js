const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadDepartments();
  loadGearOptions();
  setupForm();
  setupGearSaveButton();
});

// Load Departments from Backend
async function loadDepartments() {
  const response = await fetch(`${API_BASE}/department`);
  const departments = await response.json();
  const departmentSelect = document.getElementById('department');

  departments.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept._id;
    option.textContent = dept.name;
    departmentSelect.appendChild(option);
  });
}

// Load Gear Options from Backend
async function loadGearOptions() {
  const response = await fetch(`${API_BASE}/gear`);
  const gear = await response.json();
  const gearOptions = document.getElementById('gear-options');

  gear.forEach(item => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = item._id;
    checkbox.id = `gear-${item._id}`;
    checkbox.classList.add('form-check-input');

    const label = document.createElement('label');
    label.textContent = item.name;
    label.htmlFor = checkbox.id;
    label.classList.add('form-check-label');

    const div = document.createElement('div');
    div.classList.add('form-check');
    div.appendChild(checkbox);
    div.appendChild(label);

    gearOptions.appendChild(div);
  });
}

// Setup Save Button for Gear Selection
function setupGearSaveButton() {
  const saveButton = document.getElementById('save-gear-selection');
  saveButton.addEventListener('click', () => {
    const selectedGear = Array.from(document.querySelectorAll('#gear-options input:checked')).map(input => input.value);
    const gearList = document.getElementById('gear-list');
    gearList.innerHTML = '';
    selectedGear.forEach(gearId => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = document.querySelector(`label[for="gear-${gearId}"]`).textContent;
      listItem.dataset.id = gearId;
      gearList.appendChild(listItem);
    });
    const gearModal = bootstrap.Modal.getInstance(document.getElementById('gearModal'));
    gearModal.hide();
  });
}

// Setup Form Submission
function setupForm() {
  const form = document.getElementById('booking-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedGear = Array.from(document.querySelectorAll('#gear-list .list-group-item')).map(item => item.dataset.id);

    const bookingData = {
      dateFrom: form.dateFrom.value,
      timeFrom: form.timeFrom.value,
      dateTo: form.dateTo.value,
      timeTo: form.timeTo.value,
      department: form.department.value,
      gear: selectedGear,
    };

    try {
      const response = await fetch(`${API_BASE}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.conflicts) {
          displayConflicts(result.conflicts);
        } else {
          alert(result.message || 'An error occurred while submitting the booking.');
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred while submitting the booking.');
      console.error(error);
    }
  });
}

// Display conflict details to the user
function displayConflicts(conflicts) {
  const errorDiv = document.getElementById('conflict-errors');
  const conflictMessage = conflicts.map(conflict => {
    const gearNames = conflict.gear.map(gear => gear.name).join(', ');
    return `<strong>Gear:</strong> ${gearNames}<br><strong>Dates:</strong> ${new Date(conflict.dateFrom).toLocaleDateString()} - ${new Date(conflict.dateTo).toLocaleDateString()}`;
  }).join('<hr>');

  errorDiv.innerHTML = `<h5>Booking Conflicts:</h5>${conflictMessage}`;
  errorDiv.classList.remove('d-none');
}

// Retain Add Gear Button functionality
document.getElementById('add-gear').addEventListener('click', () => {
  const gearModal = new bootstrap.Modal(document.getElementById('gearModal'));
  gearModal.show();
});
