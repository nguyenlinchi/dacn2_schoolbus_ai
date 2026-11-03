import '../repositories/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  Future<bool> call({
    required String fullName,
    required String email,
    required String password,
  }) async {
    if (fullName.trim().isEmpty) {
      throw ArgumentError('Họ tên không được để trống');
    }

    if (email.trim().isEmpty) {
      throw ArgumentError('Email không được để trống');
    }

    if (password.length < 8) {
      throw ArgumentError(
        'Mật khẩu phải có ít nhất 8 ký tự',
      );
    }

    return repository.register(
      fullName: fullName.trim(),
      email: email.trim(),
      password: password,
    );
  }
}