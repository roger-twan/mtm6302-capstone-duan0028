const API_TOKEN = 'xnCWDfklhoSen4iJ380dA6SonLiHzlB2M5yGeUij';
const API_URL = 'https://quizapi.io/api/v1/questions';
let quizInfo = null;
const accuracy = JSON.parse(localStorage.getItem('accuracy')) || { totalTry: 0, correctTotal: 0 };
let totalTry = accuracy.totalTry;
let correctTotal = accuracy.correctTotal;

const $content = document.getElementById('content');
const $selectLevelTemplate = document.getElementById('select-level-template');
const $questionTemplate = document.getElementById('question-template');
const $resultTemplate = document.getElementById('result-template');

showLevelSelection();

document.addEventListener('click', (e) => {
  if (e.target.matches('#start-button')) {
    showQuestion();
  } else if (e.target.matches('#submit-button')) {
    showResult();
  } else if (e.target.matches('#new-quiz-button')) {
    showLevelSelection();
  } else if (e.target.matches('#clear-button')) {
    localStorage.removeItem('accuracy');
    totalTry = 0;
    correctTotal = 0;
    showLevelSelection();
  }
});

function showLevelSelection() {
  $content.replaceChildren($selectLevelTemplate.content.cloneNode(true));
}

async function showQuestion() {
  difficulty = document.getElementById('level').value;
  const response = await fetch(`${API_URL}?apiKey=${API_TOKEN}&limit=1&difficulty=${difficulty}`);
  const data = await response.json();
  quizInfo = data[0];

  renderQuestion();
}

function showResult() {
  // check if the user's answer is correct
  const $answers = document.querySelectorAll('input[name="answer"]:checked');
  const answers = Array.from($answers).map($answer => $answer.value);
  const correctAnswers = Object.entries(quizInfo.correct_answers)
    .filter(([key, value]) => value === 'true')
    .map(([key, value]) => key.replace('_correct', ''));
  const isCorrect = answers.length === correctAnswers.length && answers.sort().toString() === correctAnswers.sort().toString();

  // show the result
  const $resultIcon = $resultTemplate.content.getElementById('result-icon');
  const $resultText = $resultTemplate.content.getElementById('result-text');

  if (isCorrect) {
    $resultIcon.textContent = '🎉';
    $resultText.textContent = 'Correct';
    $resultText.classList.add('text-[#759A30]');

    correctTotal++;
  } else {
    $resultIcon.textContent = '💔';
    $resultText.textContent = 'Incorrect';
    $resultText.classList.add('text-[#FF0000]');
  }

  $accuracy = $resultTemplate.content.getElementById('accuracy');
  $accuracy.textContent = `${correctTotal}/${++totalTry}`;

  $content.replaceChildren($resultTemplate.content.cloneNode(true));

  saveAccuracy();
}

function renderQuestion() {
  const $question = $questionTemplate.content.getElementById('question');
  const $form = $questionTemplate.content.getElementById('answer-form');
  $question.textContent = quizInfo.question;

  $form.replaceChildren();
  for (let key in quizInfo.answers) {
    if (quizInfo.answers[key] !== null) {
      const input = document.createElement('input');
      input.classList.add('cursor-pointer');
      input.type = 'checkbox';
      input.name = 'answer';
      input.value = key;
      input.id = key;
      $form.appendChild(input);

      const label = document.createElement('label');
      label.textContent = quizInfo.answers[key];
      label.setAttribute('for', key);
      label.classList.add('ml-2');
      $form.appendChild(label);

      const br = document.createElement('br');
      $form.appendChild(br);
    }
  }

  $content.replaceChildren($questionTemplate.content.cloneNode(true));
}

function saveAccuracy() {
  const accuracy = {
    totalTry: totalTry,
    correctTotal: correctTotal
  };

  localStorage.setItem('accuracy', JSON.stringify(accuracy));
}
