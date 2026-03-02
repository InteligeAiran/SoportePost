import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:soporte_post/providers/auth_provider.dart';
import 'package:soporte_post/utils/theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isStaff = true; // Toggle between Staff and Client

  void _handleLogin() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    bool success;
    
    if (_isStaff) {
      success = await auth.login(
        _usernameController.text,
        _passwordController.text,
      );
    } else {
      success = await auth.loginAsClient(_usernameController.text);
    }

    if (success) {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.errorMessage ?? 'Error al iniciar sesión'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.backgroundDark,
              AppTheme.surfaceDark.withOpacity(0.8),
              AppTheme.backgroundDark,
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo / Icon
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryNeon.withOpacity(0.5),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Image.asset(
                      'assets/images/app_icon.png',
                      height: 100,
                      width: 100,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'SOPORTE POST',
                    style: GoogleFonts.orbitron(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryNeon,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'SISTEMA DE GESTIÓN POS',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                      letterSpacing: 4,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Role Toggle
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildRoleButton('VENDEDOR / TÉCNICO', _isStaff, () => setState(() => _isStaff = true)),
                      const SizedBox(width: 8),
                      _buildRoleButton('CLIENTE (POS)', !_isStaff, () => setState(() => _isStaff = false)),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Login Form
                  TextField(
                    controller: _usernameController,
                    decoration: InputDecoration(
                      labelText: _isStaff ? 'Usuario' : 'RIF del Comercio',
                      prefixIcon: Icon(_isStaff ? Icons.person_outline : Icons.business_outlined),
                    ),
                  ),
                  if (_isStaff) ...[
                    const SizedBox(height: 16),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Contraseña',
                        prefixIcon: Icon(Icons.lock_outline),
                      ),
                    ),
                  ],
                  const SizedBox(height: 32),

                  // Login Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: Consumer<AuthProvider>(
                      builder: (context, auth, child) {
                        return ElevatedButton(
                          onPressed: auth.isLoading ? null : _handleLogin,
                          child: auth.isLoading
                              ? const CircularProgressIndicator(color: AppTheme.backgroundDark)
                              : Text(_isStaff ? 'INICIAR SESIÓN' : 'LOGUEAR COMO CLIENTE'),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleButton(String title, bool isActive, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(
            color: isActive ? AppTheme.primaryNeon : Colors.white12,
          ),
          borderRadius: BorderRadius.circular(20),
          color: isActive ? AppTheme.primaryNeon.withOpacity(0.1) : Colors.transparent,
        ),
        child: Text(
          title,
          style: TextStyle(
            fontSize: 10,
            color: isActive ? AppTheme.primaryNeon : Colors.white24,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
