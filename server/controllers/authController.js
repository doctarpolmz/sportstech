const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Mock user database (replace with real database in production)
const users = new Map();

// Demo users
users.set('farmer@demo.com', {
  id: uuidv4(),
  email: 'farmer@demo.com',
  password: bcrypt.hashSync('demo123', 10),
  role: 'farmer',
  name: 'John Mukasa',
  phone: '+256700000001',
  profile: {
    landSize: 2.5,
    crops: ['Coffee', 'Maize'],
    location: 'Wakiso District',
    vslaStatus: 'active'
  }
});

users.set('fsp@demo.com', {
  id: uuidv4(),
  email: 'fsp@demo.com',
  password: bcrypt.hashSync('demo123', 10),
  role: 'fsp',
  name: 'Centenary Bank',
  organization: 'Centenary Bank Uganda'
});

users.set('admin@demo.com', {
  id: uuidv4(),
  email: 'admin@demo.com',
  password: bcrypt.hashSync('demo123', 10),
  role: 'admin',
  name: 'ARIP Administrator'
});

class AuthController {
  register(req, res) {
    const { email, password, name, role, phone, profile } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role: role || 'farmer',
      name,
      phone,
      profile: profile || {},
      createdAt: new Date()
    };
    
    users.set(email, user);
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'arip-secret-key',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  }
  
  login(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = users.get(email);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'arip-secret-key',
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  }
  
  verifyToken(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arip-secret-key');
      res.json({ valid: true, decoded });
    } catch (error) {
      res.status(401).json({ valid: false, error: 'Invalid token' });
    }
  }
  
  refreshToken(req, res) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arip-secret-key');
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET || 'arip-secret-key',
        { expiresIn: '7d' }
      );
      
      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

module.exports = new AuthController();
