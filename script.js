const form = document.getElementById('mission-form');
const status = document.getElementById('transmission-status');
const statusDetail = document.getElementById('status-detail');
const resetBtn = document.getElementById('status-reset');
const missionPanel = document.getElementById('mission-panel');
const consoleButtons = document.querySelectorAll('.console-btn');

const officer = document.getElementById('name');
const crewMember = document.getElementById('crew-member');

function transmissionMessage() {
  return `TO: STARFLEET COMMAND<br>FROM: ${officer.value}<br>CREW MEMBER: ${crewMember.value}`;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();

  statusDetail.innerHTML = transmissionMessage();
  missionPanel.classList.add('is-locked');
});

resetBtn.addEventListener('click', () => {
  form.reset();
  missionPanel.classList.remove('is-locked');
});

// Adding function to set buttons to active state when clicked. Works using .console-btn.active class in CSS. This is a simple way to show which console is currently selected.
function setActiveConsole(clickedButton) {
  consoleButtons.forEach(function (btn) {
    btn.classList.remove('active');
  });
  clickedButton.classList.add('active');
}

consoleButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    setActiveConsole(btn);
  }); 
});

// Adding a function to help manage the scroll pips in the Ship Division section

const scroller = document.querySelector('.division-scroller');
const pips = document.querySelectorAll('.pip');

function setPip() {
  scroller.addEventListener('scroll', function() {
    const index = Math.round(scroller.scrollTop / scroller.clientHeight);
    pips.forEach(function (pip, i) {
      pip.classList.toggle('active', i === index);
  });
});
}
setPip();