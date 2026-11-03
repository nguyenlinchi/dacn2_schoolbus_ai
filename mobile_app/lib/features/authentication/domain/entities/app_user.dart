enum UserRole {
  admin,
  driver,
  parent,
}

class AppUser {
  final String id;
  final String email;
  final String fullName;
  final UserRole role;

  const AppUser({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
  });
}