const $form = $('#mission-form');
const $formLayer = $('.form-layer');
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

// Top buttons with outline (aria-pressed tells screen readers which is active)
// .on('click', ...) runs the function each time a button is clicked.
// Inside it, $(this) means "the button that was clicked".
$consoleButtons.on('click', function () {
  $consoleButtons.removeClass('active').attr('aria-pressed', 'false'); 
  $(this).addClass('active').attr('aria-pressed', 'true');             
});


// Ship Division
// On every scroll, work out which section is showing (scroll distance / section height,
// rounded to 0, 1 or 2) and light the matching pip. toggleClass('active', true/false)
// adds the class when the condition is true and removes it when false.
$scroller.on('scroll', function () {
  const index = Math.round(this.scrollTop / this.clientHeight);
  $pips.each(function (i) {
    $(this).toggleClass('active', i === index);
  });
});

// Series List
// .empty() clears the list, .append() adds a new <li>, and .text() inserts plain text.
function showEpisodeMessage(text) {
  $episodeList.empty().append($('<li>').text(text));
}

function loadEpisodes(seasonUid) {
  showEpisodeMessage('loading transmissions...');
  // $.get sends the request in the background so the page doesn't freeze while waiting.
  $.get('https://stapi.co/api/v1/rest/season?uid=' + seasonUid, function (data) {
    // STAPI does not return episodes in order. Sorting with a comparator (a, b) => a - b
    // compares them as numbers; a plain .sort() would compare as text and put 10 before 2.
    const episodes = data.season.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
    $episodeList.empty();
    episodes.forEach(function (ep) {
      // `${...}` (backticks) drops values into a string
      $episodeList.append($('<li>').text(`${ep.episodeNumber}. ${ep.title} (${ep.usAirDate})`));
    });
  }).fail(function () {
    // .fail() runs instead if the request fails (offline, API down), so the user isn't left on "loading..."
    showEpisodeMessage('Transmission failed. Please check your connection and choose the season again.');
  });
}

// Load a new season when the dropdown changes, and load the first season when the page opens
$seasonSelect.on('change', function () {
  loadEpisodes($(this).val()); // .val() is the chosen option's value (the season's STAPI id)
});
loadEpisodes($seasonSelect.val());

// Mission review form
// Each line is added with .text() so anything typed into the name field is shown as plain text, never as HTML.
// (.html() would treat something like <b>test</b> as real markup.)
function showTransmissionMessage() {
  const lines = [
    'TO: STARFLEET COMMAND',
    `FROM: ${$officer.val().trim()}`, // .trim() removes spaces from the start and end
    `CREW MEMBER: ${$crewMember.val()}`
  ];
  $statusDetail.empty();
  lines.forEach(function (line) {
    $statusDetail.append($('<span>').text(line)); // CSS makes each span a separate line
  });
}

$form.on('submit', function (e) {
  e.preventDefault(); // stops the browser reloading the page, as a real form submit would. Annoying as it takes the user back to the top of the page.
  showTransmissionMessage();
  $missionPanel.addClass('is-locked'); // CSS fades the form back and shows the confirmation panel
  $formLayer.prop('inert', true); // stops keyboard users tabbing into the form behind the panel
  // hide() then fadeIn(400) fades the panel in over 0.4s; the function runs once the fade finishes
  $status.hide().fadeIn(400, function () {
    $status.trigger('focus'); // moves keyboard focus (and the screen reader) to the confirmation
  });
});

$resetBtn.on('click', function () {
  $form.trigger('reset'); // clears the form fields
  $missionPanel.removeClass('is-locked');
  $formLayer.prop('inert', false);
  $status.fadeOut(200); // hides the panel completely, so it can't be tabbed into
  $officer.trigger('focus'); // puts the cursor back in the first field
});
