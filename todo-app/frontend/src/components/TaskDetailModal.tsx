import React, { useState, useEffect } from "react";
import type { Task, Comment } from "../types";
import * as api from "../api";

interface Props {
  task:       Task;
  onClose:    () => void;
  onDelete:   (task: Task) => void;
  onComplete: (task: Task) => void;
}

export default function TaskDetailModal({ task, onClose, onDelete, onComplete }: Props) {
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [newComment,  setNewComment]  = useState("");
  const [loadingCmts, setLoadingCmts] = useState(true);
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    api.getComments(task.id)
      .then(setComments)
      .catch(console.error)
      .finally(() => setLoadingCmts(false));
  }, [task.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const comment = await api.createComment(task.id, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue =
    task.due_date &&
    task.status !== "completed" &&
    new Date(task.due_date) < new Date();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <header className="modal__header">
          <div className="modal__header-meta">
            <span className="task-card__category">
              {task.category.emoji} {task.category.name}
            </span>
            <span className="task-card__priority">{task.priority.icon} {task.priority.name}</span>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">✕</button>
        </header>

        <div className="modal__body">
          <h2 id="detail-modal-title" className="detail__title">{task.title}</h2>

          <div className="detail__meta">
            <span className={`status-badge status-badge--${task.status}`}>
              {task.status === "todo" ? "📋 To Do" : task.status === "in_progress" ? "⚡ In Progress" : "✅ Completed"}
            </span>
            {task.due_date && (
              <span className={`detail__due ${isOverdue ? "overdue" : ""}`}>
                📅 {isOverdue ? "⚠ Overdue · " : ""}
                {new Date(task.due_date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>

          {task.description ? (
            <p className="detail__description">{task.description}</p>
          ) : (
            <p className="detail__description detail__description--empty">No description provided.</p>
          )}

          {/* Action buttons */}
          <div className="detail__actions">
            {task.status !== "completed" && (
              <button className="btn btn--success" onClick={() => { onComplete(task); onClose(); }}>
                ✅ Mark as Completed
              </button>
            )}
            <button className="btn btn--danger" onClick={() => onDelete(task)}>
              🗑️ Delete Task
            </button>
          </div>

          {/* Comments */}
          <section className="comments" aria-label="Comments">
            <h3 className="comments__title">💬 Notes & Comments</h3>

            {loadingCmts ? (
              <p className="comments__loading">Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="comments__empty">No comments yet. Add one below.</p>
            ) : (
              <ul className="comments__list">
                {comments.map(c => (
                  <li key={c.id} className="comment">
                    <p className="comment__body">{c.body}</p>
                    <time className="comment__time" dateTime={c.created_at}>
                      {new Date(c.created_at).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            )}

            <form className="comments__form" onSubmit={handleAddComment}>
              <textarea
                className="comments__input"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a note or comment…"
                rows={2}
                aria-label="New comment"
              />
              <button type="submit" className="btn btn--primary btn--sm" disabled={submitting || !newComment.trim()}>
                {submitting ? "Adding…" : "Add Comment"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
