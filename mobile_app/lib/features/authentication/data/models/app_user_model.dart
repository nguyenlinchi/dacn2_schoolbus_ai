import '../../domain/entities/app_user.dart';

class AppUserModel extends AppUser {
  const AppUserModel({
    required super.id,
    required super.email,
    required super.fullName,
    required super.role,
  });

  factory AppUserModel.fromMap(
    Map<String, dynamic> map,
  ) {
    final roleString = map['role'] as String;

    final role = switch (roleString) {
      'ADMIN' => UserRole.admin,
      'DRIVER' => UserRole.driver,
      'PARENT' => UserRole.parent,
      _ => throw FormatException(
          'Role không hợp lệ: $roleString',
        ),
    };

    return AppUserModel(
      id: map['id'] as String,
      email: map['email'] as String? ?? '',
      fullName: map['full_name'] as String,
      role: role,
    );
  }
}