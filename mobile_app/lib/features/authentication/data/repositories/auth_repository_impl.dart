import '../../domain/entities/app_user.dart';
import '../../domain/repositories/auth_repository.dart';

import '../datasources/auth_remote_datasource.dart';
import '../models/app_user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<AppUser> login({
    required String email,
    required String password,
  }) async {
    await remoteDataSource.login(
      email: email,
      password: password,
    );

    final profile = await remoteDataSource.getCurrentProfile();

    if (profile == null) {
      throw Exception('Không tìm thấy profile');
    }

    return AppUserModel.fromMap(profile);
  }

  @override
  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
  }) {
    return remoteDataSource.register(
      fullName: fullName,
      email: email,
      password: password,
    );
  }

  @override
  Future<AppUser?> getCurrentUser() async {
    final profile = await remoteDataSource.getCurrentProfile();

    if (profile == null) {
      return null;
    }

    return AppUserModel.fromMap(profile);
  }

  @override
  Future<void> logout() {
    return remoteDataSource.logout();
  }
}