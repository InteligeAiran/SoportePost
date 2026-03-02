import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:soporte_post/models/ticket.dart';
import 'package:soporte_post/providers/ticket_provider.dart';
import 'package:soporte_post/providers/auth_provider.dart';
import 'package:soporte_post/utils/theme.dart';
import 'package:soporte_post/ui/screens/document_viewer_screen.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_fonts/google_fonts.dart';

class TicketDetailScreen extends StatefulWidget {
  final Ticket ticket;

  const TicketDetailScreen({super.key, required this.ticket});

  @override
  State<TicketDetailScreen> createState() => _TicketDetailScreenState();
}

class _TicketDetailScreenState extends State<TicketDetailScreen> {
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TicketProvider>().fetchTimeline(widget.ticket.id);
      context.read<TicketProvider>().fetchAttachments(widget.ticket.id.toString(), widget.ticket.nroTicket);
    });
  }

  Future<void> _takePhoto() async {
    final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
    if (photo != null) {
      final bytes = await photo.readAsBytes();
      final auth = context.read<AuthProvider>();
      final provider = context.read<TicketProvider>();

      final success = await provider.uploadPhoto(
        widget.ticket.id,
        auth.user?.id_user ?? 0,
        widget.ticket.nroTicket,
        'Envio_Destino', // Default for staff delivery
        bytes,
        photo.name,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success ? 'Foto subida con éxito' : 'Error al subir foto'),
            backgroundColor: success ? AppTheme.primaryNeon : Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _updateStatus() async {
    final commentController = TextEditingController();
    final auth = context.read<AuthProvider>();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.backgroundDark,
        title: Text('ENTREGAR TICKET', style: GoogleFonts.orbitron(color: AppTheme.primaryNeon, fontSize: 16)),
        content: TextField(
          controller: commentController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            labelText: 'Comentario',
            prefixIcon: const Icon(Icons.comment),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () async {
              final success = await context.read<TicketProvider>().updateStatus(
                widget.ticket.id,
                auth.user?.id_user ?? 0,
                commentController.text,
              );
              if (mounted) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(success ? 'Ticket entregado' : 'Error al actualizar'),
                    backgroundColor: success ? AppTheme.primaryNeon : Colors.red,
                  ),
                );
                if (success) Navigator.pop(context); // Close detail screen
              }
            },
            child: const Text('CONFIRMAR'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.ticket.nroTicket, style: GoogleFonts.orbitron(color: AppTheme.primaryNeon, fontSize: 18)),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'DETALLES'),
              Tab(text: 'HISTORIAL'),
              Tab(text: 'DOC. COMPLETOS'),
            ],
            indicatorColor: AppTheme.primaryNeon,
            labelColor: AppTheme.primaryNeon,
            unselectedLabelColor: Colors.grey,
          ),
        ),
        body: TabBarView(
          children: [
            _buildDetailsTab(),
            _buildTimelineTab(),
            _buildAttachmentsTab(),
          ],
        ),
        bottomNavigationBar: auth.isStaff ? _buildActionArea() : null,
      ),
    );
  }

  Widget _buildDetailsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _infoCard('Cliente', [
            _infoRow('Razón Social', widget.ticket.razonSocial),
            _infoRow('RIF', widget.ticket.rif),
          ]),
          const SizedBox(height: 16),
          _infoCard('POS', [
            _infoRow('Serial', widget.ticket.serialPos),
            _infoRow('Instalación', widget.ticket.dateInstallation ?? 'No registrada'),
          ]),
          const SizedBox(height: 16),
          _infoCard('Ticket', [
            _infoRow('Falla', widget.ticket.failure),
            _infoRow('Estado', widget.ticket.status),
            _infoRow('Proceso', widget.ticket.process),
            _infoRow('Acción', widget.ticket.action),
            _infoRow('Técnico', widget.ticket.technician),
          ]),
        ],
      ),
    );
  }

  Widget _buildTimelineTab() {
    return Consumer<TicketProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon));
        }
        if (provider.timeline.isEmpty) {
          return const Center(child: Text('No hay historia registrada', style: TextStyle(color: Colors.grey)));
        }
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: provider.timeline.length,
          itemBuilder: (context, index) {
            final item = provider.timeline[index];
            return _timelineStep(item, index == 0, index == provider.timeline.length - 1);
          },
        );
      },
    );
  }

  Widget _buildAttachmentsTab() {
    return Consumer<TicketProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon));
        }
        
        if (provider.attachments.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.folder_open, size: 64, color: Colors.grey),
                SizedBox(height: 16),
                Text('No hay documentos adjuntos', style: TextStyle(color: Colors.grey)),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: provider.attachments.length,
          itemBuilder: (context, index) {
            final doc = provider.attachments[index];
            return Card(
              color: AppTheme.surfaceDark,
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: AppTheme.primaryNeon.withOpacity(0.3)),
              ),
              child: ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryNeon.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    doc.mimeType?.contains('image') == true ? Icons.image : Icons.insert_drive_file,
                    color: AppTheme.primaryNeon,
                  ),
                ),
                title: Text(
                  doc.documentType?.replaceAll('_', ' ') ?? 'Documento',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                subtitle: Text(
                  doc.originalFilename ?? 'archivo.dat',
                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                ),
                trailing: const Icon(Icons.chevron_right, color: AppTheme.primaryNeon),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => DocumentViewerScreen(
                        ticketId: widget.ticket.id.toString(),
                        documentType: doc.documentType ?? '',
                        title: doc.documentType?.replaceAll('_', ' ') ?? 'Documento',
                      ),
                    ),
                  );
                },
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildActionArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark,
        boxShadow: [
          BoxShadow(color: AppTheme.primaryNeon.withOpacity(0.1), blurRadius: 10, spreadRadius: 2),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _takePhoto,
                icon: const Icon(Icons.camera_alt, size: 18),
                label: const Text('FOTO'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.secondaryNeon.withOpacity(0.8),
                  foregroundColor: Colors.white,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _updateStatus,
                icon: const Icon(Icons.check_circle, size: 18),
                label: const Text('ENTREGAR'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryNeon,
                  foregroundColor: AppTheme.backgroundDark,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper widgets...
  Widget _infoCard(String title, List<Widget> rows) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.primaryNeon.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.toUpperCase(), style: GoogleFonts.orbitron(color: AppTheme.primaryNeon, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          ...rows,
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          Flexible(child: Text(value, style: const TextStyle(color: Colors.white, fontSize: 14), textAlign: TextAlign.right)),
        ],
      ),
    );
  }

  Widget _timelineStep(item, bool isFirst, bool isLast) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(width: 2, height: 20, color: isFirst ? Colors.transparent : AppTheme.primaryNeon.withOpacity(0.5)),
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: AppTheme.primaryNeon,
                shape: BoxShape.circle,
                boxShadow: [BoxShadow(color: AppTheme.primaryNeon, blurRadius: 4)],
              ),
            ),
            Container(width: 2, height: 100, color: isLast ? Colors.transparent : AppTheme.primaryNeon.withOpacity(0.5)),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.status.toUpperCase(), style: GoogleFonts.orbitron(color: AppTheme.primaryNeon, fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Text(item.date ?? '', style: const TextStyle(color: Colors.white38, fontSize: 11)),
                if (item.user != null) 
                  Padding(
                    padding: const EdgeInsets.only(top: 2.0),
                    child: Text(item.user, style: const TextStyle(color: AppTheme.secondaryNeon, fontSize: 12, fontWeight: FontWeight.bold)),
                  ),
                if (item.comment != null && item.comment!.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 8),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.white.withOpacity(0.1)),
                    ),
                    child: Text(item.comment!, style: const TextStyle(color: Colors.white70, fontSize: 12, fontStyle: FontStyle.italic)),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
