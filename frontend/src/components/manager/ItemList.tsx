import React from 'react';
import { FaEdit, FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../common/Button';
import { Item } from '../../types';

interface ItemListProps {
  items: Item[];
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
  selectionMode?: boolean;
  selectedItems?: number[];
  onToggleItemSelection?: (itemId: number) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  onContinueSelection?: () => void;
  loading?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  selectionMode = false,
  selectedItems = [],
  onToggleItemSelection,
  onSelectAll,
  onClearAll,
  onContinueSelection,
  loading = false
}) => {
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  // Check if item is selected
  const isItemSelected = (itemId: number) => {
    return selectedItems.includes(itemId);
  };

  // Check if all items are selected
  const areAllItemsSelected = items.length > 0 && selectedItems.length === items.length;
  
  // Check if some items are selected (for indeterminate state)  
  const areSomeItemsSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (areAllItemsSelected && onClearAll) {
      onClearAll();
    } else if (onSelectAll) {
      onSelectAll();
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          {selectionMode 
            ? `Select items (${selectedItems.length} selected)` 
            : `Total Items: ${items.length}`}
        </h3>
        {selectionMode && (
          <div className="flex items-center space-x-3">
            {/* Select All / Clear All Button */}
            {items.length > 0 && (
              <Button
                onClick={handleSelectAllToggle}
                variant="secondary"
                size="sm"
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              >
                {areAllItemsSelected ? 'Clear All' : 'Select All'}
              </Button>
            )}
            <Button
              onClick={onContinueSelection}
              disabled={selectedItems.length === 0}
              variant={selectedItems.length > 0 ? "primary" : "secondary"}
              size="sm"
              className="px-4 py-2"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-500 text-lg">Loading items...</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-lg mb-4">No items available</p>
              <p className="text-gray-400">Add new items using the sidebar button</p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectionMode && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      <div 
                        className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer transition-colors ${
                          areAllItemsSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : areSomeItemsSelected
                            ? 'bg-blue-200 border-blue-400'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={handleSelectAllToggle}
                        title={areAllItemsSelected ? 'Deselect all' : 'Select all'}
                      >
                        {areAllItemsSelected && <FaCheck className="text-white text-xs" />}
                        {areSomeItemsSelected && <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>}
                      </div>
                      <span className="ml-2">Select</span>
                    </div>
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions (L×W×H)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fragile
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Time
                </th>
                {!selectionMode && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 ${isItemSelected(item.id) ? 'bg-blue-50' : ''} ${selectionMode ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (selectionMode && onToggleItemSelection) {
                      onToggleItemSelection(item.id);
                    }
                  }}
                >
                  {selectionMode && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                        isItemSelected(item.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-gray-300'
                      }`}>
                        {isItemSelected(item.id) && <FaCheck className="text-white text-xs" />}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600 font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${item.length} × ${item.width} × ${item.height}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {item.is_fragile ? (
                        <>
                          <FaExclamationTriangle className="text-red-500 mr-1" />
                          <span className="text-red-600 font-medium">Yes</span>
                        </>
                      ) : (
                        <span className="text-green-600 font-medium">No</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {item.remarks ? (
                      <div title={item.remarks} className="truncate">
                        {item.remarks}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.created_at ? formatDate(item.created_at) : "-"}
                  </td>
                  {!selectionMode && (
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <div className="flex justify-end space-x-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.id);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="Edit item"
                        >
                          <FaEdit className="mr-1" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Delete item"
                        >
                          <FaTrash className="mr-1" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemList;