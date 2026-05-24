import React from "react";

interface Props {
  title:     string;
  message:   string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
      <div className="modal modal--sm">
        <header className="modal__header">
          <h2 id="confirm-title">{title}</h2>
        </header>
        <div className="modal__body">
          <p id="confirm-msg">{message}</p>
        </div>
        <footer className="modal__footer">
          <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger"    onClick={onConfirm} autoFocus>Delete</button>
        </footer>
      </div>
    </div>
  );
}
