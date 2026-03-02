import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:soporte_post/models/user.dart';
import 'package:soporte_post/services/api_service.dart';
import 'package:soporte_post/utils/constants.dart';

enum AuthType { staff, client }

class AuthProvider with ChangeNotifier {
  User? _user;
  String? _clientRif;
  AuthType? _authType;
  String? _sessionId;
  bool _isLoading = false;
  String? _errorMessage;

  User? get user => _user;
  String? get clientRif => _clientRif;
  AuthType? get authType => _authType;
  String? get sessionId => _sessionId;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _sessionId != null || _clientRif != null;
  bool get isStaff => _authType == AuthType.staff;
  bool get isClient => _authType == AuthType.client;

  final ApiService _apiService = ApiService();

  AuthProvider() {
    _loadSession();
  }

  /// Loads the session from local storage if it exists
  Future<void> _loadSession() async {
    final prefs = await SharedPreferences.getInstance();
    _sessionId = prefs.getString(AppConstants.tokenKey);
    _clientRif = prefs.getString('client_rif');
    final authTypeStr = prefs.getString('auth_type');
    final userData = prefs.getString(AppConstants.userDataKey);
    
    if (authTypeStr == 'staff') {
      _authType = AuthType.staff;
      if (userData != null) {
        _user = User.fromJson(jsonDecode(userData));
      }
    } else if (authTypeStr == 'client') {
      _authType = AuthType.client;
    }
    notifyListeners();
  }

  /// Handles user login
  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.post(AppConstants.login, {
        'username': username,
        'password': password, // The ApiService handles hashing separately or we do it here
      });

      if (response.statusCode == 200 && response.data['success'] == true) {
        _sessionId = response.data['session_id'];
        _user = User.fromJson(response.data);
        _authType = AuthType.staff;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.tokenKey, _sessionId!);
        await prefs.setString(AppConstants.userDataKey, jsonEncode(_user!.toJson()));
        await prefs.setString('auth_type', 'staff');

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response.data['message'] ?? 'Error desconocido';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Handles client login (RIF-based)
  Future<bool> loginAsClient(String rif) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.validateRif(rif);

      if (response.statusCode == 200 && response.data['success'] == true) {
        _clientRif = rif;
        _authType = AuthType.client;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('client_rif', rif);
        await prefs.setString('auth_type', 'client');

        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = response.data['message'] ?? 'RIF no verificado';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Handles user logout
  Future<void> logout() async {
    if (_sessionId != null) {
      await _apiService.post(AppConstants.logout, {
        'session_id': _sessionId,
      });
    }

    _user = null;
    _clientRif = null;
    _authType = null;
    _sessionId = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.tokenKey);
    await prefs.remove(AppConstants.userDataKey);
    await prefs.remove('client_rif');
    await prefs.remove('auth_type');
    notifyListeners();
  }
}
