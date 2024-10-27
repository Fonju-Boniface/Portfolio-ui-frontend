import React, { useState } from 'react';
import Image from 'next/image';
import CustomDialog from './Dialog'; // Updated import for the dialog

interface ExperienceItem {
  id: number;
  title: string;
  experiencePercentage: number;
  note: string;
  description: string;
  image: string;
}

interface ExperienceListProps {
  items: ExperienceItem[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);

  const handleOpenDialog = (item: ExperienceItem) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Experience List</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-4 rounded-md shadow-md cursor-pointer flex items-center"
            onClick={() => handleOpenDialog(item)}
          >
            <Image src={item.image} alt={item.title} width={50} height={50} className="rounded mr-4" />
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-700">Experience: {item.experiencePercentage}%</p>
              <div
                className={`mt-2 h-2 rounded-full ${item.experiencePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${item.experiencePercentage}%` }}
              />
              <p className="text-gray-600">{item.note}</p>
            </div>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <CustomDialog
          isOpen={!!selectedItem}
          onClose={handleCloseDialog}
          title={selectedItem.title}
          description={selectedItem.description}
        />
      )}
    </div>
  );
};

export default ExperienceList;