const content = document.getElementById('content');
const selectLevelTemplate = document.getElementById('select-level-template');
const questionTemplate = document.getElementById('question-template');
const resultTemplate = document.getElementById('result-template');
const startButton = document.getElementById('start-button');
const submitButton = document.getElementById('submit-button');
const newQuizButton = document.getElementById('new-quiz-button');

showLevelSelection();

document.addEventListener('click', (e) => {
  if (e.target.matches('#start-button')) {
    showQuestion();
  } else if (e.target.matches('#submit-button')) {
    showResult();
  } else if (e.target.matches('#new-quiz-button')) {
    showLevelSelection();
  }
});

function showLevelSelection() {
  content.replaceChildren(selectLevelTemplate.content.cloneNode(true));
}

function showQuestion() {
  content.replaceChildren(questionTemplate.content.cloneNode(true));
}

function showResult() {
  content.replaceChildren(resultTemplate.content.cloneNode(true));
}
