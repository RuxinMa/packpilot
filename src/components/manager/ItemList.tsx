import React from 'react';
import { Item } from '../../services/itemService';
import { FaEdit, FaSync, FaTrash } from 'react-icons/fa';

interface ItemListProps {
  items: Item[];
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
  onRefresh: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onEdit, onDelete, onRefresh }) => {
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="w-full">
              <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Total Items: {items.length}
          </h3>
          <button
            onClick={onRefresh}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaSync className="mr-1" /> Refresh
          </button>
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <div className="flex justify-end space-x-4">
                      <button 
                        onClick={() => onEdit(item.id)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        title="Edit item"
                      >
                        <FaEdit className="mr-1" />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Delete item"
                      >
                        <FaTrash className="mr-1" />
                      </button>
                    </div>
                  </td>
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