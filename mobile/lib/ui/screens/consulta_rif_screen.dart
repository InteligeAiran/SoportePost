import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:soporte_post/services/api_service.dart';
import 'package:soporte_post/utils/theme.dart';
import 'package:soporte_post/ui/screens/pos_details_modal.dart';

class ConsultaRifScreen extends StatefulWidget {
  const ConsultaRifScreen({super.key});

  @override
  State<ConsultaRifScreen> createState() => _ConsultaRifScreenState();
}

class _ConsultaRifScreenState extends State<ConsultaRifScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();
  String _searchType = 'RIF'; // 'RIF', 'SERIAL', 'RAZON'
  List<dynamic> _results = [];
  bool _isLoading = false;
  String? _errorMessage;

  final List<String> _rifTypes = ['V', 'J', 'G', 'E', 'P'];
  String _selectedRifType = 'V';

  Future<void> _performSearch() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingrese un valor de búsqueda')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _results = [];
    });

    try {
      dynamic response;
      if (_searchType == 'RIF') {
        response = await _apiService.searchByRif('$_selectedRifType$query');
      } else if (_searchType == 'SERIAL') {
        response = await _apiService.searchBySerial(query);
      } else {
        response = await _apiService.searchByRazon(query);
      }

      if (response.data['success'] == true) {
        setState(() {
          _results = response.data['rif'] ?? response.data['serialData'] ?? response.data['data'] ?? [];
          if (_results.isEmpty) {
            _errorMessage = 'No se encontraron resultados';
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSearchTypeSelector(),
          const SizedBox(height: 16),
          _buildSearchInput(),
          const SizedBox(height: 16),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon))
                : _errorMessage != null
                    ? _buildErrorView()
                    : _buildResultsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchTypeSelector() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildTypeChip('RIF'),
          const SizedBox(width: 8),
          _buildTypeChip('SERIAL'),
          const SizedBox(width: 8),
          _buildTypeChip('RAZÓN SOCIAL', value: 'RAZON'),
        ],
      ),
    );
  }

  Widget _buildTypeChip(String label, {String? value}) {
    final typeValue = value ?? label;
    final isSelected = _searchType == typeValue;
    return ChoiceChip(
      label: Text(
        label,
        style: GoogleFonts.orbitron(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: isSelected ? Colors.black : AppTheme.primaryNeon,
        ),
      ),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _searchType = typeValue;
            _results = [];
            _errorMessage = null;
          });
        }
      },
      selectedColor: AppTheme.primaryNeon,
      backgroundColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
        side: BorderSide(color: AppTheme.primaryNeon.withOpacity(0.5)),
      ),
    );
  }

  Widget _buildSearchInput() {
    return Row(
      children: [
        if (_searchType == 'RIF') ...[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            decoration: BoxDecoration(
              color: AppTheme.surfaceDark,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.primaryNeon.withOpacity(0.3)),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedRifType,
                dropdownColor: AppTheme.backgroundDark,
                items: _rifTypes.map((t) => DropdownMenuItem(
                  value: t,
                  child: Text(t, style: const TextStyle(color: AppTheme.primaryNeon)),
                )).toList(),
                onChanged: (val) => setState(() => _selectedRifType = val!),
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
        Expanded(
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Ingresar ${_searchType.toLowerCase()}...',
              suffixIcon: IconButton(
                icon: const Icon(Icons.search, color: AppTheme.primaryNeon),
                onPressed: _performSearch,
              ),
            ),
            onSubmitted: (_) => _performSearch(),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.info_outline, color: Colors.white24, size: 48),
          const SizedBox(height: 16),
          Text(_errorMessage!, style: const TextStyle(color: Colors.white54)),
        ],
      ),
    );
  }

  Widget _buildResultsList() {
    if (_results.isEmpty) {
      return Center(
        child: Text(
          'Utilice el buscador para encontrar un cliente o equipo',
          style: GoogleFonts.orbitron(fontSize: 12, color: Colors.white24),
          textAlign: TextAlign.center,
        ),
      );
    }

    return ListView.builder(
      itemCount: _results.length,
      itemBuilder: (context, index) {
        final item = _results[index];
        return _buildResultCard(item);
      },
    );
  }

  Widget _buildResultCard(Map<String, dynamic> item) {
    final double deuda = double.tryParse(item['deuda']?.toString() ?? '0') ?? 0;
    final bool hasDebt = deuda > 0;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: hasDebt ? Colors.red.withOpacity(0.15) : AppTheme.surfaceDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: hasDebt ? Colors.redAccent.withOpacity(0.5) : AppTheme.primaryNeon.withOpacity(0.2),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    item['razonsocial']?.toString().toUpperCase() ?? 'N/A',
                    style: GoogleFonts.orbitron(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryNeon,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (hasDebt)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.redAccent,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'CON DEUDA',
                      style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            _buildInfoRow('RIF', item['rif']?.toString() ?? 'N/A'),
            _buildInfoRow('SERIAL', item['serial_pos']?.toString() ?? 'N/A', isLink: true, onTap: () {
              _showPosDetails(item['serial_pos']?.toString() ?? '');
            }),
            _buildInfoRow('MODELO', item['name_modelopos']?.toString() ?? 'N/A'),
            _buildInfoRow('FECHA INST.', item['fechainstalacion']?.toString() ?? 'N/A'),
            const SizedBox(height: 8),
            _buildGuaranteeLabel(item['fechainstalacion']?.toString()),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isLink = false, VoidCallback? onTap}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          SizedBox(
            width: 60,
            child: Text(
              '$label:',
              style: const TextStyle(fontSize: 10, color: Colors.white38, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: onTap,
              child: Text(
                value,
                style: TextStyle(
                  fontSize: 11,
                  color: isLink ? Colors.blueAccent : Colors.white70,
                  decoration: isLink ? TextDecoration.underline : null,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGuaranteeLabel(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return const SizedBox.shrink();
    
    try {
      final installDate = DateTime.parse(dateStr);
      final now = DateTime.now();
      final diff = now.difference(installDate).inDays;
      final months = diff / 30;

      final bool hasGuarantee = months <= 6 && months >= 0;
      
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: hasGuarantee ? Colors.green.withOpacity(0.1) : Colors.grey.withOpacity(0.1),
          borderRadius: BorderRadius.circular(4),
          border: Border.all(
            color: hasGuarantee ? Colors.green.withOpacity(0.5) : Colors.grey.withOpacity(0.3),
          ),
        ),
        child: Text(
          hasGuarantee ? 'GARANTÍA INSTALACIÓN (6 MESES)' : 'SIN GARANTÍA',
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.bold,
            color: hasGuarantee ? Colors.greenAccent : Colors.white38,
          ),
        ),
      );
    } catch (e) {
      return const SizedBox.shrink();
    }
  }

  void _showPosDetails(String serial) {
    if (serial.isEmpty) return;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => PosDetailsModal(serial: serial),
    );
  }
}
