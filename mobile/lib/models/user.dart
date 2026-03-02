class User {
  final int id_user;
  final String username;
  final String names;
  final String surnames;
  final String email;
  final int roleId;
  final String roleName;
  final int areaId;

  User({
    required this.id_user,
    required this.username,
    required this.names,
    required this.surnames,
    required this.email,
    required this.roleId,
    required this.roleName,
    required this.areaId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id_user: json['id_user'],
      username: json['usuario'],
      names: json['nombres'],
      surnames: json['apellidos'],
      email: json['correo'],
      roleId: json['id_rol'],
      roleName: json['name_rol'],
      areaId: json['id_area'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_user': id_user,
      'usuario': username,
      'nombres': names,
      'apellidos': surnames,
      'correo': email,
      'id_rol': roleId,
      'name_rol': roleName,
      'id_area': areaId,
    };
  }
}
