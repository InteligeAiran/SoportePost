import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:soporte_post/services/api_service.dart';
import 'package:soporte_post/utils/theme.dart';

class PosDetailsModal extends StatefulWidget {
  final String serial;

  const PosDetailsModal({super.key, required this.serial});

  @override
  State<PosDetailsModal> createState() => _PosDetailsModalState();
}

class _PosDetailsModalState extends State<PosDetailsModal> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _details;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchDetails();
  }

  Future<void> _fetchDetails() async {
    try {
      final response = await _apiService.searchSerialDetails(widget.serial);
      if (response.data['success'] == true && response.data['serial'] != null && response.data['serial'].isNotEmpty) {
        setState(() {
          _details = response.data['serial'][0];
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = response.data['message'] ?? 'No se encontraron detalles';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error de conexión: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: AppTheme.backgroundDark,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(color: AppTheme.primaryNeon, blurRadius: 10, spreadRadius: -5),
        ],
      ),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon))
                : _errorMessage != null
                    ? _buildErrorView()
                    : _buildDetailsList(),
          ),
          _buildActionButtons(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: AppTheme.primaryNeon.withOpacity(0.3))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'DETALLES DEL POS',
            style: GoogleFonts.orbitron(
              color: AppTheme.primaryNeon,
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.white54),
            onPressed: () => Navigator.pop(context),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Text(_errorMessage!, style: const TextStyle(color: Colors.white54)),
    );
  }

  Widget _buildDetailsList() {
    if (_details == null) return const SizedBox.shrink();

    final List<MapEntry<String, dynamic>> entries = _details!.entries
        .where((e) => e.value != null && e.value.toString().isNotEmpty)
        .toList();

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: entries.length,
      itemBuilder: (context, index) {
        final entry = entries[index];
        final key = entry.key.replaceAll('_', ' ').toUpperCase();
        final value = entry.value.toString();

        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: Text(
                  key,
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white38,
                  ),
                ),
              ),
              Expanded(
                flex: 3,
                child: Text(
                  value,
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildActionButtons() {
    if (_isLoading || _details == null) return const SizedBox.shrink();

    final status = _details!['Estatus_Pos']?.toString() ?? '';
    final isInactive = status == 'Equipo Desafiliado' || status == 'Equipo Inactivo';

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: AppTheme.primaryNeon.withOpacity(0.1))),
      ),
      child: Column(
        children: [
          if (isInactive)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.redAccent.withOpacity(0.5)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, color: Colors.redAccent),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Equipo no instalado. No se pueden generar tickets.',
                      style: TextStyle(color: Colors.redAccent, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: isInactive ? null : () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryNeon,
                    foregroundColor: Colors.black,
                  ),
                  child: const Text('TICKET FALLA 1'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: isInactive ? null : () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryNeon,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('TICKET FALLA 2'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
