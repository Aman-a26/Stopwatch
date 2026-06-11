const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('laps');
const lapCountEl = document.getElementById('lapCount');

let running = false;
let startTime = 0;
let elapsed = 0;
let timerId = null;
let lapCount = 0;

function formatTime(totalMs) {
  const ms = Math.floor(totalMs % 1000 / 10);
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / 60000) % 60;
  const hours = Math.floor(totalMs / 3600000);

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':') + `.${String(ms).padStart(2, '0')}`;
}

function updateDisplay() {
  const total = elapsed + (running ? Date.now() - startTime : 0);
  display.textContent = formatTime(total);
}

function renderLaps() {
  const lapEntries = JSON.parse(localStorage.getItem('stopwatch-laps') || '[]');
  lapCount = lapEntries.length;
  lapCountEl.textContent = `${lapCount} ${lapCount === 1 ? 'lap' : 'laps'}`;

  if (lapEntries.length === 0) {
    lapsList.innerHTML = '<li>No laps yet</li>';
    return;
  }

  lapsList.innerHTML = '';
  lapEntries.forEach((lap, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>Lap ${index + 1}</span><strong>${lap}</strong>`;
    lapsList.appendChild(li);
  });
}

function saveLap(value) {
  const lapEntries = JSON.parse(localStorage.getItem('stopwatch-laps') || '[]');
  lapEntries.push(value);
  localStorage.setItem('stopwatch-laps', JSON.stringify(lapEntries));
  return lapEntries;
}

function start() {
  if (running) return;
  running = true;
  startTime = Date.now();
  timerId = setInterval(updateDisplay, 10);
  updateDisplay();
}

function pause() {
  if (!running) return;
  running = false;
  elapsed += Date.now() - startTime;
  clearInterval(timerId);
  updateDisplay();
}

function reset() {
  clearInterval(timerId);
  running = false;
  elapsed = 0;
  startTime = 0;
  lapCount = 0;
  localStorage.removeItem('stopwatch-laps');
  display.textContent = '00:00:00.00';
  renderLaps();
}

function recordLap() {
  if (!running && elapsed === 0) return;
  const total = elapsed + (running ? Date.now() - startTime : 0);
  saveLap(formatTime(total));
  renderLaps();
}

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', recordLap);

updateDisplay();
renderLaps();
