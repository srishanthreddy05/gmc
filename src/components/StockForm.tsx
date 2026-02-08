'use client';

import { Product } from '@/types';
import { FormEvent, useState, useEffect } from 'react';
import { getDatabase } from '@/utils/firebase';
import { ref, push, update } from 'firebase/database';
import { uploadImageToCloudinary } from '@/utils/cloudinary';

interface StockFormProps {
  editingProduct: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM_STATE = {
  name: '',
  price: '',
  stock: '',
  description: '',
  displayImage: '',
  album: '',
  enabled: true,
};

export const StockForm = ({ editingProduct, onClose, onSuccess }: StockFormProps) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayImageFile, setDisplayImageFile] = useState<File | null>(null);
  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price.toString(),
        stock: editingProduct.stock.toString(),
        description: editingProduct.description,
        displayImage: editingProduct.displayImage,
        album: editingProduct.album?.join('\n') || '',
        enabled: editingProduct.enabled,
      });
      setDisplayImageFile(null);
      setAlbumFiles([]);
    } else {
      setFormData(INITIAL_FORM_STATE);
      setDisplayImageFile(null);
      setAlbumFiles([]);
    }
  }, [editingProduct]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setError('Price must be a valid positive number');
      return false;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      setError('Stock must be a valid non-negative number');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.displayImage.trim() && !displayImageFile) {
      setError('Display image is required (upload a file or enter a URL)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const database = getDatabase();
      
      // Upload display image if file is selected
      let displayImageUrl = formData.displayImage;
      if (displayImageFile) {
        setUploadProgress('Uploading display image to Cloudinary...');
        displayImageUrl = await uploadImageToCloudinary(displayImageFile);
      }
      
      // Upload album images if files are selected
      const albumUrls: string[] = [];
      if (albumFiles.length > 0) {
        for (let i = 0; i < albumFiles.length; i++) {
          setUploadProgress(`Uploading image ${i + 1} of ${albumFiles.length} to Cloudinary...`);
          const url = await uploadImageToCloudinary(albumFiles[i]);
          albumUrls.push(url);
        }
      }
      
      // Parse URL album entries
      const urlAlbum = formData.album
        .split('\n')
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
      
      // Combine uploaded images with URL entries
      const album = [...albumUrls, ...urlAlbum];
      
      setUploadProgress('Saving product...');

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        displayImage: displayImageUrl,
        ...(album.length > 0 && { album }),
        enabled: formData.enabled,
        updatedAt: Date.now(),
      };

      if (editingProduct) {
        // Update existing product
        const productRef = ref(database, `stock/${editingProduct.productId}`);
        await update(productRef, productData);
        console.log('Product updated successfully:', editingProduct.productId);
      } else {
        // Create new product
        const stockRef = ref(database, 'stock');
        const result = await push(stockRef, {
          ...productData,
          createdAt: Date.now(),
        });
        console.log('Product created successfully:', result.key);
      }

      setUploadProgress('Product saved successfully!');
      setTimeout(() => {
        onSuccess();
        setFormData(INITIAL_FORM_STATE);
        setDisplayImageFile(null);
        setAlbumFiles([]);
        setUploadProgress('');
      }, 500);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-8 mb-6 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-300">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-500 border border-red-600 text-white rounded-lg font-semibold">{error}</div>}
      {uploadProgress && <div className="mb-4 p-3 bg-blue-500 border border-blue-600 text-white rounded-lg font-semibold">{uploadProgress}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2 text-slate-100">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-100">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0" 
              className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-100">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-100">Enabled</label>
            <select
              name="enabled"
              value={formData.enabled.toString()}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, enabled: e.target.value === 'true' }))
              }
              className="w-full bg-slate-600 border-2 border-slate-500 text-white rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              disabled={loading}
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-100">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
            rows={3}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-100">Display Image *</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setDisplayImageFile(file);
                  setFormData((prev) => ({ ...prev, displayImage: '' }));
                }
              }}
              className="w-full bg-slate-600 border-2 border-slate-500 text-slate-100 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-1 file:rounded file:cursor-pointer"
              disabled={loading}
            />
            {displayImageFile && (
              <p className="text-sm text-green-300 font-semibold">✓ Selected: {displayImageFile.name}</p>
            )}
            <div className="text-sm text-slate-300">Or enter URL:</div>
            <input
              type="url"
              name="displayImage"
              value={formData.displayImage}
              onChange={(e) => {
                handleInputChange(e);
                setDisplayImageFile(null);
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2 text-slate-100">Album Images</label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAlbumFiles(files);
              }}
              className="w-full bg-slate-600 border-2 border-slate-500 text-slate-100 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-1 file:rounded file:cursor-pointer"
              disabled={loading}
            />
            {albumFiles.length > 0 && (
              <p className="text-sm text-green-300 font-semibold">✓ {albumFiles.length} file(s) selected</p>
            )}
            <div className="text-sm text-slate-300">Or enter URLs (one per line):</div>
            <textarea
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="w-full bg-slate-600 border-2 border-slate-500 text-white placeholder-slate-400 rounded px-4 py-2.5 focus:border-blue-400 focus:outline-none transition"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition disabled:opacity-50 shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
