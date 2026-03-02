import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:soporte_post/models/ticket.dart';
import 'package:soporte_post/providers/auth_provider.dart';
import 'package:soporte_post/providers/ticket_provider.dart';
import 'package:soporte_post/utils/theme.dart';
import 'package:soporte_post/ui/screens/ticket_detail_screen.dart';
import 'package:soporte_post/ui/screens/consulta_rif_screen.dart';
import 'package:soporte_post/ui/screens/consulta_tickets_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();
  String _selectedModule = 'Gestión de Tickets';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final ticketProvider = Provider.of<TicketProvider>(context, listen: false);
      
      if (auth.isStaff) {
        ticketProvider.fetchTickets();
      } else if (auth.isClient && auth.clientRif != null) {
        ticketProvider.fetchTicketsByRif(auth.clientRif!);
      }
    });
  }

  // Removed deprecated _buildDrawerItem method as it was replaced by _buildExpansionCategory and _buildSubmoduleItem


  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final ticketProvider = Provider.of<TicketProvider>(context);
    final user = auth.user;
    final tickets = ticketProvider.search(_searchController.text);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/images/app_icon.png',
              height: 32,
              width: 32,
            ),
            const SizedBox(width: 12),
            Flexible(
              child: Text(
                _selectedModule.toUpperCase(),
                style: GoogleFonts.orbitron(fontSize: 16, fontWeight: FontWeight.bold),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppTheme.secondaryNeon),
            onPressed: () {
              auth.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      ),
      drawer: Drawer(
        backgroundColor: AppTheme.backgroundDark,
        child: Column(
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppTheme.primaryNeon.withOpacity(0.2), Colors.transparent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/app_icon.png',
                      height: 60,
                      width: 60,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'SOPORTE POST',
                      style: GoogleFonts.orbitron(
                        color: AppTheme.primaryNeon,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.person_outline, color: AppTheme.primaryNeon),
              title: Text(auth.isStaff ? (user?.names ?? 'Usuario') : 'Cliente POS'),
              subtitle: Text(auth.isStaff ? (user?.roleName ?? '') : auth.clientRif ?? ''),
            ),
            const Divider(color: Colors.white10),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: auth.isStaff ? [
                  // --- CATEGORÍA: CONSULTAS Y REPORTES ---
                  _buildExpansionCategory(
                    icon: Icons.search,
                    title: 'CONSULTAS Y REPORTES',
                    children: [
                      _buildSubmoduleItem('Consulta de RIF', Icons.person_search),
                      _buildSubmoduleItem('Consulta Tickets', Icons.summarize),
                    ],
                  ),

                  // --- CATEGORÍA: GESTIÓN DE TICKETS ---
                  _buildExpansionCategory(
                    icon: Icons.confirmation_number,
                    title: 'GESTIÓN DE TICKETS',
                    children: [
                      _buildSubmoduleItem('Crear Ticket', Icons.add_circle_outline),
                      _buildSubmoduleItem('Gestión Coordinador', Icons.engineering),
                      _buildSubmoduleItem('Gestión Técnicos', Icons.groups),
                      _buildSubmoduleItem('Gestión Taller', Icons.build),
                      _buildSubmoduleItem('Pendiente por Entregar', Icons.pending_actions),
                    ],
                  ),

                  // --- CATEGORÍA: ADMINISTRACIÓN ---
                  _buildExpansionCategory(
                    icon: Icons.admin_panel_settings,
                    title: 'ADMINISTRACIÓN',
                    children: [
                      _buildSubmoduleItem('Gestión de Pagos', Icons.payments),
                      _buildSubmoduleItem('Presupuesto', Icons.description),
                      _buildSubmoduleItem('Verificación de Solvencia', Icons.fact_check),
                      _buildSubmoduleItem('Documentos', Icons.archive),
                      _buildSubmoduleItem('Gestión Comercial', Icons.storefront),
                    ],
                  ),

                  // --- CATEGORÍA: CONFIGURACIÓN ---
                  if (user?.roleId == 1 || user?.roleId == 2)
                    _buildExpansionCategory(
                      icon: Icons.settings,
                      title: 'CONFIGURACIÓN',
                      children: [
                        _buildSubmoduleItem('Gestión Usuario', Icons.manage_accounts),
                      ],
                    ),
                ] : [
                  _buildSubmoduleItem('Mis Equipos POS', Icons.confirmation_number),
                ],
              ),
            ),
            const Divider(color: Colors.white10),
            ListTile(
              leading: const Icon(Icons.logout, color: AppTheme.secondaryNeon),
              title: Text(
                'CERRAR SESIÓN',
                style: GoogleFonts.orbitron(
                  color: AppTheme.secondaryNeon,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              onTap: () {
                auth.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
      body: (_selectedModule == 'Gestión de Tickets' || _selectedModule == 'Mis Equipos POS') 
          ? Column(
              children: [
          // Search & User Info
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      auth.isStaff ? 'Hola, ${user?.names}' : 'RIF: ${auth.clientRif}',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryNeon.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.primaryNeon.withOpacity(0.5)),
                      ),
                      child: Text(
                        auth.isStaff ? (user?.roleName ?? 'Staff') : 'CLIE POS',
                        style: const TextStyle(fontSize: 10, color: AppTheme.primaryNeon),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _searchController,
                  onChanged: (value) => setState(() {}),
                  decoration: const InputDecoration(
                    hintText: 'Buscar por Ticket, RIF o Serial...',
                    prefixIcon: Icon(Icons.search),
                  ),
                ),
              ],
            ),
          ),

          // Ticket List
          Expanded(
            child: ticketProvider.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryNeon))
                : tickets.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.search_off, size: 64, color: Colors.white24),
                            const SizedBox(height: 16),
                            Text(
                              ticketProvider.errorMessage ?? 'No se encontraron tickets',
                              style: const TextStyle(color: Colors.white54),
                            ),
                            ElevatedButton(
                              onPressed: () => ticketProvider.fetchTickets(),
                              child: const Text('REINTENTAR'),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () {
                          if (auth.isStaff) {
                            return ticketProvider.fetchTickets();
                          } else {
                            return ticketProvider.fetchTicketsByRif(auth.clientRif!);
                          }
                        },
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: tickets.length,
                          itemBuilder: (context, index) {
                            final ticket = tickets[index];
                            return _buildTicketCard(ticket, auth);
                          },
                        ),
                      ),
          ),
          ],
        )
      : _buildModuleContent(_selectedModule),
    );
  }

  Widget _buildExpansionCategory({
    required IconData icon,
    required String title,
    required List<Widget> children,
  }) {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        leading: Icon(icon, color: AppTheme.primaryNeon),
        title: Text(
          title,
          style: GoogleFonts.orbitron(
            color: Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        iconColor: AppTheme.primaryNeon,
        collapsedIconColor: Colors.white54,
        childrenPadding: const EdgeInsets.only(left: 16),
        children: children,
      ),
    );
  }

  Widget _buildSubmoduleItem(String title, IconData icon) {
    final isSelected = _selectedModule == title;
    return ListTile(
      leading: Icon(
        icon,
        size: 20,
        color: isSelected ? AppTheme.primaryNeon : Colors.white54,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? AppTheme.primaryNeon : Colors.white70,
          fontSize: 13,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      onTap: () {
        setState(() {
          _selectedModule = title;
        });
        Navigator.pop(context);
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 0),
      visualDensity: VisualDensity.compact,
    );
  }

  Widget _buildModuleContent(String moduleName) {
    if (moduleName == 'Consulta de RIF') {
      return const ConsultaRifScreen();
    }
    
    if (moduleName == 'Consulta Tickets') {
      return const ConsultaTicketsScreen();
    }

    // Mapeo de nombres de visualización a funcionalidades existentes
    if (moduleName == 'Gestión Coordinador' || moduleName == 'Asignar Técnico') {
       // Aquí iría la lógica para mostrar la lista de tickets para asignar
       return const Center(child: Text('Funcionalidad de Asignación de Técnico'));
    }
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.build_circle, size: 80, color: AppTheme.secondaryNeon),
          const SizedBox(height: 24),
          Text(
            'MÓDULO EN CONSTRUCCIÓN',
            style: GoogleFonts.orbitron(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.primaryNeon,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'El módulo "$moduleName" estará disponible pronto.',
            style: const TextStyle(color: Colors.white70),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTicketCard(Ticket ticket, AuthProvider auth) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      color: AppTheme.surfaceDark,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: _getStatusColor(ticket.status).withOpacity(0.3),
        ),
      ),
      child: ExpansionTile(
        leading: Container(
          width: 4,
          height: 40,
          color: _getStatusColor(ticket.status),
        ),
        title: Text(
          '#${ticket.nroTicket}',
          style: GoogleFonts.orbitron(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.primaryNeon),
        ),
        subtitle: Text(
          ticket.razonSocial,
          style: const TextStyle(fontSize: 12, color: Colors.white70),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildDetailRow('RIF:', ticket.rif),
                _buildDetailRow('Serial POS:', ticket.serialPos),
                _buildDetailRow('Falla:', ticket.failure),
                _buildDetailRow('Estatus:', ticket.status, color: _getStatusColor(ticket.status)),
                _buildDetailRow('Técnico:', ticket.technician),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton.icon(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => TicketDetailScreen(ticket: ticket),
                          ),
                        );
                      },
                      icon: const Icon(Icons.visibility_outlined, size: 18, color: AppTheme.primaryNeon),
                      label: const Text('VER DETALLES', style: TextStyle(color: AppTheme.primaryNeon)),
                    ),
                    if (auth.isStaff) ...[
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.secondaryNeon.withOpacity(0.8),
                          visualDensity: VisualDensity.compact,
                        ),
                        child: const Text('EDITAR'),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white38),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(fontSize: 12, color: color ?? Colors.white),
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
