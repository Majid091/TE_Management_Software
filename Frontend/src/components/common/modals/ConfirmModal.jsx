import React from 'react';
import Modal from './Modal';
import { Button } from '../buttons';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

/**
 * Confirmation modal component
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const variantIcons = {
    danger: XCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  };

  const variantColors = {
    danger: 'confirm-modal-danger',
    warning: 'confirm-modal-warning',
    info: 'confirm-modal-info',
    success: 'confirm-modal-success',
  };

  const Icon = variantIcons[variant];

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  const footer = (
    <div className="confirm-modal-actions">
      <Button variant="outline" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button
        variant={variant === 'success' ? 'success' : variant}
        onClick={handleConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
      showCloseButton={false}
      closeOnOverlayClick={!loading}
      footer={footer}
    >
      <div className={clsx('confirm-modal-content', variantColors[variant])}>
        <div className="confirm-modal-icon">
          <Icon size={48} />
        </div>
        <h3 className="confirm-modal-title">{title}</h3>
        <p className="confirm-modal-message">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
