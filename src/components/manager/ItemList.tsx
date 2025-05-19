import React from 'react';
import { FaEdit, FaSync, FaTrash, FaCheck } from 'react-icons/fa';

// Item interface from original file
interface Item {
  id: number;
  length: number;
  width: number;
  height: number;
  direction: string;
  notes?: string;
  createdAt?: Date;
}

interface ItemListProps {
  items: Item[];
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
  onRefresh: () => void;
  selectionMode?: boolean;
  selectedItems?: number[];
  onToggleItemSelection?: (itemId: number) => void;
  onContinueSelection?: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  onEdit, 
  onDelete, 
  onRefresh,
  selectionMode = false,
  selectedItems = [],
  onToggleItemSelection,
  onContinueSelection
}) => {
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  // Check if item is selected
  const isItemSelected = (itemId: number) => {
    return selectedItems.includes(itemId);
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          {selectionMode 
            ? `Select items (${selectedItems.length} selected)` 
            : `Total Items: ${items.length}`}
        </h3>
        {selectionMode ? (
          <button
            onClick={onContinueSelection}
            disabled={selectedItems.length === 0}
            className={`px-4 py-2 rounded-md ${
              selectedItems.length > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onRefresh}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaSync className="mr-1" /> Refresh
          </button>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg mb-4">No items available</p>
          <p className="text-gray-400">Add new items using the sidebar button</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {selectionMode && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions (L×W×H)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Direction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added Time
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {`${item.length} × ${item.width} × ${item.height}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.direction}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {item.notes || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdAt ? formatDate(item.createdAt) : "-"}
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