function todayKey() {
  const d = new Date();
  return `day:${d.toISOString().slice(0,10)}`;
}

function getTodayLabel() {
  return new Date().toLocaleDateString();
}

function loadActivities() {
  return JSON.parse(localStorage.getItem(todayKey())) || [];
}

function saveActivities(data) {
  localStorage.setItem(todayKey(), JSON.stringify(data));
}

const todayLabelEl = document.getElementById('todayLabel');
const totalCaloriesEl = document.getElementById('totalCalories');
const activitiesListEl = document.getElementById('activitiesList');
const progressBarEl = document.getElementById('progressBar');
const targetInput = document.getElementById('targetInput');
const typeInput = document.getElementById('typeInput');
const durationInput = document.getElementById('durationInput');
const caloriesInput = document.getElementById('caloriesInput');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');

// Show today's date on load
todayLabelEl.textContent = getTodayLabel();

function render() {
  const items = loadActivities();
  const total = items.reduce((sum, item) => sum + item.calories, 0);
  totalCaloriesEl.textContent = `${total} kcal`;

  const target = Number(targetInput.value) || 500;
  progressBarEl.style.width = Math.min(100, (total / target) * 100) + "%";

  activitiesListEl.innerHTML = "";
  if (!items.length) {
    activitiesListEl.innerHTML = '<li class="muted">No activities yet.</li>';
    return;
  }

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div><strong>${item.type}</strong><div class="muted small">${item.duration} min</div></div>
      <div>${item.calories} kcal <button data-index="${index}" class="secondary">❌</button></div>
    `;

    li.querySelector("button").addEventListener("click", () => {
      deleteActivity(index);
    });

    activitiesListEl.appendChild(li);
  });
}

function addActivity(type, duration, calories) {
  const items = loadActivities();
  items.unshift({ type, duration, calories });
  saveActivities(items);
  render();
}

function deleteActivity(index) {
  const items = loadActivities();
  items.splice(index, 1);
  saveActivities(items);
  render();
}

function clearToday() {
  if (confirm("Clear today's data?")) {
    localStorage.removeItem(todayKey());
    render();
  }
}

saveBtn.addEventListener("click", () => {
  const type = typeInput.value.trim();
  const duration = Number(durationInput.value);
  const calories = Number(caloriesInput.value);
  if (!type) return alert("Enter workout type!");
  addActivity(type, duration || 0, calories || 0);
  typeInput.value = durationInput.value = caloriesInput.value = "";
});

clearBtn.addEventListener("click", clearToday);
targetInput.addEventListener("input", render);

render();
