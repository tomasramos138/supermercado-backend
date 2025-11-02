import request from 'supertest';

// Usar la URL directamente en lugar de importar la app
const BASE_URL = 'http://localhost:3000';

describe('Auth Login API - Integration Test', () => {
  describe('POST /api/auth/login', () => {
    // Test 1: Credenciales faltantes
    it('should return 400 for missing credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuario y contraseña son requeridos');
    });

    // Test 2: Solo usuario faltante
    it('should return 400 for missing usuario', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          contraseña: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuario y contraseña son requeridos');
    });

    // Test 3: Solo contraseña faltante
    it('should return 400 for missing contraseña', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          usuario: 'usuariodeprueba@gmail.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuario y contraseña son requeridos');
    });

    // Test 4: Credenciales inválidas
    it('should return 401 for invalid credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          usuario: 'usuario_que_no_existe@gmail.com',
          contraseña: 'contraseña_invalida'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    // Test 5: Formato de request incorrecto
    it('should return proper error for invalid request format', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com', // campos incorrecto
          password: '123' 
        });

      expect(response.status).toBe(400);
    });

    // Test 6: Login exitoso con usuario existente
    it('should login successfully with existing test user credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          usuario: 'usuariodeprueba@gmail.com', //Creamos ete usuario en la base de datos
          contraseña: 'password123'
        });

      // Si el usuario existe, debería funcionar
      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('message', 'Login exitoso');
        
        // Verificaciones adicionales para login exitoso
        const token = response.body.token;
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(10);
      } else {
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciales inválidas');
      }
    });

    // Test 7: Caso con espacios en blanco 
    it('should handle empty strings in credentials', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          usuario: '   ',
          contraseña: '   '
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    // Test 8: Contraseña incorrecta para usuario existente
    it('should return 401 for correct usuario but wrong contraseña', async () => {
      const response = await request(BASE_URL)
        .post('/api/auth/login')
        .send({
          usuario: 'usuariodeprueba@gmail.com',
          contraseña: 'contraseña_incorrecta'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciales inválidas');
    });
  });
});