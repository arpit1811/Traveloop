"use client";

import { useState, use } from "react";

interface PackingItem {
  id: number;
  name: string;
  packed: boolean;
}

interface PackingCategory {
  name: string;
  items: PackingItem[];
}

const getInitialData = (city: string): PackingCategory[] => {
  const dataByCity: Record<string, PackingCategory[]> = {
    delhi: [
      {
        name: "Documents",
        items: [
          { id: 1, name: "Passport", packed: false },
          { id: 2, name: "Visa", packed: false },
          { id: 3, name: "ID Card", packed: true },
          { id: 4, name: "Travel Insurance", packed: false },
        ],
      },
      {
        name: "Clothing",
        items: [
          { id: 5, name: "T-shirts", packed: true },
          { id: 6, name: "Pants", packed: true },
          { id: 7, name: "Underwear", packed: false },
          { id: 8, name: "Shoes", packed: false },
          { id: 9, name: "Jacket", packed: false },
        ],
      },
      {
        name: "Electronics",
        items: [
          { id: 10, name: "Phone Charger", packed: false },
          { id: 11, name: "Power Bank", packed: false },
          { id: 12, name: "Camera", packed: true },
          { id: 13, name: "Headphones", packed: false },
        ],
      },
    ],
    mumbai: [
      {
        name: "Documents",
        items: [
          { id: 1, name: "Passport", packed: false },
          { id: 2, name: "Visa", packed: false },
          { id: 3, name: "ID Card", packed: false },
          { id: 4, name: "Travel Insurance", packed: false },
        ],
      },
      {
        name: "Clothing",
        items: [
          { id: 5, name: "T-shirts", packed: false },
          { id: 6, name: "Shorts", packed: false },
          { id: 7, name: "Swimwear", packed: false },
          { id: 8, name: "Flip Flops", packed: false },
          { id: 9, name: "Sunglasses", packed: false },
        ],
      },
      {
        name: "Electronics",
        items: [
          { id: 10, name: "Phone Charger", packed: false },
          { id: 11, name: "Power Bank", packed: false },
          { id: 12, name: "Earphones", packed: false },
          { id: 13, name: "Travel Adapter", packed: false },
        ],
      },
    ],
    paris: [
      {
        name: "Documents",
        items: [
          { id: 1, name: "Passport", packed: false },
          { id: 2, name: "Visa", packed: false },
          { id: 3, name: "ID Card", packed: true },
          { id: 4, name: "Travel Insurance", packed: false },
        ],
      },
      {
        name: "Clothing",
        items: [
          { id: 5, name: "T-shirts", packed: true },
          { id: 6, name: "Pants", packed: true },
          { id: 7, name: "Underwear", packed: false },
          { id: 8, name: "Shoes", packed: false },
          { id: 9, name: "Jacket", packed: false },
        ],
      },
      {
        name: "Electronics",
        items: [
          { id: 10, name: "Phone Charger", packed: false },
          { id: 11, name: "Power Bank", packed: false },
          { id: 12, name: "Camera", packed: true },
          { id: 13, name: "Headphones", packed: false },
        ],
      },
    ],
  };
  return dataByCity[city.toLowerCase()] || dataByCity["paris"];
};

export default function PackingChecklistPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const [categories, setCategories] = useState<PackingCategory[]>(getInitialData(city));
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: "category" | "item", categoryIndex?: number, itemId?: number, name?: string} | null>(null);
  const [addStep, setAddStep] = useState<"type" | "category" | "item">("type");
  const [addType, setAddType] = useState<"new" | "existing" | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [newItemName, setNewItemName] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = categories.reduce((acc, cat) => acc + cat.items.filter(item => item.packed).length, 0);
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const toggleItem = (categoryIndex: number, itemId: number) => {
    const newCategories = [...categories];
    const item = newCategories[categoryIndex].items.find(i => i.id === itemId);
    if (item) item.packed = !item.packed;
    setCategories(newCategories);
  };

  const resetAll = () => {
    const resetCategories = categories.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, packed: false }))
    }));
    setCategories(resetCategories);
  };

  const addItem = () => {
    if (newItemName.trim()) {
      const newCategories = [...categories];
      const maxId = Math.max(...newCategories.flatMap(cat => cat.items.map(i => i.id)));
      newCategories[selectedCategory].items.push({
        id: maxId + 1,
        name: newItemName.trim(),
        packed: false
      });
      setCategories(newCategories);
      setNewItemName("");
      setShowAddModal(false);
      setAddStep("type");
    }
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      const newCategories = [...categories, {
        name: newCategoryName.trim(),
        items: []
      }];
      setCategories(newCategories);
      setSelectedCategory(newCategories.length - 1);
      setAddStep("item");
    }
  };

  const resetModal = () => {
    setShowAddModal(false);
    setAddStep("type");
    setAddType(null);
    setNewCategoryName("");
    setNewItemName("");
    setSelectedCategory(0);
  };

  const openDeleteModal = (type: "category" | "item", categoryIndex?: number, itemId?: number, name?: string) => {
    setDeleteTarget({type, categoryIndex, itemId, name});
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === "category" && deleteTarget.categoryIndex !== undefined) {
      const newCategories = categories.filter((_, idx) => idx !== deleteTarget.categoryIndex);
      setCategories(newCategories);
    } else if (deleteTarget.type === "item" && deleteTarget.categoryIndex !== undefined && deleteTarget.itemId !== undefined) {
      const newCategories = [...categories];
      newCategories[deleteTarget.categoryIndex].items = newCategories[deleteTarget.categoryIndex].items.filter(item => item.id !== deleteTarget.itemId);
      setCategories(newCategories);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setAddStep("type");
  };

  const shareChecklist = () => {
    const checklistText = categories.map(cat => 
      `${cat.name}:\n${cat.items.map(i => `${i.packed ? '✓' : '○'} ${i.name}`).join('\n')}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(checklistText).then(() => {
      setShareMessage("Checklist copied to clipboard!");
      setTimeout(() => setShareMessage(""), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="bg-[#2E4057] text-white px-6 py-3">
        <span className="text-xl font-semibold text-[#FF6B35]">Traveloop</span>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-black mb-4">Packing Checklist</h1>

        <div className="bg-white rounded-xl border border-gray-300 p-3 mb-4 inline-block">
          <span className="text-sm font-medium text-gray-600">Trip:</span>
          <span className="text-sm font-semibold text-[#2E4057] ml-2">{cityName}</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-300 p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Items Packed</span>
            <span className="text-sm font-semibold text-[#FF6B35]">{packedItems}/{totalItems} ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#FF6B35] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((category, categoryIndex) => (
            <div key={`${categoryIndex}-${category.name}`} className="bg-white rounded-3xl border border-gray-300 overflow-hidden">
              <div className="bg-[#2E4057] text-white px-6 py-3">
                <span className="font-semibold">{category.name}</span>
              </div>
              <div className="p-4 space-y-3">
                {category.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => toggleItem(categoryIndex, item.id)}
                      className="w-5 h-5 accent-[#FF6B35] cursor-pointer"
                    />
                    <span className={`text-base ${item.packed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={openAddModal}
            className="flex-1 py-2 bg-[#2E4057] text-white rounded-xl hover:bg-[#1a2a3d] transition-colors text-sm font-medium"
          >
            + Add Item
          </button>
          <button
            onClick={resetAll}
            className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Reset All
          </button>
          <button
            onClick={shareChecklist}
            className="flex-1 py-2 bg-[#FF6B35] text-white rounded-xl hover:bg-[#e55a2b] transition-colors text-sm font-medium"
          >
            Share Checklist
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex-1 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>

        {shareMessage && (
          <div className="mt-3 p-2 bg-green-100 text-green-700 rounded-lg text-center text-sm">
            {shareMessage}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              {addStep === "type" && (
                <>
                  <h3 className="text-lg font-semibold text-[#2E4057] mb-4">Add New Item</h3>
                  <p className="text-sm text-gray-600 mb-4">What would you like to add?</p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => { setAddType("new"); setAddStep("category"); }}
                      className="flex-1 py-3 bg-[#2E4057] text-white rounded-lg hover:bg-[#1a2a3d]"
                    >
                      New Category
                    </button>
                    <button
                      onClick={() => { setAddType("existing"); setAddStep("category"); }}
                      className="flex-1 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                    >
                      Add to Existing
                    </button>
                  </div>
                  <button
                    onClick={resetModal}
                    className="w-full py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </>
              )}

              {addStep === "category" && addType === "existing" && (
                <>
                  <h3 className="text-lg font-semibold text-[#2E4057] mb-4">Select Category</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={idx}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddStep("type")}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setAddStep("item")}
                      className="flex-1 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {addStep === "category" && addType === "new" && (
                <>
                  <h3 className="text-lg font-semibold text-[#2E4057] mb-4">New Category</h3>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    onKeyDown={(e) => e.key === 'Enter' && addNewCategory()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddStep("type")}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={addNewCategory}
                      className="flex-1 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                    >
                      Create
                    </button>
                  </div>
                </>
              )}

              {addStep === "item" && (
                <>
                  <h3 className="text-lg font-semibold text-[#2E4057] mb-4">
                    {categories[selectedCategory].name}
                  </h3>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Enter item name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAddStep("type")}
                      className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={addItem}
                      className="flex-1 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b]"
                    >
                      Add Item
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showDeleteModal && !deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-[#2E4057] mb-4">Select Item to Delete</h3>
              
              {categories.map((category, catIdx) => (
                <div key={catIdx} className="mb-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[#2E4057]">{category.name}</span>
                    <button
                      onClick={() => {
                        setDeleteTarget({type: "category", categoryIndex: catIdx, name: category.name});
                      }}
                      className="text-xs bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
                    >
                      Delete Category
                    </button>
                  </div>
                  <div className="space-y-1 ml-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <button
                          onClick={() => {
                            setDeleteTarget({type: "item", categoryIndex: catIdx, itemId: item.id, name: item.name});
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full mt-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showDeleteModal && deleteTarget && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold text-[#2E4057] mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete 
                {deleteTarget.type === "category" ? ` "${deleteTarget.name}"?` : ` "${deleteTarget.name}"?`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}