import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/ticket.dart';
import '../models/timeline_item.dart';
import '../models/attachment.dart';
import 'package:soporte_post/services/api_service.dart';
import 'package:soporte_post/utils/constants.dart';

class TicketProvider with ChangeNotifier {
  List<Ticket> _tickets = [];
  List<TimelineItem> _timeline = [];
  List<Attachment> _attachments = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Ticket> get tickets => _tickets;
  List<TimelineItem> get timeline => _timeline;
  List<Attachment> get attachments => _attachments;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  final ApiService _apiService = ApiService();

  /// Fetches the ticket list from the backend
  Future<void> fetchTickets() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final userIdStr = prefs.getString(AppConstants.userIdKey);
      
      final Map<String, dynamic> requestBody = {};
      if (userIdStr != null) {
        requestBody['id_user'] = userIdStr;
      }

      final response = await _apiService.post(AppConstants.tickets, requestBody);

      if (response.statusCode == 200 && response.data['success'] == true) {
        final List<dynamic> data = response.data['ticket'] ?? response.data['data'] ?? [];
        _tickets = data.map((json) => Ticket.fromJson(json)).toList();
        _isLoading = false;
        notifyListeners();
      } else {
        _errorMessage = response.data['message'] ?? 'Error al cargar tickets';
        _isLoading = false;
        notifyListeners();
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetches tickets for a specific client RIF
  Future<void> fetchTicketsByRif(String rif) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.searchByRif(rif);

      if (response.statusCode == 200 && response.data['success'] == true) {
        final List<dynamic> data = response.data['rif'] ?? [];
        _tickets = data.map((json) => Ticket.fromJson(json)).toList();
        _isLoading = false;
        notifyListeners();
      } else {
        _errorMessage = response.data['message'] ?? 'No se encontraron tickets para este RIF';
        _tickets = [];
        _isLoading = false;
        notifyListeners();
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAttachments(String ticketId, String nroTicket) async {
    _isLoading = true;
    _attachments = [];
    notifyListeners();

    try {
      final data = await _apiService.getAllTicketDocuments(ticketId, nroTicket);
      _attachments = data.map((item) => Attachment.fromJson(item)).toList();
    } catch (e) {
      print('Error loading attachments: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetches the timeline for a specific ticket
  Future<void> fetchTimeline(int ticketId) async {
    _isLoading = true;
    _timeline = [];
    notifyListeners();

    try {
      final response = await _apiService.getTicketTimeline(ticketId);
      if (response.statusCode == 200 && response.data['success'] == true) {
        final List<dynamic> details = response.data['details'] ?? [];
        _timeline = details.map((json) => TimelineItem.fromJson(json)).toList();
      }
    } catch (e) {
      debugPrint('Error fetching timeline: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Updates the status of a ticket
  Future<bool> updateStatus(int ticketId, int userId, String comment) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.updateTicketStatus(ticketId, userId, comment);
      if (response.statusCode == 200 && response.data['success'] == true) {
        await fetchTickets(); // Refresh list
        return true;
      } else {
        _errorMessage = response.data['message'] ?? 'Error al actualizar estado';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Uploads a photo for a ticket
  Future<bool> uploadPhoto(int ticketId, int userId, String nroTicket, String documentType, List<int> bytes, String fileName) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.uploadPhoto(ticketId, userId, nroTicket, documentType, bytes, fileName);
      if (response.statusCode == 200 && response.data['success'] == true) {
        return true;
      } else {
        _errorMessage = response.data['message'] ?? 'Error al subir foto';
        return false;
      }
    } catch (e) {
      _errorMessage = 'Error de conexión: $e';
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Searches tickets by a query (RIF, Serial, etc.)
  List<Ticket> search(String query) {
    if (query.isEmpty) return _tickets;
    
    final lowerQuery = query.toLowerCase();
    return _tickets.where((ticket) {
      return ticket.nroTicket.toLowerCase().contains(lowerQuery) ||
             ticket.rif.toLowerCase().contains(lowerQuery) ||
             ticket.serialPos.toLowerCase().contains(lowerQuery) ||
             ticket.razonSocial.toLowerCase().contains(lowerQuery);
    }).toList();
  }
}
