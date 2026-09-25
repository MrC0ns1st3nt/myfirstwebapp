const form = document.getElementById('mission-form');
const status = document.getElementById('transmission-status');
const statusDetail = document.getElementById('status-detail');
const resetBtn = document.getElementById('status-reset');
const missionPanel = document.getElementById('mission-panel');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  statusDetail.innerHTML = `TO: STARFLEET COMMAND`;

  missionPanel.classList.add('is-locked');
});

resetBtn.addEventListener('click', () => {
  form.reset();
  missionPanel.classList.remove('is-locked');
});
