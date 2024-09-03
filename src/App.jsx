import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {};

    fetchIssues();
  }, []);

  const addNewIssue = async (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <header className="py-2 shadow-sm">
        <h1 className="text-4xl font-sofia text-center font-semibold text-green-700">
          Issue Tracker
        </h1>
      </header>
      <main>
        <form
          onSubmit={addNewIssue}
          className="my-5 mx-auto px-4 md:w-1/2 max-w-64 flex flex-col gap-4 py-8 bg-slate-200 rounded-3xl "
        >
          <div className="flex flex-col">
            <label className="text-sm font-semibold" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="border py-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold" htmlFor="description">
              Description
            </label>
            <textarea name="description" id="description" className="border" />
          </div>
          <button className="text-white bg-green-700 mt-4 py-1" type="submit">
            Add Issue
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
