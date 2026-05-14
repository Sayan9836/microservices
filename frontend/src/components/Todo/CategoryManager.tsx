import { useState } from 'react';
import { fetchData, type Category } from '../../utils/util';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategory: string;
  onSelect: (id: string) => void;
}

const CategoryManager = ({ categories, setCategories, selectedCategory, onSelect }: CategoryManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const { data, success } = await fetchData<Category>({
      url: '/tasks/categories',
      method: 'POST',
      data: { name: newCatName }
    });

    if (success && data) {
      setCategories(prev => [...prev, data]);
      setNewCatName('');
      setIsAdding(false);
      onSelect(data.id);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest">Collections</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
        >
          {isAdding ? 'Cancel' : '+ New'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 animate-fade-in-down">
          <input
            autoFocus
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name..."
            className="w-full bg-neutral-900 border border-indigo-500/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 ring-indigo-500/20 placeholder:text-neutral-600"
          />
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect('')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            selectedCategory === '' 
              ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
          }`}
        >
          All Tasks
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              selectedCategory === cat.id 
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
