'use client';

import { useState, useEffect } from 'react';
import { getAllPestNames } from '@/app/pest-services/pests/complete-data';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  service?: any;
}

export default function ServiceModal({ isOpen, onClose, onSubmit, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    service_type: '',
    item_type: 'service' as 'service' | 'product',
    pest_types: '',
    image: null as File | null,
  });
  const [selectedPests, setSelectedPests] = useState<string[]>([]);
  const [pestSearchQuery, setPestSearchQuery] = useState('');
  const [showPestDropdown, setShowPestDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const allPestNames = getAllPestNames();

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        price: service.price?.toString() || '',
        service_type: service.service_type || '',
        item_type: (service.service_type === 'product' ? 'product' : 'service') as 'service' | 'product',
        pest_types: Array.isArray(service.pest_types) ? service.pest_types.join(', ') : '',
        image: null,
      });
      setSelectedPests(Array.isArray(service.pest_types) ? service.pest_types : []);
      setImagePreview(service.image || null);
    } else {
      // Reset form when opening for a new service
      setFormData({
        title: '',
        description: '',
        price: '',
        service_type: '',
        item_type: 'service',
        pest_types: '',
        image: null,
      });
      setSelectedPests([]);
      setImagePreview(null);
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      pest_types: selectedPests.length > 0 ? selectedPests.join(', ') : formData.pest_types,
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="relative bg-gray-900 w-full max-w-2xl rounded-xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold">
            {service ? 'Edit Service/Product' : 'Add New Service/Product'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-white/80 mb-2">Item Type</label>
            <select
              value={formData.item_type}
              onChange={(e) => setFormData({ ...formData, item_type: e.target.value as 'service' | 'product' })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="service">Service</option>
              <option value="product">Product</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 mb-2">
              {formData.item_type === 'product' ? 'Product' : 'Service'} Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">
                {formData.item_type === 'product' ? 'Product Category' : 'Service Category'}
              </label>
              {formData.item_type === 'product' ? (
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="insecticide">Insecticide</option>
                  <option value="herbicide">Herbicide</option>
                  <option value="fungicide">Fungicide</option>
                  <option value="equipment">Equipment</option>
                  <option value="trap">Trap</option>
                  <option value="bait">Bait</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="inspection">Inspection</option>
                  <option value="treatment">Treatment</option>
                  <option value="prevention">Prevention</option>
                  <option value="consultation">Consultation</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="emergency">Emergency Service</option>
                  <option value="other">Other</option>
                </select>
              )}
            </div>
          </div>

          <div className="pest-dropdown-container">
            <label className="block text-white/80 mb-2">Target Pests</label>
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 bg-gray-700 rounded-lg border border-white/20">
                {selectedPests.length > 0 ? (
                  selectedPests.map((pest) => (
                    <span
                      key={pest}
                      className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-emerald-600 text-white' : 'text-white'}`}
                    >
                      {pest}
                      <button
                        type="button"
                        onClick={() => setSelectedPests(selectedPests.filter(p => p !== pest))}
                        className="hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-white/50 text-sm">No pests selected</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={pestSearchQuery}
                  onChange={(e) => {
                    setPestSearchQuery(e.target.value);
                    setShowPestDropdown(true);
                  }}
                  onFocus={() => setShowPestDropdown(true)}
                  onBlur={() => setTimeout(() => setShowPestDropdown(false), 200)}
                  placeholder="Search and select pests..."
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                {showPestDropdown && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-gray-900 border border-white/20 rounded-lg shadow-lg py-1 text-base focus:outline-none sm:text-sm">
                    {allPestNames
                      .filter(pest => 
                        pest.toLowerCase().includes(pestSearchQuery.toLowerCase()) &&
                        !selectedPests.includes(pest)
                      )
                      .map((pest) => (
                        <button
                          key={pest}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (!selectedPests.includes(pest)) {
                              setSelectedPests([...selectedPests, pest]);
                            }
                            setPestSearchQuery('');
                            setShowPestDropdown(false);
                          }}
                          className="w-full text-sm"
                        >
                          {pest}
                        </button>
                      ))}
                    {allPestNames.filter(pest => 
                      pest.toLowerCase().includes(pestSearchQuery.toLowerCase()) &&
                      !selectedPests.includes(pest)
                    ).length === 0 && (
                      <div className="px-4 py-2 text-white/50 text-sm">No pests found</div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/60 mt-1">
                Selected: {selectedPests.length} pest{selectedPests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-white/80 mb-2">
              {formData.item_type === 'product' ? 'Product' : 'Service'} Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setFormData({ ...formData, image: file });
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg max-h-48 mx-auto" />
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium"
            >
              {service ? 'Update Item' : `Create ${formData.item_type === 'product' ? 'Product' : 'Service'}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
