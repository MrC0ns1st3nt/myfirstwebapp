const $consoleButtons = $('.console-btn');

const $episodeList = $('#episode-list');
const $episodeError = $('#episode-error');
const $seasonSelect = $('#season-select');

const $form = $('#mission-form');
const $statusDetail = $('#status-detail');
const $officer = $('#name');
const $crewMember = $('#crew-member');
const $transmissionModal = $('#transmissionModal');

// Console buttons
$consoleButtons.on('click', function () {
    $consoleButtons.removeClass('active');
    $(this).addClass('active');
});

// API Call for Series episode list
function loadEpisodes(seasonUid) {
  $episodeError.prop('hidden', true);

  $.get("https://stapi.co/api/v1/rest/season?uid=" + seasonUid, function (data) {
    const episodes = data.season.episodes.sort((a,b) => a.episodeNumber - b.episodeNumber);
    $episodeList.empty();
    episodes.forEach(function (ep) {
        $episodeList.append($("<li>").text(`${ep.episodeNumber}. ${ep.title} (${ep.usAirDate})`));
    });
  }).fail(function () {
    $episodeList.empty();
    $episodeError.prop('hidden', false);
  });
}

$seasonSelect.on('change', function () {
  loadEpisodes($(this).val());
});
loadEpisodes($seasonSelect.val());

// Mission review
function transmissionLines() {
  return [
    'TO: STARFLEET COMMAND',
    `FROM: ${$officer.val()}`,
    `CREW MEMBER: ${$crewMember.val()}`
  ];
}

$form.on('submit', function (e) {
  e.preventDefault();

  if (!this.checkValidity()) {
    $form.addClass('was-validated');
    return;
  }

  $statusDetail.empty();
  transmissionLines().forEach(function (line, i) {
    if (i > 0) {
      $statusDetail.append('<br>');
    }
    $statusDetail.append(document.createTextNode(line));
  });

  bootstrap.Modal.getOrCreateInstance($transmissionModal[0]).show();
});

// Reset the form when the transmission modal closes
$transmissionModal.on('hidden.bs.modal', function () {
  $form[0].reset();
  $form.removeClass('was-validated');
});
