import { useState } from "react";
import confetti from "canvas-confetti";
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa";
import type { Task } from "../types/Task";
import { useTasks } from "../context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { deleteTask, editTask, toggleTask } = useTasks();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);
  const [desc, setDesc] = useState(task.tags.join(", "));
  const [showModal, setShowModal] = useState(false);

  const save = () => {
    editTask(task.id, value);
    setEditing(false);
  };

  const confirmDone = () => {
    toggleTask(task.id);
    setShowModal(false);

    if (!task.completed) {
      confetti();
    }
  };

  return (
    <>
      <div className={`task-card ${task.completed ? "completed" : ""}`}>
        {task.completed && <FaCheckCircle className="done-icon" />}

        {editing ? (
          <>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <input value={desc} onChange={(e) => setDesc(e.target.value)} />
          </>
        ) : (
          <>
            <h3 className="task-title">{task.text}</h3>
            <p className="task-desc">{task.tags.join(", ")}</p>
          </>
        )}

        <div className="meta">
          <span>{task.category}</span>
          <span className={`priority ${task.priority}`}>{task.priority}</span>
        </div>

        <div className="actions">
          {editing ? (
            <button onClick={save}>Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="edit">
              <FaEdit />
            </button>
          )}

          <button onClick={() => deleteTask(task.id)} className="delete">
            <FaTrash />
          </button>

          <button onClick={() => setShowModal(true)} className="complete">
            ✓
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <p>Have you finished your task?</p>
            <div className="modal-actions">
              <button onClick={confirmDone}>Yes</button>
              <button onClick={() => setShowModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
