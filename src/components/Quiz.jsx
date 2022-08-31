import { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Question from "./Question";
import Spinner from "./Spinner";
import { nanoid } from "nanoid";
import "./Quiz.css";

const BASE_URL = "https://opentdb.com/api.php";

function shuffle(array) {
  let m = array.length;
  let t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent || input;
}

export default function Quiz(props) {
  const { count = 5, difficulty = "easy" } = props;
  const [gameStatus, setGameStatus] = useState("init");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const { width, height } = useWindowSize();

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      setIsError(false);
      try {
        const queryParam = `amount=${count}&difficulty=${difficulty}&type=multiple`;
        const response = await fetch(`${BASE_URL}?${queryParam}`);
        const data = await response.json();
        if (data["response_code"] === 0) {
          data["results"].map((question) => {
            question["id"] = nanoid();
            question["question"] = htmlDecode(question["question"]);
            question["options"] = shuffle([
              question["correct_answer"],
              ...question["incorrect_answers"]
            ]).map((answer) => htmlDecode(answer));
            question["correct_answer"] = htmlDecode(question["correct_answer"]);
            question["selectedAnswer"] = "";
            delete question["incorrect_answers"];
            return question;
          });
          setQuestions(data["results"]);
        }
      } catch (e) {
        setIsError(true);
      }
      setIsLoading(false);
    }

    if (gameStatus === "init") {
      resetGame();
    }
    if (gameStatus === "start") {
      fetchQuestions();
    }
  }, [gameStatus]);

  function checkAnswers(event) {
    event.preventDefault();
    setScore(questions.filter((question) => question["isCorrect"]).length);
    setShowAnswer(true);
  }

  function handleOnAnswerChange(id, data) {
    setQuestions((oldQuestions) => {
      let answeredCount = 0;
      let newQuestions = oldQuestions.map((question) => {
        if (question["id"] === id) {
          question["selectedAnswer"] = data["selectedAnswer"];
        }
        if (question["selectedAnswer"]) {
          answeredCount++;
        }
        if (question["selectedAnswer"] === question["correct_answer"]) {
          question["isCorrect"] = true;
        }
        return question;
      });
      setAnsweredCount(answeredCount);
      return newQuestions;
    });
  }

  function resetGame() {
    setShowAnswer(false);
    setAnsweredCount(0);
    setScore(0);
    setQuestions([]);
  }

  function renderIntro() {
    return (
      <>
        <div className="quiz-intro-title fade-in animation">
          <h1>Quizzy</h1>
          <p>
            Get Smarter With Trivia Quizzes. Train Your Brain With Variety Of
            Trivia Questions.
          </p>
          <p>It's fun, easy and free.</p>
        </div>
        <button
          className="quiz-btn quiz-start-btn fade-in btn btn-primary animation"
          onClick={() => setGameStatus("start")}
        >
          Start Quiz
        </button>
      </>
    );
  }

  function renderQuestions() {
    return isError ? (
      <Spinner message="Something went wrong!! Try again later...">
        <button
          className="mt-3 mb-3 quiz-btn quiz-playagain-btn btn btn-primary"
          onClick={() => setGameStatus("init")}
        >
          Try Again
        </button>
      </Spinner>
    ) : isLoading ? (
      <Spinner message="Loading..." />
    ) : (
      <>
        <form className="quiz-form">
          <div className="quiz-question-board">
            {questions.map((question) => {
              return (
                <Question
                  key={question.id}
                  id={question.id}
                  data={question}
                  showAnswer={showAnswer}
                  onChange={(data) => handleOnAnswerChange(question.id, data)}
                />
              );
            })}
          </div>
          <div className="quiz-score-board">
            {showAnswer ? (
              <>
                <p className="quiz-score">
                  {`You scored ${score}/${questions.length} correct answers`}
                </p>
                <button
                  type="button"
                  className="quiz-btn quiz-playagain-btn btn"
                  onClick={() => setGameStatus("init")}
                >
                  Play Again
                </button>
              </>
            ) : (
              <button
                type="button"
                className="quiz-btn quiz-check-btn btn"
                disabled={answeredCount !== questions.length}
                onClick={checkAnswers}
              >
                Check answers
              </button>
            )}
          </div>
        </form>
      </>
    );
  }

  return (
    <div className="quiz justify-content-center">
      {gameStatus === "init" && renderIntro()}
      {gameStatus === "start" && renderQuestions()}
      {showAnswer && score >= Math.ceil(0.75 * count, 10) && (
        <Confetti width={width} height={height} />
      )}
    </div>
  );
}
