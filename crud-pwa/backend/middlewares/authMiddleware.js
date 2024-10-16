const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido' });
    }

    const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(actualToken, 'sua_chave_secreta', { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
