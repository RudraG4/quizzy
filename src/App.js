import "./App.css";
import Blob from "./components/Blob";
import Quiz from "./components/Quiz";

export default function App() {
  return (
    <>
      <div className="position-fixed top-0 left-0 right-0 bottom-0 w-100 overflow-hidden">
        <Blob className="blob-right" />
        <Blob className="blob-left" />
      </div>
      <Quiz count={5} difficulty="easy" />
    </>
  );
}
