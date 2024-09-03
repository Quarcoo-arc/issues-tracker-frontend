import { useState } from "react";
import { useEffect } from "react";
import noDataIconUrl from "./assets/no-data.svg";
import deleteIconUrl from "./assets/delete.png";
import editIconUrl from "./assets/edit.png";
import Modal from "react-modal";

function App() {
  const [issues, setIssues] = useState([]);
  const [showConfirmDeleteDialog, setshowConfirmDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const issuesUrl = import.meta.env.VITE_ISSUES_URL;
  useEffect(() => {
    const fetchIssues = async () => {
      const response = await fetch(issuesUrl);
      const data = await response.json();
      if (data && data.success) {
        setIssues(data.data);
      } else {
        alert(data.message || "Something went wrong!");
      }
    };

    fetchIssues();
  }, [issuesUrl]);

  const addNewIssue = async (e) => {
    e.preventDefault();
    const request = await fetch(issuesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: e.target.title?.value,
        description: e.target.description?.value,
      }),
    });
    const response = await request.json();
    if (response && response.success) {
      alert("Successfully added issue!");
      setIssues((prev) => [...prev, response.data]);
      e.target?.reset();
    } else {
      alert(response.message || "Something went wrong!");
    }
  };

  const deleteIssue = async () => {
    if (!selected) return alert("No issue selected");
    const request = await fetch(`${issuesUrl}/${selected._id}`, {
      method: "DELETE",
    });
    const response = await request.json();
    if (response && response.success) {
      alert("Successfully deleted issue!");
      setIssues((prev) => prev.filter((it) => it._id !== selected._id));
      setSelected(null);
      setshowConfirmDeleteDialog(false);
    } else {
      alert(response.message || "Something went wrong!");
    }
  };

  const cancelDelete = () => {
    setSelected(null);
    setshowConfirmDeleteDialog(false);
  };

  const cancelUpdate = () => {
    setSelected(null);
    setShowUpdateDialog(false);
  };

  const deleteIssueHandler = (issue) => {
    setSelected(issue);
    setshowConfirmDeleteDialog(true);
  };

  const updateIssueHandler = (issue) => {
    setSelected(issue);
    setShowUpdateDialog(true);
  };

  const updateIssue = async (e) => {
    e.preventDefault();
    if (!selected) return alert("No issue selected");
    const request = await fetch(issuesUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selected._id,
        title: e.target?.title?.value,
        description: e.target?.description?.value,
      }),
    });
    const response = await request.json();
    if (response && response.success) {
      alert("Successfully updated issue!");
      setIssues((prev) =>
        prev.map((iss) => (iss._id !== selected._id ? iss : response.data))
      );
      setShowUpdateDialog(false);
      setSelected(null);
    } else {
      alert(response.message || "Failed to update issue!");
    }
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

        {!issues || !issues.length ? (
          <img src={noDataIconUrl} className="h-96 mx-auto" alt="No Data" />
        ) : (
          <div className="px-5">
            <h3 className="text-3xl">Issues</h3>
            <div className="overflow-x-scroll">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="min-w-64 text-left">#</th>
                    <th className="text-left min-w-64">Issue</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id}>
                      <td>{issue._id}</td>{" "}
                      <td>
                        <div className="flex flex-col py-3">
                          <h5 className="font-medium truncate max-w-64">
                            {issue.title}
                          </h5>
                          <p className="text-sm truncate max-w-72">
                            {issue.description}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-5">
                          <img
                            src={editIconUrl}
                            className="cursor-pointer w-5 h-auto"
                            alt="Edit"
                            onClick={() => updateIssueHandler(issue)}
                          />
                          <img
                            src={deleteIconUrl}
                            className="cursor-pointer w-5 h-auto"
                            alt="Delete"
                            onClick={() => deleteIssueHandler(issue)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              isOpen={showConfirmDeleteDialog}
              onRequestClose={cancelDelete}
              contentLabel="Confirm Delete"
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            >
              <h2 className="text-lg">
                Are you sure you want to delete this issue?
              </h2>
              <div className="flex gap-5 mt-5 mb-3 justify-center">
                <button
                  className="bg-gray-500 text-white p-1.5 rounded-md"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white p-1.5 rounded-md"
                  onClick={deleteIssue}
                >
                  Delete
                </button>
              </div>
            </Modal>
            <Modal
              isOpen={showUpdateDialog}
              onRequestClose={cancelUpdate}
              contentLabel="Update Issue"
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            >
              <h2 className="text-lg text-center font-semibold">
                Update Issue
              </h2>
              <form
                onSubmit={updateIssue}
                className="flex flex-col gap-5 mt-6 w-56"
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
                    defaultValue={selected?.title ?? ""}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="border"
                    defaultValue={selected?.description ?? ""}
                  />
                </div>
                <div className="flex gap-5 justify-center mt-3">
                  <button
                    className="bg-gray-500 text-white p-1.5 rounded-md"
                    onClick={cancelUpdate}
                  >
                    Cancel
                  </button>

                  <button
                    className="text-white bg-green-700 p-1.5 rounded-md"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
