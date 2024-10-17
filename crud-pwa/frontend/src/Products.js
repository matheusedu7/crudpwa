import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductManager.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
    
        if (!token) {
            alert('Você precisa estar logado para acessar esta página');
            navigate('/login');
            return;
        }
        
        fetchProducts();
    }, [navigate]);

    // Função para buscar todos os produtos
    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8080/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos', error.response ? error.response.data : error.message);
        }
    };

    // Função para criar um novo produto
    const handleCreateProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8080/products', {
                name,
                price,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Produto criado com sucesso');
            setName('');
            setPrice('');
            setDescription('');
            fetchProducts();
        } catch (error) {
            console.error('Erro ao criar produto', error.response ? error.response.data : error.message);
        }
    };

    // Função para preencher o formulário com o produto selecionado para edição
    const handleEditProduct = (product) => {
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setEditingProduct(product);
    };

    // Função para atualizar o produto
    const handleUpdateProduct = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:8080/products/${editingProduct._id}`, {
                name,
                price,
                description
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Produto atualizado com sucesso');
            setName('');
            setPrice('');
            setDescription('');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Erro ao atualizar produto', error.response ? error.response.data : error.message);
        }
    };

    // Função para deletar um produto
    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Produto deletado com sucesso');
            fetchProducts();
        } catch (error) {
            console.error('Erro ao deletar produto', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="product-manager">
            <h2>Gerenciamento de Produtos</h2>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Nome do Produto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="number"
                    placeholder="Preço"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Descrição"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {editingProduct ? (
                <button className="update" onClick={handleUpdateProduct}>Atualizar Produto</button>
            ) : (
                <button className="create" onClick={handleCreateProduct}>Criar Produto</button>
            )}

            <h2>Lista de Produtos</h2>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product._id}>
                        <div>
                            {product.name} - {product.price} - {product.description}
                        </div>
                        <div className="product-actions">
                            <button className="edit" onClick={() => handleEditProduct(product)}>Editar</button>
                            <button className="delete" onClick={() => handleDeleteProduct(product._id)}>Deletar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductManager;
