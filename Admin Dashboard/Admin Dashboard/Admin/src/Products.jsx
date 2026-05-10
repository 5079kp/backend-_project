import { useState } from 'react'

export default function Products({ products, onAdd, onUpdate, onDelete, error }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' })

  function handleEdit(product) {
    setEditingId(product._id)
    setFormData({ name: product.name, price: product.price, stock: product.stock })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setFormData({ name: '', price: '', stock: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editingId) {
      onUpdate(editingId, { ...formData, price: Number(formData.price), stock: Number(formData.stock) })
      setEditingId(null)
    } else {
      onAdd({ ...formData, price: Number(formData.price), stock: Number(formData.stock) })
    }
    setFormData({ name: '', price: '', stock: '' })
  }

  return (
    <div className="content-shell">
      <section className="section-header">
        <div>
          <h2>Product Management</h2>
          <p>Add new products, update pricing or stock, and remove old inventory.</p>
        </div>
      </section>

      {error && <div className="content-error">{error}</div>}

      <div className="form-card">
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price ($)"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={e => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          <button type="submit">{editingId ? 'Save Changes' : 'Add Product'}</button>
          {editingId && <button type="button" onClick={handleCancelEdit} className="delete-button">Cancel</button>}
        </form>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(product)} style={{marginRight: '8px', background: '#3b82f6', border: 'none', padding: '6px 12px', color: '#fff', borderRadius: '4px', cursor: 'pointer'}}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => onDelete(product._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
