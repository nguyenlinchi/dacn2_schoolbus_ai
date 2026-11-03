import 'package:supabase_flutter/supabase_flutter.dart';

class AuthRemoteDataSource {
  final SupabaseClient client;

  AuthRemoteDataSource(this.client);

  // LOGIN
  Future<User> login({
    required String email,
    required String password,
  }) async {
    final response = await client.auth.signInWithPassword(
      email: email,
      password: password,
    );

    final user = response.user;

    if (user == null) {
      throw Exception('Không thể đăng nhập');
    }

    return user;
  }

  // REGISTER
  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final response = await client.auth.signUp(
      email: email,
      password: password,
      data: {
        'full_name': fullName,
      },
    );

    if (response.user == null) {
      throw Exception('Không thể tạo tài khoản');
    }

    // true nếu đã có session
    // false nếu cần xác nhận email
    return response.session != null;
  }

  // GET CURRENT USER PROFILE
  Future<Map<String, dynamic>?> getCurrentProfile() async {
    final user = client.auth.currentUser;

    if (user == null) {
      return null;
    }

    final result = await client
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle();

    if (result == null) {
      throw Exception(
        'Không tìm thấy thông tin phân quyền của tài khoản',
      );
    }

    return {
      ...result,
      'email': user.email ?? '',
    };
  }

  // LOGOUT
  Future<void> logout() async {
    await client.auth.signOut();
  }
}