import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface TaskCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName?: string;
  itemCount?: number;
  isSubmitting?: boolean;
}

const TaskCompletion: React.FC<TaskCompletionProps> = ({
  isOpen,
  onClose,
  onConfirm,
  taskName = 'Current Task',
  itemCount = 0,
  isSubmitting = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Task"
    >
      <div className="space-y-6">
        {/* Icon and Title */}
        <div className="flex items-center justify-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FaCheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>

        {/* Task Information */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ready to Complete Task?
          </h3>
        </div>

        {/* Warning Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notice
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Once you confirm, it cannot be undone. Please ensure:
                </p>
                <ul className="list-disc mt-2 space-y-1 ml-6 text-left">
                  <li>All items have been properly placed</li>
                  <li>Fragile items are handled with care</li>
                  <li>The packing layout matches the visualization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-20">
          <Button
            variant="secondary"
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Completing' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskCompletion;