import React from "react";

const ConfirmRemove = ({
  isOpen,
  onClose,
  isDelete,
  postIdRemove,
}: {
  isOpen: boolean;
  onClose: () => void;
  isDelete: () => void;
  postIdRemove: string;
}) => {
  return (
    <div
      className="modal d-block bg-dark bg-opacity-50"
      tabIndex={-1}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            {/* Tiêu đề */}
            <h5 className="modal-title fs-5 fw-semibold">Xác nhận xóa</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Nội dung thông báo */}
          <div className="modal-body pt-0">
            <p className="fs-6 text-secondary mb-1">
              Bạn có chắc chắn muốn xóa bài viết này{" "}
              {/* <span className="fw-bold text-dark">{itemToDelete}</span> này
              không? */}
            </p>
            <p className="fs-6 text-secondary">
              Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="modal-footer d-flex justify-content-end gap-2 border-0 pt-0">
            <button
              onClick={onClose}
              className="btn btn-outline-secondary btn-sm"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                isDelete();
                onClose();
              }}
              className="btn btn-danger btn-sm"
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRemove;
