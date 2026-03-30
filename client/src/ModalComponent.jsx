import React, { useState, useRef } from "react";
import "./ModalComponent.css";

export default function ModalComponent({ open, Header, Body, Footer = null }) {
  const modalRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!open) return null;

  const startDrag = (e) => {
    const rect = modalRef.current.getBoundingClientRect();
    setDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const onDrag = (e) => {
    if (!dragging) return;

    const modal = modalRef.current;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const maxX = window.innerWidth - modal.offsetWidth;
    const maxY = window.innerHeight - modal.offsetHeight;

    modal.style.left = Math.max(0, Math.min(newX, maxX)) + "px";
    modal.style.top = Math.max(0, Math.min(newY, maxY)) + "px";
  };

  const stopDrag = () => setDragging(false);

  return (
    <div
      className="modal-overlay"
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      <div
        className="modal-box draggable"
        ref={modalRef}
        style={{ left: "calc(50% - 160px)", top: "25%" }}
      >
        <div className="modal-header" onMouseDown={startDrag}>
          {Header}
        </div>

        <div className="modal-body">{Body}</div>

        <div className="modal-footer">{Footer}</div>
      </div>
    </div>
  );
}
