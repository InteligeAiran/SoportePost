import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:soporte_post/models/ticket.dart';
import 'package:soporte_post/services/api_service.dart';
import 'package:soporte_post/utils/theme.dart';
import 'package:soporte_post/ui/screens/ticket_detail_screen.dart';

class ConsultaTicketsScreen extends StatefulWidget {
  const ConsultaTicketsScreen({super.key});

  @override
  State<ConsultaTicketsScreen> createState() => _ConsultaTicketsScreenState();
}

class _ConsultaTicketsScreenState extends State<ConsultaTicketsScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();
  List<Ticket> _tickets = [];
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _searchTicket() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _tickets = [];
    });

    try {
      final response = await _apiService.globalSearchTicket(query);
      if (response.data['success'] == true) {
        final List<dynamic> data = response.data['data'] ?? [];
        setState(() {
          _tickets = data.map((item) => Ticket.fromJson(item)).toList();
          if (_tickets.isEmpty) {
            _errorMessage = 'No se encontró el ticket';
          }
        });
      } else {
        setState(() {
          _errorMessage = response.data['message'] ?? 'Error en la búsqueda';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error de conexión: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Buscar por número de ticket...',
              suffixIcon: IconButton(
                icon: const Icon(Icons.search, color: AppTheme.primaryNeon),
                onPressed: _searchTicket,
              ),
            ),
            onSubmitted: (_) => _searchTicket(),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon))
                : _errorMessage != null
                    ? _buildErrorView()
                    : _buildTicketsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, color: Colors.white24, size: 48),
          const SizedBox(height: 16),
          Text(_errorMessage!, style: const TextStyle(color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildTicketsList() {
    if (_tickets.isEmpty) {
      return Center(
        child: Text(
          'Ingrese un número de ticket para buscar',
          style: GoogleFonts.orbitron(fontSize: 12, color: Colors.white24),
        ),
      );
    }

    return ListView.builder(
      itemCount: _tickets.length,
      itemBuilder: (context, index) {
        final ticket = _tickets[index];
        return _buildTicketCard(ticket);
      },
    );
  }

  Widget _buildTicketCard(Ticket ticket) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: AppTheme.surfaceDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: _getStatusColor(ticket.status).withOpacity(0.3),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '#${ticket.nroTicket}',
                  style: GoogleFonts.orbitron(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryNeon,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(ticket.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: _getStatusColor(ticket.status).withOpacity(0.5)),
                  ),
                  child: Text(
                    ticket.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                      color: _getStatusColor(ticket.status),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _buildDetailRow('Cliente:', ticket.razonSocial),
            _buildDetailRow('Serial:', ticket.serialPos),
            _buildDetailRow('Falla:', ticket.failure),
            _buildDetailRow('Fecha:', ticket.date),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TicketDetailScreen(ticket: ticket),
                    ),
                  );
                },
                icon: const Icon(Icons.visibility_outlined, size: 18, color: AppTheme.primaryNeon),
                label: const Text('VER DETALLES', style: TextStyle(color: AppTheme.primaryNeon, fontSize: 11)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 70,
            child: Text(
              label,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white38),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    final s = status.toLowerCase();
    if (s.contains('abierto') || s.contains('nuevo')) return Colors.blueAccent;
    if (s.contains('proceso')) return Colors.orangeAccent;
    if (s.contains('resuelto') || s.contains('cerrado')) return Colors.greenAccent;
    return Colors.grey;
  }
}
