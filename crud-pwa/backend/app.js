const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path'); // Importar path para servir os arquivos da pasta build
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// Configurar CORS para permitir requisições do frontend
app.use(cors({
    origin: 'http://localhost:3000' // Permitir que o frontend faça requisições
}));

// Middleware para interpretar JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/crud', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.log("Erro ao conectar ao MongoDB", err));

// Modelo de Usuário (User)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

// *** Rota para Registro de Usuário ***
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao registrar o usuário', error: err.message });
    }
});

// *** Rota para Login de Usuário ***
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuário não encontrado" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Senha incorreta" });

        // Gera um token JWT
        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login', error: err.message });
    }
});

// Middleware de Autenticação JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verifica se o cabeçalho Authorization foi fornecido
    if (!authHeader) {
        return res.status(403).json({ message: 'Token necessário' });
    }

    // Remove o prefixo 'Bearer ' do token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'Token inválido ou ausente' });
    }

    // Verifica o token JWT
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Falha na autenticação, token inválido' });
        }
        
        // Se o token for válido, armazene o id do usuário no objeto req
        req.userId = decoded.id;
        next();
    });
};

// *** Rota Protegida para Exibir Perfil do Usuário ***
app.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar o perfil', error: err.message });
    }
});

// *** Rotas CRUD para Produtos ***
const Product = require('./models/Product'); // Importe o modelo Product

// Rota para criar um produto (Autenticada)
app.post('/products', authMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar produto', error: err.message });
    }
});

// Rota para listar todos os produtos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar produtos', error: err.message });
    }
});

// Rota para atualizar um produto (Autenticada)
app.put('/products/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error: err.message });
    }
});

// Rota para deletar um produto (Autenticada)
app.delete('/products/:id', authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar produto', error: err.message });
    }
});

// *** Configuração para servir o front-end ***
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Servir o index.html para qualquer rota que não corresponda às rotas da API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Iniciar o Servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
