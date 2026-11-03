import '../entities/app_user.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<AppUser> call({
    required String email,
    required String password,
  }) async {
    if (email.trim().isEmpty) {
      throw ArgumentError('Email không được để trống');
    }

    if (password.isEmpty) {
      throw ArgumentError('Mật khẩu không được để trống');
    }

    return repository.login(
      email: email.trim(),
      password: password,
    );
  }
}