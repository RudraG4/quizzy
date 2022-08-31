import "./Spinner.css";

export default function Spinner(props) {
  return (
    <div className="spinner flex-grow-1 flex-column">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">{props.message}</span>
      </div>
      <span className="">{props.message}</span>
      {props.children}
    </div>
  );
}
