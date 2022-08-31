import { useState } from "react";
import "./Question.css";

export default function Question(props) {
  const { id, data, showAnswer = false, onChange = (data) => {} } = props;
  const [answer, setAnswer] = useState("");

  function handleChange(event) {
    if (!showAnswer) {
      const { value } = event.target;
      setAnswer(value);
      onChange({
        id,
        selectedAnswer: value,
        isCorrect: data["correct_answer"] === value,
        data
      });
    }
  }

  return (
    <div className="quiz-question">
      <p className="form-label">{data["question"]}</p>
      <div className="d-flex btn-group row">
        {data["options"].map((option, optionId) => {
          return (
            <div
              key={optionId}
              className="quiz-option col align-items-center mb-2"
            >
              <input
                type="radio"
                className={`btn-check ${showAnswer ? "disabled " : ""}`}
                name={`question-${id}`}
                value={option}
                id={`${id}-btn-${optionId}`}
                checked={option === answer}
                disabled={showAnswer}
                onChange={handleChange}
              />
              <label
                className={`btn btn-outline-primary w-100 h-100 ${
                  showAnswer &&
                  (option === data["correct_answer"]
                    ? "is-valid"
                    : option === answer && answer !== data["correct_answer"]
                    ? "is-invalid"
                    : "")
                }`}
                htmlFor={`${id}-btn-${optionId}`}
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
