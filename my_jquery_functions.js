const $form = $('#mission-form');
const $status = $('#transmission-status');
const $statusDetail = $('#status-detail');
const $resetBtn = $('#status-reset');
const $missionPanel = $('#mission-panel');
const $consoleButtons = $('.console-btn');
const $officer = $('#name');
const $crewMember = $('#crew-member');
const $scroller = $('.division-scroller');
const $pips = $('.pip');
const $episodeList = $('#episode-list');
const $seasonSelect = $('#season-select');

function transmissionMessage() {
  return `TO: STARFLEET COMMAND<br>FROM: ${$officer.val()}<br>CREW MEMBER: ${$crewMember.val()}`;
}
$form.on('submit', function (e) {
  e.preventDefault();
  $statusDetail.html(transmissionMessage());
  $missionPanel.addClass('is-locked');
  $status.hide().fadeIn(400);
});

$resetBtn.on('click', function () {
  $form.trigger('reset');
  $missionPanel.removeClass('is-locked');
});


$consoleButtons.on('click', function () {
    $consoleButtons.removeClass('active');
    $(this).addClass('active');
});



$scroller.on('scroll', function() {
    const index = Math.round(this.scrollTop / this.clientHeight);
    $pips.each(function (i) {
      $(this).toggleClass('active', i === index);
  });
});

function loadEpisodes(seasonUid) {
  $.get("https://stapi.co/api/v1/rest/season?uid=" + seasonUid, function (data) {
    const episodes = data.season.episodes.sort((a,b) => a.episodeNumber - b.episodeNumber);
    $episodeList.empty();
    episodes.forEach(function (ep) {
        $episodeList.append($("<li>").text(`${ep.episodeNumber}. ${ep.title} (${ep.usAirDate})`));
    });
  });
}
    
$seasonSelect.on('change', function () {
  loadEpisodes($(this).val());
});
loadEpisodes($seasonSelect.val());
